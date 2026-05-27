"use client";

import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import CompanyServiceCard from "@/components/uiElements/CompanyServiceCard";
import "./ourservices.css"

const Page = () => {
  return (
    <main>
      <section>
        <main id="main-content" className="services-page">
          {/* Hero Section */}
          <section className="hero mt-30" id="top">
            <div className="container hero-grid">
              <div className="hero-left">
                <span className="eyebrow">What We Offer</span>
                <div>
                  <h1 style={{ maxWidth: "100%", wordWrap: "break-word" }}>
                   Everything a startup needs
                  </h1>
                </div>
                <p>
                 One platform for every stage of your startup journey. Less friction, more momentum. One platform for every stage of your startup journey. Less friction, more momentum.
                </p>
              </div>
              <aside className="hero-panel">
                <h2>Why teams choose us</h2>
                <ul>
                  <li>One platform to manage deals, talent, events, and product visibility</li>
                  <li>Smart filtering that surfaces only the opportunities worth your time</li>
                  <li>Built-in compliance, audit trails, and enterprise-grade security</li>
                </ul>
              </aside>
            </div>
          </section>

          {/* Services Section */}
          <section id="services">
            <div className="container">
              <div className="section-head">
                <div className="section-label">What's Inside</div>
                <div>
                  <h2>Service overview & capabilities</h2>
                  <p className="section-copy">
                    Each service solves a specific bottleneck in the startup journey — from finding co-founders to closing investment rounds and everything in between.
                  </p>
                </div>
              </div>

              <div className="services-grid">
                {/* Service 1 - Competitions */}
                <article className="service-card">
                  <div className="service-header">
                    <div className="service-number">01</div>
                  </div>
                  <h3>Competitions</h3>
                  <p>
                    Run high-stakes innovation challenges, pitch battles, and grant programs with end-to-end lifecycle management — from submissions to winner payouts.
                  </p>
                  <div className="features-grid">
                    <div className="feature-item">
                      <svg className="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <div>Custom judging rubrics, blind scoring panels, real-time leaderboards</div>
                    </div>
                    <div className="feature-item">
                      <svg className="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                      </svg>
                      <div>Multi-stage submissions, team roles, eligibility gating, and NDA workflows</div>
                    </div>
                  </div>

                  <div className="sub-section">
                    <h4>Use Cases</h4>
                    <ul>
                      <li>Corporate open innovation programs sourcing external IP</li>
                      <li>Government-backed grant competitions for deep tech founders</li>
                      <li>University pitch days and cross-border hackathons</li>
                    </ul>
                  </div>

                  <div className="sub-section">
                    <h4>Benefits</h4>
                    <ul>
                      <li>Fill applicant pipelines 3x faster with targeted outreach</li>
                      <li>Zero manual screening with automated eligibility checks</li>
                      <li>Post-event impact reports delivered to every stakeholder</li>
                    </ul>
                  </div>
                </article>

                {/* Service 2 - Events */}
                <article className="service-card">
                  <div className="service-header">
                    <div className="service-number">02</div>
                  </div>
                  <h3>Events</h3>
                  <p>
                    From intimate founder dinners to global virtual summits — orchestrate every detail without juggling five separate tools.
                  </p>
                  <div className="features-grid">
                    <div className="feature-item">
                      <svg className="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <div>Tiered ticketing, waitlists, hybrid streaming, and agenda builder</div>
                    </div>
                    <div className="feature-item">
                      <svg className="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V9a2 2 0 00-2-2H4a2 2 0 00-2 2v2.08a2 2 0 0 1-.83 1.62l-3.1.91a2 2 0 0 1 0 3.28l3.1.91a2 2 0 0 1 .83 1.62V21a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.09a2 2 0 0 1 .83-1.62l3.1-.91a2 2 0 0 1 0-3.28l-3.1-.91a2 2 0 0 1-.83-1.62z"/>
                      </svg>
                      <div>Speaker portals, sponsor dashboards, and post-event ROI summaries</div>
                    </div>
                  </div>

                  <div className="sub-section">
                    <h4>Use Cases</h4>
                    <ul>
                      <li>Annual ecosystem summits with 2000+ registered attendees</li>
                      <li>Accelerator demo days streamed to global investor networks</li>
                      <li>Weekly founder meetups with automated RSVP and reminders</li>
                    </ul>
                  </div>

                  <div className="sub-section">
                    <h4>Benefits</h4>
                    <ul>
                      <li>Stripe-native payments supporting 135+ currencies</li>
                      <li>Live heatmaps tracking session engagement by minute</li>
                      <li>Auto-generated certificates and personalized follow-up sequences</li>
                    </ul>
                  </div>
                </article>

                {/* Service 3 - Job Postings */}
                <article className="service-card">
                  <div className="service-header">
                    <div className="service-number">03</div>
                  </div>
                  <h3>Job Postings</h3>
                  <p>
                    Stop wading through irrelevant applications. Reach pre-vetted startup professionals who actually want equity and ambiguity.
                  </p>
                  <div className="features-grid">
                    <div className="feature-item">
                      <svg className="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      <div>Skills-based matching, async video interviews, offer letter templates</div>
                    </div>
                    <div className="feature-item">
                      <svg className="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="17 8 17 10 17 12"/>
                        <polyline points="7 8 7 10 7 12"/>
                      </svg>
                      <div>Verified startup experience badges, reference checks, culture-fit scoring</div>
                    </div>
                  </div>

                  <div className="sub-section">
                    <h4>Use Cases</h4>
                    <ul>
                      <li>First engineering hire searches for pre-seed AI startups</li>
                      <li>VP-level recruiting for post-Series A scaling teams</li>
                      <li>Fractional CMO and growth advisor placements</li>
                    </ul>
                  </div>

                  <div className="sub-section">
                    <h4>Benefits</h4>
                    <ul>
                      <li>Cut time-to-hire by 65% with pre-screened candidate pools</li>
                      <li>Significantly cheaper than agency fees with better retention rates</li>
                      <li>DEI dashboards and anonymized screening to reduce bias</li>
                    </ul>
                  </div>
                </article>

                {/* Service 4 - Investor */}
                <article className="service-card">
                  <div className="service-header">
                    <div className="service-number">04</div>
                  </div>
                  <h3>Investor Network</h3>
                  <p>
                    Whether you're deploying capital or raising it — our matching engine connects the right check with the right founder at the right stage.
                  </p>
                  <div className="features-grid">
                    <div className="feature-item">
                      <svg className="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                      <div>Thesis-aligned deal flow, one-click intros, and NDA-gated data rooms</div>
                    </div>
                    <div className="feature-item">
                      <svg className="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="17" y1="17" x2="17" y2="21"/>
                      </svg>
                      <div>Live cap table sync, pro-rata tracking, and co-investor coordination</div>
                    </div>
                  </div>

                  <div className="sub-section">
                    <h4>Use Cases</h4>
                    <ul>
                      <li>Rolling SAFE rounds for pre-revenue climate tech ventures</li>
                      <li>Series A lead identification for B2B SaaS companies</li>
                      <li>Syndicate formation for emerging fund managers</li>
                    </ul>
                  </div>

                  <div className="sub-section">
                    <h4>Benefits</h4>
                    <ul>
                      <li>Reduce unqualified inbound by 70% with thesis filtering</li>
                      <li>SEC-compliant documentation generated automatically</li>
                      <li>Benchmark your portfolio against sector-level performance data</li>
                    </ul>
                  </div>
                </article>

                {/* Service 5 - Product Listings */}
                <article className="service-card">
                  <div className="service-header">
                    <div className="service-number">05</div>
                  </div>
                  <h3>Product Listings</h3>
                  <p>
                    Put your SaaS, API, or hardware in front of thousands of startups actively looking to buy — not browsers, actual buyers with budgets.
                  </p>
                  <div className="features-grid">
                    <div className="feature-item">
                      <svg className="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="8" width="6" height="8"/>
                        <rect x="3" y="14" width="6" height="2"/>
                        <rect x="15" y="14" width="6" height="2"/>
                      </svg>
                      <div>Dynamic pricing tiers, usage-based billing, and trial conversion flows</div>
                    </div>
                    <div className="feature-item">
                      <svg className="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="17" y1="17" x2="17" y2="21"/>
                      </svg>
                      <div>Verified reviews, integration badges, and buyer intent signals</div>
                    </div>
                  </div>

                  <div className="sub-section">
                    <h4>Use Cases</h4>
                    <ul>
                      <li>Dev tool launches targeting early-stage engineering teams</li>
                      <li>IoT hardware procurement for prototype-stage founders</li>
                      <li>Fintech API distribution to neobank and lending startups</li>
                    </ul>
                  </div>

                  <div className="sub-section">
                    <h4>Benefits</h4>
                    <ul>
                      <li>Tap into a pre-qualified buyer network from day one</li>
                      <li>Flexible revenue share with full attribution reporting</li>
                      <li>Lower CAC by up to 50% versus paid acquisition channels</li>
                    </ul>
                  </div>
                </article>

                {/* Service 6 - Add-ons */}
                <article className="service-card">
                  <div className="service-header">
                    <div className="service-number">06</div>
                  </div>
                  <h3>Growth Add-ons</h3>
                  <p>
                    Amplify every listing, deal, and event with a layer of premium tools designed to turn visibility into measurable traction.
                  </p>
                  <div className="features-grid">
                    <div className="feature-item">
                      <svg className="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <div>Pinned placements, newsletter features, and co-branded social drops</div>
                    </div>
                    <div className="feature-item">
                      <svg className="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                      </svg>
                      <div>Funnel analytics, multivariate testing, and weekly growth reviews</div>
                    </div>
                  </div>

                  <div className="sub-section">
                    <h4>Use Cases</h4>
                    <ul>
                      <li>Boosting competition visibility during the final application sprint</li>
                      <li>Investor profile spotlights ahead of a new fund close</li>
                      <li>Product launch blitzes with sequenced email and social campaigns</li>
                    </ul>
                  </div>

                  <div className="sub-section">
                    <h4>Benefits</h4>
                    <ul>
                      <li>Average 3x lift in profile views within the first 7 days</li>
                      <li>Weekly optimization briefs backed by real platform data</li>
                      <li>A dedicated growth partner — not a support ticket queue</li>
                    </ul>
                  </div>
                </article>
              </div>
            </div>
          </section>
        </main>
      </section>
    </main>
  );
};

export default Page;