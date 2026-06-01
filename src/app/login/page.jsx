"use client";
import Link from "next/link";
import Image from "next/image";
import api from "@/app/api";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import "@/app/styles/loginandsignup.css";
import { Eye, EyeOff, ArrowLeft, Mail, KeyRound, ShieldCheck } from "lucide-react";


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
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputRefs.current[i - 1]?.focus();
  };

  return (
    <div className="lsb-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="lsb-modal" role="dialog" aria-modal="true" aria-labelledby="otp-title">
        <div className="lsb-modal-header">
          <div className="lsb-modal-icon">✉</div>
          <div>
            <p className="lsb-modal-title" id="otp-title">Check your inbox</p>
            <p className="lsb-modal-sub">6-digit code sent to <strong>{email}</strong></p>
          </div>
        </div>
        <div className="lsb-field">
          <label>Enter OTP</label>
          <div className="lsb-otp-row">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <input
                key={i} type="text" inputMode="numeric" maxLength="1"
                className="lsb-otp-box" value={otp[i]}
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
              ? <><span>Expires in </span><strong>{mins}:{secs}</strong></>
              : <span style={{ color: "var(--lsb-red)" }}>Code expired</span>
            }
          </span>
          <button className="lsb-modal-resend" type="button" onClick={onResend}>Resend code</button>
        </div>
        <button
          className="lsb-btn" type="button"
          onClick={() => onVerify(otp.join(""))}
          disabled={loading || otp.join("").length !== 6}
        >
          {loading ? "Verifying…" : "Verify & Continue"}
        </button>
        <button className="lsb-modal-back" type="button" onClick={onClose}>← Back to login</button>
        <div className="lsb-modal-progress">
          <div className="lsb-modal-dot" />
          <div className="lsb-modal-dot active" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   FORGOT PASSWORD MODAL  (new)
───────────────────────────────────── */
function ForgotPasswordModal({ onClose }) {
  const [step, setStep]         = useState("email");   // "email" | "otp" | "reset"
  const [email, setEmail]       = useState("");
  const [otp, setOtp]           = useState(["", "", "", "", "", ""]);
  const [newPassword, setNew]   = useState("");
  const [confirm, setConfirm]   = useState("");
  const [showNew, setShowNew]   = useState(false);
  const [showCon, setShowCon]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [seconds, setSeconds]   = useState(300);
  const otpRefs                 = useRef([]);

  /* OTP countdown */
  useEffect(() => {
    if (step !== "otp") return;
    setSeconds(300);
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [step]);

  /* auto-focus first OTP box */
  useEffect(() => {
    if (step === "otp") setTimeout(() => otpRefs.current[0]?.focus(), 80);
  }, [step]);

  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toString().padStart(2, "0");

  const handleOtpChange = (val, i) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (e, i) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  /* Step 1 — send OTP */
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setError("");
    if (!email) { setError("Please enter your email."); return; }
    setLoading(true);
    try {
      await api.post("/api/auth/forgot-password/send-otp", { email });
      setStep("otp");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* Resend OTP */
  const handleResend = async () => {
    setError("");
    try {
      await api.post("/api/auth/forgot-password/send-otp", { email });
      setSeconds(300);
    } catch (err) {
      setError(err?.response?.data?.message || "Resend failed.");
    }
  };

  /* Step 2 — verify OTP (client-side length check only; real check on reset) */
  const handleVerifyOtp = (e) => {
    e?.preventDefault();
    setError("");
    if (otp.join("").length !== 6) { setError("Please enter all 6 digits."); return; }
    setStep("reset");
  };

  /* Step 3 — reset password */
  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (newPassword !== confirm)  { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      await api.post("/api/auth/forgot-password/reset", {
        email,
        otp: otp.join(""),
        newPassword,
      });
      setSuccess("Password reset successfully! You can now log in.");
    } catch (err) {
      setError(err?.response?.data?.message || "Reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const stepIndex = { email: 0, otp: 1, reset: 2 }[step];

  const stepMeta = [
    { icon: <Mail size={18} />,       label: "Email" },
    { icon: <ShieldCheck size={18} />, label: "OTP" },
    { icon: <KeyRound size={18} />,   label: "Reset" },
  ];

  return (
    <div
      className="lsb-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="lsb-modal" role="dialog" aria-modal="true" aria-labelledby="fp-title" style={{ maxWidth: 420 }}>

        {/* ── Header ── */}
        <div className="lsb-modal-header" style={{ marginBottom: 20 }}>
          <div className="lsb-modal-icon">
            {stepMeta[stepIndex].icon}
          </div>
          <div>
            <p className="lsb-modal-title" id="fp-title">
              {step === "email" && "Forgot password?"}
              {step === "otp"   && "Enter verification code"}
              {step === "reset" && "Set new password"}
            </p>
            <p className="lsb-modal-sub">
              {step === "email" && "Enter your email and we'll send a code."}
              {step === "otp"   && <>Code sent to <strong>{email}</strong></>}
              {step === "reset" && "Choose a strong new password."}
            </p>
          </div>
        </div>

        {/* ── Step bar ── */}
        <div style={{ display: "flex", gap: 6, marginBottom: 22 }}>
          {stepMeta.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1, height: 4, borderRadius: 4,
                background: i <= stepIndex ? "#0194df" : "#e5e7eb",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>

        {/* ── Messages ── */}
        {error   && <div className="lsb-error" style={{ marginBottom: 14 }}>{error}</div>}
        {success && (
          <div style={{ background: "#dcfce7", color: "#166534", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 14 }}>
            {success}
          </div>
        )}

        {/* ── Step 1: Email ── */}
        {step === "email" && !success && (
          <form onSubmit={handleSendOtp}>
            <div className="lsb-field">
              <label htmlFor="fp-email">Email address</label>
              <div className="lsb-ctrl">
                <i>@</i>
                <input
                  id="fp-email" type="email" placeholder="Enter Email ID"
                  value={email} onChange={(e) => setEmail(e.target.value)} required
                />
              </div>
            </div>
            <button className="lsb-btn" type="submit" disabled={loading} style={{padding: "10px" , marginTop : "20px"}}>
              {loading ? "Sending…" : "Send OTP"}
            </button>
          </form>
        )}

        {/* ── Step 2: OTP ── */}
        {step === "otp" && !success && (
          <form onSubmit={handleVerifyOtp}>
            <div className="lsb-field">
              <label>6-digit code</label>
              <div className="lsb-otp-row">
                {[0,1,2,3,4,5].map((i) => (
                  <input
                    key={i} type="text" inputMode="numeric" maxLength="1"
                    className="lsb-otp-box" value={otp[i]}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    ref={(el) => (otpRefs.current[i] = el)}
                  />
                ))}
              </div>
            </div>
            <div className="lsb-modal-timer">
              <span>
                {seconds > 0
                  ? <><span>Expires in </span><strong>{mins}:{secs}</strong></>
                  : <span style={{ color: "var(--lsb-red)" }}>Code expired</span>
                }
              </span>
              <button type="button" className="lsb-modal-resend" onClick={handleResend}>
                Resend code
              </button>
            </div>
            <button
              className="lsb-btn" type="submit"
              disabled={loading || otp.join("").length !== 6}
              style={{padding: "10px" , marginTop : "20px"}}
            >
              {loading ? "Verifying…" : "Verify & Continue"}
            </button>
            <button
              type="button" className="lsb-modal-back"
              onClick={() => { setStep("email"); setError(""); setOtp(["","","","","",""]); }}
              style={{ marginTop : "20px"}}
            >
              <ArrowLeft size={13} style={{ marginRight: 4, verticalAlign: -1 }} />
              Change email
            </button>
          </form>
        )}

        {/* ── Step 3: New password ── */}
        {step === "reset" && !success && (
          <form onSubmit={handleReset}>
            <div className="lsb-field">
              <label htmlFor="fp-new">New password</label>
              <div className="lsb-ctrl">
                <i>*</i>
                <input
                  id="fp-new"
                  type={showNew ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={newPassword}
                  onChange={(e) => setNew(e.target.value)}
                  required
                />
                <button
                  type="button" className="lsb-eye-toggle"
                  onClick={() => setShowNew((p) => !p)}
                  aria-label={showNew ? "Hide" : "Show"}
                >
                  {showNew ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
                </button>
              </div>
            </div>
            <div className="lsb-field">
              <label htmlFor="fp-con">Confirm password</label>
              <div className="lsb-ctrl">
                <i>*</i>
                <input
                  id="fp-con"
                  type={showCon ? "text" : "password"}
                  placeholder="Repeat password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
                <button
                  type="button" className="lsb-eye-toggle"
                  onClick={() => setShowCon((p) => !p)}
                  aria-label={showCon ? "Hide" : "Show"}
                >
                  {showCon ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
                </button>
              </div>
            </div>
            <button className="lsb-btn" type="submit" disabled={loading} style={{padding: "10px" , marginTop : "20px"}}>
              {loading ? "Resetting…" : "Reset Password"}
            </button>
          </form>
        )}

        {/* ── Success: close / back to login ── */}
        {success && (
          <button className="lsb-btn" type="button" onClick={onClose}>
            Back to login
          </button>
        )}

        {/* ── Back link (email & reset steps only) ── */}
        {!success && step !== "otp" && (
          <button className="lsb-modal-back" type="button" onClick={onClose}>
            <ArrowLeft size={13} style={{ marginRight: 4, verticalAlign: -1 }} />
            Back to login
          </button>
        )}

        {/* Progress dots */}
        <div className="lsb-modal-progress">
          {stepMeta.map((_, i) => (
            <div key={i} className={`lsb-modal-dot${i === stepIndex ? " active" : ""}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   LOGIN PAGE
───────────────────────────────────── */
const Page = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [method, setMethod]             = useState("password");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showFpModal, setShowFpModal]   = useState(false);   // ← forgot-password modal
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");

  const redirect = (role) => {
    router.push(role === "publisher" ? "/publisher/dashboard" : "/");
    router.refresh();
  };

/* ── Password login ── */
const handlePasswordSubmit = async (e) => {
  e.preventDefault();
  setLoading(true); setError("");
  try {
    const { data } = await api.post("/api/auth/login", { email, password });
    const { token, user: userData } = data;
    if (userData?.role === "user") {
      login(userData, token);
      router.push("/"); router.refresh();
    } else if (userData?.role === "publisher") {
      localStorage.setItem("publisher_token", token);
      localStorage.setItem("publisher_category", data.publisherCategory || "publisher"); // ← add
      router.push("/publisher/dashboard"); router.refresh();
    } else {
      setError("Access denied. Only users and publishers can log in here.");
    }
  } catch (err) {
    setError(err?.response?.data?.message || "Invalid email or password.");
  } finally {
    setLoading(false);
  }
};



  /* ── Send OTP ── */
const handleSendOtp = async () => {
  if (!email) { setError("Please enter your email."); return; }
  setError(""); setLoading(true);
  try {
    const res = await api.post("/api/auth/send-otp", { email, type: "login" });
    if (res.data.success) setShowOtpModal(true);
    else setError("Failed to send OTP. Please try again.");
  } catch (err) {
    setError(err?.response?.data?.message || "Failed to send OTP.");
  } finally {
    setLoading(false);
  }
};

  /* ── Verify OTP ── */
/* ── Verify OTP ── */
const handleVerifyOtp = async (otpValue) => {
  if (otpValue.length !== 6) { setError("Please enter all 6 digits."); return; }
  setLoading(true); setError("");
  try {
    const res = await api.post("/api/auth/verify-otp", { email, otp: otpValue });
    if (res.data.success) {
      const { token, user: userData } = res.data;
      if (userData?.role === "user") {
        login(userData, token);
        setShowOtpModal(false);
        router.push("/"); router.refresh();
      } else if (userData?.role === "publisher") {
        localStorage.setItem("publisher_token", token);
        localStorage.setItem("publisher_category", res.data.publisherCategory || "publisher"); // ← add
        setShowOtpModal(false);
        router.push("/publisher/dashboard"); router.refresh();
      } else {
        setError("Access denied.");
        setShowOtpModal(false);
      }
    }
  } catch (err) {
    setError(err?.response?.data?.message || "Invalid or expired OTP.");
  } finally {
    setLoading(false);
  }
};

  /* ── Resend OTP ── */
const handleResendOtp = async () => {
  try { await api.post("/api/auth/send-otp", { email, type: "login" }); } 
  catch (err) { setError(err?.response?.data?.message || "Resend failed."); }
};

  return (
    <main>
      {showOtpModal && (
        <OtpModal
          email={email} onVerify={handleVerifyOtp}
          onResend={handleResendOtp} onClose={() => setShowOtpModal(false)}
          loading={loading}
        />
      )}

      {showFpModal && (
        <ForgotPasswordModal onClose={() => setShowFpModal(false)} />
      )}

      <section className="login-section position-relative pt-100 lg-pt-80 pb-150 lg-pb-80">
        <div className="lsb-page">
          <main className="lsb-shell" id="main">

            {/* ── LEFT PANEL ── */}
            <section className="lsb-left">
              <div className="lsb-bar" />
              <div className="lsb-hero">
                <div className="lsb-tag">Startup services hub</div>
                <div className="lsb-orbit">
                  <strong>Welcome back to your ecosystem.</strong>
                  <span>
                    Access hiring tools, event registrations, competition tracks,
                    and investor connections.
                  </span>
                </div>
                <div className="lsb-features">
                  <div className="lsb-feature" style={{ background: "linear-gradient(135deg, rgb(255,207,10) 0%, rgb(223,88,42) 100%)", color: "#1a1a1a" }}>
                    <strong>Competitions</strong><span style={{color: "white"}}>Submit and track</span>
                  </div>
                  <div className="lsb-feature" style={{ background: "linear-gradient(135deg, rgb(30,176,228) 0%, rgb(255,207,10) 100%)", color: "#1a1a1a" }}>
                    <strong>Events</strong><span style={{color: "white"}}>Register and manage</span>
                  </div>
                  <div className="lsb-feature" style={{ background: "linear-gradient(135deg, rgb(223,88,42) 0%, rgb(30,176,228) 100%)" }}>
                    <strong>Jobs</strong><span style={{color: "white"}}>Talent and hiring</span>
                  </div>
                  <div className="lsb-feature" style={{ background: "linear-gradient(135deg, rgb(255,207,10) 0%, rgb(30,176,228) 100%)", color: "#1a1a1a" }}>
                    <strong>Investors</strong><span style={{color: "white"}}>Pitch and connect</span>
                  </div>
                  <div className="lsb-feature" style={{ background: "linear-gradient(135deg, rgb(30,176,228) 0%, rgb(223,88,42) 100%)" }}>
                    <strong>Products</strong><span style={{color: "white"}}>Buy and order</span>
                  </div>
                  <div className="lsb-feature" style={{ background: "linear-gradient(135deg, rgb(223,88,42) 0%, rgb(255,207,10) 100%)", color: "#1a1a1a" }}>
                    <strong>Services</strong><span style={{color: "white"}}>Let us help</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ── RIGHT PANEL ── */}
            <section className="lsb-right">
              <div className="lsb-card">
                <div className="lsb-head">
                  <Image
                    src="/assets/images/logo/logo_4.jpg" alt="logo"
                    width={150} height={60}
                    style={{ height: "auto", marginBottom: "12px", display: "block", margin: "0 auto 12px" }}
                  />
                  <h2>Welcome to Your Unlock Startup Account</h2>
                  <p>Sign in to access your dashboard, manage your listings and take advantage of all the services and resources available to help grow your startup.</p>
                </div>

                {error && <div className="lsb-error">{error}</div>}

                <div className="lsb-method-toggle">
                  <button type="button" className={`lsb-method-btn${method === "password" ? " active" : ""}`}
                    onClick={() => { setMethod("password"); setError(""); }}>Password</button>
                  <button type="button" className={`lsb-method-btn${method === "otp" ? " active" : ""}`}
                    onClick={() => { setMethod("otp"); setError(""); }}>OTP</button>
                </div>

                {/* ── Password method ── */}
                {method === "password" && (
                  <form className="lsb-form" onSubmit={handlePasswordSubmit}>
                    <div className="lsb-field">
                      <label htmlFor="l-email">Email</label>
                      <div className="lsb-ctrl">
                        <i>@</i>
                        <input id="l-email" type="email" name="email"
                          placeholder="Enter Email ID" value={email}
                          onChange={(e) => setEmail(e.target.value)} required />
                      </div>
                    </div>

                    <div className="lsb-field">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <label htmlFor="l-pass" style={{ margin: 0 }}>Password</label>
                        {/* ── Forgot password link ── */}
                        <button
                          type="button"
                          onClick={() => { setError(""); setShowFpModal(true); }}
                          style={{
                            background: "none", border: "none", padding: 0,
                            color: "#0194df", fontSize: 12, fontWeight: 600,
                            cursor: "pointer", textDecoration: "underline",
                            textUnderlineOffset: 2,
                          }}
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="lsb-ctrl">
                        <i>*</i>
                        <input id="l-pass" type={showPassword ? "text" : "password"}
                          name="password" placeholder="Enter password" value={password}
                          onChange={(e) => setPassword(e.target.value)} required />
                        <button type="button" className="lsb-eye-toggle"
                          onClick={() => setShowPassword((p) => !p)}
                          aria-label={showPassword ? "Hide password" : "Show password"}>
                          {showPassword ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
                        </button>
                      </div>
                    </div>

                    <button className="lsb-btn" type="submit" disabled={loading}>
                      {loading ? "Logging in..." : "Login"}
                    </button>
                    <p className="lsb-note">
                      New user? <Link href="/signup" className="lsb-link">Create account</Link>
                    </p>
                  </form>
                )}

                {/* ── OTP method ── */}
                {method === "otp" && (
                  <div className="lsb-form">
                    <div className="lsb-field">
                      <label htmlFor="otp-email">Email</label>
                      <div className="lsb-ctrl">
                        <i>@</i>
                        <input id="otp-email" type="email" placeholder="Enter Email ID"
                          value={email} onChange={(e) => setEmail(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendOtp()} />
                      </div>
                    </div>
                    <button className="lsb-btn" type="button" onClick={handleSendOtp} disabled={loading}>
                      {loading ? "Sending…" : "Send OTP"}
                    </button>
                    <p className="lsb-note">
                      New user? <Link href="/signup" className="lsb-link">Create account</Link>
                    </p>
                  </div>
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