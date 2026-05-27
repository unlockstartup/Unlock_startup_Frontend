"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import JobListingCard from "@/components/uiElements/JobListingCard";
import api from "@/app/api";

export default function HowItWorks() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/publisher/jobs/sorted");
        setJobs(res.data?.items || res.data?.jobs || []);
      } catch (err) {
        console.error("Failed to load jobs", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="how-it-works-two position-relative pt-130 xl-pt-110 mt-50">
      <div className="container">
        <div className="row align-items-center mt-0 mb-20">
          <div className="col-md-7">
            <div className="title-one mb-30 lg-mb-10">
              <h2 className="fw-semibold fs-1 fs-lg-3 fs-md-4 fs-sm-5">
                Unlock New Jobs
              </h2>
            </div>
          </div>
          <div className="col-md-5 d-none d-md-block">
            <div className="text-end explore-btn sm-mt-50">
              <Link href="/jobs" className="btn-six">Explore All Jobs</Link>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {loading ? (
              <div className="text-center py-4 text-muted">Loading jobs...</div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-4 text-muted">No job listings available.</div>
            ) : (
              jobs.slice(0, 5).map((job) => (
                <JobListingCard
                  key={job._id}
                  job={job}
                />
              ))
            )}
          </div>
        </div>

        <div className="row d-md-none">
          <div className="col-12">
            <div className="text-center explore-btn sm-mt-50">
              <Link href="/jobs" className="btn-six">Explore More</Link>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="text-center mt-50 wow fadeInUp">
              <div className="btn-eight fw-500">
                Do you want to post a job for your company?{" "}
                <span>We can help.</span> <a href="/signup">Click here</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}