import Hero from "@/components/home/hero/Hero";
import HowItWorks from "@/components/home/howItWorks/HowItWorks";
import UpcomingEvents from "@/components/home/upcomingEvents/UpcomingEvents";
import JobListing from "@/components/home/jobListing/JobListing";
import TopInvestor from "@/components/home/topInvestor/TopInvestor";
import ProductLaunches from "@/components/home/productLaunches/ProductLaunches";
import ServiceProvider from "@/components/home/serviceProvider/ServiceProvider";
import Testimonial from "@/components/home/testimonial/Testimonial";
import Blogs from "@/components/home/blogs/Blogs";
import JobCta from "@/components/home/jobCta/JobCta";
import UpcomingFundingCalls from "@/components/home/upcomingCompetitions/UpcomingFundingCalls";
import PlatformOverview from "@/components/home/platformOverview/PlatformOverview";
import HomeFaq from "@/components/home/homeFaq/HomeFaq";

const SITE_URL = "https://www.unlockstartup.com/";

const TITLE = "Unlock Startup | Jobs, Investors, Competitions & Events";

export const metadata = {
  title: TITLE,
  description:
    "Discover startup competitions, business events, jobs, investors, funding opportunities, innovative products, and professional services on Unlock Startup, India's startup growth platform.",
  keywords:
    "startup platform India, startup competitions, startup events India, startup jobs, startup investors, funding opportunities, business services, startup networking, entrepreneurs, innovation challenges",
  robots: "index, follow",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "Discover startup opportunities, competitions, events, jobs, investors, innovative products, and business services on Unlock Startup.",
    url: SITE_URL,
    siteName: "Unlock Startup",
    images: ["/unlock-startup.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unlock Startup | Startup Growth Platform",
    description:
      "Explore startup competitions, events, jobs, investors, products, and business services.",
    images: ["/unlock-startup.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: "Unlock Startup",
      url: SITE_URL,
      logo: `${SITE_URL}unlock-startup.png`,
      description:
        "A platform connecting startups, entrepreneurs, investors, job seekers, and businesses through competitions, events, jobs, products, and services.",
      sameAs: [
        "https://www.facebook.com/unlockstartup",
        "https://www.linkedin.com/company/unlock-startup",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: "Unlock Startup",
      publisher: {
        "@id": `${SITE_URL}#organization`,
      },
      inLanguage: "en-IN",
    },
  ],
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <PlatformOverview />
      <UpcomingFundingCalls />
      <UpcomingEvents />
      <JobListing />
      <TopInvestor />
      <ProductLaunches />
      <ServiceProvider />
      <HomeFaq />
      <JobCta />
    </main>
  );
}
