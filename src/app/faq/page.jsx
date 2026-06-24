"use client";

import { useState } from "react";

const faqs = [
  {
    category: "Getting Started",
    color: "#ec512b",
    items: [
      {
        q: "What is Unlock Startup?",
        a: "Unlock Startup is a comprehensive digital platform designed to connect startups, companies, organizations, investors, innovators, professionals, and job seekers within a unified ecosystem. The platform enables publishers to create and manage listings for innovation challenges, competitions, events, job opportunities, products, and professional services through a dedicated dashboard.\n\nAt the same time, individuals, innovators, entrepreneurs, startups, and professionals can discover and participate in competitions, register for events, apply for jobs, explore innovative products, and connect with service providers that support business growth.",
      },
      {
        q: "Who can join Unlock Startup?",
        a: "If you are individual, innovators, can join, including startups, entrepreneurs, companies, organizations, investors, students, professionals, and job seekers.",
      },
      {
        q: "How do I create an account?",
        a: "You can register through our platform by selecting the account type that best matches your role, such as User, Publisher, or Investor.",
      },
      {
        q: "Is Unlock Startup free to use?",
        a: "Unlock Startup may offer both one month free and subscription-based plans. Features and benefits vary depending on the selected subscription plan.",
      },
    ],
  },
  {
    category: "Account Types",
    color: "#ec512b",
    items: [
      {
        q: "What is a User Account?",
        a: "A User Account is designed for individuals, innovators, entrepreneurs, startup founders, students, professionals, and job seekers who want to explore and participate in opportunities available on Unlock Startup. Through a User Account, members can discover innovation challenges, competitions, grant programs, events, job opportunities, investor profiles, products, and business services from a single dashboard.",
      },
      {
        q: "What is a Publisher Account?",
        a: "A Publisher Account allows startups, companies, organizations, and ecosystem partners to publish competitions, events, jobs, products list, and service listings on the platform.",
      },
      {
        q: "What is an Investor Account?",
        a: "An Investor Account is designed for angel investors, venture capital firms, and funding organizations to create investment profiles and connect with startups seeking funding opportunities.",
      },
    ],
  },
  {
    category: "Listings & Applications",
    color: "#ec512b",
    items: [
      {
        q: "Can investors receive pitch decks from startups?",
        a: "Yes. Investors can include pitch deck submission link details in their profiles, allowing startups to share business proposals and funding requests directly.",
      },
      {
        q: "What types of products can be listed?",
        a: "Startups and companies can showcase innovative products, technologies, hardware products, research projects, and market-ready innovations.",
      },
      {
        q: "Can Publishers Track Applications?",
        a: "Yes. Publishers can track and manage applications submitted through their listings using the Publisher Dashboard. Depending on the listing type, publishers can view applicant details, monitor application activity, review submissions, and track participation status. This feature helps organizations efficiently manage opportunities, evaluate candidates or participants, and streamline their selection process.",
      },
      {
        q: "Why do some listings use external or third-party application links?",
        a: "Unlock Startup allows publishers, investors to include external or third-party application links to provide flexibility in managing their recruitment, event registration, challenge participation, job apply, investor applications, or business processes. Only events apply for platform or add external link option.",
      },
    ],
  },
];

const AccordionItem = ({ q, a, accentColor, isOpen, onToggle }) => {
  const isYellow = accentColor === "#ec512b";
  return (
    <div className="apexfaq__accordion-item">
      <button className="apexfaq__accordion-btn" onClick={onToggle}>
        <span className="apexfaq__accordion-question">{q}</span>
        <span
          className="apexfaq__accordion-icon"
          style={{ background: isOpen ? accentColor : "#f0f0f0" }}
        >
          <svg
            className="apexfaq__accordion-chevron"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            <path
              d="M2 4l4 4 4-4"
              stroke={isOpen ? (isYellow ? "#1a1a1a" : "#fff") : "#888"}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <div
        className="apexfaq__accordion-body"
        style={{
          maxHeight: isOpen ? "400px" : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <p className="apexfaq__accordion-answer">{a}</p>
      </div>
    </div>
  );
};

export default function FAQPage() {
  const [openMap, setOpenMap] = useState({});

  const toggle = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`;
    setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <div className="apexfaq__page">
        <div className="apexfaq__wrapper">

          <div className="apexfaq__eyebrow">
            <div className="apexfaq__eyebrow-dot" />
            <span className="apexfaq__eyebrow-text">Help Centre</span>
          </div>

<h1 className="apexfaq__heading">
  <span className="apexfaq__heading-accent">Frequently Asked Questions</span> 
</h1>

<p className="apexfaq__subheading">
  From account setup to publisher tools — answers to the most common questions about Unlock Startup. Need help? We are a message away.
</p>

          <div className="apexfaq__grid">
            {faqs.map((cat, catIdx) => (
              <div key={catIdx} className="apexfaq__category-block">
                <div className="apexfaq__category-header">
                  <div
                    className="apexfaq__category-bar"
                    style={{ background: cat.color }}
                  />
                  <span
                    className="apexfaq__category-label"
                    style={{ color: cat.color === "#fecd05" ? "#a07f00" : cat.color }}
                  >
                    {cat.category}
                  </span>
                </div>

                <div className="apexfaq__category-divider" />

                {cat.items.map((item, itemIdx) => (
                  <AccordionItem
                    key={itemIdx}
                    q={item.q}
                    a={item.a}
                    accentColor={cat.color}
                    isOpen={!!openMap[`${catIdx}-${itemIdx}`]}
                    onToggle={() => toggle(catIdx, itemIdx)}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="apexfaq__cta-bar">
            <div>
              <p className="apexfaq__cta-text-primary">Still have questions?</p>
              <p className="apexfaq__cta-text-secondary">Our team responds within 24 hours.</p>
            </div>
            <a className="apexfaq__cta-btn" href="#">
              Talk to us
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

        </div>
      </div>
    </>
  );
}