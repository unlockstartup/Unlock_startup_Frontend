// all jobs of a company
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import JobListingCard from "@/components/uiElements/JobListingCard";
import api from "@/app/api";

const AllJobPage = () => {
  const { companyId } = useParams();
  const [jobs, setJobs] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [companyLogo, setCompanyLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    if (!companyId) return;
    (async () => {
      try {
        setLoading(true);
        // Adjust the endpoint to whatever your API exposes
        const res = await api.get(`/api/publisher/jobs/sorted`);
        const allJobs = res.data?.items || res.data?.jobs || [];

        // Filter client-side by companyId or companyName slug
        const matched = allJobs.filter(
          (j) =>
            j.companyId === companyId ||
            encodeURIComponent(j.companyName || "") === companyId
        );

        setJobs(matched);

        // Grab meta from the first match
        if (matched.length > 0) {
          setCompanyName(matched[0].companyName || "");
          setCompanyLogo(matched[0].companyLogo?.url || null);
        }
      } catch (err) {
        console.error("Failed to load company jobs", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [companyId]);

  const sorted = [...jobs].sort((a, b) =>
    sortBy === "salary"
      ? (b.salaryMax || 0) - (a.salaryMax || 0)
      : new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <main>
      <section className="job-section pt-100 lg-pt-80 pb-100 lg-pb-80 mt-30">
        <div className="container">
          {/* Back + Sort bar */}
          <div className="d-flex justify-content-between align-items-center mt-20">
            <Link href="/jobs" className="backLink">
              <ArrowLeft size={14} strokeWidth={2} />
              Back to all jobs
            </Link>
              <p className="companyJobsSubtitle">
                {loading
                  ? "Loading…"
                  : `${jobs.length} open position${jobs.length !== 1 ? "s" : ""}`}
              </p>
            <div className="d-flex align-items-center gap-2">
              <span className="text-dark fw-500" style={{ fontSize: 13 }}>Sort:</span>
              <select
                className="form-select form-select-sm"
                style={{ width: "auto" }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="latest">Latest</option>
                <option value="salary">Salary</option>
              </select>
            </div>
          </div>

          {/* Job listings */}
          {loading ? (
            <div className="text-center py-4 text-muted">Loading jobs…</div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <Building2 size={40} strokeWidth={1} className="mb-3 opacity-50" />
              <p>No open positions found for this company.</p>
              <Link href="/jobs" className="btn btn-outline-primary mt-2">
                Browse all jobs
              </Link>
            </div>
          ) : (
            sorted.map((job) => (
              <JobListingCard key={job._id} job={job} />
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default AllJobPage;