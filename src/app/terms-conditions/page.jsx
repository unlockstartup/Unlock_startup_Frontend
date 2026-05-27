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
  ArrowRight,
  FileText,
  ShieldAlert,
  Lock,
  Mail,
  Phone,
  MapPin,
  UserCheck,
  Ticket,
  CreditCard,
  RefreshCw,
  Ban,
  Copyright,
  Eye,
  Scale,
  LogOut,
  MessageCircle,
} from 'lucide-react';
import '@/app/styles/termandcondition.css';

const sections = [
  { id: 'ex-acceptance', label: 'Acceptance of Terms', color: 'orange' },
  { id: 'ex-accounts', label: 'User Accounts', color: 'blue' },
  { id: 'ex-events', label: 'Event Management', color: 'yellow' },
  { id: 'ex-tickets', label: 'Tickets & Payments', color: 'orange' },
  { id: 'ex-refunds', label: 'Refunds & Cancellations', color: 'blue' },
  { id: 'ex-ip', label: 'Intellectual Property', color: 'orange' },
  { id: 'ex-privacy', label: 'Privacy & Data', color: 'blue' },
  { id: 'ex-liability', label: 'Limitation of Liability', color: 'yellow' },
  { id: 'ex-termination', label: 'Termination', color: 'orange' },
  { id: 'ex-contact', label: 'Contact Us', color: 'blue' },
];

const policyCards = [
  { icon: FileText, title: 'Accurate Info', text: 'All event details must be truthful and kept up to date.' },
  { icon: ShieldAlert, title: 'Compliance', text: 'Events must comply with all applicable local laws and regulations.' },
  { icon: Lock, title: 'Safety', text: 'Organizers must maintain appropriate safety standards for all attendees.' },
  { icon: MessageCircle, title: 'Communication', text: 'Notify attendees promptly of any changes to event details.' },
  { icon: CreditCard, title: 'Financial', text: 'Organizers are responsible for accurate pricing and any applicable taxes.' },
  { icon: Ban, title: 'Prohibited', text: 'Events promoting illegal activities or hate speech are strictly banned.' },
];

const contactCards = [
  { icon: Mail, title: 'Legal Inquiries', text: 'legal@unlockproject.io' },
  { icon: Eye, title: 'Privacy Team', text: 'privacy@unlockproject.io' },
  { icon: Shield, title: 'Security', text: 'security@unlockproject.io' },
  { icon: Phone, title: 'Support', text: '+1 (800) 888-3947' },
];

export default function TermsConditions() {
  const [activeSection, setActiveSection] = useState('ex-acceptance');
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
      alert('Thank you! You have accepted the Terms & Conditions.');
    }, 150);
  };

  return (
    <>
      <Head>
        <title>Terms & Conditions | unlockproject</title>
        <meta name="description" content="unlockproject Terms and Conditions — please read before using our event management platform." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Progress Bar */}
      <div
        className="ex-progress-bar"
        style={{ width: `${scrollProgress}%` }}
      />



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
            Terms &amp; <span>Conditions</span>
          </h1>
          <div className="ex-hero-meta">
            <span className="ex-hero-meta-item">Effective: January 1, 2025</span>
            <span className="ex-hero-meta-dot" />
            <span className="ex-hero-meta-item">Last Updated: April 28, 2026</span>
            <span className="ex-hero-meta-dot" />
            <span className="ex-hero-meta-item">Version 3.2</span>
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

          {/* 1. Acceptance */}
          <section id="ex-acceptance" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">01</span>
              <div>
                <h2 className="ex-section-title">Acceptance of Terms</h2>
                <p className="ex-section-subtitle">By using unlockproject, you agree to these terms</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                Welcome to <strong>unlockproject</strong>, the premier platform for creating, managing, and attending events worldwide. These Terms and Conditions ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and unlockproject Technologies Inc. ("unlockproject," "we," "us," or "our").
              </p>
              <p>
                By accessing or using our website, mobile applications, APIs, or any other services (collectively, "Services"), you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy, incorporated herein by reference.
              </p>
            </div>
            <div className="ex-callout ex-orange">
              <AlertCircle className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Important:</strong> If you do not agree to these Terms, you must not access or use our Services. Continued use of unlockproject after any modifications constitutes your acceptance of the updated Terms.
              </p>
            </div>
            <div className="ex-prose">
              <p>
                These Terms apply to all visitors, registered users, event organizers, sponsors, and any other parties who interact with the unlockproject platform in any capacity. You must be at least 18 years of age, or the legal age of majority in your jurisdiction, to use our Services.
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 2. Accounts */}
          <section id="ex-accounts" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">02</span>
              <div>
                <h2 className="ex-section-title">User Accounts</h2>
                <p className="ex-section-subtitle">Registration, security, and responsibilities</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                To access certain features of the Services, you must register for an account. When creating your account, you agree to provide accurate, current, and complete information and to update such information to keep it accurate, current, and complete.
              </p>
            </div>
            <ul className="ex-rule-list">
              {[
                'You are responsible for safeguarding your password and any activities under your account.',
                'You must notify us immediately at security@unlockproject.io if you suspect unauthorized access.',
                'You may not share your account credentials with any third party.',
                'Each person may only maintain one active account at a time.',
                'Accounts created by automated means or bots are strictly prohibited.',
                'You agree not to impersonate any person or entity when registering.',
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
                <strong>Account Security:</strong> We employ industry-standard encryption and security measures. Enable two-factor authentication in your settings to add an extra layer of protection to your account.
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 3. Events */}
          <section id="ex-events" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-yellow">03</span>
              <div>
                <h2 className="ex-section-title">Event Management</h2>
                <p className="ex-section-subtitle">Rules for creating and hosting events</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                unlockproject provides tools for organizers to create, promote, and manage events. By creating an event on our platform, you represent that you have all necessary rights, permissions, and authorizations to host the event, including any required venue licenses, performer agreements, and regulatory permits.
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
                unlockproject reserves the right to remove any event listing that violates these Terms, community guidelines, or applicable law, without prior notice. Repeated violations may result in permanent suspension of organizer privileges.
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 4. Tickets & Payments */}
          <section id="ex-tickets" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">04</span>
              <div>
                <h2 className="ex-section-title">Tickets &amp; Payments</h2>
                <p className="ex-section-subtitle">Purchasing, transferring, and payment terms</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                All ticket purchases made through unlockproject are subject to our processing fees and the terms set by the event organizer. Prices are displayed inclusive of applicable taxes unless otherwise stated.
              </p>
            </div>
            <div className="ex-table-wrapper">
              <table className="ex-table">
                <thead>
                  <tr>
                    <th>Fee Type</th>
                    <th>Amount</th>
                    <th>Applies To</th>
                    <th>Charged By</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Platform Service Fee', '2.5% + Rs.99', 'All ticket sales', <span key="a" className="ex-badge ex-orange">unlockproject</span>],
                    ['Payment Processing', '2.9% + Rs.30', 'Credit/Debit cards', <span key="b" className="ex-badge ex-blue">Processor</span>],
                    ['Organizer Fee', 'Varies', 'Set per event', <span key="c" className="ex-badge ex-yellow">Organizer</span>],
                    ['Currency Conversion', 'Up to 2%', 'International purchases', <span key="d" className="ex-badge ex-blue">Processor</span>],
                    ['Express Ticket', 'Rs.150 flat', 'Same-day delivery', <span key="e" className="ex-badge ex-orange">unlockproject</span>],
                  ].map(([type, amount, applies, charged], i) => (
                    <tr key={i}>
                      <td><strong style={{ color: 'var(--ex-text-primary)', fontWeight: 500 }}>{type}</strong></td>
                      <td>{amount}</td>
                      <td style={{ color: 'var(--ex-text-muted)' }}>{applies}</td>
                      <td>{charged}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="ex-prose">
              <p>
                All payments are processed through PCI-DSS compliant payment gateways. unlockproject does not store your full credit card details on our servers. By completing a purchase, you authorize unlockproject to charge the specified amount to your selected payment method.
              </p>
            </div>
          </section>



          {/* 5. Refunds */}
          {/* <section id="ex-refunds" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">05</span>
              <div>
                <h2 className="ex-section-title">Refunds &amp; Cancellations</h2>
                <p className="ex-section-subtitle">Our refund policy and cancellation procedures</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                Refund eligibility depends on the event organizer's policy, which is displayed on each event page before purchase. unlockproject's service fee is non-refundable in all cases.
              </p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Full refunds are issued if an event is cancelled by the organizer.',
                'Postponed events entitle attendees to refunds if the new date is unacceptable.',
                'Refund requests for personal reasons are subject to the organizer\'s policy.',
                'Approved refunds are processed within 5–10 business days to the original payment method.',
                'Partial refunds may be issued for multi-day event cancellations on a pro-rata basis.',
                'Ticket transfers are subject to a $2.00 administrative fee per transfer.',
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
                <strong>Note:</strong> unlockproject acts as an intermediary between buyers and organizers. For organizer-specific refund disputes, contact the organizer directly through the event page messaging system within 30 days of the event.
              </p>
            </div>
          </section> */}

   


          <div className="ex-divider" />

          {/* 7. IP */}
          <section id="ex-ip" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">07</span>
              <div>
                <h2 className="ex-section-title">Intellectual Property</h2>
                <p className="ex-section-subtitle">Content ownership and license terms</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                The unlockproject platform, including its software, design, logos, trademarks, and content created by unlockproject, is owned by unlockproject Technologies Inc. and is protected by applicable intellectual property laws worldwide.
              </p>
              <p>
                By uploading content (event descriptions, images, videos, etc.) to unlockproject, you grant us a non-exclusive, royalty-free, worldwide license to use, reproduce, distribute, and display that content solely for the purpose of operating and promoting the Services. You retain all ownership rights to your content.
              </p>
            </div>
            <div className="ex-callout ex-orange">
              <ShieldCheck className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>DMCA:</strong> If you believe your copyright has been infringed on our platform, contact our designated copyright agent at dmca@unlockproject.io with full details of the alleged infringement.
              </p>
            </div>
          </section>



          {/* 8. Privacy */}
          {/* <section id="ex-privacy" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">08</span>
              <div>
                <h2 className="ex-section-title">Privacy &amp; Data</h2>
                <p className="ex-section-subtitle">How we collect, use, and protect your data</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                Your privacy is important to us. Our collection and use of personal information is governed by our <a href="#">Privacy Policy</a>, which is incorporated into these Terms by reference. By using unlockproject, you consent to the data practices described therein.
              </p>
              <p>
                We collect information you provide directly (registration data, payment info), data generated by your use of the Services (browsing history, purchase records), and information from third-party sources (social logins, fraud prevention services). We use this data to operate, improve, and personalize the Services, process transactions, and communicate with you.
              </p>
              <p>
                We implement technical, administrative, and physical safeguards to protect your personal information. In the event of a data breach that affects your rights, we will notify you in accordance with applicable data protection laws, including GDPR and CCPA requirements.
              </p>
            </div>
          </section> */}

          <div className="ex-divider" />

          {/* 9. Liability */}
          <section id="ex-liability" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-yellow">09</span>
              <div>
                <h2 className="ex-section-title">Limitation of Liability</h2>
                <p className="ex-section-subtitle">Disclaimers and maximum liability caps</p>
              </div>
            </div>
            <div className="ex-callout ex-yellow">
              <AlertTriangle className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Disclaimer:</strong> The Services are provided on an "as is" and "as available" basis without warranties of any kind. unlockproject expressly disclaims all implied warranties, including merchantability, fitness for a particular purpose, and non-infringement.
              </p>
            </div>
            <div className="ex-prose">
              <p>
                To the maximum extent permitted by law, unlockproject shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, goodwill, or other intangible losses, resulting from your use of or inability to use the Services.
              </p>
              <p>
                Our total cumulative liability for any claims arising from or relating to these Terms or the Services shall not exceed the greater of (a) the total amount you paid to unlockproject in the twelve months preceding the claim, or (b) one hundred US dollars ($100.00).
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 10. Termination */}
          <section id="ex-termination" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">10</span>
              <div>
                <h2 className="ex-section-title">Termination</h2>
                <p className="ex-section-subtitle">Account closure and suspension policies</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                You may terminate your account at any time by visiting your account settings and following the deactivation process. Upon termination, your right to use the Services will immediately cease.
              </p>
              <p>
                unlockproject reserves the right to suspend or permanently terminate your account at our sole discretion, without prior notice, if we determine you have violated these Terms, engaged in fraudulent activity, or posed a risk to the platform or other users.
              </p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Upon account closure, your data will be retained for up to 90 days per our data retention policy.',
                'Outstanding balances owed to you (legitimate earnings) will be paid within 30 days of termination.',
                'Termination does not relieve you of obligations incurred prior to termination.',
                'Provisions that by their nature should survive termination will continue to apply.',
              ].map((rule, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-orange" />
                  {rule}
                </li>
              ))}
            </ul>
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