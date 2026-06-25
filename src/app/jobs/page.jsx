"use client";

import { useEffect, useState, useMemo } from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import JobListingCard from "@/components/uiElements/JobListingCard";
import SidebarFilter from "@/components/uiElements/SidebarFilter";
import api from "@/app/api";

const PER_PAGE = 3;

const JobListPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters, sortBy]);

  const filtered = useMemo(() => {
    let list = [...jobs];
    const { search, jobType, workMode, experienceLevel, location, jobCategory } = activeFilters;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (j) =>
          j.title?.toLowerCase().includes(q) ||
          j.companyName?.toLowerCase().includes(q) ||
          j.description?.toLowerCase().includes(q)
      );
    }
    if (jobType?.length)
      list = list.filter((j) => jobType.includes(j.jobType));
    if (workMode?.length)
      list = list.filter((j) => workMode.includes(j.workMode));
    if (jobCategory?.length)
      list = list.filter((j) => jobCategory.includes(j.jobCategory));
    if (experienceLevel && experienceLevel !== "All")
      list = list.filter((j) => j.experienceLevel === experienceLevel);
    if (location && location !== "All") {
      list = list.filter((j) => {
        const jLoc =
          j.location ||
          j.officeLocation ||
          (j.jobLocationCity && j.jobLocationState
            ? `${j.jobLocationCity}, ${j.jobLocationState}`
            : null);
        return jLoc === location;
      });
    }

if (sortBy === "oldest")
  list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));  // ascending
else
  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));  // latest 

    return list;
  }, [jobs, activeFilters, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <main>
      <section className="job-section pt-100 lg-pt-80 pb-100 lg-pb-80">
        <div className="container mt-30">
          <Breadcrumb title="Jobs" />
          <div className="row g-4 mt-10">
            {/* Sidebar */}
            <div className="col-12 col-lg-3">
              <SidebarFilter
                pageType="jobs"
                onFilterChange={setActiveFilters}
                items={jobs}
                searchPlaceholder="Search by keywords…"
              />
            </div>

            {/* Main content */}
            <div className="col-12 col-lg-9">
              {/* Top bar */}
              <div className="d-flex justify-content-between align-items-center mb-25">
                <span className="text-muted" style={{ fontSize: 13 }}>
                  {filtered.length} {filtered.length === 1 ? "job" : "jobs"} found
                </span>
                <div className="d-flex align-items-center gap-2">
                  <span className="text-dark fw-500" style={{ fontSize: 13 }}>Sort:</span>
                  <select
                    className="form-select form-select-sm"
                    style={{ width: "auto" }}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="latest">Latest</option>
                    <option value="oldest"></option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-4 text-muted">Loading jobs...</div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-4 text-muted">No job listings found.</div>
              ) : (
                paginated.map((job) => (
                  <JobListingCard
                    key={job._id}
                    job={job}
                    onApply={(job) => setSelectedJob(job)}
                  />
                ))
              )}

              {/* Pagination */}
              {!loading && filtered.length > PER_PAGE && (
                <nav className="mt-4 d-flex justify-content-center">
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <li
                        key={page}
                        className={`page-item ${currentPage === page ? "active" : ""}`}
                      >
                        <button className="page-link" onClick={() => goToPage(page)}>
                          {page}
                        </button>
                      </li>
                    ))}

                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}

              {/* Results count */}
              {!loading && filtered.length > 0 && (
                <div className="text-center text-muted small mt-2">
                  Showing {(currentPage - 1) * PER_PAGE + 1}–
                  {Math.min(currentPage * PER_PAGE, filtered.length)} of {filtered.length}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default JobListPage;