import Link from "next/link";
import "./homeFaq.css";

const faqs = [
  {
    q: "What is Unlock Startup?",
    a: "Unlock Startup is a digital platform that connects startups, companies, organisations, investors, innovators, professionals and job seekers in one ecosystem. Publishers list competitions, events, jobs, products and services, and members discover and apply for these opportunities from a single dashboard.",
  },
  {
    q: "Who can use Unlock Startup?",
    a: "Individuals, innovators, students, professionals, job seekers, startups, entrepreneurs, companies, organisations and investors can all join. You choose the account type that matches your role: User, Publisher or Investor.",
  },
  {
    q: "How can startups find investors and funding opportunities?",
    a: "Startups can apply to competitions, grant programs and funding calls, and explore investor profiles from angel investors, venture capital firms and funding organisations. Many investors share pitch deck submission links so you can send your proposal directly.",
  },
  {
    q: "How do I apply for startup jobs and internships?",
    a: "Browse the Jobs section, filter by location, work mode, job type and experience level, and apply online. Some listings use the employer's own application link.",
  },
  {
    q: "Can my organisation publish competitions, events, jobs, products or services?",
    a: "Yes. With a Publisher Account, startups, companies and ecosystem partners can publish listings and track the applications they receive from the Publisher Dashboard.",
  },
  {
    q: "Is Unlock Startup free to use?",
    a: "Unlock Startup offers a one month free plan and subscription-based plans. Features vary by plan; see the pricing page for details. Services are currently available in India only.",
  },
];

export default function HomeFaq() {
  return (
    <section className="home-faq position-relative pt-100 lg-pt-60 pb-100 lg-pb-60">
      <div className="container">
        <div className="row">
          <div className="col-lg-5">
            <div className="title-one mb-30">
              <h2 className="fw-semibold fs-1 fs-lg-3 fs-md-4 fs-sm-5">Frequently Asked Questions</h2>
            </div>
            <p className="mb-15">
              Answers to common questions from startups, entrepreneurs, investors and job seekers about using
              Unlock Startup.
            </p>
            <Link href="/faq" className="btn-six">
              View all FAQs
            </Link>
          </div>
          <div className="col-lg-7 md-mt-40">
            {faqs.map((item, index) => (
              <details key={item.q} className="home-faq__item" open={index === 0}>
                <summary className="home-faq__question">{item.q}</summary>
                <p className="home-faq__answer">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
