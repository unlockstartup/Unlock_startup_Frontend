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
  Lock,
  Mail,
  Phone,
  Eye,
  Cookie,
  Server,
  Globe,
  UserCheck,
  Trash2,
  RefreshCw,
  Ban,
  Scale,
  HelpCircle,
  CreditCard
} from 'lucide-react';
import '@/app/styles/termandcondition.css';

const sections = [
  { id: 'pv-intro', label: 'Introduction & Scope', color: 'orange' },
  { id: 'pv-collection', label: 'Information We Collect', color: 'blue' },
  { id: 'pv-usage', label: 'How We Use Your Data', color: 'yellow' },
  { id: 'pv-sharing', label: 'Data Sharing & Third Parties', color: 'orange' },
  { id: 'pv-cookies', label: 'Cookies & Tracking', color: 'blue' },
  { id: 'pv-security', label: 'Data Security', color: 'yellow' },
  { id: 'pv-rights', label: 'Your Privacy Rights', color: 'orange' },
  { id: 'pv-retention', label: 'Data Retention', color: 'blue' },
  { id: 'pv-transfer', label: 'International Transfers', color: 'yellow' },
  { id: 'pv-contact', label: 'Contact Us', color: 'blue' },
];

const policyCards = [
  { icon: UserCheck, title: 'Identity Data', text: 'Name, email, phone, profile photo, and government ID when required.' },
  { icon: CreditCard, title: 'Financial Data', text: 'Payment methods, billing addresses, and transaction history.' },
  { icon: Server, title: 'Technical Data', text: 'IP address, browser type, device info, and usage logs.' },
  { icon: Globe, title: 'Location Data', text: 'Geolocation from your device or IP for event recommendations.' },
  { icon: Eye, title: 'Interaction Data', text: 'Events viewed, tickets purchased, messages sent, and preferences.' },
  { icon: Cookie, title: 'Cookie Data', text: 'Session tokens, preference storage, and analytics identifiers.' },
];

const contactCards = [
  { icon: Mail, title: 'Privacy Inquiries', text: 'privacy@unlockproject.io' },
  { icon: Shield, title: 'Data Protection Officer', text: 'dpo@unlockproject.io' },
  { icon: Phone, title: 'Support Hotline', text: '+1 (800) 888-3947' },
  { icon: HelpCircle, title: 'Data Requests', text: 'requests@unlockproject.io' },
];

const dataUsageTable = [
  ['Account Management', 'Registration, authentication, profile maintenance', 'Identity, Contact', 'Legitimate Interest / Contract'],
  ['Ticket Processing', 'Purchasing, delivery, refunds, fraud prevention', 'Financial, Identity', 'Contract / Legal Obligation'],
  ['Personalization', 'Event recommendations, saved preferences', 'Interaction, Technical', 'Consent / Legitimate Interest'],
  ['Marketing', 'Promotional emails, retargeting ads', 'Contact, Interaction', 'Consent (opt-in)'],
  ['Analytics', 'Platform improvement, A/B testing, performance', 'Technical, Cookie', 'Legitimate Interest'],
  ['Legal Compliance', 'Tax reporting, regulatory audits, law enforcement', 'Identity, Financial', 'Legal Obligation'],
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('pv-intro');
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
      alert('You have acknowledged the Privacy & Data Policy.');
    }, 150);
  };

  return (
    <>
      <Head>
        <title>Privacy & Data Policy | unlockproject</title>
        <meta name="description" content="unlockproject Privacy & Data Policy — learn how we collect, use, protect, and share your personal information." />
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
            Legal Document
          </span>
          <h1 className="ex-hero-title">
            Privacy &amp; <span>Data Policy</span>
          </h1>
          <div className="ex-hero-meta">
            <span className="ex-hero-meta-item">Effective: January 1, 2025</span>
            <span className="ex-hero-meta-dot" />
            <span className="ex-hero-meta-item">Last Updated: May 23, 2026</span>
            <span className="ex-hero-meta-dot" />
            <span className="ex-hero-meta-item">Version 4.1</span>
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
          {/* 1. Introduction */}
          <section id="pv-intro" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">01</span>
              <div>
                <h2 className="ex-section-title">Introduction &amp; Scope</h2>
                <p className="ex-section-subtitle">Our commitment to protecting your personal information</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                This <strong>Privacy &amp; Data Policy</strong> describes how <strong>unlockproject Technologies Inc.</strong> ("unlockproject," "we," "us," or "our") collects, uses, stores, shares, and protects your personal information when you use our website, mobile applications, APIs, and related services (collectively, "Services").
              </p>
              <p>
                We are committed to respecting your privacy and ensuring transparency in our data practices. This policy applies to all visitors, registered users, event organizers, and any other individuals who interact with our platform, regardless of location.
              </p>
            </div>
            <div className="ex-callout ex-orange">
              <AlertCircle className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Important:</strong> By accessing or using our Services, you acknowledge that you have read and understood this policy. If you do not agree with our practices, you must discontinue use of the platform immediately.
              </p>
            </div>
            <div className="ex-prose">
              <p>
                This policy is designed to comply with major data protection frameworks, including the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and other applicable local privacy laws. We review and update this policy regularly to reflect changes in our practices or legal requirements.
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 2. Information We Collect */}
          <section id="pv-collection" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">02</span>
              <div>
                <h2 className="ex-section-title">Information We Collect</h2>
                <p className="ex-section-subtitle">Categories of personal data we gather</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                We collect information that you provide directly, data generated automatically through your use of the Services, and information from third-party sources. We minimize data collection to what is necessary for the specific purposes outlined in this policy.
              </p>
            </div>
            <div className="ex-policy-grid">
              {policyCards.map((card) => {
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
            <div className="ex-prose">
              <p>
                We may also collect sensitive personal data — such as government-issued identification or health information — only when strictly necessary (e.g., age-restricted events or accessibility requirements) and with your explicit consent.
              </p>
            </div>
            <div className="ex-callout ex-blue">
              <Shield className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Minors:</strong> Our Services are not directed to individuals under 16 years of age. We do not knowingly collect personal data from children. If you believe we have inadvertently collected such data, contact us immediately for deletion.
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 3. How We Use Your Data */}
          <section id="pv-usage" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-yellow">03</span>
              <div>
                <h2 className="ex-section-title">How We Use Your Data</h2>
                <p className="ex-section-subtitle">Purposes and legal bases for processing</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                We process your personal data only for specific, explicit, and legitimate purposes. The table below summarizes the primary uses, the data categories involved, and the legal basis for processing under applicable privacy laws.
              </p>
            </div>
            <div className="ex-table-wrapper">
              <table className="ex-table">
                <thead>
                  <tr>
                    <th>Purpose</th>
                    <th>Description</th>
                    <th>Data Categories</th>
                    <th>Legal Basis</th>
                  </tr>
                </thead>
                <tbody>
                  {dataUsageTable.map(([purpose, desc, categories, basis], i) => (
                    <tr key={i}>
                      <td>
                        <strong style={{ color: 'var(--ex-text-primary)', fontWeight: 500 }}>
                          {purpose}
                        </strong>
                      </td>
                      <td style={{ color: 'var(--ex-text-muted)' }}>{desc}</td>
                      <td>{categories}</td>
                      <td>
                        <span className={`ex-badge ex-${i % 3 === 0 ? 'orange' : i % 3 === 1 ? 'blue' : 'yellow'}`}>
                          {basis}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="ex-prose">
              <p>
                We do not use your personal data for automated decision-making that produces legal or similarly significant effects without human intervention, except where necessary for fraud prevention with appropriate safeguards.
              </p>
            </div>
            <div className="ex-callout ex-yellow">
              <Scale className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Marketing:</strong> We only send promotional communications if you have opted in. You may withdraw consent and unsubscribe at any time via the link in every marketing email or through your account settings.
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 4. Data Sharing */}
          <section id="pv-sharing" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">04</span>
              <div>
                <h2 className="ex-section-title">Data Sharing &amp; Third Parties</h2>
                <p className="ex-section-subtitle">Who we share your information with and why</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                We do not sell your personal data. We share information only with trusted third parties who assist us in operating the platform, processing payments, analyzing usage, or complying with legal obligations. All third parties are contractually bound to use your data solely for the specified purpose and to protect it in accordance with this policy.
              </p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Event Organizers — name, email, and ticket details to manage attendance and communicate updates.',
                'Payment Processors — Stripe, PayPal, and other PCI-DSS compliant providers for transaction handling.',
                'Cloud Infrastructure — AWS, Google Cloud for secure hosting, storage, and backup.',
                'Analytics Providers — Google Analytics, Mixpanel for aggregated, non-identifiable usage insights.',
                'Marketing Platforms — Mailchimp, Meta for targeted campaigns (only with your consent).',
                'Legal Authorities — when required by subpoena, court order, or applicable law.',
              ].map((rule, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-orange" />
                  {rule}
                </li>
              ))}
            </ul>
            <div className="ex-callout ex-orange">
              <AlertTriangle className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Business Transfers:</strong> If unlockproject undergoes a merger, acquisition, or asset sale, your personal data may be transferred as part of that transaction. We will notify you before your data becomes subject to a different privacy policy.
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 5. Cookies & Tracking */}
          <section id="pv-cookies" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">05</span>
              <div>
                <h2 className="ex-section-title">Cookies &amp; Tracking Technologies</h2>
                <p className="ex-section-subtitle">How we use cookies and similar technologies</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                We use cookies, local storage, session storage, and pixel tags to operate, secure, and improve our Services. These technologies help us maintain your login session, remember preferences, analyze traffic, and deliver relevant content.
              </p>
              <p>
                For detailed information on the specific cookies we use, their lifespans, and your management options, please refer to our <a href="#">Cookie Policy</a>, which is incorporated into this Privacy Policy by reference.
              </p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Essential cookies are required for core functionality and cannot be disabled.',
                'Functional cookies enable personalization features such as language and timezone preferences.',
                'Analytics cookies help us understand platform usage and improve user experience.',
                'Advertising cookies deliver relevant promotions and measure campaign effectiveness.',
                'You can manage your cookie preferences anytime through your account settings or browser controls.',
              ].map((rule, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-blue" />
                  {rule}
                </li>
              ))}
            </ul>
            <div className="ex-callout ex-blue">
              <Cookie className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Do Not Track:</strong> We honor browser "Do Not Track" signals for non-essential cookies. Essential cookies required for security and platform operation will remain active regardless of tracking preferences.
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 6. Data Security */}
          <section id="pv-security" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-yellow">06</span>
              <div>
                <h2 className="ex-section-title">Data Security</h2>
                <p className="ex-section-subtitle">Measures we take to protect your information</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                We implement a comprehensive security program designed to protect your personal data against unauthorized access, alteration, disclosure, or destruction. Our measures include technical, administrative, and physical safeguards appropriate to the sensitivity of the data we process.
              </p>
            </div>
            <ul className="ex-rule-list">
              {[
                'AES-256 encryption for data at rest and TLS 1.3 for data in transit.',
                'Regular penetration testing and vulnerability assessments by independent security firms.',
                'Role-based access controls limiting data access to authorized personnel only.',
                'Multi-factor authentication (MFA) required for all internal administrative accounts.',
                'Automated anomaly detection and real-time threat monitoring.',
                'Annual SOC 2 Type II audits and PCI-DSS compliance for payment data.',
              ].map((rule, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-yellow" />
                  {rule}
                </li>
              ))}
            </ul>
            <div className="ex-callout ex-yellow">
              <Lock className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Breach Notification:</strong> In the unlikely event of a data breach affecting your personal data, we will notify you within 72 hours in accordance with GDPR requirements and applicable state breach notification laws.
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 7. Your Privacy Rights */}
          <section id="pv-rights" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">07</span>
              <div>
                <h2 className="ex-section-title">Your Privacy Rights</h2>
                <p className="ex-section-subtitle">How to exercise control over your personal data</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                Depending on your jurisdiction, you may have specific rights regarding your personal data. We honor these rights regardless of your location and have established simple mechanisms to submit requests.
              </p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Right to Access — request a copy of the personal data we hold about you.',
                'Right to Rectification — correct inaccurate or incomplete information.',
                'Right to Erasure ("Right to be Forgotten") — request deletion of your data, subject to legal retention requirements.',
                'Right to Restrict Processing — limit how we use your data in certain circumstances.',
                'Right to Data Portability — receive your data in a structured, machine-readable format.',
                'Right to Object — opt out of processing based on legitimate interests or direct marketing.',
                'Right to Withdraw Consent — revoke previously given consent at any time.',
                'Right to Non-Discrimination — we will not penalize you for exercising your privacy rights.',
              ].map((rule, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-orange" />
                  {rule}
                </li>
              ))}
            </ul>
            <div className="ex-callout ex-orange">
              <UserCheck className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>How to Submit:</strong> Email requests@unlockproject.io with "Privacy Rights Request" in the subject line. We verify identity before processing and respond within 30 days. Complex requests may require an additional 60-day extension.
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 8. Data Retention */}
          <section id="pv-retention" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">08</span>
              <div>
                <h2 className="ex-section-title">Data Retention</h2>
                <p className="ex-section-subtitle">How long we keep your personal information</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, comply with legal obligations, resolve disputes, and enforce our agreements. Retention periods vary by data category and legal requirements.
              </p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Account data: retained for the duration of your account plus 90 days after deletion.',
                'Transaction records: retained for 7 years to comply with tax and financial regulations.',
                'Marketing data: retained until you withdraw consent or unsubscribe.',
                'Server logs and analytics: retained for 12 months, then anonymized or deleted.',
                'Support correspondence: retained for 3 years for quality assurance and dispute resolution.',
                'Backup data: may persist in encrypted archives for up to 6 months beyond active deletion.',
              ].map((rule, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-blue" />
                  {rule}
                </li>
              ))}
            </ul>
            <div className="ex-callout ex-blue">
              <Trash2 className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Secure Deletion:</strong> When retention periods expire, we securely delete or irreversibly anonymize your data using industry-standard methods. Physical backups are destroyed through certified shredding services.
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 9. International Transfers */}
          <section id="pv-transfer" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-yellow">09</span>
              <div>
                <h2 className="ex-section-title">International Data Transfers</h2>
                <p className="ex-section-subtitle">Cross-border processing and safeguards</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                unlockproject operates globally, and your personal data may be transferred to, stored, or processed in countries outside your jurisdiction, including the United States, the European Union, and other regions where our service providers maintain facilities.
              </p>
              <p>
                When we transfer personal data across borders, we implement appropriate safeguards to ensure your data receives an equivalent level of protection as required in your home jurisdiction.
              </p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Standard Contractual Clauses (SCCs) approved by the European Commission for EU data transfers.',
                'Adequacy decisions where the destination country is recognized by the EU Commission.',
                'Data Processing Agreements (DPAs) with all subprocessors and service providers.',
                'Encryption of data in transit and at rest regardless of storage location.',
              ].map((rule, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-yellow" />
                  {rule}
                </li>
              ))}
            </ul>
            <div className="ex-callout ex-yellow">
              <Globe className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>UK &amp; Swiss Transfers:</strong> For data originating from the UK or Switzerland, we apply the UK International Data Transfer Agreement (IDTA) and Swiss Federal Act on Data Protection (FADP) equivalent safeguards respectively.
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 10. Contact */}
          <section id="pv-contact" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">10</span>
              <div>
                <h2 className="ex-section-title">Contact Us</h2>
                <p className="ex-section-subtitle">Questions, requests, and data protection inquiries</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                If you have questions about this Privacy &amp; Data Policy, wish to exercise your privacy rights, or need to report a data protection concern, please contact us using the information below. We aim to respond to all inquiries within 2 business days.
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
                <strong>Postal Address:</strong> unlockproject Technologies Inc., Attn: Data Protection Officer, 100 Event Plaza, Suite 400, San Francisco, CA 94105, USA.
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
        {sections.map((section) => (
          <li key={section.id} className="ex-toc-item">
            <a
              href={`#${section.id}`}
              className={`ex-toc-link ${activeSection === section.id ? 'ex-active' : ''}`}
            >
              <span className="ex-toc-num">{sections.indexOf(section) + 1 < 10 ? `0${sections.indexOf(section) + 1}` : sections.indexOf(section) + 1}</span>
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
              Accepted
            </span>
          ) : (
            'Accept Terms'
          )}
        </button>
      </div>
    </div>
  );
}