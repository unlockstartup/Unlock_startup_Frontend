import { useEffect, useState } from "react";
import { getPlans, createOrder, verifyPayment } from "@/app/apiServices/subscriptions";
import { toast, ToastContainer } from "react-toastify";
import publisherApi from "@/app/publisherapi";

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Failed to load Razorpay script"));
    document.body.appendChild(script);
  });
}

const planLabels = (months) => {
  if (months === 0)  return { name: "Free",          desc: "Get started at no cost for 30 days." };
  if (months === 3)  return { name: "Startup Basic",  desc: "Perfect for individuals just getting started." };
  if (months === 6)  return { name: "Startup Plus",   desc: "Great for small teams and growing startups." };
  if (months === 9)  return { name: "Startup Pro",    desc: "Ideal for professionals who need more power." };
  return                    { name: "Startup Elite",  desc: "Best value for long-term power users." };
};

const monthsToPlanKey = (months) => {
  if (months === 0)  return "free";
  if (months === 3)  return "3m";
  if (months === 6)  return "6m";
  if (months === 9)  return "9m";
  if (months === 12) return "12m";
  return String(months) + "m";
};

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="#4338ca" style={{ flexShrink: 0, marginTop: "2px" }}>
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

function ConfirmSwitchModal({ plan, currentPlanName, onConfirm, onCancel }) {
  const { name } = plan.isTrial ? { name: "Free 30-Day Trial" } : planLabels(plan.durationInMonths);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        backgroundColor: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: "#fff", borderRadius: "16px",
          padding: "48px 40px", maxWidth: "560px", width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "72px", height: "72px", borderRadius: "50%",
            backgroundColor: "rgba(234,179,8,0.12)",
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"
              fill="none" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
        </div>

        <h5 style={{ fontWeight: 700, color: "#1a1a2e", textAlign: "center", marginBottom: "14px", fontSize: "1.5rem" }}>
          Switch to {name}?
        </h5>
        <p style={{ color: "#64748b", fontSize: "1.15rem", textAlign: "center", lineHeight: 1.7, marginBottom: "32px" }}>
          You currently have an active <strong style={{ color: "#1a1a2e" }}>{currentPlanName}</strong> plan.
          Purchasing <strong style={{ color: "#1a1a2e" }}>{name}</strong> will{" "}
          <span style={{ color: "#dc2626", fontWeight: 600 }}>immediately deactivate</span> your current plan.
          This action cannot be undone.
        </p>

        <div style={{ display: "flex", gap: "16px" }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: "14px 0", borderRadius: "10px",
              border: "1.5px solid #e2e8f0", backgroundColor: "#f8fafc",
              color: "#475569", fontWeight: 600, fontSize: "1.1rem", cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: "14px 0", borderRadius: "10px",
              border: "none", backgroundColor: "#4338ca",
              color: "#fff", fontWeight: 600, fontSize: "1.1rem", cursor: "pointer",
            }}
          >
            Yes, Switch Plan
          </button>
        </div>
      </div>
    </div>
  );
}

function buildPlanDetails(plan) {
  const items = [];

  if (plan.jobLimit !== undefined)
    items.push(
      plan.jobLimit === 0
        ? "Unlimited job postings"
        : `Up to ${plan.jobLimit} job posting${plan.jobLimit !== 1 ? "s" : ""}`
    );

  if (plan.eventLimit !== undefined)
    items.push(
      plan.eventLimit === 0
        ? "Unlimited events"
        : `Up to ${plan.eventLimit} event${plan.eventLimit !== 1 ? "s" : ""}`
    );

  if (plan.fundingCallsLimit !== undefined)
    items.push(
      plan.fundingCallsLimit === 0
        ? "Unlimited funding calls"
        : `Up to ${plan.fundingCallsLimit} funding call${plan.fundingCallsLimit !== 1 ? "s" : ""}`
    );

  if (plan.productsLimit !== undefined)
    items.push(
      plan.productsLimit === 0
        ? "Unlimited products"
        : `Up to ${plan.productsLimit} product${plan.productsLimit !== 1 ? "s" : ""}`
    );

  if (Array.isArray(plan.features))
    plan.features.forEach((f) => { if (f?.trim()) items.push(f); });

  return items;
}

const TRIAL_PLAN = {
  _id: "trial_static",
  isTrial: true,
  durationInMonths: 0,
  price: 0,
  features: ["Access to all core features", "No credit card required"],
};

export default function SubscriptionPlans({ planInfo, onPaymentSuccess }) {
  const [plans, setPlans]                   = useState([]);
  const [loading, setLoading]               = useState(true);
  const [loadingPlanId, setLoadingPlanId]   = useState(null);
  const [pendingPlan, setPendingPlan]       = useState(null);
  const [hasPremiumHistory, setHasPremiumHistory] = useState(false);
  const [isTrialActive, setIsTrialActive]   = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [plansRes, historyRes] = await Promise.all([
          getPlans(),
          publisherApi.get("/api/publisher/subscriptions/history"),
        ]);

        if (plansRes.data?.success)
          setPlans((plansRes.data.plans || []).filter((p) => p.durationInMonths !== 0));

        if (historyRes?.data?.success && Array.isArray(historyRes.data.subscriptions)) {
          const hasPremium = historyRes.data.subscriptions.some((s) => s.plan !== "trial");
          setHasPremiumHistory(hasPremium);

          const activeTrial = historyRes.data.subscriptions.find(
            (s) => s.plan === "trial" && s.isActive && new Date(s.expiryDate) > new Date()
          );
          setIsTrialActive(!!activeTrial);
        }
      } catch (err) {
        console.error("Failed to load plans", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const isSubscriptionActive =
    planInfo?.subscriptionStatus === "active" &&
    planInfo?.expiry &&
    new Date(planInfo.expiry) > new Date();

  const activePlanKey = planInfo?.plan?.plan ?? null;

  const isAnyLimitReached = (() => {
    if (!planInfo?.usage || !planInfo?.limits) return false;
    const { usage, limits } = planInfo;
    return (
      (limits.jobLimit            > 0 && usage.jobs            >= limits.jobLimit)           ||
      (limits.eventLimit          > 0 && usage.events          >= limits.eventLimit)         ||
      (limits.fundingCallsLimit   > 0 && usage.fundingCalls    >= limits.fundingCallsLimit)  ||
      (limits.productsLimit       > 0 && usage.products        >= limits.productsLimit)      ||
      (limits.serviceListingLimit > 0 && usage.serviceListings >= limits.serviceListingLimit)
    );
  })();

  const startPayment = async (plan) => {
    setLoadingPlanId(plan._id);
    try {
      const res = await createOrder(plan.durationInMonths);
      if (!res.data?.success)
        throw new Error(res.data?.message || "Order creation failed");

      const { order } = res.data;
      await loadRazorpayScript();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: order.amount,
        currency: order.currency,
        name: "Unlock Startup",
        description: `${plan.durationInMonths} month subscription`,
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              durationInMonths:    plan.durationInMonths,
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

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Unable to start payment");
    } finally {
      setLoadingPlanId(null);
    }
  };

  const handleSubscribe = (plan) => {
    if (plan.isTrial) return;

    const thisPlanKey = monthsToPlanKey(plan.durationInMonths);
    const isActivePlan = isSubscriptionActive && activePlanKey === thisPlanKey;

    if (isActivePlan) return;

    if (isSubscriptionActive) {
      setPendingPlan(plan);
      return;
    }

    startPayment(plan);
  };

  const handleModalConfirm = () => {
    const plan = pendingPlan;
    setPendingPlan(null);
    startPayment(plan);
  };

  const handleModalCancel = () => setPendingPlan(null);

  const currentPlanName = (() => {
    if (!activePlanKey) return "current";
    const monthsMap = { free: 0, "3m": 3, "6m": 6, "9m": 9, "12m": 12 };
    const months = monthsMap[activePlanKey] ?? 0;
    return planLabels(months).name;
  })();

  if (loading)
    return (
      <div className="py-5 text-center text-muted" style={{ fontSize: "1.2rem" }}>
        <div className="spinner-border spinner-border-sm me-2" role="status" />
        Loading plans…
      </div>
    );

  if (!plans.length)
    return (
      <div className="py-5 text-center text-muted" style={{ fontSize: "1.2rem" }}>
        No subscription plans available.
      </div>
    );

  const allPlans = hasPremiumHistory ? plans : [TRIAL_PLAN, ...plans];

  return (
    <section className="py-2">
      <div className="container">

        <div className="text-center mb-2">
          <h2 className="fw-bold mb-2" style={{ color: "#1a1a2e", letterSpacing: "-0.5px", fontSize: "2.4rem" }}>
            Pricing for Startup plans
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: "480px", fontSize: "1.2rem" }}>
            Choose a plan that works best for you. All plans include access to our core features.
          </p>
        </div>

        {isAnyLimitReached && isSubscriptionActive && (
          <div
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "10px", background: "rgba(255,91,91,0.07)",
              border: "1px solid rgba(255,91,91,0.25)", borderRadius: "10px",
              padding: "12px 18px", marginBottom: "20px",
              fontSize: "1.2rem", color: "#991b1b", fontWeight: 500,
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>⚠</span>
            <span>
              You've reached the limit on one or more listing types. Upgrade your plan to
              continue publishing.
            </span>
          </div>
        )}

        <div className="row g-4 align-items-stretch justify-content-center grid-mob">
          {allPlans.map((plan) => {
            if (plan.isTrial) {
              const isActivePlan = isTrialActive;
              const isThisLoading = loadingPlanId === plan._id;
              const isOtherLoading = loadingPlanId !== null && loadingPlanId !== plan._id;

              return (
                <div className="col-12 col-sm-12 col-xl-3" key="trial_static">
                  <div
                    className="h-100 d-flex flex-column rounded-3"
                    style={{
                      border: isActivePlan ? "2px solid #4338ca" : "1px solid #e2e8f0",
                      backgroundColor: "#fff",
                      boxShadow: isActivePlan
                        ? "0 0 0 4px rgba(67,56,202,0.08)"
                        : "0 1px 4px rgba(0,0,0,0.04)",
                      opacity: isOtherLoading ? 0.5 : 1,
                      transition: "opacity 0.2s ease",
                      position: "relative",
                    }}
                  >
                    {isActivePlan && (
                      <div
                        style={{
                          position: "absolute", top: "-13px", left: "50%",
                          transform: "translateX(-50%)", backgroundColor: "#4338ca",
                          color: "#fff", fontSize: "1.2rem", fontWeight: 700,
                          padding: "3px 14px", borderRadius: "999px",
                          letterSpacing: "0.06em", textTransform: "uppercase",
                          whiteSpace: "nowrap", zIndex: 1,
                        }}
                      >
                        ● Ongoing
                      </div>
                    )}

                    <div className="p-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <p
                        className="fw-semibold mb-1"
                        style={{ color: "#4338ca", fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "0.06em" }}
                      >
                        Free
                      </p>
                      <div className="d-flex align-items-baseline gap-1 mb-2">
                        <span className="fw-bold" style={{ fontSize: "2.4rem", color: "#1a1a2e", lineHeight: 1.1 }}>
                          Free
                        </span>
                      </div>
                      <p className="text-muted mb-3" style={{ fontSize: "1.2rem", minHeight: "3.2rem" }}>
                        Get started at no cost for 30 days.
                      </p>

                      {isActivePlan ? (
                        <div
                          style={{
                            width: "100%", padding: "10px 0", borderRadius: "8px",
                            fontSize: "1.2rem", fontWeight: 600, textAlign: "center",
                            backgroundColor: "rgba(67,56,202,0.08)",
                            color: "#4338ca", border: "2px solid #4338ca",
                          }}
                        >
                          ✓ Current Plan
                        </div>
                      ) : (
                        <div
                          style={{
                            width: "100%", padding: "10px 0", borderRadius: "8px",
                            fontSize: "1.2rem", fontWeight: 600, textAlign: "center",
                            backgroundColor: "#f1f5f9",
                            color: "#94a3b8", border: "1.5px solid #e2e8f0",
                            cursor: "default",
                          }}
                        >
                          Trial Ended
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex-grow-1">
                      <p className="fw-semibold mb-3" style={{ fontSize: "1.2rem", color: "#1a1a2e" }}>
                        What's included
                      </p>
                      <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                        {["Access to all core features", "No credit card required"].map((item, idx) => (
                          <li key={idx} className="d-flex align-items-start gap-2">
                            <CheckIcon />
                            <span style={{ fontSize: "1.2rem", color: "#475569" }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            }

            const { name, desc }  = planLabels(plan.durationInMonths);
            const planDetails     = buildPlanDetails(plan);
            const isThisLoading   = loadingPlanId === plan._id;
            const isOtherLoading  = loadingPlanId !== null && loadingPlanId !== plan._id;

            const thisPlanKey  = monthsToPlanKey(plan.durationInMonths);
            const isActivePlan = isSubscriptionActive && activePlanKey === thisPlanKey;

            const isDisabled = isThisLoading || isOtherLoading;

            return (
              <div className="col-12 col-sm-12 col-xl-3" key={plan._id}>
                <div
                  className="h-100 d-flex flex-column rounded-3"
                  style={{
                    border: isActivePlan ? "2px solid #4338ca" : "1px solid #e2e8f0",
                    backgroundColor: "#fff",
                    boxShadow: isActivePlan
                      ? "0 0 0 4px rgba(67,56,202,0.08)"
                      : "0 1px 4px rgba(0,0,0,0.04)",
                    opacity: isOtherLoading ? 0.5 : 1,
                    transition: "opacity 0.2s ease",
                    position: "relative",
                  }}
                >
                  {isActivePlan && (
                    <div
                      style={{
                        position: "absolute", top: "-13px", left: "50%",
                        transform: "translateX(-50%)", backgroundColor: "#4338ca",
                        color: "#fff", fontSize: "1.2rem", fontWeight: 700,
                        padding: "3px 14px", borderRadius: "999px",
                        letterSpacing: "0.06em", textTransform: "uppercase",
                        whiteSpace: "nowrap", zIndex: 1,
                      }}
                    >
                      ● Ongoing
                    </div>
                  )}

                  <div className="p-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <p
                      className="fw-semibold mb-1"
                      style={{ color: "#4338ca", fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "0.06em" }}
                    >
                      {name}
                    </p>
                    <div className="d-flex align-items-baseline gap-1 mb-2">
                      <span className="fw-bold" style={{ fontSize: "2.4rem", color: "#1a1a2e", lineHeight: 1.1 }}>
                        {plan.price === 0 ? "Free" : `₹${plan.price.toLocaleString("en-IN")}`}
                      </span>
                      {plan.durationInMonths > 0 && (
                        <span className="text-muted" style={{ fontSize: "1.2rem" }}>
                          / {plan.durationInMonths} mo
                        </span>
                      )}
                    </div>
                    <p className="text-muted mb-3" style={{ fontSize: "1.2rem", minHeight: "3.2rem" }}>
                      {desc}
                    </p>

                    {isActivePlan ? (
                      <div
                        style={{
                          width: "100%", padding: "10px 0", borderRadius: "8px",
                          fontSize: "1.2rem", fontWeight: 600, textAlign: "center",
                          backgroundColor: "rgba(67,56,202,0.08)",
                          color: "#4338ca", border: "2px solid #4338ca",
                        }}
                      >
                        ✓ Current Plan
                      </div>
                    ) : (
                      <button
                        className="btn w-100 fw-semibold"
                        style={{
                          backgroundColor: isThisLoading ? "#4338ca" : "#fff",
                          color: isThisLoading ? "#fff" : "#4338ca",
                          border: "2px solid #4338ca", borderRadius: "8px",
                          padding: "10px 0", fontSize: "1.2rem",
                          transition: "all 0.15s ease",
                          cursor: isDisabled ? "not-allowed" : "pointer",
                        }}
                        disabled={isDisabled}
                        onClick={() => handleSubscribe(plan)}
                        onMouseEnter={(e) => {
                          if (!isDisabled) {
                            e.currentTarget.style.backgroundColor = "#4338ca";
                            e.currentTarget.style.color = "#fff";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isThisLoading) {
                            e.currentTarget.style.backgroundColor = "#fff";
                            e.currentTarget.style.color = "#4338ca";
                          }
                        }}
                      >
                        {isThisLoading ? (
                          <span className="d-flex align-items-center justify-content-center gap-2">
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              style={{ width: "14px", height: "14px", borderWidth: "2px" }}
                            />
                            Processing...
                          </span>
                        ) : (
                          "Get Started"
                        )}
                      </button>
                    )}
                  </div>

                  <div className="p-4 flex-grow-1">
                    <p className="fw-semibold mb-3" style={{ fontSize: "1.2rem", color: "#1a1a2e" }}>
                      What's included
                    </p>
                    {planDetails.length > 0 ? (
                      <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                        {planDetails.map((item, idx) => (
                          <li key={idx} className="d-flex align-items-start gap-2">
                            <CheckIcon />
                            <span style={{ fontSize: "1.2rem", color: "#475569" }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted mb-0" style={{ fontSize: "1.2rem" }}>
                        No features configured for this plan yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <ToastContainer position="top-center" />
      </div>

      {pendingPlan && (
        <ConfirmSwitchModal
          plan={pendingPlan}
          currentPlanName={currentPlanName}
          onConfirm={handleModalConfirm}
          onCancel={handleModalCancel}
        />
      )}
    </section>
  );
}