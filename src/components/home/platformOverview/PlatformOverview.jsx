import Link from "next/link";

const features = [
  {
    title: "Startup Competitions & Funding Calls",
    text: "Find innovation challenges, pitch competitions, grant programs and funding calls from organisations across India. Check eligibility, deadlines and prizes, then apply online.",
    href: "/competitions",
    linkText: "Browse competitions",
  },
  {
    title: "Startup Events & Workshops",
    text: "Discover networking meetups, workshops, webinars and conferences for founders and innovators. Register in a few clicks and meet mentors, partners and peers.",
    href: "/events",
    linkText: "Explore events",
  },
  {
    title: "Startup Jobs & Internships",
    text: "Search jobs and internships at startups by location, work mode, job type and experience level, and apply directly to companies that are hiring.",
    href: "/jobs",
    linkText: "Find startup jobs",
  },
  {
    title: "Investors for Startups",
    text: "Explore angel investors, venture capital firms and funding organisations, review their investment focus, and share your pitch deck with the right investors.",
    href: "/investors",
    linkText: "Meet investors",
  },
  {
    title: "Innovative Products",
    text: "See new products, technologies, hardware and market-ready innovations launched by startups and companies, and connect with the teams building them.",
    href: "/products",
    linkText: "View products",
  },
  {
    title: "Business & Professional Services",
    text: "Connect with professional service providers that support business growth, so you can focus on building and scaling your startup.",
    href: "/services",
    linkText: "Find services",
  },
];

export default function PlatformOverview() {
  return (
    <section className="position-relative pt-100 lg-pt-60">
      <div className="container">
        <div className="row">
          <div className="col-lg-10 m-auto text-center">
            <div className="title-one mb-30">
              <h2 className="fw-semibold fs-1 fs-lg-3 fs-md-4 fs-sm-5">
                India&apos;s Startup Growth Platform
              </h2>
            </div>
            <p className="mb-15">
              Unlock Startup brings startups, entrepreneurs, investors, job seekers and businesses together in one
              ecosystem. Startups, companies and organisations publish competitions, events, jobs, products and
              services from a single dashboard, while founders, innovators and professionals discover these
              opportunities and apply in one place.
            </p>
            <p className="mb-0">
              Whether you are raising funds, hiring your first team, looking for your next role or searching for
              the right partners to grow your business, Unlock Startup helps you find it faster.
            </p>
          </div>
        </div>

        <div className="row g-4 mt-30">
          {features.map((item) => (
            <div key={item.href} className="col-lg-4 col-md-6">
              <div className="h-100 p-4 border rounded-3 bg-white d-flex flex-column">
                <h3 className="fw-semibold fs-5 mb-10">{item.title}</h3>
                <p className="mb-15">{item.text}</p>
                <div className="mt-auto">
                  <Link href={item.href} className="btn-six">
                    {item.linkText}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row">
          <div className="col-lg-10 m-auto text-center mt-50">
            <h3 className="fw-semibold fs-4 mb-10">Resources to Grow Your Business</h3>
            <p className="mb-15">
              Read articles and insights for founders on the Unlock Startup blog, and compare our plans to start
              publishing your own competitions, events, jobs, products and services.
            </p>
            <div className="d-flex justify-content-center gap-4">
              <Link
                href="https://blog.unlockstartup.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-six"
              >
                Read the blog
              </Link>
              <Link href="/prices" className="btn-six">
                View pricing plans
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
