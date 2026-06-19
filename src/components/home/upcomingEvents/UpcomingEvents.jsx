"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import EventCard from "@/components/uiElements/EventCard";
import api from "@/app/api";
import "@/app/carousel.css"

const UpcomingEvents = () => {
  const [events, setEvents]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [cardsPerSlide, setCardsPerSlide] = useState(4);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/api/publisher/dashboard/getapprovedevents");
        const items = response.data?.items ?? [];
        const mapped = items.map((event) => ({
          id:                event._id,
          slug:              event._id,
          image:             event.mainImage?.url ?? "/placeholder.jpg",
          title:             event.title,
          startDateTime:     event.startDateTime ?? null,
          endDateTime:       event.endDateTime ?? null,
          location:          event.venueName
                               ? `${event.venueName}, ${event.fullAddress}`
                               : event.fullAddress ?? "TBA",
          category:          event.eventCategory ? [event.eventCategory] : [],
          registrationPrice: event.registrationPrice,
          registrationType:  event.registrationType,
          publisherName:     event.publisherId?.organizationName ?? "",
          targetAudience:    event.targetAudience ?? [],
          eventFormat:       event.eventFormat ?? "in-person",
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

  useEffect(() => {
    const update = () => {
      if (window.matchMedia("(max-width: 480px)").matches)       setCardsPerSlide(1);
      else if (window.matchMedia("(max-width: 768px)").matches)  setCardsPerSlide(2);
      else if (window.matchMedia("(max-width: 1024px)").matches) setCardsPerSlide(3);
      else                                                        setCardsPerSlide(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const slides = [];
  for (let i = 0; i < events.length; i += cardsPerSlide) {
    slides.push(events.slice(i, i + cardsPerSlide));
  }

  const showControls = slides.length > 1;

  return (
    <>
      <section className="event-section-one">
        <div className="container">
          <div className="row align-items-center mt-50 mb-20">
            <div className="col-md-7">
              <div className="title-one mb-30 lg-mb-10">
                <h2 className="fw-semibold fs-1 fs-lg-3 fs-md-4 fs-sm-5">Unlock Events</h2>
              </div>
            </div>
            <div className="col-md-5 d-none d-md-block">
              <div className="text-end explore-btn sm-mt-50">
                <Link href="/events" className="btn-six">Explore More</Link>
              </div>
            </div>
          </div>

          {loading && <div className="text-center py-5"><p>Loading events...</p></div>}
          {error   && <div className="text-center py-5"><p className="text-danger">{error}</p></div>}

          {!loading && !error && (
            events.length === 0 ? (
              <div className="col-12 text-center py-5"><p>No upcoming events found.</p></div>
            ) : (
              <div className="events-carousel-wrapper">
                <div
                  id="eventsCarousel"
                  className="carousel slide"
                  data-bs-ride="false"
                  data-bs-wrap="true"
                  data-bs-touch="true"
                >
                  <div className="carousel-inner">
                    {slides.map((slideCards, slideIndex) => (
                      <div key={slideIndex} className={`carousel-item ${slideIndex === 0 ? "active" : ""}`}>
                        <div className="row g-3">
                          {slideCards.map((event, index) => (
                            <div key={event.id} className={`col-${12 / cardsPerSlide}`}>
                              <EventCard event={event} index={index} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {showControls && (
                    <div className="carousel-indicators">
                      {slides.map((_, i) => (
                        <button
                          key={i} type="button"
                          data-bs-target="#eventsCarousel"
                          data-bs-slide-to={i}
                          className={i === 0 ? "active" : ""}
                          aria-label={`Slide ${i + 1}`}
                          aria-current={i === 0 ? "true" : undefined}
                        />
                      ))}
                    </div>
                  )}

                  {showControls && (
                    <>
                      <button className="carousel-control-prev" type="button" data-bs-target="#eventsCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true" />
                        <span className="visually-hidden">Previous</span>
                      </button>
                      <button className="carousel-control-next" type="button" data-bs-target="#eventsCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true" />
                        <span className="visually-hidden">Next</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          )}

          <div className="row d-md-none mt-4">
            <div className="col-12">
              <div className="text-center explore-btn">
                <Link href="/events" className="btn-six">Explore More</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UpcomingEvents;