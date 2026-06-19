"use client";

import { useEffect, useState, useMemo } from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import EventCard from "@/components/uiElements/EventCard";
import SidebarFilter from "@/components/uiElements/SidebarFilter";
import api from "@/app/api";

const PER_PAGE = 3;

const Page = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get(`/api/publisher/dashboard/getapprovedevents`);
        const mapped = res.data.items.map((item) => ({
          slug:              item._id,
          image:             item.mainImage?.url ?? "",
          title:             item.title ?? "",
          startDateTime:     item.startDateTime ?? null,
          endDateTime:       item.endDateTime ?? null,
          location:          item.venueName
                               ? `${item.venueName}, ${item.fullAddress}`
                               : item.fullAddress ?? "",
          category:          item.eventCategory ? [item.eventCategory] : [],
          registrationPrice: item.registrationPrice ?? null,
          registrationType:  item.registrationType ?? "",
          publisherName:     item.publisherId?.organizationName ?? "",
          targetAudience:    item.targetAudience ?? [],
          eventFormat:       item.eventFormat ?? "in-person",
          eventType:         item.eventType ?? "", 
          state:             item.location
        }));
        setEvents(mapped);
      } catch (err) {
        setError(err?.response?.data?.message ?? "Failed to load events.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters]);

  const filtered = useMemo(() => {
    let list = [...events];
    const { search, eventType, category, registrationType, state } = activeFilters;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.location?.toLowerCase().includes(q) ||
          e.publisherName?.toLowerCase().includes(q)
      );
    }
    if (eventType?.length) {
      list = list.filter((e) =>
        eventType.some(
          (f) => e.eventType?.toLowerCase() === f.toLowerCase()
        )
      );
    }
    if (category?.length)
      list = list.filter((e) =>
        category.some((c) => e.category?.includes(c))
      );
    if (registrationType && registrationType !== "All")
      list = list.filter((e) => e.registrationType === registrationType);
    if (state && state !== "All") {
      list = list.filter((e) => e.state === state);
    }
   list.sort((a, b) => {
      const dateA = a.startDateTime ? new Date(a.startDateTime).getTime() : 0;
      const dateB = b.startDateTime ? new Date(b.startDateTime).getTime() : 0;
      return dateB - dateA;
    });
    return list;
  }, [events, activeFilters]);

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
      <section className="event-section pt-100 lg-pt-80 pb-100 lg-pb-80">
        <div className="container mt-30">
          <Breadcrumb title="Events" />
          <div className="row g-4 mt-10">
            {/* Sidebar */}
            <div className="col-12 col-lg-3 sm-hidden">
             <SidebarFilter
                pageType="events"
                items={events}                 
                onFilterChange={setActiveFilters}
                searchPlaceholder="Search events…"
              />
            </div>

            {/* Main content */}
            <div className="col-12 col-lg-9">
              {loading && (
                <div className="text-center py-80">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-15">Loading events...</p>
                </div>
              )}
              {!loading && error && (
                <div className="text-center py-80">
                  <p className="text-danger">{error}</p>
                </div>
              )}
              {!loading && !error && filtered.length === 0 && (
                <div className="text-center py-80">
                  <p>No events match your filters.</p>
                </div>
              )}
              {!loading && !error && filtered.length > 0 && (
                <>
                  <div className="row g-4">
                    {paginated.map((event, index) => (
                      <div key={event.slug} className="col-12 col-md-6 col-xl-4">
                        <EventCard event={event} index={index} />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {filtered.length > PER_PAGE && (
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
                  <div className="text-center text-muted small mt-2">
                    Showing {(currentPage - 1) * PER_PAGE + 1}–
                    {Math.min(currentPage * PER_PAGE, filtered.length)} of {filtered.length}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;