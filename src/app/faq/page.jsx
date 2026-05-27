"use client";

import { useState } from "react";

const faqs = [
  {
    category: "Getting Started",
    color: "#ec512b",
    items: [
      {
        q: "What types of events does your company manage?",
        a: "We handle the full spectrum — corporate conferences, product launches, galas, trade expos, brand activations, award ceremonies, team off-sites, and large-scale concerts. If it needs a crowd and a stage, we've done it.",
      },
      {
        q: "How early should I reach out before my event date?",
        a: "For large-scale events (500+ attendees), we recommend a minimum of 3–4 months lead time. For mid-size events, 6–8 weeks. For intimate gatherings, 2–3 weeks can work. That said — the earlier, the better. Venue availability and vendor bookings fill up fast.",
      },
      {
        q: "Do you offer services for virtual or hybrid events?",
        a: "Absolutely. We have a dedicated digital production team specializing in virtual stages, live-streaming, hybrid audience management, and interactive online experiences. Your remote attendees get the same energy as those in the room.",
      },
    ],
  },
  {
    category: "Pricing & Packages",
    color: "#ec512b",
    items: [
      {
        q: "How is pricing structured?",
        a: "We offer three service tiers: Essentials (coordination + day-of execution), Signature (end-to-end planning with creative direction), and Bespoke (white-glove, fully custom delivery). Pricing scales with event complexity, headcount, and duration. Contact us for a tailored quote.",
      },
      {
        q: "Are there any hidden fees I should know about?",
        a: "Zero hidden fees. Every quote we send is itemised and transparent — vendor costs, our management fee, contingency budget, and optional add-ons are all broken out clearly before you sign anything.",
      },
      {
        q: "Do you require a deposit? What is your cancellation policy?",
        a: "We require a 30% deposit upon signing. Cancellations made 60+ days before the event receive a full refund of the deposit. Within 30–60 days, 50% is retained. Under 30 days, the full deposit is non-refundable. We always work with clients on force-majeure situations.",
      },
    ],
  },
  {
    category: "Planning & Execution",
    color: "#ec512b",
    items: [
      {
        q: "Will I have a dedicated event manager throughout the process?",
        a: "Yes, always. From the kickoff call to post-event debrief, you get a single dedicated event manager as your main point of contact. No being bounced around — one person who knows your event inside and out.",
      },
      {
        q: "Do you have preferred vendors, or can I bring my own?",
        a: "We have a vetted network of caterers, AV crews, decorators, photographers, and entertainers we trust and have worked with extensively. That said, you're welcome to bring your own vendors — we'll coordinate and integrate them seamlessly into the plan.",
      },
      {
        q: "How do you handle unexpected issues on the event day?",
        a: "Every event ships with a detailed contingency plan. Our on-site team runs a closed operations channel and has pre-approved backup options for vendors, logistics, and tech — so we resolve issues before guests even notice they existed.",
      },
      {
        q: "Can you manage events outside our city or country?",
        a: "Yes. We manage domestic and international events. Our team handles venue scouting, local vendor sourcing, permit acquisition, and on-ground logistics no matter the location. We've executed events across 4 continents.",
      },
    ],
  },
  {
    category: "After the Event",
    color: "#ec512b",
    items: [
      {
        q: "Do you provide post-event reporting or analytics?",
        a: "Every event closes with a comprehensive debrief report covering attendance data, budget reconciliation, vendor performance ratings, attendee feedback summary, and recommendations for future events. Data you can actually use.",
      },
      {
        q: "Can we repurpose event content — photos, videos, livestreams?",
        a: "Yes. We coordinate with our media partners to deliver edited highlight reels, photography packages, and raw livestream archives within 5–10 business days post-event. Licensing rights are fully transferred to you.",
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
            <span className="apexfaq__heading-accent">Everything</span> you need to know.
          </h1>

          <p className="apexfaq__subheading">
            From your first inquiry to post-event debrief — answers to the questions our clients ask most. Still stuck? We're a message away.
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
              <p className="apexfaq__cta-text-secondary">Our team responds within 2 business hours.</p>
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