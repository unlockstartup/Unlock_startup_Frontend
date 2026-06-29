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
  CreditCard,
  Building2,
  BarChart2,
} from 'lucide-react';
import '@/app/styles/termandcondition.css';

const sections = [
  { id: 'pv-intro',        label: 'Introduction',            color: 'orange' },
  { id: 'pv-collection',   label: 'Information We Collect',  color: 'blue'   },
  { id: 'pv-usage',        label: 'How We Use Your Data',    color: 'yellow' },
  { id: 'pv-sharing',      label: 'Sharing Your Information',color: 'orange' },
  { id: 'pv-data-privacy', label: 'Data Privacy',            color: 'blue'   },
  { id: 'pv-rights',       label: 'Your Choices & Rights',   color: 'yellow' },
  { id: 'pv-third-party',  label: 'Third-Party Links',       color: 'orange' },
  { id: 'pv-children',     label: "Children's Privacy",      color: 'blue'   },
  { id: 'pv-changes',      label: 'Changes to This Policy',  color: 'yellow' },
  { id: 'pv-contact',      label: 'Contact Us',              color: 'orange' },
];

const collectionCards = [
  { icon: UserCheck,  title: 'Personal Information', text: 'Name, email address, phone number, company name, and other contact details.' },
  { icon: Building2,  title: 'Business Information', text: 'Information about your business such as industry, company size, and business goals.' },
  { icon: BarChart2,  title: 'Usage Data',           text: 'IP address, browser type, pages visited, and other usage details from your interaction with our site.' },
  { icon: Cookie,     title: 'Cookies & Tracking',   text: 'Cookies and similar technologies used to enhance your experience and track usage patterns.' },
];

const contactCards = [
  { icon: Mail,  title: 'Email Us',   text: 'contact@unlockstartup.com' },
  { icon: Phone, title: 'Call Us',    text: '+91 9266733959'            },
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('pv-intro');
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

  const handleAccept = () => {
    setAccepted(true);
    setTimeout(() => {
      alert('You have acknowledged the Privacy Policy.');
    }, 150);
  };

  return (
    <>
      <Head>
        <title>Privacy Policy | Unlock Startup</title>
        <meta name="description" content="Unlock Startup Privacy Policy — learn how we collect, use, and protect your personal information." />
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
            Privacy <span>Policy</span>
          </h1>
          <p className="ex-hero-subtitle">Unlock Startup</p>
          <div className="ex-hero-meta">
            <span className="ex-hero-meta-item">Last Updated: April 28, 2026</span>           
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="ex-page-layout">



        {/* Content */}
        <main className="ex-content">

          {/* 1. Introduction */}
          <section id="pv-intro" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">01</span>
              <div>
                <h2 className="ex-section-title">Introduction</h2>
                <p className="ex-section-subtitle">Our commitment to protecting your privacy</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                <strong>Unlock Startup</strong> ("we," "us," or "our") is committed to protecting the privacy and personal information of our users ("you," "your"). This Privacy Policy outlines how we collect, use, and safeguard your personal data when you use our website, services, or products.
              </p>
              <p>
                By accessing or using our services, you agree to the terms outlined in this policy. If you do not agree with the terms, please discontinue the use of our services.
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
                We may collect various types of information from you, including:
              </p>
            </div>
            <div className="ex-policy-grid">
              {collectionCards.map((card) => {
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

          {/* 3. How We Use Your Information */}
          <section id="pv-usage" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-yellow">03</span>
              <div>
                <h2 className="ex-section-title">How We Use Your Information</h2>
                <p className="ex-section-subtitle">Purposes for which we process your data</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                We use the information we collect for various purposes, including:
              </p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Providing Services: To deliver the solutions and services you request, including consulting, branding, marketing, and business development.',
                'Improving Our Services: To analyze and improve our services, website performance, and user experience.',
                'Communication: To send you updates, newsletters, promotional materials, and other information related to our services.',
                'Legal Compliance: To comply with applicable laws, regulations, and legal processes.',
              ].map((rule, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-yellow" />
                  {rule}
                </li>
              ))}
            </ul>

          </section>

          <div className="ex-divider" />

          {/* 4. Sharing Your Information */}
          <section id="pv-sharing" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">04</span>
              <div>
                <h2 className="ex-section-title">Sharing Your Information</h2>
                <p className="ex-section-subtitle">Who we share your data with and why</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
              </p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Service Providers: Trusted third-party providers who assist in delivering our services — such as payment processors, hosting providers, and marketing agencies — and are required to protect your information.',
                'Legal Obligations: We may disclose your information if required by law, regulation, or legal process, or if necessary to protect our rights, property, or safety.',
                'Business Transfers: In the event of a merger, acquisition, or sale of all or part of our business, your information may be transferred to the new owner.',
              ].map((rule, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-orange" />
                  {rule}
                </li>
              ))}
            </ul>

          </section>

          <div className="ex-divider" />

          {/* 5. Data Privacy */}
          <section id="pv-data-privacy" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">05</span>
              <div>
                <h2 className="ex-section-title">Data Privacy</h2>
                <p className="ex-section-subtitle">How we secure and handle your personal data</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                We implement a variety of security measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the Internet or electronic storage is completely secure, so we cannot guarantee absolute security.
              </p>
              <p>
                By participating in a third-party event, you may be required to provide personal information to the third-party company. Unlock Startup is not responsible for the privacy practices of third parties, and we recommend reviewing the third party's privacy policy before submitting any personal data.
              </p>
              <p>
                Unlock Startup may collect certain data for event promotion or platform analytics, but such data collection will be governed by this Privacy Policy, and no personal data will be shared with third parties without your consent.
              </p>
            </div>

          </section>

          <div className="ex-divider" />

          {/* 6. Your Choices and Rights */}
          <section id="pv-rights" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-yellow">06</span>
              <div>
                <h2 className="ex-section-title">Your Choices &amp; Rights</h2>
                <p className="ex-section-subtitle">How to manage and control your personal information</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                You have the following rights regarding your personal information:
              </p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Access and Correction: You may request access to or correction of your personal information by contacting us at (Email ID).',
                'Opt-Out: You can opt out of receiving marketing communications by following the unsubscribe link in our emails or contacting us directly.',
                'Cookies: Most web browsers are set to accept cookies by default. You can choose to remove or reject cookies, though this may affect certain features of our website.',
              ].map((rule, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-yellow" />
                  {rule}
                </li>
              ))}
            </ul>

          </section>

          <div className="ex-divider" />

          {/* 7. Third-Party Links */}
          <section id="pv-third-party" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">07</span>
              <div>
                <h2 className="ex-section-title">Third-Party Links</h2>
                <p className="ex-section-subtitle">External websites and your responsibility</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                Our website may contain links to third-party websites or services. We are not responsible for the privacy practices or content of those sites. We encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </div>

          </section>

          <div className="ex-divider" />

          {/* 8. Children's Privacy */}
          <section id="pv-children" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">08</span>
              <div>
                <h2 className="ex-section-title">Children's Privacy</h2>
                <p className="ex-section-subtitle">Our policy on data collected from minors</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal data, please contact us, and we will take steps to delete such information.
              </p>
            </div>

          </section>

          <div className="ex-divider" />

          {/* 9. Changes to This Privacy Policy */}
          <section id="pv-changes" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-yellow">09</span>
              <div>
                <h2 className="ex-section-title">Changes to This Privacy Policy</h2>
                <p className="ex-section-subtitle">How we notify you of updates</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the updated policy on our website. Your continued use of our services after any changes indicates your acceptance of the revised policy.
              </p>
            </div>

          </section>

          <div className="ex-divider" />

          {/* 10. Contact Us */}
          <section id="pv-contact" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">10</span>
              <div>
                <h2 className="ex-section-title">Contact Us</h2>
                <p className="ex-section-subtitle">Reach out with questions or data concerns</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
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

          </section>

          <div className="ex-divider" />

        </main>

      </div>
    </>
  );
}

