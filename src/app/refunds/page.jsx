'use client'

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { List, Check } from 'lucide-react';
import '@/app/styles/termandcondition.css';

const sections = [
  { id: 'ex-scope', label: 'Subscription Plans' },
  { id: 'ex-eligibility', label: 'Cancellation Policy' },
  { id: 'ex-types', label: '7-Day Satisfaction Guarantee' },
  { id: 'ex-attendee', label: 'Monthly Subscription Refunds' },
  { id: 'ex-organizer', label: 'Annual Subscription Refunds' },
  { id: 'ex-processing', label: 'Duplicate or Multiple Payments' },
  { id: 'ex-billing', label: 'Billing Errors' },
  { id: 'ex-nonrefund', label: 'Non-Refundable Situations' },
  { id: 'ex-refundprocess', label: 'Refund Processing' },
  { id: 'ex-contact', label: 'Contact Us' },
];

export default function RefundPolicy() {
  const [activeSection, setActiveSection] = useState('ex-scope');
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
          if (entry.isIntersecting) setActiveSection(entry.target.id);
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



  return (
    <>
      <Head>
        <title>Refund & Cancellation Policy | Unlock Startup</title>
        <meta name="description" content="Unlock Startup Refund and Cancellation Policy — understand your rights, timelines, and eligibility for subscription refunds." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Progress Bar */}
      <div className="ex-progress-bar" style={{ width: `${scrollProgress}%` }} />

      {/* Hero Strip */}
      <div className="ex-hero-strip">
        <div className="ex-hero-strip-bg" />
        <div className="ex-hero-strip-grid" />
        <div className="ex-hero-strip-content">
          <h1 className="ex-hero-title">
            Refund &amp; <span>Cancellation Policy</span>
          </h1>
          <div className="ex-hero-meta">
            <span className="ex-hero-meta-item">Effective Date: June 29, 2026</span>
          </div>
           <p style={{fontSize : "20px" , marginTop : "10px"}}>
                At Unlock Startup, we strive to provide the best possible experience for our users. This Refund &amp; Cancellation Policy explains how subscription cancellations, refunds, and billing-related issues are handled.
           </p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="ex-page-layout">
        {/* Mobile TOC */}
        {/* <div className="ex-mobile-toc-card">
          <TocCard activeSection={activeSection} onAccept={handleAccept} accepted={accepted} />
        </div> */}

        {/* Content */}
        <main className="ex-content">

          {/* 1. Subscription Plans */}
          <section id="ex-scope" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">01</span>
              <h2 className="ex-section-title">Subscription Plans</h2>
            </div>
            <div className="ex-prose">
              <p>Unlock Startup offers the following subscription plans:</p>
            </div>
            <ul className="ex-rule-list">
              {['Monthly Subscription', 'Annual Subscription'].map((item, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-orange" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="ex-prose">
              <p>By purchasing a subscription, you agree to the pricing, billing cycle, and terms outlined in this policy.</p>
            </div>
          </section>



          {/* 2. Cancellation Policy */}
          <section id="ex-eligibility" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">02</span>
              <h2 className="ex-section-title">Cancellation Policy</h2>
            </div>
            <div className="ex-prose">
              <p>You may cancel your subscription at any time through your account dashboard.</p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Your subscription will remain active until the end of your current billing period.',
                'No additional charges will be made after cancellation.',
                'Cancellation does not automatically qualify for a refund unless you meet the refund eligibility requirements below.',
              ].map((item, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-blue" />
                  {item}
                </li>
              ))}
            </ul>
          </section>



          {/* 3. 7-Day Satisfaction Guarantee */}
          <section id="ex-types" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-yellow">03</span>
              <h2 className="ex-section-title">7-Day Satisfaction Guarantee</h2>
            </div>
            <div className="ex-prose">
              <p>Customer satisfaction is important to us.</p>
              <p>
                If you are not satisfied with our services, you may request a refund within 7 days of your initial subscription purchase.
              </p>
              <p>To be eligible for a refund:</p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Your refund request must be submitted within 7 calendar days of the original payment.',
                'You must provide the reason why the service did not meet your expectations.',
                'Our support team will review each request individually.',
              ].map((item, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-yellow" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="ex-prose">
              <p>Approved refunds will be processed using the original payment method.</p>
            </div>
          </section>



          {/* 4. Monthly Subscription Refunds */}
          <section id="ex-attendee" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">04</span>
              <h2 className="ex-section-title">Monthly Subscription Refunds</h2>
            </div>
            <ul className="ex-rule-list">
              {[
                'Refund requests made within the first 7 days of the initial purchase may be considered under our Satisfaction Guarantee.',
                'Renewed monthly subscription payments are generally non-refundable unless required by applicable law or due to a billing error.',
              ].map((item, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-orange" />
                  {item}
                </li>
              ))}
            </ul>
          </section>



          {/* 5. Annual Subscription Refunds */}
          <section id="ex-organizer" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">05</span>
              <h2 className="ex-section-title">Annual Subscription Refunds</h2>
            </div>
            <ul className="ex-rule-list">
              {[
                'Annual subscriptions may be eligible for a refund if requested within 7 days of the initial purchase.',
                'After the 7-day period, annual subscription payments are generally non-refundable.',
              ].map((item, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-blue" />
                  {item}
                </li>
              ))}
            </ul>
          </section>



          {/* 6. Duplicate or Multiple Payments */}
          <section id="ex-processing" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-yellow">06</span>
              <h2 className="ex-section-title">Duplicate or Multiple Payments</h2>
            </div>
            <div className="ex-prose">
              <p>If you are accidentally charged more than once for the same subscription:</p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Contact our support team immediately.',
                'Verified duplicate or multiple payments will be fully refunded.',
                'Refunds are generally processed within 7–14 business days, depending on your payment provider.',
              ].map((item, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-yellow" />
                  {item}
                </li>
              ))}
            </ul>
          </section>



          {/* 7. Billing Errors */}
          <section id="ex-billing" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">07</span>
              <h2 className="ex-section-title">Billing Errors</h2>
            </div>
            <div className="ex-prose">
              <p>You may be eligible for a refund if:</p>
            </div>
            <ul className="ex-rule-list">
              {[
                'You were charged incorrectly.',
                'You experienced a system or technical billing error.',
                'Your account was billed after a valid cancellation.',
                'An unauthorized duplicate transaction occurred.',
              ].map((item, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-orange" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="ex-prose">
              <p>Each billing issue will be investigated before a refund is approved.</p>
            </div>
          </section>



          {/* 8. Non-Refundable Situations */}
          <section id="ex-nonrefund" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">08</span>
              <h2 className="ex-section-title">Non-Refundable Situations</h2>
            </div>
            <div className="ex-prose">
              <p>Refunds will generally not be issued for:</p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Change of mind after the 7-day refund period.',
                'Failure to cancel before automatic renewal.',
                'Partial use of a subscription after the refund eligibility period.',
                'Violations of our Terms of Service resulting in account suspension or termination.',
              ].map((item, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-blue" />
                  {item}
                </li>
              ))}
            </ul>
          </section>



          {/* 9. Refund Processing */}
          <section id="ex-refundprocess" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-yellow">09</span>
              <h2 className="ex-section-title">Refund Processing</h2>
            </div>
            <div className="ex-prose">
              <p>Once approved:</p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Refunds will be issued to the original payment method.',
                'Processing time may vary depending on your bank or payment provider.',
                'Most refunds are completed within 7–14 business days.',
              ].map((item, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-yellow" />
                  {item}
                </li>
              ))}
            </ul>
          </section>



          {/* 10. Contact Us */}
          <section id="ex-contact" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">10</span>
              <h2 className="ex-section-title">Contact Us</h2>
            </div>
            <div className="ex-prose">
              <p>
                If you have questions about billing, cancellations, or refunds, please contact our support team.
              </p>
              <p>Please include:</p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Registered email address',
                'Subscription plan',
                'Payment date',
                'Transaction ID (if available)',
                'Description of the issue',
              ].map((item, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-blue" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="ex-prose">
              <p>Our team will review your request and respond as quickly as possible.</p>
              <p>
                <strong>Notes: </strong>  Unlock Startup reserves the right to modify this Refund &amp; Cancellation Policy at any time. Any updates will be published on this page and become effective immediately upon posting.
              </p>
            </div>
          </section>


        </main>
      </div>
    </>
  );
}

