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
  { id: 'ex-introduction',   label: 'Introduction',                 color: 'orange' },
  { id: 'ex-accounts',       label: 'User Accounts',                color: 'blue'   },
  { id: 'ex-content',        label: 'Content Sharing',              color: 'yellow' },
  { id: 'ex-data',           label: 'Data Collection & Privacy',    color: 'orange' },
  { id: 'ex-privacy-rights', label: 'Your Privacy Rights',          color: 'blue'   },
  { id: 'ex-third-party',    label: 'Third-Party Links',            color: 'yellow' },
  { id: 'ex-liability',      label: 'Limitation of Liability',      color: 'orange' },
  { id: 'ex-user-resp',      label: 'User Responsibilities',        color: 'blue'   },
  { id: 'ex-disclaimer',     label: 'Disclaimer of Warranties',     color: 'yellow' },
  { id: 'ex-cancellations',  label: 'Cancellations & Termination',  color: 'orange' },
  { id: 'ex-governing',      label: 'Governing Law',                color: 'blue'   },
  { id: 'ex-modifications',  label: 'Modifications',                color: 'yellow' },
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
        <meta name="description" content="Unlock Startup Platform Terms and Conditions — please read before using our platform." />
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
            Terms &amp; <span>Conditions</span>
          </h1>
          <p className="ex-hero-subtitle">for Unlock Startup Platform</p>
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
                <p className="ex-section-subtitle">Welcome to Unlock Startup Platform</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                These Terms and Conditions ("Terms") explain the rules for using our content platform ("Platform"), operated by <strong>World Mirror Innovations Pvt Ltd</strong>. By accessing or using our Platform, you agree to follow these Terms. If you don&apos;t agree with any part of them, please don&apos;t use our Platform.
              </p>
              <p>
                We may update these Terms at any time. We&apos;ll notify you of significant changes by posting the updated version here and updating the &quot;Last Updated&quot; date. Your continued use of the Platform means you accept the updated Terms.
              </p>
            </div>
          </section>

          {/* 2. User Accounts */}
          <section id="ex-accounts" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">02</span>
              <div>
                <h2 className="ex-section-title">User Accounts</h2>
                <p className="ex-section-subtitle">Creating and maintaining your account</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                To use certain features on our Platform, you&apos;ll need to create an account. Here&apos;s what you need to know:
              </p>
            </div>
            <ul className="ex-rule-list">
              {[
                'You must be at least 18 years old (or the legal age of majority in your state) to create an account.',
                'You\'re responsible for keeping your password confidential and secure.',
                'You agree to provide accurate, current, and complete information when registering.',
                'You\'re responsible for all activity that happens under your account.',
                'You must notify us immediately if you suspect unauthorized access to your account.',
              ].map((rule, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-blue" />
                  {rule}
                </li>
              ))}
            </ul>
            <div className="ex-prose">
              <p><strong>Account Termination.</strong> We can suspend or terminate your account if you:</p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Violate these Terms.',
                'Engage in illegal activity.',
                'Harass or harm other users.',
                'Attempt to gain unauthorized access to our systems.',
              ].map((rule, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-blue" />
                  {rule}
                </li>
              ))}
            </ul>
          </section>

          {/* 3. Content Sharing */}
          <section id="ex-content" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-yellow">03</span>
              <div>
                <h2 className="ex-section-title">Content Sharing</h2>
                <p className="ex-section-subtitle">Your Content, prohibited content, and moderation</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                When you upload, post, list, or share content on our Platform (&quot;Your Content&quot;):
              </p>
            </div>
            <ul className="ex-rule-list">
              {[
                'You retain ownership of Your Content.',
                'You grant us a worldwide, non-exclusive license to use, display, and distribute Your Content to operate and improve the Platform.',
                'You\'re responsible for ensuring Your Content doesn\'t violate anyone\'s rights or these Terms.',
                'You warrant that you have the right to share Your Content and that it doesn\'t infringe on third-party intellectual property rights.',
              ].map((rule, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-yellow" />
                  {rule}
                </li>
              ))}
            </ul>
            <div className="ex-prose">
              <p><strong>Prohibited Content.</strong> You agree not to share content that:</p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Is illegal or promotes illegal activity.',
                'Violates someone\'s privacy, publicity, or intellectual property rights.',
                'Contains hate speech, harassment, or threats.',
                'Is sexually explicit or exploitative.',
                'Contains malware, viruses, or harmful code.',
                'Is spam or misleading advertising.',
                'Impersonates another person or entity.',
              ].map((rule, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-yellow" />
                  {rule}
                </li>
              ))}
            </ul>
            <div className="ex-prose">
              <p><strong>Content Moderation.</strong> We reserve the right to:</p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Review, monitor, and remove content that violates these Terms.',
                'Disable access to content that infringes on third-party rights.',
                'Cooperate with law enforcement regarding illegal content.',
              ].map((rule, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-yellow" />
                  {rule}
                </li>
              ))}
            </ul>
            <div className="ex-prose">
              <p>
                We&apos;re not responsible for content posted by other users, but we&apos;ll take action against violations when we become aware of them.
              </p>
              <p>
                <strong>Third-Party Content.</strong> Our Platform may contain links to or embed content from third parties. We&apos;re not responsible for third-party content, and your use of it is governed by their terms and policies.
              </p>
            </div>
          </section>

          {/* 4. Data Collection and Privacy */}
          <section id="ex-data" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">04</span>
              <div>
                <h2 className="ex-section-title">Data Collection and Privacy</h2>
                <p className="ex-section-subtitle">What we collect and how we use it</p>
              </div>
            </div>
            <div className="ex-prose">
              <p><strong>Information We Collect.</strong> We collect information to provide and improve our Platform, including:</p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Account Information: Name, email, company name, password, profile details.',
                'Payment Information: Billing address, payment method (processed securely by third parties).',
                'Usage Data: Pages visited, content viewed, search queries, time spent on Platform.',
                'Device Information: IP address, browser type, operating system, device identifiers.',
                'Communications: Messages, support requests, feedback you send us.',
              ].map((rule, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-orange" />
                  {rule}
                </li>
              ))}
            </ul>
            <div className="ex-prose">
              <p><strong>How We Use Your Information.</strong> We use your information to:</p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Create and maintain your account.',
                'Process payments and send billing information.',
                'Provide, improve, and personalize our Platform.',
                'Send you service updates and support communications.',
                'Comply with legal obligations.',
                'Prevent fraud and enhance security.',
                'Analyze usage trends and user behavior.',
              ].map((rule, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-orange" />
                  {rule}
                </li>
              ))}
            </ul>
            <div className="ex-prose">
              <p>
                <strong>Data Sharing.</strong> We may share your information with law enforcement or government agencies when required by law. Once your content or information is published and made live on the Platform, it may be accessible to third parties and could be viewed by anyone, depending on the Platform&apos;s privacy and visibility settings. We don&apos;t sell your personal information to third parties for marketing purposes.
              </p>
              <p>
                <strong>Data Security.</strong> We implement reasonable security measures to protect your information, including encryption and secure servers. However, no online transmission is completely secure. You use the Platform at your own risk.
              </p>
            </div>
          </section>

          {/* 5. Your Privacy Rights */}
          <section id="ex-privacy-rights" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">05</span>
              <div>
                <h2 className="ex-section-title">Your Privacy Rights</h2>
                <p className="ex-section-subtitle">Accessing, correcting, and deleting your information</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>You have the right to:</p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Access the personal information we hold about you.',
                'Request correction of inaccurate information.',
                'Request deletion of your information (subject to legal retention requirements).',
              ].map((rule, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-blue" />
                  {rule}
                </li>
              ))}
            </ul>
            <div className="ex-prose">
              <p>To exercise these rights, contact us using the information in the &quot;Contact Us&quot; section.</p>
            </div>
          </section>

          {/* 6. Third-Party Links */}
          <section id="ex-third-party" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-yellow">06</span>
              <div>
                <h2 className="ex-section-title">Third-Party Links</h2>
                <p className="ex-section-subtitle">External links and your responsibility</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                This website may contain links to third-party websites. These links are provided solely for your convenience. Unlock Startup does not endorse, control, or guarantee the accuracy, relevance, or completeness of any third-party websites. Visiting such websites is at your own risk, and you should review their respective terms and conditions.
              </p>
              <p>
                World Mirror Innovations Pvt Ltd shall not be held responsible, directly or indirectly, for any damage, loss, or harm caused or alleged to be caused by or in connection with the use of or reliance on any content, goods, or services available on or through any such third-party websites or services.
              </p>
            </div>
          </section>

          {/* 7. Limitation of Liability */}
          <section id="ex-liability" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">07</span>
              <div>
                <h2 className="ex-section-title">Limitation of Liability</h2>
                <p className="ex-section-subtitle">Disclaimers and maximum liability caps</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                Under no circumstances shall Unlock Startup, its directors, employees, partners, or affiliates be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in any way connected with the use of this website or reliance on any information provided on the website. This includes but is not limited to loss of data, revenue, or profits.
              </p>
            </div>
          </section>

          {/* 8. User Responsibilities */}
          <section id="ex-user-resp" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">08</span>
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
          </section>

          {/* 9. Disclaimer of Warranties */}
          <section id="ex-disclaimer" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-yellow">09</span>
              <div>
                <h2 className="ex-section-title">Disclaimer of Warranties</h2>
                <p className="ex-section-subtitle">No guarantees on information accuracy or reliability</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                This website is provided &quot;as is&quot; without any warranties or representations, whether express or implied. Unlock Startup makes no guarantees regarding the accuracy, reliability, or suitability of the information and materials found on the website. Any reliance you place on such information is strictly at your own risk.
              </p>
            </div>
          </section>

          {/* 10. Competitions/Event/Job/Product/Services Cancellations or Termination */}
          <section id="ex-cancellations" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">10</span>
              <div>
                <h2 className="ex-section-title">Cancellations &amp; Termination</h2>
                <p className="ex-section-subtitle">Competitions, events, jobs, products, and services listings</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                Unlock Startup reserves the right to remove any third-party competition, challenge, event, job listing, product, or services listing from our Platform if it is found to violate our content guidelines, or if we receive complaints regarding the event&apos;s legitimacy or ethics.
              </p>
              <p>
                Removal of a challenge or event from our Platform does not affect your participation or relationship with the third-party company, and you should contact the event organizer and host directly for further guidance.
              </p>
            </div>
          </section>

          {/* 11. Governing Law */}
          <section id="ex-governing" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">11</span>
              <div>
                <h2 className="ex-section-title">Governing Law &amp; Jurisdiction</h2>
                <p className="ex-section-subtitle">Legal framework and dispute resolution</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                These Terms and Conditions shall be governed by and construed in accordance with the laws of [Jurisdiction]. Any disputes arising out of or related to the use of this website shall be subject to the exclusive jurisdiction of the courts in Delhi.
              </p>
            </div>
          </section>

          {/* 12. Modifications */}
          <section id="ex-modifications" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-yellow">12</span>
              <div>
                <h2 className="ex-section-title">Modifications</h2>
                <p className="ex-section-subtitle">Our right to update these terms</p>
              </div>
            </div>
            <div className="ex-prose">
              <p>
                Unlock Startup reserves the right to modify or replace these Terms and Conditions at any time without prior notice. By continuing to use this website after such modifications are made, you signify your acceptance of the updated Terms and Conditions.
              </p>
            </div>
          </section>

        </main>

      </div>
    </>
  );
}