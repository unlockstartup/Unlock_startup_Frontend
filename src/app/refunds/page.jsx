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
  CreditCard,
  RefreshCw,
  Ban,
  Clock,
  CalendarX,
  UserX,
  Percent,
  Wallet,
  MessageCircle,
  HelpCircle,
} from 'lucide-react';
import '@/app/styles/termandcondition.css';

const sections = [
  { id: 'ex-scope', label: 'Scope & Applicability', color: 'orange' },
  { id: 'ex-eligibility', label: 'Eligibility Criteria', color: 'blue' },
  { id: 'ex-types', label: 'Refund Types', color: 'yellow' },
  { id: 'ex-attendee', label: 'Cancellations by Attendee', color: 'orange' },
  { id: 'ex-organizer', label: 'Cancellations by Organizer', color: 'blue' },
  { id: 'ex-processing', label: 'Processing & Timeline', color: 'yellow' },
  { id: 'ex-nonrefund', label: 'Non-Refundable Items', color: 'orange' },
  { id: 'ex-disputes', label: 'Disputes & Appeals', color: 'blue' },
  { id: 'ex-contact', label: 'Contact Us', color: 'blue' },
];

const policyCards = [
  { icon: ShieldCheck, title: 'Event Cancelled', text: 'Full refund issued automatically when an organizer cancels an event.' },
  { icon: CalendarX, title: 'Event Postponed', text: 'Full refund available if the rescheduled date is not acceptable to you.' },
  { icon: Percent, title: 'Partial Refund', text: 'Pro-rata refunds for multi-day events when specific days are cancelled.' },
  { icon: CreditCard, title: 'Credit Voucher', text: 'Opt-in alternative offering platform credit valid for 12 months.' },
  { icon: Clock, title: 'Time Limits', text: 'Refund requests must be submitted before the event start time.' },
  { icon: Ban, title: 'No-Show Policy', text: 'Tickets marked as used or expired are ineligible for any refund.' },
];

const contactCards = [
  { icon: Mail, title: 'Refund Requests', text: 'refunds@unlockproject.io' },
  { icon: Eye, title: 'Dispute Team', text: 'disputes@unlockproject.io' },
  { icon: Shield, title: 'Support', text: 'support@unlockproject.io' },
  { icon: Phone, title: 'Hotline', text: '+1 (800) 888-3947' },
];

const refundTableData = [
  ['Organizer Cancellation', '100%', '5–10 business days', 'Automatic; no action required.'],
  ['Event Postponed', '100%', '5–10 business days', 'Must request within 14 days of postponement notice.'],
  ['Attendee — 7+ Days', '80%', '5–10 business days', 'Subject to organizer policy; service fee retained.'],
  ['Attendee — 24h to 7 Days', '50%', '5–10 business days', 'Subject to organizer approval; service fee retained.'],
  ['Attendee — < 24 Hours', '0%', 'N/A', 'Tickets are non-refundable except under extenuating circumstances.'],
  ['Multi-Day Partial', 'Pro-rata', '5–10 business days', 'Calculated based on cancelled days vs. total event length.'],
  ['No-Show / Used Ticket', '0%', 'N/A', 'Tickets scanned or expired are ineligible for refund.'],
];

export default function RefundPolicy() {
  const [activeSection, setActiveSection] = useState('ex-scope');
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
      alert('You have acknowledged the Refund & Cancellation Policy.');
    }, 150);
  };

  return (
    <>
      <Head>
        <title>Refund & Cancellation Policy | unlockproject</title>
        <meta name="description" content="unlockproject Refund and Cancellation Policy — understand your rights, timelines, and eligibility before purchasing tickets." />
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
            Refund &amp; <span>Cancellation Policy</span>
          </h1>
          <div className="ex-hero-meta">
            <span className="ex-hero-meta-item">Effective: January 1, 2025</span>
            <span className="ex-hero-meta-dot" />
            <span className="ex-hero-meta-item">Last Updated: May 23, 2026</span>
            <span className="ex-hero-meta-dot" />
            <span className="ex-hero-meta-item">Version 4.0</span>
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
          {/* 1. Scope */}
          <section id="ex-scope" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">01</span>
              <div>
                <h2 className="ex-section-title">Scope &amp; Applicability</h2>
                <p className="ex-section-subtitle">What this policy covers and who it applies to</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                This <strong>Refund &amp; Cancellation Policy</strong> governs all ticket purchases, bookings, and reservations made through the unlockproject platform. It applies to all attendees, registered users, and event organizers who transact on our Services.
              </p>
              <p>
                By completing a purchase, you acknowledge that you have read, understood, and agree to the terms set forth in this policy. This document works in conjunction with our Terms &amp; Conditions and Privacy Policy, which are incorporated by reference.
              </p>
            </div>
            <div className="ex-callout ex-orange">
              <AlertCircle className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Important:</strong> Individual event organizers may impose additional refund rules. The organizer's stated policy on the event page takes precedence where it is stricter than this platform policy. We display all organizer-specific terms prior to checkout.
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 2. Eligibility */}
          <section id="ex-eligibility" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">02</span>
              <div>
                <h2 className="ex-section-title">Eligibility Criteria</h2>
                <p className="ex-section-subtitle">Who qualifies for a refund and under what conditions</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                Refund eligibility is determined by the reason for cancellation, the timing of the request relative to the event date, and the specific terms set by the event organizer. unlockproject acts solely as the payment intermediary and applies the organizer's policy unless otherwise stated below.
              </p>
            </div>
            <ul className="ex-rule-list">
              {[
                'The ticket must have been purchased directly through the unlockproject platform.',
                'Refund requests must be submitted by the original purchaser using the registered account.',
                'The request must be made before the scheduled event start time unless the event is cancelled or postponed.',
                'Tickets acquired through resale, transfer, or third-party platforms are not eligible.',
                'Complimentary or promotional tickets carry no cash refund value unless the event is cancelled.',
                'Group bookings of 10+ tickets may be subject to separate contractual terms.',
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
                <strong>Verification:</strong> We reserve the right to request proof of purchase, identity verification, or supporting documentation before processing any refund request.
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 3. Refund Types */}
          <section id="ex-types" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-yellow">03</span>
              <div>
                <h2 className="ex-section-title">Refund Types &amp; Scenarios</h2>
                <p className="ex-section-subtitle">Summary of refund categories available on unlockproject</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                We classify refunds into distinct categories based on the party initiating the cancellation and the nature of the disruption. The following cards outline the primary scenarios you may encounter.
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
          </section>

          <div className="ex-divider" />

          {/* 4. Attendee Cancellation */}
          <section id="ex-attendee" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">04</span>
              <div>
                <h2 className="ex-section-title">Cancellations by Attendee</h2>
                <p className="ex-section-subtitle">Your options when you need to cancel your ticket</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                If you can no longer attend an event, you may request a cancellation through your unlockproject account dashboard or by contacting support. The refund amount depends on how far in advance you cancel and the organizer's specific policy.
              </p>
            </div>
            <div className="ex-table-wrapper">
              <table className="ex-table">
                <thead>
                  <tr>
                    <th>Scenario</th>
                    <th>Refund %</th>
                    <th>Timeline</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {refundTableData.map(([scenario, pct, timeline, notes], i) => (
                    <tr key={i}>
                      <td>
                        <strong style={{ color: 'var(--ex-text-primary)', fontWeight: 500 }}>
                          {scenario}
                        </strong>
                      </td>
                      <td>{pct}</td>
                      <td>{timeline}</td>
                      <td style={{ color: 'var(--ex-text-muted)' }}>{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="ex-prose">
              <p>
                All attendee-initiated refunds are subject to the unlockproject service fee being retained. The service fee covers payment processing, platform maintenance, and administrative costs incurred at the time of purchase.
              </p>
            </div>
            <div className="ex-callout ex-yellow">
              <AlertTriangle className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Extenuating Circumstances:</strong> Medical emergencies, bereavement, or government-mandated travel restrictions may qualify for exceptions. Submit documentation to refunds@unlockproject.io within 7 days of the event for review.
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 5. Organizer Cancellation */}
          <section id="ex-organizer" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">05</span>
              <div>
                <h2 className="ex-section-title">Cancellations by Organizer</h2>
                <p className="ex-section-subtitle">What happens when an organizer cancels or postpones</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                If an organizer cancels an event entirely, all ticket holders are entitled to a full refund of the ticket face value. unlockproject will automatically initiate bulk refunds to the original payment method within 24 hours of the cancellation announcement.
              </p>
              <p>
                In the case of postponement, attendees may either retain their tickets for the new date or request a full refund. Refund requests for postponed events must be submitted within 14 days of the postponement notice. After this window, tickets will be automatically transferred to the new date.
              </p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Organizers must notify unlockproject at least 48 hours before cancelling to avoid platform penalties.',
                'Venue changes within the same metropolitan area are treated as postponements, not cancellations.',
                'If an organizer fails to provide a rescheduled date within 90 days, all tickets convert to automatic refunds.',
                'Force majeure events (natural disasters, pandemics) may trigger modified refund terms disclosed per-event.',
              ].map((rule, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-blue" />
                  {rule}
                </li>
              ))}
            </ul>
            <div className="ex-callout ex-blue">
              <RefreshCw className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Credit Option:</strong> For organizer cancellations, you may opt to receive platform credit equal to 110% of your ticket value instead of a cash refund. Credits expire 12 months from issuance.
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 6. Processing */}
          <section id="ex-processing" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-yellow">06</span>
              <div>
                <h2 className="ex-section-title">Processing &amp; Timeline</h2>
                <p className="ex-section-subtitle">How and when refunds are issued</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                Approved refunds are processed to the original payment method used at checkout. We do not issue refunds to alternate accounts or payment instruments for security and fraud-prevention reasons.
              </p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Credit/Debit Cards: 5–10 business days to appear on your statement.',
                'Bank Transfers (ACH/Wire): 7–14 business days depending on your bank.',
                'Digital Wallets (PayPal, Apple Pay, Google Pay): 3–5 business days.',
                'Platform Credit: Instant upon approval; visible in your account wallet.',
                'International payments may take an additional 3–5 business days due to currency conversion.',
              ].map((rule, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-yellow" />
                  {rule}
                </li>
              ))}
            </ul>
            <div className="ex-callout ex-orange">
              <Clock className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Pending Period:</strong> Refunds may show as "Pending" for up to 48 hours in our system while we verify transaction integrity with payment processors. This is normal and does not affect the final delivery timeline.
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 7. Non-Refundable */}
          <section id="ex-nonrefund" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">07</span>
              <div>
                <h2 className="ex-section-title">Non-Refundable Items</h2>
                <p className="ex-section-subtitle">Charges and fees that cannot be returned</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                Certain charges associated with your purchase are non-refundable under all circumstances. These fees are collected by unlockproject or our payment partners to cover irreversible costs incurred during the transaction lifecycle.
              </p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Platform Service Fee (2.5% + Rs.99 per transaction).',
                'Payment Processing Fee (2.9% + Rs.30) charged by card networks.',
                'Currency Conversion Fee (up to 2%) for international transactions.',
                'Express Delivery or physical ticket shipping fees.',
                'Donations, tips, or voluntary contributions added at checkout.',
                'Membership or subscription fees billed separately from event tickets.',
              ].map((rule, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-orange" />
                  {rule}
                </li>
              ))}
            </ul>
            <div className="ex-callout ex-orange">
              <Ban className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Final Sale Events:</strong> Some events are designated "Final Sale" by the organizer. These tickets are non-refundable and non-transferable except in the case of organizer cancellation. This status is clearly displayed before purchase.
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 8. Disputes */}
          <section id="ex-disputes" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">08</span>
              <div>
                <h2 className="ex-section-title">Disputes &amp; Appeals</h2>
                <p className="ex-section-subtitle">How to escalate a refund disagreement</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                If you disagree with a refund decision, you may file a formal dispute within 30 days of the event date or the date of the refund denial notice. Disputes are reviewed by our Resolution Team, which operates independently from customer support.
              </p>
              <p>
                To file a dispute, email disputes@unlockproject.io with your order number, a detailed explanation, and any supporting evidence (receipts, medical notes, travel bans, etc.). Our team will acknowledge receipt within 2 business days and render a decision within 10 business days.
              </p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Disputes must be initiated by the original purchaser only.',
                'Chargebacks initiated through your bank before contacting us may result in account suspension.',
                'Our decision is final for amounts under $500. Disputes above this threshold may proceed to binding arbitration per our Terms.',
                'We reserve the right to reverse a refund if fraud or misrepresentation is discovered after issuance.',
              ].map((rule, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-blue" />
                  {rule}
                </li>
              ))}
            </ul>
            <div className="ex-callout ex-blue">
              <HelpCircle className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Good Faith:</strong> unlockproject reserves the right to ban users who abuse the dispute or refund system through frivolous claims, chargeback fraud, or pattern-based refund exploitation.
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 9. Contact */}
          <section id="ex-contact" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">09</span>
              <div>
                <h2 className="ex-section-title">Contact Us</h2>
                <p className="ex-section-subtitle">Reach our refunds and support teams</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                For questions about this policy, to check the status of a refund, or to submit documentation for extenuating circumstances, please use the contact methods below. Include your order number in all correspondence.
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
                <strong>Mailing Address:</strong> unlockproject Technologies Inc., Attn: Refunds Department, 100 Event Plaza, Suite 400, San Francisco, CA 94105, USA.
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
              Acknowledged
            </span>
          ) : (
            'Acknowledge Policy'
          )}
        </button>
      </div>
    </div>
  );
}