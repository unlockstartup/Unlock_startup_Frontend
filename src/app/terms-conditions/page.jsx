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
  MessageCircle,
  Ban,
  Eye,
  Scale,
  LogOut,
  UserCheck,
} from 'lucide-react';
import '@/app/styles/termandcondition.css';

const sections = [
  { id: 'ex-introduction',       label: 'Introduction',                color: 'orange' },
  { id: 'ex-prohibited',         label: 'Prohibited Activities',       color: 'blue'   },
  { id: 'ex-third-party',        label: 'Third-Party Links',           color: 'yellow' },
  { id: 'ex-liability',          label: 'Limitation of Liability',     color: 'orange' },
  { id: 'ex-user-resp',          label: 'User Responsibilities',       color: 'blue'   },
  { id: 'ex-disclaimer',         label: 'Disclaimer of Warranties',    color: 'yellow' },
  { id: 'ex-indemnity',          label: 'Indemnity',                   color: 'orange' },
  { id: 'ex-governing',          label: 'Governing Law',               color: 'blue'   },
  { id: 'ex-modifications',      label: 'Modifications',               color: 'yellow' },
  { id: 'ex-entire-agreement',   label: 'Entire Agreement',            color: 'orange' },
];

export default function TermsConditions() {
  const [activeSection, setActiveSection] = useState('ex-introduction');
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
      alert('Thank you! You have accepted the Terms & Conditions.');
    }, 150);
  };

  return (
    <>
      <Head>
        <title>Terms & Conditions | Unlock Startup</title>
        <meta name="description" content="Unlock Startup Blog Terms and Conditions — please read before using our website." />
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
            Terms &amp; <span>Conditions</span>
          </h1>
          <p className="ex-hero-subtitle">for Unlock Startup Blog</p>
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
          <section id="ex-introduction" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">01</span>
              <div>
                <h2 className="ex-section-title">Introduction</h2>
                <p className="ex-section-subtitle">Governing your use of Unlock Startup</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                These terms and conditions govern your use of the website <strong>Unlock Startup</strong>. By accessing and using this website, you agree to abide by these terms and conditions in full. If you disagree with any part of these terms and conditions, you must refrain from using this website.
              </p>
            </div>
            {/* <div className="ex-callout ex-orange">
              <AlertCircle className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Important:</strong> Continued use of Unlock Startup constitutes your full acceptance of these terms and conditions. Please read them carefully before proceeding.
              </p>
            </div> */}
          </section>

          <div className="ex-divider" />

          {/* 2. Prohibited Activities */}
          <section id="ex-prohibited" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">02</span>
              <div>
                <h2 className="ex-section-title">Prohibited Activities</h2>
                <p className="ex-section-subtitle">What you must not do while using this website</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                While using this website, you must not engage in any unlawful, fraudulent, or harmful activities. This includes but is not limited to:
              </p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Attempting to gain unauthorized access to the website or its server.',
                'Uploading or transmitting any malicious software, viruses, or harmful code.',
                'Interfering with the website\'s functionality or disrupting its services.',
                'Collecting or storing personal information of other users without their consent.',
                'Posting or transmitting any offensive, indecent, or objectionable content.',
              ].map((rule, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-blue" />
                  {rule}
                </li>
              ))}
            </ul>
            {/* <div className="ex-callout ex-blue">
              <Shield className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Enforcement:</strong> Violations of these prohibitions may result in immediate suspension of your access and may be reported to the relevant authorities.
              </p>
            </div> */}
          </section>

          <div className="ex-divider" />

          {/* 3. Third-Party Links */}
          <section id="ex-third-party" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-yellow">03</span>
              <div>
                <h2 className="ex-section-title">Third-Party Links</h2>
                <p className="ex-section-subtitle">External links and your responsibility</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
This website may contain links to third-party websites. These links are provided solely for your convenience. Unlock Startup does not endorse, control, or guarantee the accuracy, relevance, or completeness of any third-party websites. Visiting such websites is at your own risk, and you should review their respective terms and conditions.
              </p>
            
            </div>
            {/* <div className="ex-callout ex-yellow">
              <AlertTriangle className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Disclaimer:</strong> Unlock Startup bears no responsibility for the content, privacy practices, or any damages arising from your visit to any linked third-party website.
              </p>
            </div> */}
          </section>

          <div className="ex-divider" />

          {/* 4. Limitation of Liability */}
          <section id="ex-liability" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">04</span>
              <div>
                <h2 className="ex-section-title">Limitation of Liability</h2>
                <p className="ex-section-subtitle">Disclaimers and maximum liability caps</p>
              </div>
            </div>
            {/* <div className="ex-callout ex-yellow">
              <AlertTriangle className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Disclaimer:</strong> Under no circumstances shall Unlock Startup, its directors, employees, partners, or affiliates be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in any way connected with the use of this website.
              </p>
            </div> */}
            <div className="ex-prose">
              <p>
Under no circumstances shall Unlock Startup, its directors, employees, partners, or affiliates be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in any way connected with the use of this website or reliance on any information provided on the website. This includes but is not limited to loss of data, revenue, or profits.
              </p>
            </div>
          </section>

          <div className="ex-divider" />

          {/* 5. User Responsibilities */}
          <section id="ex-user-resp" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">05</span>
              <div>
                <h2 className="ex-section-title">User Responsibilities</h2>
                <p className="ex-section-subtitle">Your obligations when using this website</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
By using this website, you agree to be solely responsible for any content you post, upload, or transmit. You must ensure that such content complies with applicable laws and does not infringe upon any intellectual property rights or violate any third-party rights.
              </p>
            </div>
            {/* <div className="ex-callout ex-blue">
              <UserCheck className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Your Commitment:</strong> You are solely accountable for all content you contribute to the platform. Unlock Startup reserves the right to remove any content that violates these responsibilities.
              </p>
            </div> */}
          </section>

          <div className="ex-divider" />

          {/* 6. Disclaimer of Warranties */}
          <section id="ex-disclaimer" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-yellow">06</span>
              <div>
                <h2 className="ex-section-title">Disclaimer of Warranties</h2>
                <p className="ex-section-subtitle">No guarantees on information accuracy or reliability</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
This website is provided “as is” without any warranties or representations, whether express or implied. Unlock Startup makes no guarantees regarding the accuracy, reliability, or suitability of the information and materials found on the website. Any reliance you place on such information is strictly at your own risk.
              </p>
            </div>
            {/* <div className="ex-callout ex-yellow">
              <ShieldCheck className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>As-Is Basis:</strong> All content and services are provided without warranty of any kind. Unlock Startup expressly disclaims all implied warranties, including merchantability and fitness for a particular purpose.
              </p>
            </div> */}
          </section>

          <div className="ex-divider" />

          {/* 7. Indemnity */}
          <section id="ex-indemnity" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">07</span>
              <div>
                <h2 className="ex-section-title">Indemnity</h2>
                <p className="ex-section-subtitle">Your agreement to hold Unlock Startup harmless</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
You agree to indemnify and hold Unlock Startup and its affiliates, directors, employees, and partners harmless from any claims, liabilities, damages, expenses, and costs, including reasonable attorneys’ fees, arising from your use of this website or any violation of these terms and conditions.
              </p>
            </div>
            {/* <div className="ex-callout ex-orange">
              <Scale className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Note:</strong> This indemnification obligation survives termination of your use of this website and remains in full force regardless of any changes to these terms.
              </p>
            </div> */}
          </section>

          <div className="ex-divider" />

          {/* 8. Governing Law */}
          <section id="ex-governing" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">08</span>
              <div>
                <h2 className="ex-section-title">Governing Law &amp; Jurisdiction</h2>
                <p className="ex-section-subtitle">Legal framework and dispute resolution</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
These terms and conditions shall be governed by and construed in accordance with the laws of [Jurisdiction]. Any disputes arising out of or related to the use of this website shall be subject to the exclusive jurisdiction of the courts in [Jurisdiction].
              </p>
            </div>
            {/* <div className="ex-callout ex-blue">
              <Shield className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Jurisdiction:</strong> By using this website, you consent to the personal jurisdiction of the courts specified herein for the purpose of litigating any such disputes.
              </p>
            </div> */}
          </section>

          <div className="ex-divider" />

          {/* 9. Modifications */}
          <section id="ex-modifications" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-yellow">09</span>
              <div>
                <h2 className="ex-section-title">Modifications</h2>
                <p className="ex-section-subtitle">Our right to update these terms</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
Unlock Startup reserves the right to modify or replace these terms and conditions at any time without prior notice. By continuing to use this website after such modifications are made, you signify your acceptance of the updated terms and conditions.
              </p>
            </div>
            {/* <div className="ex-callout ex-yellow">
              <AlertTriangle className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Stay Informed:</strong> We recommend reviewing these terms periodically to stay aware of any updates. Your continued use of the website constitutes acceptance of any revised terms.
              </p>
            </div> */}
          </section>

          <div className="ex-divider" />

          {/* 10. Entire Agreement */}
          <section id="ex-entire-agreement" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">10</span>
              <div>
                <h2 className="ex-section-title">Entire Agreement</h2>
                <p className="ex-section-subtitle">The complete agreement between you and Unlock Startup</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
These terms and conditions constitute the entire agreement between you and Unlock Startup and supersede all prior agreements and understandings, whether written or verbal, relating to the subject matter herein.
              </p>
            </div>
            {/* <div className="ex-callout ex-orange">
              <FileText className="ex-callout-icon" size={20} />
              <p className="ex-callout-text">
                <strong>Final Agreement:</strong> No other representations, warranties, or agreements, whether oral or written, shall be binding unless expressly included in these terms and conditions.
              </p>
            </div> */}
          </section>

          <div className="ex-divider" />

        </main>


      </div>
    </>
  );
}

