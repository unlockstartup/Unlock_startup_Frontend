import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import JobCta from "@/components/home/jobCta/JobCta";
import './aboutus.css';

const Page = () => {
  return (
    <main>
      <section className="hero mt-30" id="top">
        {/* <div className="au-container au-hero-grid">
          <div>
            <span className="au-eyebrow">Event Management for Startups</span>
            <h1 style={{ maxWidth: "100%", wordWrap: "break-word" }}>We create high impact events that accelerate startup growth and unlock new business opportunities.</h1>
            <p>
              Catalyst Events is a premier event management company trusted by ambitious founders, early-stage startups, and scaling ventures to design and execute strategic events that drive measurable business growth. From product launches and investor summits to networking galas and industry conferences, we turn visionary ideas into unforgettable experiences that attract funding, customers, and strategic partners.
            </p>
            <div className="au-nav-actions">
              <a className="au-btn au-btn-primary" href="#overview">Explore Our Story</a>
              <a className="au-btn au-btn-secondary" href="#values">Our Growth Formula</a>
            </div>
          </div>

          <aside className="au-hero-card" aria-label="Company highlights">
            <div className="au-metric">
              <div className="au-metric-block">
                <strong>Strategy-First</strong>
                <span>Every event begins with your business goals, target audience, and clear ROI objectives.</span>
              </div>
              <div className="au-metric-block">
                <strong>Startup-Focused</strong>
                <span>Tailored experiences designed exclusively for founders, investors, and growth-stage teams.</span>
              </div>
              <div className="au-metric-block">
                <strong>Results-Driven</strong>
                <span>Events engineered to generate leads, secure funding, build partnerships, and accelerate market traction.</span>
              </div>
            </div>
          </aside>
        </div> */}
                    <h1 className="hero-heading">
           About Us
            </h1>
      </section>

      {/* Overview Section */}
      <section className="au-section" id="overview">
        <div className="au-container">
          <div className="au-section-head">
            <div className="au-section-label">Company overview</div>
            <div>
              <h2>Complete Startup Ecosystem for Growth and Success.</h2>
              <p className="au-section-copy">
                Every startup has its vision and mission but finding the right platform to grow, connect and succeed can be a challenge.
<br/> To bridge this gap, we developed an all-in-one ecosystem for startups, innovators, investors, job seekers, service providers and innovative product listings. Our platform combines everything a growing startup needs, all in one place – from startup challenges and events, to jobs, networking, funding and products.
              </p>
            </div>
          </div>

          <div className="au-overview-grid">
            <article className="au-card">
              <h3>Who we are</h3>
              <p>
                We provide a dynamic platform designed to support startups, innovators, entrepreneurs, and investors by creating opportunities for growth, collaboration, and success. 
              </p>
            </article>
            <article className="au-card">
              <h3>What we do</h3>
              <p>
                We are an innovation startup platform designed to enable entrepreneurs, innovators, investors and the scaling business ecosystem through an integrated and robust digital platform.
              </p>
            </article>
            <article className="au-card">
              <h3>What we offer</h3>
              <p>
                 Unlock Startup provides a subscription-based dashboard for publishers, and investors, bringing the entire startup ecosystem together on a single digital platform. Our services include job posting solutions, startup competitions, business events, investor networking, and product listing services to help businesses gain visibility and reach the right audience.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="au-section" id="mission">
        <div className="au-container">
          <div className="au-section-head">
            <div className="au-section-label">Mission &amp; vision</div>
            <div>
              <h2>One Platform. Endless Opportunities for Startups.</h2>
              <p className="au-section-copy">
                Unlock Startup: The only place you need for innovation and growth, connecting entrepreneurs, innovators, startups, companies and investors within one seamlessly connected platform. Unlock Startup aggregates grant challenges, startup events, job postings, investor relationships, product showcases and business services all into one online portal. 
              </p>
            </div>
          </div>

          <div className="au-mission-vision">
            <article className="au-statement">
              <span>Our mission</span>
              <p>
                Unlock Startup mission to support the startups in all phases of their growth by offering access to the opportunities, connections and resources necessary for growth. Often, early-stage startups struggle with finding investment opportunities, getting suitable mentors, establishing a business network, targeting potential clients and achieving market reachability.
              </p>
            </article>
            <article className="au-statement">
              <span>Our vision</span>
              <p>
                Our vision is to contribute to India's emergence as a global leader in innovation, entrepreneurship, and technology. We believe the rise of a new generation of entrepreneurs, innovators, and creators will transform lives in a significant and powerful way through creation of solutions and services with impact and purpose that adds real value for everyone involved.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="au-section" id="services">
        <div className="au-container">
          <div className="au-section-head">
            <div className="au-section-label">Core services</div>
            <div>
              <h2>Empowering Startups to Innovate, Connect, and Scale.</h2>
              <p className="au-section-copy">
                Unlock Startup provides a comprehensive range of services designed to support innovation, entrepreneurship, and business growth. Our platform enables organizations to publish innovation challenges, competitions, hackathons, events, and job opportunities while allowing startups and innovators to discover and participate in them. We are able to deliver as well: product showcase lists, lists of start-up services, access to investors, and networking among business people. All these with the help of one integrated, central platform where startups, companies, investors and professionals are linked, interact and grow in the vibrant ecosystem for innovation.
              </p>
            </div>
          </div>

          <div className="au-service-grid">
            <article className="au-card">
              <h3>Competitions</h3>
              <p>
                Unlock Startup enables startups, companies, organizations, investors, and ecosystem partners to publish competitions, innovation challenges, grant programs, seed funding opportunities, hackathons, and other growth initiatives through a dedicated Publisher Dashboard. Every submitted program undergoes a review and validation by the Unlock Startup team before it is published on the platform. when approved, they become available to our growing community of innovators, entrepreneurs, startups and professionals, where they will register for an account, view programs, make submissions and enter challenges and competition that match with their capabilities, ideas, business models and so on.
              </p>
            </article>
            <article className="au-card">
              <h3>Events</h3>
              <p>
                Unlock Startup provides a Publisher Dashboard that enables startups, companies, organizations, investors, and ecosystem partners to publish and promote a wide range of events, including conferences, seminars, webinars, workshops, trade shows, networking sessions, investor meetups, and industry programs.
              </p>
              <ul>
                <li>Event organizers can submit their event details through the platform for review and verification by the Unlock Startup team. Publishers have the flexibility to direct participants to their own registration page or accept applications directly through the Unlock Startup platform.</li>
                <li>Once approved, events become visible to our growing community of innovators, entrepreneurs, startups, professionals, and industry leaders. This creates valuable opportunities for learning, networking, collaboration, knowledge sharing, and business growth within the innovation ecosystem.</li>
              </ul>
            </article>
            <article className="au-card">
              <h3>Jobs</h3>
              <p>
                 Unlock Startup provides a separate publisher dashboard that allows startup companies, organization, firm and investors to post their job opportunities for different kinds of industries & profession like technology, IT, networking, E-commerce, Digital Marketing, Business Development, operation etc.
              </p>
              <ul>
                <li>Publisher will submit their job posts on our platform which will check & verified by unlock startup team for the best opportunity for the individuals. Publishers can add their individual application link so that candidates can apply through their process.</li>
                <li>After checking & approval, opportunity will display to the student, innovator, professional & job seekers in their user dashboard. User can search the details of the job description, criteria & details and apply for the same.</li>
              </ul>
            </article>
            <article className="au-card">
              <h3>Investors </h3>
              <p>
                Unlock Startup provides a Investor Dashboard exclusively designed for angel investors, venture capital firms, investment professionals, and funding organizations. Investors can create a comprehensive profile showcasing their investment interests, industry focus, funding stage preferences, portfolio companies, and past investment experience. All investor profiles must pass a review by the Unlock Startup team prior to being published in the platform for verification purposes so that they are genuine and true. When approved, these investors become visible and accessible for all the startups, entrepreneurs, and companies that are looking for funding and partnership opportunity.
              </p>
            </article>
            <article className="au-card">
              <h3>Product Listings </h3>
              <p>
                Unlock Startup offers to start-ups, innovators and organizations, a unique platform to feature their innovation products to a large audience. Numerous start-ups at the beginning of their trajectory develops an innovation product or technology but encounter difficulties to ensure its visibility in the market, reach their potential customers and connect to investors. Our "Product Listings" space enables start-ups to display their product innovation, list their features and exhibit the relevance and benefits of the innovation. Product visibility at the platform increases the brand awareness of the start-up, captures the customers’ interest and opens new business avenues.
              </p>
            </article>
            <article className="au-card">
              <h3>Services  </h3>
              <p>
                The Unlock Startup's Services Marketplace provides a platform to promote services, business services, solutions, and professional offers by businesses, companies, agencies, consultants and professional firms to an ever-expanding entrepreneurial, business and innovation focused community. 
              </p>
                <ul>
                <li>A service listing is submitted by a business, and Unlock Startup verifies the service to assure it is legitimate and professional before it is published. All submitted and verified services are then discoverable to registered users in the network. Startups and companies sign up, log in to their account, view listed services, and inquire or partner directly with service providers.</li>
                <li>Services are typically sold through monthly or yearly subscriptions or by direct contract payment to a third-party provider. A business can list services and gain new clients, expand their reach within the market, achieve greater brand exposure and visibility, generate qualified leads, and discover new revenue opportunities.</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="au-section" id="values">
        <div className="au-container">
          <div className="au-section-head">
            <div className="au-section-label">Our values</div>
            <div>
              <h2>Connecting Visionaries with Opportunities.</h2>
              <p className="au-section-copy">
                At Unlock Startup, we are convinced that all important inventions start with a revolutionary idea. It is our goal to link Entrepreneurs, Innovators, Startups, Businesses, Investors, Professionals to resources so that they can convert ideas into business realities.
              </p>
            </div>
          </div>

          <div className="au-values-grid">
            <article className="au-card">
              <h3>Innovation </h3>
              <p>
                We encourage creativity, new ideas, and forward-thinking solutions that drive business growth and industry transformation.
              </p>
            </article>
            <article className="au-card">
              <h3>Collaboration</h3>
              <p>
                We develop a cohesive network that enables startups, investors, professionals, and corporations to communicate, assist, and thrive collectively.
              </p>
            </article>
            <article className="au-card">
              <h3>Empowerment</h3>
              <p>
                We make efforts to empower ventures and entrepreneurs by giving them the tools, information and associations essential for achievements.
              </p>
            </article>
            <article className="au-card">
              <h3>Growth & Sustainability</h3>
              <p>
               We aim to deliver enduring worth and sustainable progress for startups, companies and the entrepreneurship landscape.
              </p>
            </article>
          </div>
        </div>
      </section>

      <JobCta />
    </main>
  );
};

export default Page;