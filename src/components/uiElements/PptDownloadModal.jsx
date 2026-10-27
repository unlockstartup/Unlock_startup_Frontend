"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import {
  createPptOrder,
  verifyPptPayment,
  getPptPurchaseStatus,
  getSavedPptToken,
  pptDownloadUrl,
  savePptToken,
  downloadsLeftLabel,
} from "@/app/apiServices/ppt";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[6-9]\d{9}$/;

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

function validate({ name, email, phone, agree }) {
  const errors = {};
  if (name.trim().length < 2) errors.name = "Please enter your full name";
  if (!EMAIL_RE.test(email.trim())) errors.email = "Please enter a valid email address";
  if (!PHONE_RE.test(phone)) errors.phone = "Enter a valid 10-digit mobile number";
  if (!agree) errors.agree = "Please accept the terms to continue";
  return errors;
}

const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function PptDownloadModal({ template, onClose, onPurchased, allSlidesHref }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", agree: false });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("form"); // form | paying | verifying | success | owned
  const [result, setResult] = useState(null);
  const submittingRef = useRef(false); // blocks a second order from a fast double-click

  // Returning buyer with a still-valid link: offer the download instead of asking to pay again
  useEffect(() => {
    const token = getSavedPptToken(template._id);
    if (!token) return;
    let cancelled = false;
    getPptPurchaseStatus(token)
      .then((res) => {
        if (!cancelled && res.data?.canDownload) {
          setResult(res.data);
          setStep((s) => (s === "form" ? "owned" : s));
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [template._id]);

  // Prefill from the logged-in user, if any
  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      name:  f.name  || user.name  || "",
      email: f.email || user.email || "",
      phone: f.phone || String(user.phone || "").replace(/\D/g, "").slice(-10),
    }));
  }, [user]);

  // Close on Escape, but never mid-payment
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && step !== "paying" && step !== "verifying") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, onClose]);

  const busy = step === "paying" || step === "verifying";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const next = type === "checkbox" ? checked : name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setForm((f) => ({ ...f, [name]: next }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    submittingRef.current = true;
    setStep("paying");
    try {
      const res = await createPptOrder({
        templateId: template._id,
        name:    form.name.trim(),
        company: form.company.trim(),
        email:   form.email.trim(),
        phone:   form.phone,
      });
      if (!res.data?.success) throw new Error(res.data?.message || "Order creation failed");

      const { order, keyId, prefill } = res.data;
      await loadRazorpayScript();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || keyId || "",
        amount: order.amount,
        currency: order.currency,
        name: "Unlock Startup",
        description: template.title,
        order_id: order.id,
        prefill,
        notes: { template: template.title },
        theme: { color: "#1EB0E4" },
        handler: async (response) => {
          setStep("verifying");
          try {
            const verifyRes = await verifyPptPayment({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            });
            if (!verifyRes.data?.success) throw new Error(verifyRes.data?.message);

            submittingRef.current = false;
            savePptToken(template._id, verifyRes.data.downloadToken);
            setResult(verifyRes.data);
            setStep("success");
            toast.success("Payment successful! Your download is ready.");
            onPurchased?.(verifyRes.data);
          } catch (err) {
            console.error(err);
            submittingRef.current = false;
            setStep("form");
            toast.error(
              err?.response?.data?.message ||
              "Payment received but verification failed. Please check your email or contact support."
            );
          }
        },
        modal: {
          ondismiss: () => {
            submittingRef.current = false;
            setStep((s) => (s === "paying" ? "form" : s));
            toast.info("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp) => {
        toast.error(resp?.error?.description || "Payment failed. Please try again.");
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      submittingRef.current = false;
      setStep("form");
      toast.error(err?.response?.data?.message || err.message || "Unable to start payment");
    }
  };

  const handleDownload = () => {
    if (!result?.downloadPath) return;
    if (result.downloadsLeft <= 0) return toast.error("Download limit reached. Please contact support.");
    window.location.href = pptDownloadUrl(result.downloadPath);
    setResult((r) => ({ ...r, downloadsLeft: r.downloadsLeft - 1 }));
  };

  const expiry = result?.expiresAt
    ? new Date(result.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const slides = template.previewImages?.length
    ? template.previewImages
    : template.coverImage ? [template.coverImage] : [];
  const totalSlides = Math.max(template.slideCount || 0, slides.length);

  return (
    <div className="ppt-modal-backdrop" onClick={() => !busy && onClose()}>
      <div
        className="ppt-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ppt-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ppt-modal__header">
          <h2 id="ppt-modal-title">{template.title}</h2>
          {!busy && (
            <button type="button" className="ppt-modal__close" onClick={onClose} aria-label="Close">
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>

        <div className="ppt-modal__body">
          {step === "owned" ? (
            <div className="ppt-modal__success">
              <div className="ppt-modal__success-icon">
                <i className="bi bi-bag-check"></i>
              </div>
              <h3>You already own this template</h3>
              <p>Your earlier purchase of <strong>{template.title}</strong> is still valid on this device.</p>
              <button type="button" className="ppt-btn ppt-btn--primary ppt-btn--block" onClick={handleDownload}
                disabled={result?.downloadsLeft <= 0}>
                <i className="bi bi-download"></i> Download again
              </button>
              <p className="ppt-modal__note">
                {downloadsLeftLabel(result?.downloadsLeft)}{expiry && <> · link valid until {expiry}</>}
              </p>
              <button type="button" className="ppt-link-btn" onClick={() => setStep("form")}>
                Buy another copy instead
              </button>
            </div>
          ) : step === "success" ? (
            <div className="ppt-modal__success">
              <div className="ppt-modal__success-icon">
                <i className="bi bi-check-lg"></i>
              </div>
              <h3>Payment successful</h3>
              <p>
                Thank you! <strong>{template.title}</strong> is ready to download.
                {result?.emailSent && <> We&apos;ve also emailed the download link to <strong>{form.email}</strong>.</>}
              </p>
              <button type="button" className="ppt-btn ppt-btn--primary ppt-btn--block" onClick={handleDownload}>
                <i className="bi bi-download"></i> Download now
              </button>
              <p className="ppt-modal__note">
                {downloadsLeftLabel(result?.downloadsLeft)}{expiry && <> · link valid until {expiry}</>}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {slides.length > 0 && (
                <div className="ppt-modal__slides">
                  {slides.slice(0, 4).map((src, i) => (
                    <figure key={src + i} className="ppt-modal__slide" title={`Slide ${i + 1}`}>
                      <img src={src} alt={`${template.title} — slide ${i + 1}`} />
                    </figure>
                  ))}
                </div>
              )}

              <div className="ppt-modal__summary">
                <span>
                  {template.fileFormat}
                  {totalSlides > 0 && <> · {totalSlides} slides</>}
                  {allSlidesHref && slides.length > 4 && (
                    <> · <Link href={allSlidesHref} className="ppt-modal__more">View all slides</Link></>
                  )}
                </span>
                <strong>{formatINR(template.price)}</strong>
              </div>

              <div className="ppt-form-grid">
                <div className="ppt-field">
                  <label htmlFor="ppt-name">Full name <span>*</span></label>
                  <input id="ppt-name" name="name" type="text" autoComplete="name" autoFocus
                    value={form.name} onChange={handleChange} disabled={busy}
                    className={errors.name ? "is-invalid" : ""} placeholder="e.g. Rahul Sharma" />
                  {errors.name && <small className="ppt-field__error">{errors.name}</small>}
                </div>

                <div className="ppt-field">
                  <label htmlFor="ppt-company">Company name</label>
                  <input id="ppt-company" name="company" type="text" autoComplete="organization" maxLength={120}
                    value={form.company} onChange={handleChange} disabled={busy} placeholder="Optional" />
                </div>

                <div className="ppt-field">
                  <label htmlFor="ppt-email">Email address <span>*</span></label>
                  <input id="ppt-email" name="email" type="email" autoComplete="email"
                    value={form.email} onChange={handleChange} disabled={busy}
                    className={errors.email ? "is-invalid" : ""} placeholder="you@company.com" />
                  {errors.email && <small className="ppt-field__error">{errors.email}</small>}
                </div>

                <div className="ppt-field">
                  <label htmlFor="ppt-phone">Phone number <span>*</span></label>
                  <div className={`ppt-phone ${errors.phone ? "is-invalid" : ""}`}>
                    <span className="ppt-phone__code">+91</span>
                    <input id="ppt-phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel-national"
                      value={form.phone} onChange={handleChange} disabled={busy} placeholder="98765 43210" />
                  </div>
                  {errors.phone && <small className="ppt-field__error">{errors.phone}</small>}
                </div>
              </div>

              <label className="ppt-check">
                <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} disabled={busy} />
                <span>
                  I agree to the <Link href="/terms-conditions" target="_blank">Terms &amp; Conditions</Link> and{" "}
                  <Link href="/refunds" target="_blank">Refund Policy</Link>.
                </span>
              </label>
              {errors.agree && <small className="ppt-field__error">{errors.agree}</small>}

              <button type="submit" className="ppt-btn ppt-btn--primary ppt-btn--block ppt-btn--lg" disabled={busy}>
                {step === "verifying" ? (
                  <><span className="spinner-border spinner-border-sm"></span> Verifying payment…</>
                ) : step === "paying" ? (
                  <><span className="spinner-border spinner-border-sm"></span> Opening secure payment…</>
                ) : (
                  <><i className="bi bi-download"></i> Pay {formatINR(template.price)} &amp; download</>
                )}
              </button>
              <p className="ppt-modal__note">
                <i className="bi bi-lock-fill"></i> Secure payment via Razorpay (UPI, cards, net banking, wallets) · instant download after confirmation
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
