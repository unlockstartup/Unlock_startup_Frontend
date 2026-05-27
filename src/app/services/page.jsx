"use client";

import { useEffect, useState, useMemo } from "react";
import ServiceCard from "@/components/uiElements/ServiceCard";
import SidebarFilter from "@/components/uiElements/SidebarFilter";
import api from "@/app/api";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

const PER_PAGE = 3;

const Page = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/publisher/service-listings/all");
        const listings = res.data?.listings || [];
        console.log("service sample:", listings[0]);
        setServices(listings);
      } catch (err) {
        console.error("Failed to load services", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters]);

  const filtered = useMemo(() => {
    let list = [...services];
    const { search, serviceCategory, serviceType, state } = activeFilters;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.serviceTitle?.toLowerCase().includes(q) ||
          s.detailedDescription?.toLowerCase().includes(q) ||
          s.companyName?.toLowerCase().includes(q) ||
          s.brandName?.toLowerCase().includes(q)
      );
    }
    if (serviceCategory?.length)
      list = list.filter((s) => serviceCategory.includes(s.serviceCategory));
    if (serviceType?.length)
      list = list.filter((s) => serviceType.includes(s.serviceType));
    if (state?.length)
      list = list.filter((s) => state.includes(s.serviceArea));

    return list;
  }, [services, activeFilters]);

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
      <section className="service-page pt-100 lg-pt-80 pb-100 lg-pb-80">
        <div className="container mt-30">
          <Breadcrumb title="Services" />
          <div className="row g-4 mt-10">
            {/* Sidebar */}
            <div className="col-12 col-lg-3">
              <SidebarFilter
                pageType="services"
                onFilterChange={setActiveFilters}
                items={services}
                searchPlaceholder="Search services…"
              />
            </div>

            {/* Main content */}
            <div className="col-12 col-lg-9">
              <div className="row g-3 g-lg-4">
                {loading ? (
                  <div className="col-12 text-center py-4 text-muted">Loading...</div>
                ) : filtered.length === 0 ? (
                  <div className="col-12 text-center py-4 text-muted">No services found.</div>
                ) : (
                  paginated.map((service, index) => (
                    <div key={service._id || index} className="col-12 col-md-6 col-xl-4">
                      <ServiceCard service={service} index={index} />
                    </div>
                  ))
                )}
              </div>

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

export default Page;