"use client";

import { useEffect, useState, useMemo } from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import InvestorCard from "@/components/uiElements/InvestorCard";
import SidebarFilter from "@/components/uiElements/SidebarFilter";
import api from "@/app/api";

const PER_PAGE = 9; 

export default function InvestorPage() {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/publisher/investors/all");
        setInvestors(res.data?.investors || res.data?.items || res.data || []);
      } catch (err) {
        console.error("Failed to load investors", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters]);

  const filtered = useMemo(() => {
    let list = [...investors];
    const { search, investorType, investmentStages, focusSector, location } = activeFilters;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (inv) =>
          inv.name?.toLowerCase().includes(q) ||
          inv.firm?.toLowerCase().includes(q) ||
          inv.bio?.toLowerCase().includes(q)
      );
    }
    if (investorType?.length)
      list = list.filter((inv) => investorType.includes(inv.investorType));
    if (investmentStages?.length)
      list = list.filter((inv) =>
        investmentStages.some((s) => inv.investmentStages?.includes(s))
      );
    if (focusSector?.length)
      list = list.filter((inv) =>
        focusSector.some((sec) => inv.focusSector === sec)
      );
    if (location && location !== "All") {
      list = list.filter((inv) => {
        const invLoc =
          inv.location ||
          inv.officeLocation ||
          (inv.jobLocationCity && inv.jobLocationState
            ? `${inv.jobLocationCity}, ${inv.jobLocationState}`
            : null);
        return invLoc === location;
      });
    }

    return list;
  }, [investors, activeFilters]);

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
      <section className="investors-section position-relative pt-100 lg-pt-80 pb-150 lg-pb-80">
        <div className="container mt-30">
          <Breadcrumb title="Investors" />
          <div className="row g-4 mt-10">
            {/* Sidebar */}
            <div className="col-12 col-lg-3">
              <SidebarFilter
                pageType="investors"
                onFilterChange={setActiveFilters}
                items={investors}
                searchPlaceholder="Search investors…"
              />
            </div>

            {/* Main content */}
            <div className="col-12 col-lg-9">
              {/* Top bar */}
              <div className="d-flex justify-content-between align-items-center mb-25">
                <span className="text-muted" style={{ fontSize: 13 }}>
                  {filtered.length} {filtered.length === 1 ? "investor" : "investors"} found
                </span>
              </div>

              {loading ? (
                <div className="text-center py-5 text-muted">Loading investors...</div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-5 text-muted">No investors match your filters.</div>
              ) : (
                <div className="row g-3 g-lg-4">
                  {paginated.map((investor) => (
                    <div className="col-sm-6 col-xl-4" key={investor._id}>
                      <InvestorCard investor={investor} />
                    </div>
                  ))}
                </div>
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
}