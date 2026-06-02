"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import EventCard from "@/components/uiElements/EventCard";
import api from "@/app/api";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/api/publisher/dashboard/getapprovedevents");
        const items = response.data?.items ?? [];

        const mapped = items.map((event) => ({
          id: event._id,
          slug: event._id,
          image: event.mainImage?.url ?? "/placeholder.jpg",
          title: event.title,
          startDateTime: event.startDateTime ?? null,
          endDateTime: event.endDateTime ?? null,
          location: event.venueName
            ? `${event.venueName}, ${event.fullAddress}`
            : event.fullAddress ?? "TBA",
          category: event.eventCategory ? [event.eventCategory] : [],
          registrationPrice: event.registrationPrice,
          registrationType: event.registrationType,
          publisherName: event.publisherId?.organizationName ?? "",
          targetAudience: event.targetAudience ?? [],
          eventFormat: event.eventFormat ?? "in-person",
        }));
        setEvents(mapped);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Sync dot indicator with scroll position
  useEffect(() => {
    const track = trackRef.current;
    if (!track || events.length === 0) return;

    const onScroll = () => {
      const firstCard = track.children[0];
      if (!firstCard) return;
      const cardWidth = firstCard.getBoundingClientRect().width + 16; // gap
      const idx = Math.round(track.scrollLeft / cardWidth);
      setCurrent(Math.max(0, Math.min(idx, events.length - 1)));
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [events]);

  const scrollToIndex = useCallback((i) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[i];
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    setCurrent(i);
  }, []);

  return (
    <>
      {/*  Responsive carousel styles  */}
      <style>{`
        .events-track {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          /* hide scrollbar everywhere */
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .events-track::-webkit-scrollbar {
          display: none;
        }

        .event-card-wrap {
          /* 4 cards on large screens */
          flex: 0 0 calc(25% - 12px);
          scroll-snap-align: start;
          min-width: 0;
        }

        /* 3 cards */
        @media (max-width: 1024px) {
          .event-card-wrap {
            flex: 0 0 calc(33.333% - 11px);
          }
        }

        /* 2 cards */
        @media (max-width: 768px) {
          .event-card-wrap {
            flex: 0 0 calc(50% - 8px);
          }
        }

        /* 1 card */
        @media (max-width: 480px) {
          .event-card-wrap {
            flex: 0 0 100%;
          }
        }
      `}</style>

      <section className="event-section-one">
        <div className="container position-relative">
          <div className="row align-items-center mt-50 mb-20">
            <div className="col-md-7">
              <div className="title-one mb-30 lg-mb-10">
                <h2 className="fw-semibold fs-1 fs-lg-3 fs-md-4 fs-sm-5">
                  Unlock Events
                </h2>
              </div>
            </div>
            <div className="col-md-5 d-none d-md-block">
              <div className="text-end explore-btn sm-mt-50">
                <Link href="/events" className="btn-six">
                  Explore More
                </Link>
              </div>
            </div>
          </div>

          {loading && (
            <div className="text-center py-5">
              <p>Loading events...</p>
            </div>
          )}
          {error && (
            <div className="text-center py-5">
              <p className="text-danger">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {events.length === 0 ? (
                <div className="col-12 text-center py-5">
                  <p>No upcoming events found.</p>
                </div>
              ) : (
                <>
                  {/* Carousel track — CSS handles all sizing & snap */}
                  <div ref={trackRef} className="events-track">
                    {events.map((event, index) => (
                      <div key={event.id} className="event-card-wrap">
                        <EventCard event={event} index={index} />
                      </div>
                    ))}
                  </div>

                  {/* Dot indicators */}
                  {events.length > 1 && (
                    <div className="d-flex justify-content-center gap-2 mt-4">
                      {events.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => scrollToIndex(i)}
                          aria-label={`Go to event ${i + 1}`}
                          style={{
                            width: i === current ? "20px" : "7px",
                            height: "7px",
                            borderRadius: i === current ? "4px" : "50%",
                            background: i === current ? "#000" : "#ccc",
                            border: "none",
                            padding: 0,
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}

          <div className="row d-md-none mt-4">
            <div className="col-12">
              <div className="text-center explore-btn">
                <Link href="/events" className="btn-six">
                  Explore More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UpcomingEvents;