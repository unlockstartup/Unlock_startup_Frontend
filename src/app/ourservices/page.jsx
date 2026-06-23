"use client";

import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import CompanyServiceCard from "@/components/uiElements/CompanyServiceCard";
import "./ourservices.css"

const Page = () => {
  return (
    <main>
      <section>
        <main id="main-content" className="services-page">
          {/* Hero Section */}
          <section className="hero mt-30" id="top">
            <h1 className="hero-heading">
              Unlock Startup Services
            </h1>
          </section>

          {/* Services Section */}
          <section id="services" style={{ marginTop: 40 }}>
            <div className="container">
              <div className="section-head">
                <div className="section-label">What's Inside</div>
                <div>
                  <h2>Professional Services for Startup Growth</h2>
                  <p className="section-copy">
                    Our services ecosystem provides access to experienced professionals and business partners. Connect, collaborate, and unlock new opportunities through services designed to support innovation, efficiency, and sustainable business growth.
                  </p>
                </div>
              </div>

              <div className="services-grid">
                {/* Service 1 - Competitions */}
                <article className="service-card">
                  <div className="service-header">
                    <div className="service-number">01</div>
                  </div>
                  <h3>Competitions</h3>
                  <p>
                    Find your fit across numerous areas – innovation challenges, hackathons, grant programs, startup competitions, research initiatives, sustainability projects, AI, healthcare, fintech, education, and emerging technologies.
                  </p>
                  <ul>
                    <li>Showcase your ideas, validate solutions, and win recognition from leading experts, companies and ecosystem partners.</li>
                    <li>Open doors to new business growth prospects, potential partnerships, funding sources, and startup acceleration.</li>
                    <li>Sharpen your skills in problem-solving, leadership, teamwork, and innovation through real-world experience.</li>
                    <li>Unlock new avenues for growth, potential collaborations, funding and to accelerate your startup.</li>
                    <li>Who can create Competition listings: Register as a publisher account.</li>
                    <li>Who can participate in Challenges: Register as a user account.</li>
                    <li>Number of Competition listings based on monthly/annual subscriptions.</li>
                  </ul>
                </article>

                {/* Service 2 - Events */}
                <article className="service-card">
                  <div className="service-header">
                    <div className="service-number">02</div>
                  </div>
                  <h3>Events</h3>
                  <p>
                    Engage in industry events including conferences, seminars, webinars, workshops, networking meetings, investor meetups, demo days, and more.
                  </p>
                  <ul>
                    <li>Learn directly from experienced founders, industry experts, investors, and thought leaders.</li>
                    <li>Grow your network and connect with entrepreneurs, innovators, companies, and industry players.</li>
                    <li>Stay on top of emerging trends, technological advancements, market strategies, and new opportunities.</li>
                    <li>Identify partnership possibilities to drive startup growth, business expansion, and career development.</li>
                    <li>Who can create Event listings: Register as a publisher account.</li>
                    <li>Who can participate in Events: Register as a user account.</li>
                  </ul>
                </article>

                {/* Service 3 - Jobs */}
                <article className="service-card">
                  <div className="service-header">
                    <div className="service-number">03</div>
                  </div>
                  <h3>Jobs</h3>
                  <p>
                    Find open positions in tech, IT, digital marketing, engineering, operations, biz dev, sales, and within startup ecosystems.
                  </p>
                  <ul>
                    <li>Link with innovative startups and companies looking for skilled professionals.</li>
                    <li>Experience vibrant, growth-focused work environments and develop cutting-edge skills.</li>
                    <li>Gain hands-on experience with challenging projects and contribute to impactful innovations.</li>
                    <li>Boost career trajectory with access to a wide array of job openings and expanding networks.</li>
                    <li>Who can create Job listings: Register as a publisher account.</li>
                    <li>Who can apply for Jobs: Register as a user account.</li>
                    <li>Number of Job listings based on monthly/annual subscriptions.</li>
                  </ul>
                </article>

                {/* Service 4 - Investors */}
                <article className="service-card">
                  <div className="service-header">
                    <div className="service-number">04</div>
                  </div>
                  <h3>Investors</h3>
                  <p>
                    Find angel investors, venture capital firms, funding foundations, and strategic investment partners for your business.
                  </p>
                  <ul>
                    <li>Explore a wide range of funding opportunities suited for different startup stages, industries, and business models.</li>
                    <li>Present your compelling business idea and deck through professional channels and pitch directly to potential investors.</li>
                    <li>Develop meaningful connections with seasoned investors for invaluable mentorship, guidance, and market wisdom.</li>
                    <li>Who can create an Investor profile: Register as an investor account.</li>
                    <li>Who can contact Investors: Register as a user account.</li>
                    <li>No charge to create an investor profile.</li>
                  </ul>
                </article>

                {/* Service 5 - Product Listings */}
                <article className="service-card">
                  <div className="service-header">
                    <div className="service-number">05</div>
                  </div>
                  <h3>Product Listings</h3>
                  <p>
                    Present innovative products, technology, hardware, electronics and startup creations to a broad audience.
                  </p>
                  <ul>
                    <li>Generate leads, inquiries, and market interest through targeted exposure.</li>
                    <li>Showcase innovation, product value, and real-world application in the startup sphere.</li>
                    <li>Pave the way for customer acquisition, strategic alliances, investment, and business expansion.</li>
                    <li>Who can create Product listings: Register as a publisher account.</li>
                    <li>Who can view Product details: Register as a user account.</li>
                    <li>Number of Product listings based on monthly/annual subscriptions.</li>
                  </ul>
                </article>

                {/* Service 6 - Services */}
                <article className="service-card">
                  <div className="service-header">
                    <div className="service-number">06</div>
                  </div>
                  <h3>Services</h3>
                  <p>
                    Advertise your services within a range of categories, including consulting, technology, marketing, legal, financial, design, development, and business support services.
                  </p>
                  <ul>
                    <li>Connect directly with startups, companies, entrepreneurs, and organizations that require your specialized expertise.</li>
                    <li>Enhance your brand's presence and build credibility within a dynamic and growing business and innovation community.</li>
                    <li>Secure new business leads, broaden your professional networks, and expand your market reach effectively.</li>
                    <li>Create new revenue streams by providing essential services that enable startups and businesses to thrive and grow.</li>
                    <li>Who can publish Service listings: Register as a publisher account.</li>
                    <li>Who can contact third-party Services: Register as a user account.</li>
                    <li>Number of Service listings based on monthly/annual subscriptions.</li>
                  </ul>
                </article>
              </div>
            </div>
          </section>
        </main>
      </section>
    </main>
  );
};

export default Page;