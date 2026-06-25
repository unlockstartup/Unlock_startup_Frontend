"use client";

import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import { useState } from "react";
import "./contact.css";
import { INDIA_STATES } from "@/app/constants";

const Page = () => {

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    state: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
const [stateOpen, setStateOpen] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <main className="contact-main">
      {/* Breadcrumb */}

      {/* Hero Section */}
      <section className="hero-section" style={{marginTop: "80px"}}>
        <div className="container" >
          <div className="hero-grid">
            <div className="hero-content">
              <h1>Get in Touch. Grow with Unlock Startup.</h1>
              <p>
             Have a question, partnership inquiry, support request, or business opportunity? We're here to help.
              </p> <br/> 
              <p>Whether you are a startup, innovator, company, organization, investor, service provider, or job seeker, the Unlock Startup team is ready to assist you. Contact us to learn more about our platform, subscription plans, listings, partnerships, technical support, or any other inquiries.
We value innovation, collaboration, and meaningful connections. Our team will review your message and respond as soon as possible.
</p>
<h4 style={{marginTop : 18}}>Let's connect and unlock new opportunities for growth, innovation, and success together.</h4>
            </div>

            <div className="contact-info" aria-label="Quick contact options">
              <div className="contact-item">
                <div className="contact-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="contact-details">
                  <h3>Call us</h3>
                  <p>
                    <a href="tel:+91-9266733959">+91 92667 33959</a>
                  </p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon" aria-hidden="true">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  <rect x="2" y="4" width="20" height="16" rx="2" />
  <path d="M2 7l10 7 10-7" />
</svg>
                </div>
                <div className="contact-details">
                  <h3>Email us</h3>
                  <p>
                    <a href="mailto:support@unlockstartup.com">support@unlockstartup.com</a>
                  </p>
                </div>
              </div>
              {/* <div className="contact-item">
                <div className="contact-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
                  </svg>
                </div> */}
                {/* <div className="contact-details">
                  <h3>Email us</h3>
                  <p>
                    <a href="mailto:hello@example.com">hello@example.com</a>
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        {/* </div> */}
      </section>

      {/* Contact Form Section */}
      <section className="form-section-wrapper">
        <div className="container">
          <div className="section-head">
            <div className="section-label">Tell us more</div>
            <div>
              <h2> Every Great Opportunity Starts with a Conversation.</h2>
              <p className="section-copy">
               We'd love to learn more about your goals, ideas, and requirements. Whether you're looking to publish a challenge, promote an event, post a job, showcase a product, connect with investors, or explore business services, our team is here to assist you.
              </p>
            </div>
          </div>

          <div className="form-section">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="company">Company Name</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      placeholder="Enter Company Name"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="+91 999 999 9999"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="Enter your email id"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

<div className="form-group full-width">
  <label htmlFor="state">State *</label>
  <div style={{ position: "relative" }}>
    <div
      className="form-select"
      style={{
        cursor: "pointer",
        userSelect: "none",
        border: "1.5px solid #dee2e6",
        borderRadius: 8,
        padding: "10px 14px",
        fontSize: 14,
        color: formData.state ? "#212529" : "#6c757d",
        background: "#fff",
      }}
      onClick={() => setStateOpen((p) => !p)}
    >
      {formData.state || "Select your state"}
    </div>
    {stateOpen && (
      <div style={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        maxHeight: 200,
        overflowY: "auto",
        background: "#fff",
        border: "1.5px solid #dee2e6",
        borderRadius: 8,
        zIndex: 1055,
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
      }}>
        <div
          style={{ padding: "8px 12px", cursor: "pointer", color: "#6c757d", fontSize: 14 }}
          onClick={() => {
            setFormData((prev) => ({ ...prev, state: "" }));
            setStateOpen(false);
          }}
        >
          Select your state
        </div>
        {INDIA_STATES.map((state) => (
          <div
            key={state}
            style={{
              padding: "8px 12px",
              cursor: "pointer",
              fontSize: 14,
              background: formData.state === state ? "#0d6efd" : "transparent",
              color: formData.state === state ? "#fff" : "#212529",
            }}
            onMouseEnter={(e) => {
              if (formData.state !== state)
                e.currentTarget.style.background = "#f3f4f6";
            }}
            onMouseLeave={(e) => {
              if (formData.state !== state)
                e.currentTarget.style.background = "transparent";
            }}
            onClick={() => {
              setFormData((prev) => ({ ...prev, state }));
              setStateOpen(false);
            }}
          >
            {state}
          </div>
        ))}
      </div>
    )}
  </div>
</div>

                <div className="form-group full-width">
                  <label htmlFor="message">Tell us about your event or project *</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    placeholder="Describe your upcoming product launch, investor summit, networking gala, or any other high-impact event idea..."
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="submit-btn">
                  Send Message
                </button>
              </form>
            ) : (
              <div className="success-msg" role="status" aria-live="polite">
                <span className="success-icon">🎉</span>
                <h3>Thank You!</h3>
                <p>Your message has been received. Our startup event management team in Delhi will review your requirements and reply within 24 hours.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          Unlock Startup — A Platform for Startups Moving Towards Success.
        </div>
      </footer>
    </main>
  );
};

export default Page;