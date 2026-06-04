import { useEffect, useState } from "react";
import {
  getServicePlans,
  createServiceOrder,
  verifyServicePayment,
} from "@/app/apiServices/serviceplan";
import { toast, ToastContainer } from "react-toastify";

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => reject(new Error("Failed to load Razorpay script"));
    document.body.appendChild(script);
  });
}

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="#4338ca" style={{ flexShrink: 0, marginTop: "2px" }}>
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

function buildServiceDetails(plan, durationType) {
  const limit =
    durationType === "6m"
      ? plan.sixMonthServiceListingLimit
      : plan.yearlyServiceListingLimit;

  if (limit === undefined) return [];

  return [
    limit === 0
      ? "Unlimited service listings"
      : `Up to ${limit} service listing${limit !== 1 ? "s" : ""}`,
  ];
}

export default function ServicePlans({ planInfo, onPaymentSuccess }) {
  const [servicePlans, setServicePlans]           = useState([]);
  const [loading, setLoading]                     = useState(true);
  const [loadingServiceKey, setLoadingServiceKey] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getServicePlans();
        if (res.data?.success) setServicePlans(res.data.plans || []);
      } catch (err) {
        console.error("Failed to load service plans", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const isServiceActive =
    planInfo?.servicePlanActive === true &&
    planInfo?.serviceplan?.expiryDate &&
    new Date(planInfo.serviceplan.expiryDate) > new Date();

  const activeServiceKey = isServiceActive ? planInfo?.serviceplan?.plan : null;

  const isServiceLimitReached =
    planInfo?.limits?.serviceListingLimit > 0 &&
    (planInfo?.usage?.serviceListings ?? 0) >= planInfo.limits.serviceListingLimit;

  const handleServiceSubscribe = async (plan, durationType) => {
    const key = `${plan._id}_${durationType}`;
    setLoadingServiceKey(key);
    try {
      const res = await createServiceOrder(plan._id, durationType);
      if (!res.data?.success) throw new Error(res.data?.message || "Order creation failed");

      const { order } = res.data;
      await loadRazorpayScript();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: order.amount,
        currency: order.currency,
        name: "Unlock Startup",
        description: `Service plan – ${durationType === "6m" ? "6 months" : "1 year"}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await verifyServicePayment({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              servicePlanId:       plan._id,
              durationType,
            });
            if (verifyRes.data?.success) {
              toast.success("Payment successful and subscription activated");
              onPaymentSuccess?.();
            } else {
              toast.error("Payment succeeded but verification failed");
            }
          } catch (e) {
            console.error(e);
            toast.error("Payment verification failed");
          }
        },
        prefill: {},
        theme: { color: "#4338ca" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Unable to start payment");
    } finally {
      setLoadingServiceKey(null);
    }
  };

  if (loading)
    return (
      <div className="py-5 text-center text-muted" style={{ fontSize: "1.2rem" }}>
        <div className="spinner-border spinner-border-sm me-2" role="status" />
        Loading service plans…
      </div>
    );

  if (!servicePlans.length)
    return (
      <div className="py-5 text-center text-muted" style={{ fontSize: "1.2rem" }}>
        No service plans available.
      </div>
    );

  const tiers = [
    { durationType: "6m",  label: "6-Month Plan", suffix: "/ 6 mo", desc: "Flexible half-year access to service listings." },
    { durationType: "12m", label: "Yearly Plan",  suffix: "/ year",  desc: "Best value — full year of service listings." },
  ];

  return (
    <section className="py-2">
      <div className="container">

        <div className="text-center mb-4">
          <h2 className="fw-bold mb-2" style={{ color: "#1a1a2e", letterSpacing: "-0.5px", fontSize: "2.4rem" }}>
            Pricing for service plans
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: "480px", fontSize: "1.2rem" }}>
            Choose a service plan that works best for you. All service plans include access to our core service features.
          </p>
        </div>

        <div className="row g-4 align-items-stretch justify-content-center">
          {servicePlans.map((plan) =>
            tiers.map(({ durationType, label, suffix, desc }) => {
              const key            = `${plan._id}_${durationType}`;
              const price          = durationType === "6m" ? plan.sixMonthPrice : plan.yearlyPrice;
              const isThisLoading  = loadingServiceKey === key;
              const isOtherLoading = loadingServiceKey !== null && loadingServiceKey !== key;
              const details = buildServiceDetails(plan, durationType);
              const isActivePlan   = isServiceActive && activeServiceKey === durationType;
              const isDisabled =
                isThisLoading ||
                isOtherLoading ||
                (isServiceActive && !isActivePlan && !isServiceLimitReached);

              return (
                <div className="col-12 col-sm- col-xl-3" key={key}>
                  <div
                    className="h-100 d-flex flex-column rounded-3"
                    style={{
                      border: isActivePlan ? "2px solid #4338ca" : "1px solid #e2e8f0",
                      backgroundColor: "#fff",
                      boxShadow: isActivePlan ? "0 0 0 4px rgba(67,56,202,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
                      opacity: isOtherLoading || (isServiceActive && !isActivePlan && !isServiceLimitReached) ? 0.5 : 1,
                      transition: "opacity 0.2s ease",
                      position: "relative",
                    }}
                  >
                    {isActivePlan && (
                      <div style={{ position: "absolute", top: "-13px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#4338ca", color: "#fff", fontSize: "1.2rem", fontWeight: 700, padding: "3px 14px", borderRadius: "999px", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap", zIndex: 1 }}>
                        ● Ongoing
                      </div>
                    )}

                    <div className="p-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <p className="fw-semibold mb-1" style={{ color: "#4338ca", fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {label}
                      </p>
                      <div className="d-flex align-items-baseline gap-1 mb-2">
                        <span className="fw-bold" style={{ fontSize: "2.4rem", color: "#1a1a2e", lineHeight: 1.1 }}>
                          ₹{price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-muted" style={{ fontSize: "1.2rem" }}>{suffix}</span>
                      </div>
                      <p className="text-muted mb-3" style={{ fontSize: "1.2rem", minHeight: "3.2rem" }}>{desc}</p>

                      {isActivePlan ? (
                        <div style={{ width: "100%", padding: "10px 0", borderRadius: "8px", fontSize: "1.2rem", fontWeight: 600, textAlign: "center", backgroundColor: "rgba(67,56,202,0.08)", color: "#4338ca", border: "2px solid #4338ca" }}>
                          ✓ Current Plan
                        </div>
                      ) : (
                        <button
                          className="btn w-100 fw-semibold"
                          style={{ backgroundColor: isThisLoading ? "#4338ca" : "#fff", color: isThisLoading ? "#fff" : "#4338ca", border: "2px solid #4338ca", borderRadius: "8px", padding: "10px 0", fontSize: "1.2rem", transition: "all 0.15s ease", cursor: isDisabled ? "not-allowed" : "pointer" }}
                          disabled={isDisabled}
                          onClick={() => handleServiceSubscribe(plan, durationType)}
                          onMouseEnter={(e) => { if (!isDisabled) { e.currentTarget.style.backgroundColor = "#4338ca"; e.currentTarget.style.color = "#fff"; } }}
                          onMouseLeave={(e) => { if (!isThisLoading) { e.currentTarget.style.backgroundColor = "#fff"; e.currentTarget.style.color = "#4338ca"; } }}
                        >
                          {isThisLoading ? (
                            <span className="d-flex align-items-center justify-content-center gap-2">
                              <span className="spinner-border spinner-border-sm" role="status" style={{ width: "14px", height: "14px", borderWidth: "2px" }} />
                              Processing...
                            </span>
                          ) : "Get Started"}
                        </button>
                      )}
                    </div>

                    <div className="p-4 flex-grow-1">
                      <p className="fw-semibold mb-3" style={{ fontSize: "1.2rem", color: "#1a1a2e" }}>What's included</p>
                      {details.length > 0 ? (
                        <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                          {details.map((item, idx) => (
                            <li key={idx} className="d-flex align-items-start gap-2">
                              <CheckIcon />
                              <span style={{ fontSize: "1.2rem", color: "#475569" }}>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted mb-0" style={{ fontSize: "1.2rem" }}>No features configured for this plan yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <ToastContainer position="top-center" />
      </div>
    </section>
  );
}