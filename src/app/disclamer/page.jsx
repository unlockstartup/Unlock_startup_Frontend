'use client'

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import '@/app/styles/termandcondition.css';

const sections = [
  { id: 'ex-general', label: 'General Information' },
  { id: 'ex-advice', label: 'No Professional Advice' },
  { id: 'ex-ugc', label: 'User-Generated Content' },
  { id: 'ex-business', label: 'Business Relationships' },
  { id: 'ex-investment', label: 'Investment Disclaimer' },
  { id: 'ex-jobs', label: 'Job Opportunities' },
  { id: 'ex-events', label: 'Competitions and Events' },
  { id: 'ex-products', label: 'Products & Third-Party Services' },
  { id: 'ex-links', label: 'Third-Party Links' },
  { id: 'ex-availability', label: 'Website Availability' },
  { id: 'ex-liability', label: 'Limitation of Liability' },
  { id: 'ex-changes', label: 'Changes to This Disclaimer' },
  { id: 'ex-contact', label: 'Contact Us' },
];

export default function DisclaimerPolicy() {
  const [activeSection, setActiveSection] = useState('ex-general');
  const [scrollProgress, setScrollProgress] = useState(0);
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
        <title>Disclaimer Policy | Unlock Startup</title>
        <meta name="description" content="Unlock Startup Disclaimer Policy — understand the limitations of our responsibility regarding information, services, and content on our platform." />
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
            Disclaimer 
          </h1>
          <div className="ex-hero-meta">
            <span className="ex-hero-meta-item">Effective Date: June 29, 2026</span>
          </div>
          <p style={{ fontSize: '20px', marginTop: '10px' }}>
            Welcome to Unlock Startup ("Platform", "we", "our", or "us"). This Disclaimer explains the limitations of our responsibility regarding the information, services, and content available through the Unlock Startup platform. By accessing or using our website and services, you acknowledge and agree to the terms of this Disclaimer.
          </p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="ex-page-layout">
        {/* Content */}
        <main className="ex-content">

          {/* 1. General Information */}
          <section id="ex-general" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">01</span>
              <h2 className="ex-section-title">General Information</h2>
            </div>
            <div className="ex-prose">
              <p>
                Unlock Startup is an online platform that connects innovators, startups, companies, investors, service providers, job seekers, and professionals through startup listings, innovation challenges, competitions, events, jobs, products, and business services.
              </p>
              <p>
                The information available on our platform is provided for general informational and networking purposes only.
              </p>
            </div>
          </section>



          {/* 2. No Professional Advice */}
          <section id="ex-advice" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">02</span>
              <h2 className="ex-section-title">No Professional Advice</h2>
            </div>
            <div className="ex-prose">
              <p>
                The content published on Unlock Startup does not constitute legal, financial, tax, investment, business, accounting, or professional advice.
              </p>
              <p>
                Users should seek independent professional advice before making any business, investment, employment, or financial decisions.
              </p>
            </div>
          </section>



          {/* 3. User-Generated Content */}
          <section id="ex-ugc" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-yellow">03</span>
              <h2 className="ex-section-title">User-Generated Content</h2>
            </div>
            <div className="ex-prose">
              <p>
                Many listings, profiles, job postings, competitions, events, products, services, and other content are submitted directly by users.
              </p>
              <p>Unlock Startup:</p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Does not guarantee the accuracy, completeness, or reliability of user-submitted information.',
                'Is not responsible for errors, omissions, or outdated information.',
                'Does not endorse or verify every user, company, investor, or service provider.',
              ].map((item, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-yellow" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="ex-prose">
              <p>Users are responsible for verifying all information before relying on it.</p>
            </div>
          </section>



          {/* 4. Business Relationships */}
          <section id="ex-business" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">04</span>
              <h2 className="ex-section-title">Business Relationships</h2>
            </div>
            <div className="ex-prose">
              <p>
                Unlock Startup serves only as a platform to facilitate connections between users.
              </p>
              <p>
                We are not a party to any agreement, contract, transaction, employment relationship, investment, partnership, or commercial arrangement between users. Any dealings are solely between the involved parties.
              </p>
            </div>
          </section>



          {/* 5. Investment Disclaimer */}
          <section id="ex-investment" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">05</span>
              <h2 className="ex-section-title">Investment Disclaimer</h2>
            </div>
            <div className="ex-prose">
              <p>
                Information relating to startups, investors, funding opportunities, or fundraising is provided for informational purposes only.
              </p>
              <p>
                Unlock Startup does not recommend, guarantee, or endorse any investment opportunity and does not guarantee funding, investment success, or business outcomes.
              </p>
              <p>
                Investments involve risk, and users should conduct their own due diligence.
              </p>
            </div>
          </section>



          {/* 6. Job Opportunities */}
          <section id="ex-jobs" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-yellow">06</span>
              <h2 className="ex-section-title">Job Opportunities</h2>
            </div>
            <div className="ex-prose">
              <p>Job postings are submitted by employers and organizations. Unlock Startup does not guarantee:</p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Employment opportunities',
                'Interview invitations',
                'Job offers',
                'Salary information',
                'Employer authenticity',
              ].map((item, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-yellow" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="ex-prose">
              <p>Applicants should independently verify employers before accepting any offer.</p>
            </div>
          </section>



          {/* 7. Competitions and Events */}
          <section id="ex-events" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">07</span>
              <h2 className="ex-section-title">Competitions and Events</h2>
            </div>
            <div className="ex-prose">
              <p>
                Competitions, hackathons, conferences, seminars, webinars, networking events, and other programs may be organized by third parties. Unlock Startup is not responsible for:
              </p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Event cancellations or postponements',
                'Changes in schedules',
                'Prize distribution',
                'Organizer decisions',
                'Participation outcomes',
              ].map((item, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-orange" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="ex-prose">
              <p>Participants should review the organizer's terms before participating.</p>
            </div>
          </section>



          {/* 8. Products & Third-Party Services */}
          <section id="ex-products" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">08</span>
              <h2 className="ex-section-title">Products Listing and Third-Party Services</h2>
            </div>
            <div className="ex-prose">
              <p>
                Products and services listed on the platform are offered by independent users or businesses. Unlock Startup does not guarantee:
              </p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Product quality',
                'Service quality',
                'Availability',
                'Pricing',
                'Delivery',
                'Performance',
                'Customer satisfaction',
              ].map((item, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-blue" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="ex-prose">
              <p>Any purchase or engagement is solely between the buyer and the seller or service provider.</p>
            </div>
          </section>



          {/* 9. Third-Party Links */}
          <section id="ex-links" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-yellow">09</span>
              <h2 className="ex-section-title">Third-Party Links</h2>
            </div>
            <div className="ex-prose">
              <p>
                Our platform may contain links to third-party websites or services. Unlock Startup is not responsible for the content, privacy practices, security, or availability of external websites.
              </p>
              <p>Users access third-party websites at their own risk.</p>
            </div>
          </section>



          {/* 10. Website Availability */}
          <section id="ex-availability" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">10</span>
              <h2 className="ex-section-title">Website Availability</h2>
            </div>
            <div className="ex-prose">
              <p>
                While we strive to provide uninterrupted service, we do not guarantee that the platform will always be available or error-free.
              </p>
              <p>
                We may suspend or modify services for maintenance, updates, or technical reasons without prior notice.
              </p>
            </div>
          </section>



          {/* 11. Limitation of Liability */}
          <section id="ex-liability" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-blue">11</span>
              <h2 className="ex-section-title">Limitation of Liability</h2>
            </div>
            <div className="ex-prose">
              <p>
                To the maximum extent permitted by applicable law, Unlock Startup shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from:
              </p>
            </div>
            <ul className="ex-rule-list">
              {[
                'Use or inability to use the platform',
                'User-generated content',
                'Business decisions',
                'Investments',
                'Employment opportunities',
                'Competition participation',
                'Events',
                'Products or services purchased through the platform',
                'Technical failures, interruptions, or data loss',
              ].map((item, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-blue" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="ex-prose">
              <p>Users access and use the platform at their own risk.</p>
            </div>
          </section>



          {/* 12. Changes to This Disclaimer */}
          <section id="ex-changes" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-yellow">12</span>
              <h2 className="ex-section-title">Changes to This Disclaimer</h2>
            </div>
            <ul className="ex-rule-list">
              {[
                'We reserve the right to modify this Disclaimer at any time.',
                'Updated versions will be published on this page with a revised Effective Date.',
                'Continued use of the platform after changes are posted constitutes acceptance of the updated Disclaimer.',
              ].map((item, i) => (
                <li key={i} className="ex-rule-item">
                  <span className="ex-rule-dot ex-yellow" />
                  {item}
                </li>
              ))}
            </ul>
          </section>



          {/* 13. Contact Us */}
          <section id="ex-contact" className="ex-section">
            <div className="ex-section-header">
              <span className="ex-section-num ex-orange">13</span>
              <h2 className="ex-section-title">Contact Us</h2>
            </div>
            <div className="ex-prose">
              <p>
                If you have any questions regarding this Disclaimer, please contact our support team through the contact information provided on the Unlock Startup website.
              </p>
            </div>
          </section>


        </main>
      </div>
    </>
  );
}