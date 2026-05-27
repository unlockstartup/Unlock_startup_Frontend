'use client'

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import {
  AlertCircle,
  Shield,
  AlertTriangle,
  ShieldCheck,
  List,
  Check,
  FileText,
  ShieldAlert,
  Lock,
  Mail,
  Phone,
  Eye,
  Cookie,
  Settings,
  BarChart3,
  Target,
  Clock,
  RefreshCw,
  Ban,
  ExternalLink,
} from 'lucide-react';
import '@/app/styles/termandcondition.css';

const sections = [
  { id: 'ck-about', label: 'What Are Cookies', color: 'orange' },
  { id: 'ck-how', label: 'How We Use Cookies', color: 'blue' },
  { id: 'ck-types', label: 'Types of Cookies', color: 'yellow' },
  { id: 'ck-details', label: 'Cookie Details', color: 'orange' },
  { id: 'ck-third', label: 'Third-Party Cookies', color: 'blue' },
  { id: 'ck-manage', label: 'Managing Preferences', color: 'yellow' },
  { id: 'ck-retention', label: 'Data Retention', color: 'orange' },
  { id: 'ck-changes', label: 'Changes to Policy', color: 'blue' },
  { id: 'ck-contact', label: 'Contact Us', color: 'blue' },
];

const cookieTypeCards = [
  { icon: ShieldCheck, title: 'Essential', text: 'Required for the platform to function. Cannot be disabled.' },
  { icon: Settings, title: 'Functional', text: 'Enable enhanced features and personalization.' },
  { icon: BarChart3, title: 'Analytics', text: 'Help us understand how visitors interact with our platform.' },
  { icon: Target, title: 'Advertising', text: 'Used to deliver relevant promotions and measure effectiveness.' },
  { icon: Lock, title: 'Security', text: 'Assist with fraud prevention and authentication security.' },
  { icon: Clock, title: 'Session', text: 'Temporary cookies that expire when you close your browser.' },
];

const contactCards = [
  { icon: Mail, title: 'Privacy Inquiries', text: 'privacy@unlockproject.io' },
  { icon: Eye, title: 'Data Protection', text: 'dpo@unlockproject.io' },
  { icon: Shield, title: 'Security', text: 'security@unlockproject.io' },
  { icon: Phone, title: 'Support', text: '+1 (800) 888-3947' },
];

const cookieTableData = [
  ['_unlock_session', 'Session', 'Essential', 'Maintains your login state and preferences during a visit.'],
  ['_unlock_auth', '1 year', 'Essential', 'Remembers your authentication status across sessions.'],
  ['_unlock_prefs', '6 months', 'Functional', 'Stores language, timezone, and display preferences.'],
  ['_ga', '2 years', 'Analytics', 'Google Analytics — distinguishes unique users.'],
  ['_gid', '24 hours', 'Analytics', 'Google Analytics — identifies user sessions.'],
  ['_unlock_events', '90 days', 'Analytics', 'Tracks which events you view for recommendation improvement.'],
  ['_fbp', '90 days', 'Advertising', 'Facebook Pixel — delivers relevant ads and measures conversions.'],
  ['_unlock_cart', '7 days', 'Functional', 'Preserves your ticket selections during checkout.'],
  ['_unlock_csrf', 'Session', 'Security', 'Protects against cross-site request forgery attacks.'],
];

export default function CookiePolicy() {
  const [activeSection, setActiveSection] = useState('ck-about');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setScrollProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const handleAccept = () => {
    setAccepted(true);
    setTimeout(() => {
      alert('Your cookie preferences have been saved. Essential cookies remain active.');
    }, 150);
  };

  return (
    <>
      <Head>
        <title>Cookie Policy | unlockproject</title>
        <meta name="description" content="unlockproject Cookie Policy — learn how we use cookies and manage your preferences." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Progress Bar */}
      <div className="ex-progress-bar" style={{ width: `${scrollProgress}%` }} />

      {/* Hero Strip */}
      <div className="ex-hero-strip">
        <div className="ex-hero-strip-bg" />
        <div className="ex-hero-strip-grid" />
        <div className="ex-hero-strip-content">
          <span className="ex-hero-badge">
            <span className="ex-hero-badge-dot" />
            Privacy & Compliance
          </span>
          <h1 className="ex-hero-title">
            Cookie <span>Policy</span>
          </h1>
          <div className="ex-hero-meta">
            <span className="ex-hero-meta-item">Effective: January 1, 2025</span>
            <span className="ex-hero-meta-dot" />
            <span className="ex-hero-meta-item">Last Updated: May 23, 2026</span>
            <span className="ex-hero-meta-dot" />
            <span className="ex-hero-meta-item">Version 2.1</span>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="ex-page-layout">
        {/* Mobile TOC */}
        <div className="ex-mobile-toc-card">
          <TocCard activeSection={activeSection} onAccept={handleAccept} accepted={accepted} />
        </div>

        {/* Content */}
        <main className="ex-content">
          {/* 1. What Are Cookies */}
          <section id="ck-about" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">01</span>
              <div>
                <h2 className="ex-section-title">What Are Cookies</h2>
                <p className="ex-section-subtitle">Small data files that improve your experience</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                Cookies are small text files placed on your device when you visit <strong>unlockproject</strong>. They allow us to recognize your device, remember your preferences, and provide a secure, personalized experience.
              </p>
              <p>
                In addition to cookies, we use similar technologies such as local storage, session storage, and pixel tags. For the purposes of this policy, all such technologies are referred to as "cookies."
              </p>
            </div>
            <div className="ex-callout ex-orange">
              <Cookie className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Consent:</strong> By continuing to use unlockproject, you consent to our use of essential cookies. For non-essential categories, we will request your explicit consent before activation.
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 2. How We Use Cookies */}
          <section id="ck-how" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">02</span>
              <div>
                <h2 className="ex-section-title">How We Use Cookies</h2>
                <p className="ex-section-subtitle">Purposes and benefits of our cookie usage</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                We use cookies to deliver core platform functionality, analyze traffic patterns, secure your account, and personalize your event discovery experience. Each category serves a distinct purpose and is activated based on your consent settings.
              </p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Authenticate users and maintain secure login sessions.',
                'Remember your preferences such as language, currency, and filters.',
                'Analyze platform usage to improve features and performance.',
                'Deliver relevant event recommendations and promotional content.',
                'Prevent fraudulent transactions and unauthorized access.',
                'Enable social sharing and third-party integrations.',
              ].map((rule, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-blue" />
                  {rule}
                </li>
              ))}
            </ul>
            <div className="ex-callout ex-blue">
              <Shield className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>First vs. Third Party:</strong> First-party cookies are set by unlockproject directly. Third-party cookies are set by our trusted partners for analytics, advertising, and payment processing.
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 3. Types of Cookies */}
          <section id="ck-types" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-yellow">03</span>
              <div>
                <h2 className="ex-section-title">Types of Cookies We Use</h2>
                <p className="ex-section-subtitle">Categories and their purposes</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                We classify cookies into six categories based on function and necessity. You can manage your preferences for each non-essential category through your account settings or browser controls.
              </p>
            </div>
            <div className="ex-policy-grid">
              {cookieTypeCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="ex-policy-card">
                    <Icon className="ex-policy-card-icon" size={22} />
                    <div className="ex-policy-card-title">{card.title}</div>
                    <div className="ex-policy-card-text">{card.text}</div>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="ex-divider" />

          {/* 4. Cookie Details */}
          <section id="ck-details" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">04</span>
              <div>
                <h2 className="ex-section-title">Cookie Details</h2>
                <p className="ex-section-subtitle">Specific cookies active on our platform</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                The table below lists the primary cookies and similar technologies we use, their lifespans, categories, and purposes. This list is reviewed and updated quarterly.
              </p>
            </div>
            <div className="ex-table-wrapper">
              <table className="ex-table">
                <thead>
                  <tr>
                    <th>Cookie Name</th>
                    <th>Lifespan</th>
                    <th>Category</th>
                    <th>Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {cookieTableData.map(([name, lifespan, category, purpose], i) => (
                    <tr key={i}>
                      <td>
                        <strong style={{ color: 'var(--ex-text-primary)', fontWeight: 500, fontFamily: 'monospace' }}>
                          {name}
                        </strong>
                      </td>
                      <td>{lifespan}</td>
                      <td>
                        <span className={`ex-badge ex-${category === 'Essential' || category === 'Security' ? 'orange' : category === 'Functional' ? 'yellow' : 'blue'}`}>
                          {category}
                        </span>
                      </td>
                      <td style={{ color: 'var(--ex-text-muted)' }}>{purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="ex-prose">
              <p>
                Additional cookies may be set during specific campaigns, A/B tests, or partner integrations. For a real-time view of active cookies on your device, use your browser's developer tools or our Cookie Preference Center.
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 5. Third-Party Cookies */}
          <section id="ck-third" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">05</span>
              <div>
                <h2 className="ex-section-title">Third-Party Cookies</h2>
                <p className="ex-section-subtitle">Services and partners we integrate with</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                We partner with select third-party services to enhance platform functionality. These providers may set cookies on your device when you interact with their features.
              </p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Google Analytics — usage analytics and performance measurement.',
                'Stripe / PayPal — secure payment processing and fraud detection.',
                'Facebook / Meta — advertising delivery and conversion tracking.',
                'Intercom — customer support chat and messaging.',
                'Cloudflare — security, performance, and bot management.',
              ].map((rule, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-blue" />
                  {rule}
                </li>
              ))}
            </ul>
            <div className="ex-callout ex-yellow">
              <AlertTriangle className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>External Policies:</strong> Third-party providers are responsible for their own cookie practices. We encourage you to review their privacy policies for full details on data collection and use.
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 6. Managing Preferences */}
          <section id="ck-manage" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-yellow">06</span>
              <div>
                <h2 className="ex-section-title">Managing Your Preferences</h2>
                <p className="ex-section-subtitle">How to control and disable cookies</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                You have full control over cookie usage. Essential cookies cannot be disabled as they are necessary for core platform operations. For all other categories, you can update your preferences at any time.
              </p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Visit your unlockproject Account Settings → Privacy → Cookie Preferences.',
                'Use the "Cookie Settings" link in the footer of any page.',
                'Adjust your browser settings to block or delete cookies (may affect functionality).',
                'Enable "Do Not Track" in your browser; we honor this signal for non-essential cookies.',
                'Use industry opt-out tools such as the Digital Advertising Alliance or Your Online Choices.',
              ].map((rule, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-yellow" />
                  {rule}
                </li>
              ))}
            </ul>
            <div className="ex-callout ex-orange">
              <Ban className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Note:</strong> Disabling functional or analytics cookies may reduce personalization quality and prevent us from improving the platform based on usage patterns.
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 7. Data Retention */}
          <section id="ck-retention" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">07</span>
              <div>
                <h2 className="ex-section-title">Data Retention & Expiry</h2>
                <p className="ex-section-subtitle">How long cookie data is stored</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                Cookies remain on your device for varying durations depending on their purpose. Session cookies are deleted when you close your browser. Persistent cookies remain until they expire or you manually clear them.
              </p>
              <p>
                We conduct quarterly audits of our cookie inventory to ensure retention periods remain appropriate and aligned with the original purpose of collection. Expired cookies are automatically removed during these reviews.
              </p>
            </div>
            <div className="ex-callout ex-blue">
              <Clock className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Maximum Retention:</strong> Non-essential cookies are never retained longer than 24 months. Analytics identifiers are refreshed annually to minimize long-term tracking.
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 8. Changes to Policy */}
          <section id="ck-changes" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">08</span>
              <div>
                <h2 className="ex-section-title">Changes to This Policy</h2>
                <p className="ex-section-subtitle">Updates and notification procedures</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                We may update this Cookie Policy to reflect changes in technology, regulation, or our business practices. When material changes occur, we will notify you via email or a prominent platform notice at least 30 days before the changes take effect.
              </p>
              <p>
                The "Last Updated" date at the top of this page indicates when the policy was last revised. Continued use of unlockproject after changes constitutes acceptance of the revised policy.
              </p>
            </div>
            <div className="ex-callout ex-yellow">
              <RefreshCw className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Review:</strong> We recommend reviewing this policy periodically. For significant changes affecting consent requirements, we will re-prompt you for cookie preferences.
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 9. Contact Us */}
          <section id="ck-contact" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">09</span>
              <div>
                <h2 className="ex-section-title">Contact Us</h2>
                <p className="ex-section-subtitle">Questions about our cookie practices</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                If you have questions, concerns, or complaints about this Cookie Policy or our data practices, please contact our privacy team using the information below.
              </p>
            </div>
            <div className="ex-policy-grid">
              {contactCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="ex-policy-card">
                    <Icon className="ex-policy-card-icon" size={22} />
                    <div className="ex-policy-card-title">{card.title}</div>
                    <div className="ex-policy-card-text">{card.text}</div>
                  </div>
                );
              })}
            </div>
            <div className="ex-callout ex-blue">
              <Mail className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Data Protection Officer:</strong> For formal data subject requests or regulatory inquiries, email dpo@unlockproject.io with "Cookie Policy Inquiry" in the subject line.
              </p>
            </div>
          </section>

          <div className="ex-divider" />
        </main>
      </div>
    </>
  );
}

function TocCard({ activeSection, onAccept, accepted }) {
  return (
    <div className="ex-toc-card">
      <div className="ex-toc-header">
        <List className="ex-toc-header-icon" size={20} />
        <span className="ex-toc-title">On this page</span>
      </div>
      <ul className="ex-toc-list">
        {sections.map((section, idx) => (
          <li key={section.id} className="ex-toc-item">
            <a
              href={`#${section.id}`}
              className={`ex-toc-link ${activeSection === section.id ? 'ex-active' : ''}`}
            >
              <span className="ex-toc-num">{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
              {section.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="ex-toc-accept">
        <button className="ex-toc-accept-btn" onClick={onAccept} disabled={accepted}>
          {accepted ? (
            <span className="ex-accepted-inline">
              <Check size={16} />
              Preferences Saved
            </span>
          ) : (
            'Save Preferences'
          )}
        </button>
      </div>
    </div>
  );
}