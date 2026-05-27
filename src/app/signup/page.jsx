"use client";
import Link from "next/link";
import api from "@/app/api";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "@/app/styles/loginandsignup.css";
import Image from "next/image";
import {
  Layers, Building2, User, Mail, Lock,
  ShieldCheck, ChevronDown, Phone
} from "lucide-react";
import Select from "react-select";

/* ─────────────────────────────────────
   OTP MODAL
───────────────────────────────────── */
function OtpModal({ email, onVerify, onResend, onClose, loading }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(300);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toString().padStart(2, "0");

  const handleChange = (val, i) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !otp[i] && i > 0)
      inputRefs.current[i - 1]?.focus();
  };

  return (
    <div className="lsb-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="lsb-modal" role="dialog" aria-modal="true" aria-labelledby="otp-title">
        <div className="lsb-modal-header">
          <div className="lsb-modal-icon">✉</div>
          <div>
            <p className="lsb-modal-title" id="otp-title">Check your inbox</p>
            <p className="lsb-modal-sub">
              6-digit code sent to <strong>{email}</strong>
            </p>
          </div>
        </div>

        <div className="lsb-field">
          <label>Enter OTP</label>
          <div className="lsb-otp-row">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <input
                key={i}
                type="text"
                inputMode="numeric"
                maxLength="1"
                className="lsb-otp-box"
                value={otp[i]}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                ref={(el) => (inputRefs.current[i] = el)}
              />
            ))}
          </div>
        </div>

        <div className="lsb-modal-timer">
          <span>
            {seconds > 0
              ? <>Expires in <strong>{mins}:{secs}</strong></>
              : <span style={{ color: "var(--lsb-red)" }}>Code expired</span>
            }
          </span>
          <button className="lsb-modal-resend" type="button" onClick={onResend}>
            Resend code
          </button>
        </div>

        <button
          className="lsb-btn"
          type="button"
          onClick={() => onVerify(otp.join(""))}
          disabled={loading || otp.join("").length !== 6}
        >
          {loading ? "Verifying…" : "Verify & Create Account"}
        </button>

        <button className="lsb-modal-back" type="button" onClick={onClose}>
          ← Edit details
        </button>

        <div className="lsb-modal-progress">
          <div className="lsb-modal-dot" />
          <div className="lsb-modal-dot active" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   SUCCESS MODAL
───────────────────────────────────── */
function SuccessModal({ role }) {
  return (
    <div className="lsb-modal-overlay">
      <div className="lsb-modal" role="dialog" aria-modal="true" style={{ textAlign: "center", alignItems: "center" }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "linear-gradient(135deg, rgb(30,176,228) 0%, rgb(34,197,94) 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto", fontSize: 36, animation: "lsb-fade-in 0.4s ease both"
        }}>
          ✓
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <p className="lsb-modal-title" style={{ fontSize: "1.25rem", textAlign: "center" }}>
            🎉 Account Created!
          </p>
          <p className="lsb-modal-sub" style={{ textAlign: "center", fontSize: "0.9rem" }}>
            Welcome aboard! Your <strong>{role}</strong> account is ready.
            <br />Redirecting you now…
          </p>
        </div>

        <div style={{
          width: "100%", height: 4, borderRadius: 99,
          background: "rgba(28,20,16,0.08)", overflow: "hidden"
        }}>
          <div style={{
            height: "100%", borderRadius: 99,
            background: "linear-gradient(90deg, rgb(30,176,228), rgb(34,197,94))",
            animation: "lsb-progress 2s linear forwards"
          }} />
        </div>

        <style>{`
          @keyframes lsb-progress {
            from { width: 0% }
            to   { width: 100% }
          }
        `}</style>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   SIGNUP PAGE
───────────────────────────────────── */
const Page = () => {
  const router = useRouter();

  const [accountType, setAccountType]     = useState("user"); // "user" | "publisher" | "investor"

  const [email, setEmail]                 = useState("");
  const [password, setPassword]           = useState("");
  const [agreed, setAgreed]               = useState(false);
  const [error, setError]                 = useState("");
  const [loading, setLoading]             = useState(false);
  const [showOtpModal, setShowOtpModal]   = useState(false);
  const [verifying, setVerifying]         = useState(false);
  const [showSuccess, setShowSuccess]     = useState(false);
  const [successRole, setSuccessRole]     = useState("user");
  const [portalTarget, setPortalTarget]   = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [name, setName]   = useState("");
  const [phone, setPhone] = useState("");

  const [publisherTypes, setPublisherTypes] = useState([]);
  const [organizerTypes, setOrganizerTypes] = useState([]);
  const [loadingTypes, setLoadingTypes]     = useState(false);
  const [pubForm, setPubForm] = useState({
    publisherType: "",
    organizerType: "",
    organizationName: "",
    organizationType: "",
    publisherName: "",
  });
  const setPub = (k, v) => setPubForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  // ── Load organizer types for both publisher AND investor ──
  useEffect(() => {
    if (accountType !== "publisher" && accountType !== "investor") return;
    if (publisherTypes.length > 0) return;
    (async () => {
      try {
        setLoadingTypes(true);
        const [pubRes, orgRes] = await Promise.all([
          api.get("/api/public/publisher-types"),
          api.get("/api/public/organizer-types"),
        ]);
        setPublisherTypes(pubRes.data?.types || []);
        setOrganizerTypes(orgRes.data?.types || []);
      } catch {
        setError("Failed to load Industry types.");
      } finally {
        setLoadingTypes(false);
      }
    })();
  }, [accountType]);

  const validateUser = () => {
    if (!name.trim())    return "Full name is required.";
    if (!email.trim())   return "Email is required.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return "Enter a valid email.";
    if (!password || password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    if (!phone.trim() || !/^\+?[\d\s\-]{7,15}$/.test(phone.trim()))
      return "Enter a valid phone number.";
    if (!agreed) return "You must agree to the Terms & Conditions.";
    return null;
  };

  const validatePublisher = () => {
    if (!pubForm.organizationName.trim())      return "Enter company name.";
    if (!pubForm.organizerType)                return "Select a company type.";
    if (!pubForm.publisherName.trim())         return "Enter publisher name.";
    if (!email.trim())                         return "Enter email.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return "Enter a valid email.";
    if (!password || password.length < 6)     return "Password must be at least 6 characters.";
    if (password !== confirmPassword)          return "Passwords do not match.";
    if (!agreed)                               return "You must agree to the Terms & Conditions.";
    return null;
  };

  const redirectAfterSuccess = (role, path) => {
    setSuccessRole(role);
    setShowSuccess(true);
    setTimeout(() => router.push(path), 2000);
  };

  /* ── USER: direct register (no OTP) ── */
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    const msg = validateUser();
    if (msg) return setError(msg);
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/register", { name, email, password, phone });
      if (res.data) redirectAfterSuccess("user", "/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── PUBLISHER / INVESTOR: send OTP first ── */
  const handlePublisherSendOtp = async (e) => {
    e.preventDefault();
    const msg = validatePublisher();
    if (msg) return setError(msg);
    setError("");
    setLoading(true);
    try {
      // Always role "publisher" — accountCategory carries "publisher" vs "investor"
      await api.post("/api/auth/send-otp", { email, role: "publisher", type: "register" });
      setShowOtpModal(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  /* ── PUBLISHER / INVESTOR: verify OTP + create account ── */
  const handleVerifyOtp = async (otpValue) => {
    if (otpValue.length !== 6) return setError("Enter complete 6-digit OTP.");
    setVerifying(true);
    setError("");
    try {
      const selectedOrgType = organizerTypes.find((t) => t._id === pubForm.organizerType);
      const res = await api.post("/api/auth/verify-otp", {
        email, otp: otpValue,
        role: "publisher",           // always publisher role
        accountCategory: accountType, // ← "publisher" or "investor"
        password, phone,
        publisherType: pubForm.publisherType,
        organizerType: pubForm.organizerType,
        organizationName: pubForm.organizationName,
        organizationType: selectedOrgType?.name || "",
        publisherName: pubForm.publisherName,
        companyName: pubForm.organizationName,
      });

      const { token, user: userData } = res.data;
      if (token) {
        localStorage.setItem("publisher_token", token);
        localStorage.setItem("publisher_category", accountType); // ← "publisher" or "investor"
      }
      setShowOtpModal(false);
      redirectAfterSuccess(accountType, "/publisher/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "OTP verification failed.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await api.post("/api/auth/send-otp", { email, role: "publisher", type: "register" });
    } catch (err) {
      setError(err?.response?.data?.message || "Resend failed.");
    }
  };

  // ── Helper: is it a publisher-type account? ──
  const isPublisherType = accountType === "publisher" || accountType === "investor";

  return (
    <main>
      {showOtpModal && (
        <OtpModal
          email={email}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
          onClose={() => setShowOtpModal(false)}
          loading={verifying}
        />
      )}
      {showSuccess && <SuccessModal role={successRole} />}

      <section className="login-section position-relative pt-100 lg-pt-80 pb-150 lg-pb-80">
        <div className="lsb-page">
          <main className="lsb-shell" id="main">

            {/* ── LEFT PANEL ── */}
            <section className="lsb-left">
              <div className="lsb-bar" />
              <div className="lsb-hero">
                <div className="lsb-tag">Join the ecosystem</div>
                <div className="lsb-orbit">
                  <strong>Launch, grow, and connect.</strong>
                  <span>
                    Create a business-ready account for hiring, events,
                    competitions, and investors.
                  </span>
                </div>
                <div className="lsb-features">
                  <div className="lsb-feature" style={{ background: "linear-gradient(135deg, rgb(255,207,10) 0%, rgb(223,88,42) 100%)", color: "#1a1a1a" }}>
                    <strong>Competitions</strong><span>Submit and track</span>
                  </div>
                  <div className="lsb-feature" style={{ background: "linear-gradient(135deg, rgb(30,176,228) 0%, rgb(255,207,10) 100%)", color: "#1a1a1a" }}>
                    <strong>Events</strong><span>Register and manage</span>
                  </div>
                  <div className="lsb-feature" style={{ background: "linear-gradient(135deg, rgb(223,88,42) 0%, rgb(30,176,228) 100%)" }}>
                    <strong>Jobs</strong><span>Talent and hiring</span>
                  </div>
                  <div className="lsb-feature" style={{ background: "linear-gradient(135deg, rgb(255,207,10) 0%, rgb(30,176,228) 100%)", color: "#1a1a1a" }}>
                    <strong>Investors</strong><span>Pitch and connect</span>
                  </div>
                  <div className="lsb-feature" style={{ background: "linear-gradient(135deg, rgb(30,176,228) 0%, rgb(223,88,42) 100%)" }}>
                    <strong>Products</strong><span>Buy and order</span>
                  </div>
                  <div className="lsb-feature" style={{ background: "linear-gradient(135deg, rgb(223,88,42) 0%, rgb(255,207,10) 100%)", color: "#1a1a1a" }}>
                    <strong>Services</strong><span>Let us help</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ── RIGHT PANEL ── */}
            <section className="lsb-right">
              <div className="lsb-card">

                <div className="lsb-head">
                  <Image
                    src="/assets/images/logo/logo_04.jpg" alt="logo"
                    width={150} height={60}
                    style={{ height: "auto", display: "block", margin: "0 auto 12px" }}
                  />
                  {/* ── Dynamic heading for all 3 types ── */}
                  {accountType === "publisher" && (
                    <><h2>Join as a Publisher</h2><p>Register as a publisher to manage events, competitions, jobs, and more.</p></>
                  )}
                  {accountType === "investor" && (
                    <><h2>Join as an Investor</h2><p>Register as an investor to explore startups, events, and funding opportunities.</p></>
                  )}
                  {accountType === "user" && (
                    <><h2>Join as a User</h2><p>Register to explore and apply for exclusive events and opportunities.</p></>
                  )}
                </div>

                {error && <div className="lsb-error">{error}</div>}

                {/* ── Account type dropdown ── */}
                <div className="lsb-field">
                  <label>Account Type</label>
                  <div className="lsb-ctrl lsb-ctrl--select">
                    <User size={15} color="var(--lsb-red)" strokeWidth={2} style={{ flexShrink: 0 }} />
                    <Select
                      options={[
                        { value: "user",      label: "User"      },
                        { value: "publisher", label: "Publisher" },
                        { value: "investor",  label: "Investor"  },
                      ]}
                      // ── Fixed: correct label for all 3 types ──
                      value={{
                        value: accountType,
                        label: accountType === "user" ? "User"
                             : accountType === "investor" ? "Investor"
                             : "Publisher",
                      }}
                      onChange={(opt) => { setAccountType(opt.value); setError(""); setConfirmPassword(""); }}
                      classNamePrefix="lsb-rs"
                      className="lsb-rs-wrap"
                      isSearchable={false}
                      menuPortalTarget={portalTarget}
                      menuPosition="fixed"
                    />
                  </div>
                </div>

                {/* ════════════════════════
                    USER FORM
                ════════════════════════ */}
                {accountType === "user" && (
                  <form className="lsb-form" onSubmit={handleUserSubmit}>
                    <div className="lsb-field">
                      <label htmlFor="s-name">Full Name</label>
                      <div className="lsb-ctrl">
                        <i>A</i>
                        <input id="s-name" type="text" placeholder="Aarav Mehta"
                          value={name} onChange={(e) => setName(e.target.value)} required />
                      </div>
                    </div>
                    <div className="lsb-field">
                      <label htmlFor="s-email">Email</label>
                      <div className="lsb-ctrl">
                        <i>@</i>
                        <input id="s-email" type="email" placeholder="you@company.com"
                          value={email} onChange={(e) => setEmail(e.target.value)} required />
                      </div>
                    </div>
                    <div className="lsb-field">
                      <label htmlFor="s-phone">Mobile Number</label>
                      <div className="lsb-ctrl">
                        <Phone size={15} color="var(--lsb-red)" strokeWidth={2} style={{ flexShrink: 0 }} />
                        <input id="s-phone" type="tel" placeholder="+91 98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                          onKeyDown={(e) => {
                            if (!/[\d\b]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key))
                              e.preventDefault();
                          }}
                          required
                        />
                      </div>
                    </div>
                    <div className="lsb-field">
                      <label htmlFor="s-pass">Password</label>
                      <div className="lsb-ctrl">
                        <i>*</i>
                        <input id="s-pass" type="password" placeholder="Create a secure password"
                          value={password} onChange={(e) => setPassword(e.target.value)} required />
                      </div>
                    </div>
                    <div className="lsb-field">
                      <label htmlFor="s-confirm-pass">Confirm Password</label>
                      <div className="lsb-ctrl">
                        <i>*</i>
                        <input id="s-confirm-pass" type="password" placeholder="Re-enter your password"
                          value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                      </div>
                      {confirmPassword && password !== confirmPassword && (
                        <span style={{ color: "var(--lsb-red)", fontSize: "12px", marginTop: "4px", display: "block" }}>
                          Passwords do not match
                        </span>
                      )}
                    </div>
                    <label className="lsb-check">
                      <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                      I agree to the terms and privacy policy
                    </label>
                    <button className="lsb-btn" type="submit" disabled={loading}>
                      {loading ? "Creating account..." : "Create User Account"}
                    </button>
                    <p className="lsb-note">
                      Already registered? <Link href="/login" className="lsb-link">Back to login</Link>
                    </p>
                  </form>
                )}

                {/* ════════════════════════════════════════
                    PUBLISHER + INVESTOR FORM (shared)
                ════════════════════════════════════════ */}
                {isPublisherType && (
                  <form className="lsb-form" onSubmit={handlePublisherSendOtp}>

                    <div className="lsb-field">
                      <label>Company Type</label>
                      <div className="lsb-ctrl lsb-ctrl--select">
                        <ShieldCheck size={15} color="var(--lsb-red)" strokeWidth={2} style={{ flexShrink: 0 }} />
                        <Select
                          options={organizerTypes.map((t) => ({ value: t._id, label: t.name }))}
                          onChange={(opt) => setPub("organizerType", opt?.value)}
                          value={organizerTypes.find((t) => t._id === pubForm.organizerType)
                            ? { value: pubForm.organizerType, label: organizerTypes.find((t) => t._id === pubForm.organizerType)?.name }
                            : null}
                          placeholder={loadingTypes ? "Loading…" : "Select Company type"}
                          isDisabled={loadingTypes}
                          classNamePrefix="lsb-rs"
                          className="lsb-rs-wrap"
                          menuPortalTarget={portalTarget}
                          menuPosition="fixed"
                          isSearchable={false}
                        />
                      </div>
                    </div>

                    <div className="lsb-field">
                      <label htmlFor="org-name">Company Name</label>
                      <div className="lsb-ctrl">
                        <Building2 size={15} color="var(--lsb-red)" strokeWidth={2} style={{ flexShrink: 0 }} />
                        <input id="org-name" type="text" placeholder="ABC Pvt Ltd"
                          value={pubForm.organizationName}
                          onChange={(e) => setPub("organizationName", e.target.value)} required />
                      </div>
                    </div>

                    <div className="lsb-field">
                      {/* Label adapts based on type */}
                      <label htmlFor="pub-name">{accountType === "investor" ? "Investor Name" : "Publisher Name"}</label>
                      <div className="lsb-ctrl">
                        <User size={15} color="var(--lsb-red)" strokeWidth={2} style={{ flexShrink: 0 }} />
                        <input id="pub-name" type="text" placeholder="Your full name"
                          value={pubForm.publisherName}
                          onChange={(e) => setPub("publisherName", e.target.value)} required />
                      </div>
                    </div>

                    <div className="lsb-field">
                      <label htmlFor="pub-email">Email Address</label>
                      <div className="lsb-ctrl">
                        <Mail size={15} color="var(--lsb-red)" strokeWidth={2} style={{ flexShrink: 0 }} />
                        <input id="pub-email" type="email" placeholder="name@company.com"
                          value={email} onChange={(e) => setEmail(e.target.value)} required />
                      </div>
                    </div>

                    <div className="lsb-field">
                      <label htmlFor="pub-phone">Mobile Number</label>
                      <div className="lsb-ctrl">
                        <i>#</i>
                        <input id="pub-phone" type="tel" placeholder="+91 98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                          onKeyDown={(e) => {
                            if (!/[\d\b]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key))
                              e.preventDefault();
                          }}
                          required
                        />
                      </div>
                    </div>

                    <div className="lsb-field">
                      <label htmlFor="pub-pass">Password</label>
                      <div className="lsb-ctrl">
                        <Lock size={15} color="var(--lsb-red)" strokeWidth={2} style={{ flexShrink: 0 }} />
                        <input id="pub-pass" type="password" placeholder="Min 6 characters"
                          value={password} onChange={(e) => setPassword(e.target.value)} required />
                      </div>
                    </div>

                    <div className="lsb-field">
                      <label htmlFor="pub-confirm-pass">Confirm Password</label>
                      <div className="lsb-ctrl">
                        <Lock size={15} color="var(--lsb-red)" strokeWidth={2} style={{ flexShrink: 0 }} />
                        <input id="pub-confirm-pass" type="password" placeholder="Re-enter your password"
                          value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                      </div>
                      {confirmPassword && password !== confirmPassword && (
                        <span style={{ color: "var(--lsb-red)", fontSize: "12px", marginTop: "4px", display: "block" }}>
                          Passwords do not match
                        </span>
                      )}
                    </div>

                    <label className="lsb-check">
                      <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                      I agree to the terms and privacy policy
                    </label>

                    <button className="lsb-btn" type="submit" disabled={loading}>
                      {loading ? "Sending OTP…" : `Register as ${accountType === "investor" ? "Investor" : "Publisher"} & Send OTP`}
                    </button>

                    <p className="lsb-note">
                      Already registered? <Link href="/login" className="lsb-link">Back to login</Link>
                    </p>
                  </form>
                )}

              </div>
            </section>

          </main>
        </div>
      </section>
    </main>
  );
};

export default Page;