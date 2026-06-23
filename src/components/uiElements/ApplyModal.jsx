"use client";

import { useState, useEffect } from "react";
import {
  X, User, Mail, Phone, Building2,
  Briefcase, MapPin, Globe, DollarSign,
  CheckCircle2, Loader2, Send,
} from "lucide-react";
import "@/app/styles/jobapply.css";
import api from "@/app/api";

const Field = ({ label, icon: Icon, error, children }) => (
  <div className="am-field">
    <label className="am-label">
      {Icon && <Icon size={12} strokeWidth={2.2} />}
      {label}
    </label>
    {children}
    {error && <span className="am-error">{error}</span>}
  </div>
);

const INDIA_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const TYPE_CONFIG = {
  investor: { ctaTitle: "Applying to",     submitLabel: "Submit Application" },
  event:    { ctaTitle: "Registering for", submitLabel: "Register Now" },
  services: { ctaTitle: "Enquiring about", submitLabel: "Send Enquiry" },
};

const EMPTY_FORM = {
  fullName: "", organisation: "", orgType: "company",
  role: "", email: "", phone: "", location: "",
  fundingStage: "", website: "", industryType: "",
};

const ApplyModal = ({ isOpen, onClose, jobTitle, companyName, listingId, listingType = "event" }) => {
  const config = TYPE_CONFIG[listingType] ?? TYPE_CONFIG.event;

  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [errors,     setErrors]     = useState({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setErrors({});
      setSubmitted(false);
      setSubmitting(false);
      setForm(EMPTY_FORM);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";

    if (listingType === "event") {
      if (!form.organisation.trim()) e.organisation = "Required";
      if (!form.role.trim()) e.role = "Required";
      if (!form.location) e.location = "Required";
    }

    if (listingType === "investor") {
      if (!form.organisation.trim()) e.organisation = "Required";
      if (!form.fundingStage) e.fundingStage = "Required";
      if (!form.website.trim()) e.website = "Required";
    }

    if (listingType === "services") {
      if (!form.organisation.trim()) e.organisation = "Required";
      if (!form.location) e.location = "Required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildPayload = () => {
    const base = {
      fullName:     form.fullName,
      email:        form.email,
      phone:        form.phone,
      organisation: form.organisation,
    };

    if (listingType === "event") {
      return { ...base, orgType: form.orgType, role: form.role, location: form.location };
    }
    if (listingType === "investor") {
      return { ...base, fundingStage: form.fundingStage, website: form.website };
    }
    return { ...base, industryType: form.industryType, location: form.location };
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setSubmitting(true);
      const { data } = await api.post(`/api/submissions/${listingId}`, buildPayload());
      if (!data.success) throw new Error(data.message);
      setSubmitted(true);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit: err.response?.data?.message || err.message || "Submission failed. Please try again.",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="am-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="am-modal">

        {/* Header */}
        <div className="am-header">
          <div>
            <p className="am-header-sub">{config.ctaTitle}</p>
            <h2 className="am-header-title">{jobTitle}</h2>
            {companyName && <p className="am-header-company">{companyName}</p>}
          </div>
          <button className="am-close" onClick={onClose} aria-label="Close">
            <X size={17} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="am-body">
          {submitted ? (
            <div className="am-success">
              <div className="am-success-icon">
                <CheckCircle2 size={34} strokeWidth={1.8} color="#1a7a48" />
              </div>
              <h3 className="am-success-title">
                {listingType === "event"    ? "Registration Submitted!" :
                 listingType === "services" ? "Enquiry Sent!" :
                                             "Application Submitted!"}
              </h3>
              <p className="am-success-msg">
                {listingType === "event" ? (
                  <>Your registration for <strong>{jobTitle}</strong> has been received. We'll confirm at <strong>{form.email}</strong>.</>
                ) : listingType === "services" ? (
                  <>Your enquiry for <strong>{jobTitle}</strong> has been sent. We'll get back to you at <strong>{form.email}</strong>.</>
                ) : (
                  <>Your application for <strong>{jobTitle}</strong> has been submitted. We'll reach out to <strong>{form.email}</strong>.</>
                )}
              </p>
              <button className="am-btn-primary" onClick={onClose}>Done</button>
            </div>
          ) : (
            <div className="am-section">

              {/* EVENT FORM */}
              {listingType === "event" && (
                <div className="am-grid-2">
                  <Field label="Full Name *" icon={User} error={errors.fullName}>
                    <input className={`am-input${errors.fullName ? " am-input--err" : ""}`} placeholder="Full Name" value={form.fullName} onChange={set("fullName")} />
                  </Field>

                  <Field label="Participant Type *" icon={Building2} error={errors.organisation}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <div className="am-toggle-row">
                        <button type="button" className={`am-toggle-btn${form.orgType === "individual" ? " am-toggle-btn--active" : ""}`} onClick={() => setForm(f => ({ ...f, orgType: "individual" }))}>Individual</button>
                        <button type="button" className={`am-toggle-btn${form.orgType === "company"    ? " am-toggle-btn--active" : ""}`} onClick={() => setForm(f => ({ ...f, orgType: "company" }))}>Company</button>
                      </div>
                      <input className={`am-input${errors.organisation ? " am-input--err" : ""}`} placeholder={form.orgType === "individual" ? "Gender" : "Company / Institution"} value={form.organisation} onChange={set("organisation")} />
                    </div>
                  </Field>

                  <Field label="Your Role *" icon={Briefcase} error={errors.role}>
                    <input className={`am-input${errors.role ? " am-input--err" : ""}`} placeholder="e.g. Founder, Student, Developer" value={form.role} onChange={set("role")} />
                  </Field>

                  <Field label="Email Address *" icon={Mail} error={errors.email}>
                    <input className={`am-input${errors.email ? " am-input--err" : ""}`} type="email" placeholder="Email id" value={form.email} onChange={set("email")} />
                  </Field>

                  <Field label="Phone Number *" icon={Phone} error={errors.phone}>
                    <input className={`am-input${errors.phone ? " am-input--err" : ""}`} placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} />
                  </Field>

                  <Field label="Location (State) *" icon={MapPin} error={errors.location}>
                    <select className={`am-input am-select${errors.location ? " am-input--err" : ""}`} value={form.location} onChange={set("location")}>
                      <option value="">Select state</option>
                      {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>
              )}

              {/* INVESTOR FORM */}
              {listingType === "investor" && (
                <div className="am-grid-2">
                  <Field label="Full Name *" icon={User} error={errors.fullName}>
                    <input className={`am-input${errors.fullName ? " am-input--err" : ""}`} placeholder="Full Name" value={form.fullName} onChange={set("fullName")} />
                  </Field>

                  <Field label="Company Name *" icon={Building2} error={errors.organisation}>
                    <input className={`am-input${errors.organisation ? " am-input--err" : ""}`} placeholder="Your startup / company" value={form.organisation} onChange={set("organisation")} />
                  </Field>

                  <Field label="Funding Request *" icon={DollarSign} error={errors.fundingStage}>
                    <select className={`am-input am-select${errors.fundingStage ? " am-input--err" : ""}`} value={form.fundingStage} onChange={set("fundingStage")}>
                      <option value="">Select round</option>
                      <option value="Pre-Seed">Pre-Seed</option>
                      <option value="Seed">Seed</option>
                      <option value="Series A">Series A</option>
                      <option value="Series B">Series B</option>
                      <option value="Series C">Series C</option>
                      <option value="Series D+">Series D+</option>
                    </select>
                  </Field>

                  <Field label="Email Address *" icon={Mail} error={errors.email}>
                    <input className={`am-input${errors.email ? " am-input--err" : ""}`} type="email" placeholder="Email id" value={form.email} onChange={set("email")} />
                  </Field>

                  <Field label="Phone Number *" icon={Phone} error={errors.phone}>
                    <input className={`am-input${errors.phone ? " am-input--err" : ""}`} placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} />
                  </Field>

                  <Field label="Website *" icon={Globe} error={errors.website}>
                    <input className={`am-input${errors.website ? " am-input--err" : ""}`} placeholder="https://" value={form.website} onChange={set("website")} />
                  </Field>
                </div>
              )}

              {/* SERVICES FORM */}
              {listingType === "services" && (
                <div className="am-grid-2">
                  <Field label="Full Name *" icon={User} error={errors.fullName}>
                    <input className={`am-input${errors.fullName ? " am-input--err" : ""}`} placeholder="Full Name" value={form.fullName} onChange={set("fullName")} />
                  </Field>

                  <Field label="Company Name *" icon={Building2} error={errors.organisation}>
                    <input className={`am-input${errors.organisation ? " am-input--err" : ""}`} placeholder="Your company / institution" value={form.organisation} onChange={set("organisation")} />
                  </Field>

                  <Field label="Industry Type" icon={Briefcase}>
                    <input className="am-input" placeholder="e.g. FinTech, Healthcare, EdTech" value={form.industryType} onChange={set("industryType")} />
                  </Field>

                  <Field label="Email Address *" icon={Mail} error={errors.email}>
                    <input className={`am-input${errors.email ? " am-input--err" : ""}`} type="email" placeholder="Email id" value={form.email} onChange={set("email")} />
                  </Field>

                  <Field label="Phone Number *" icon={Phone} error={errors.phone}>
                    <input className={`am-input${errors.phone ? " am-input--err" : ""}`} placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} />
                  </Field>

                  <Field label="Location (State) *" icon={MapPin} error={errors.location}>
                    <select className={`am-input am-select${errors.location ? " am-input--err" : ""}`} value={form.location} onChange={set("location")}>
                      <option value="">Select state</option>
                      {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>
              )}

              {errors.submit && <p className="am-error" style={{ marginTop: 8 }}>{errors.submit}</p>}
            </div>
          )}
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="am-footer">
            <button className="am-btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <><Loader2 size={14} className="am-spin" /> Submitting...</>
              ) : (
                <><Send size={13} strokeWidth={1.75} /> {config.submitLabel}</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyModal;