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

export default function Home() {
  return (
    <main>
      <Hero />
      {/* <HowItWorks /> client said to remove this section */}
      <UpcomingFundingCalls/>
      <UpcomingEvents />
      <JobListing />
      <TopInvestor />
      <ProductLaunches />
      <ServiceProvider />
      <Testimonial />
     
      <JobCta />
    </main>
  );
}
