import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import JobCta from "@/components/home/jobCta/JobCta";
import './aboutus.css';

const Page = () => {
  return (
    <main>
      <section className="au-hero mt-80" id="top">
        <div className="au-container au-hero-grid">
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
        </div>
      </section>

      {/* Overview Section */}
      <section className="au-section" id="overview">
        <div className="au-container">
          <div className="au-section-head">
            <div className="au-section-label">Company overview</div>
            <div>
              <h2>Event management with proven startup growth impact.</h2>
              <p className="au-section-copy">
                We operate at the intersection of strategic event planning and business acceleration. Our role is not simply to host events — it is to create powerful experiences that position startups for rapid growth, attract investors, and convert attendees into loyal customers and partners.
              </p>
            </div>
          </div>

          <div className="au-overview-grid">
            <article className="au-card">
              <h3>Who we are</h3>
              <p>
                We are a specialized team of event strategists, producers, and growth experts dedicated to helping startups scale faster through high-ROI events that deliver real business outcomes.
              </p>
            </article>
            <article className="au-card">
              <h3>What we do</h3>
              <p>
                From intimate founder dinners to large-scale industry summits, we deliver end-to-end startup event planning that aligns perfectly with your growth objectives and brand story.
              </p>
            </article>
            <article className="au-card">
              <h3>How we work</h3>
              <p>
                Our process is data-driven, founder-centric, and results-oriented — moving from goal-setting to flawless execution with speed, precision, and measurable business impact.
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
              <h2>Built for startups shaping the future of business.</h2>
              <p className="au-section-copy">
                Our long-term ambition is to become the leading event management partner for high-growth startups worldwide. We create experiences that don't just impress — they deliver funding, customers, and momentum that propel businesses forward.
              </p>
            </div>
          </div>

          <div className="au-mission-vision">
            <article className="au-statement">
              <span>Our mission</span>
              <p>
                To deliver exceptional startup event management that transforms business vision into high-impact experiences, generating measurable growth, investor interest, and market leadership.
              </p>
            </article>
            <article className="au-statement">
              <span>Our vision</span>
              <p>
                To set the global standard for strategic event planning that empowers every startup to scale faster, connect deeper, and achieve sustainable business success.
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
              <h2>Comprehensive event management for startup growth.</h2>
              <p className="au-section-copy">
                Our services are designed to support startups at every stage — from early validation to hyper-growth. We deliver integrated event experiences that ensure maximum visibility, networking, and ROI.
              </p>
            </div>
          </div>

          <div className="au-service-grid">
            <article className="au-card">
              <h3>Startup Launch Events</h3>
              <p>
                We orchestrate unforgettable product launches and go-to-market events that create buzz, attract media, and drive immediate customer acquisition.
              </p>
              <ul>
                <li>Product launch strategy, venue selection, and full production.</li>
                <li>Media outreach, influencer partnerships, and post-event growth campaigns.</li>
              </ul>
            </article>
            <article className="au-card">
              <h3>Investor &amp; Networking Events</h3>
              <p>
                Premium pitch nights, demo days, and exclusive investor summits engineered to help startups secure funding and build strategic relationships.
              </p>
              <ul>
                <li>Investor matchmaking, pitch deck alignment, and venue transformation.</li>
                <li>Seamless AV, live streaming, and follow-up lead nurturing systems.</li>
              </ul>
            </article>
            <article className="au-card">
              <h3>Industry Conference &amp; Summit Production</h3>
              <p>
                We produce large-scale startup conferences and thought-leadership summits that position your brand as an industry leader and generate high-quality leads.
              </p>
              <ul>
                <li>End-to-end planning, speaker curation, and sponsor activation.</li>
                <li>Hybrid &amp; virtual event technology for maximum reach and engagement.</li>
              </ul>
            </article>
            <article className="au-card">
              <h3>Ongoing Growth Event Partnership</h3>
              <p>
                We become your embedded event management partner — delivering a steady pipeline of strategic events that fuel continuous business expansion.
              </p>
              <ul>
                <li>Retainer-based event strategy and quarterly growth activations.</li>
                <li>Scalable event systems, brand consistency, and performance tracking.</li>
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
              <h2>The principles behind every startup success story.</h2>
              <p className="au-section-copy">
                Our values define how we plan, execute, and measure events. They are the foundation of long-term client partnerships and the reason our events consistently deliver exceptional business growth.
              </p>
            </div>
          </div>

          <div className="au-values-grid">
            <article className="au-card">
              <h3>Results-Driven</h3>
              <p>
                Every event is designed with clear KPIs — leads generated, funding secured, partnerships formed — ensuring measurable ROI for your startup.
              </p>
            </article>
            <article className="au-card">
              <h3>Founder-First</h3>
              <p>
                We listen deeply, move fast, and tailor every experience to your unique vision, timeline, and growth objectives.
              </p>
            </article>
            <article className="au-card">
              <h3>Innovation</h3>
              <p>
                We embrace cutting-edge event technology, immersive formats, and creative storytelling to make your brand unforgettable.
              </p>
            </article>
            <article className="au-card">
              <h3>Scalable Excellence</h3>
              <p>
                From intimate dinners to global summits, we deliver flawless execution that scales with your business ambitions across any market.
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