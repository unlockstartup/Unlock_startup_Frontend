"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import ServiceCard from "@/components/uiElements/ServiceCard";
import Link from "next/link";
import api from "@/app/api";

const ServiceProvider = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [current, setCurrent]   = useState(0);
  const trackRef                = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/publisher/service-listings/all");
        setServices(res.data?.listings || []);
      } catch (err) {
        console.error("Failed to load services", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Sync dot indicator with native scroll position
  useEffect(() => {
    const track = trackRef.current;
    if (!track || services.length === 0) return;

    const onScroll = () => {
      const firstCard = track.children[0];
      if (!firstCard) return;
      const cardWidth = firstCard.getBoundingClientRect().width + 16; // +gap
      const idx = Math.round(track.scrollLeft / cardWidth);
      setCurrent(Math.max(0, Math.min(idx, services.length - 1)));
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [services]);

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
        .services-track {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .services-track::-webkit-scrollbar {
          display: none;
        }

        .service-card-wrap {
          /* 4 cards on large screens */
          flex: 0 0 calc(25% - 12px);
          scroll-snap-align: start;
          min-width: 0;
        }

        /* 3 cards */
        @media (max-width: 1024px) {
          .service-card-wrap {
            flex: 0 0 calc(33.333% - 11px);
          }
        }

        /* 2 cards */
        @media (max-width: 768px) {
          .service-card-wrap {
            flex: 0 0 calc(50% - 8px);
          }
        }

        /* 1 card */
        @media (max-width: 480px) {
          .service-card-wrap {
            flex: 0 0 100%;
          }
        }
      `}</style>

      <section className="service-section pt-80 lg-pt-100">
        <div className="container position-relative">

          {/* Header */}
          <div className="row justify-content-between align-items-center mt-0 mb-20">
            <div className="col-md-6">
              <div className="title-one mb-60 lg-mb-40">
                <h2 className="fw-semibold fs-1 fs-lg-3 fs-md-4 fs-sm-5">
                  Unlock Startup Services
                </h2>
              </div>
            </div>
            <div className="col-md-5">
              <div className="d-flex justify-content-md-end">
                <Link href="/services" className="btn-six d-none d-md-inline-block">
                  Explore all
                </Link>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-4 text-muted">Loading services...</div>
          ) : services.length === 0 ? (
            <div className="text-center py-4 text-muted">No services available.</div>
          ) : (
            <>
              {/* Carousel track — CSS handles all sizing & snap */}
              <div ref={trackRef} className="services-track">
                {services.map((service) => (
                  <div key={service._id} className="service-card-wrap">
                    <ServiceCard service={service} />
                  </div>
                ))}
              </div>

              {/* Dot indicators */}
              {services.length > 1 && (
                <div className="d-flex justify-content-center gap-2 mt-4">
                  {services.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToIndex(i)}
                      aria-label={`Go to service ${i + 1}`}
                      style={{
                        width:        i === current ? "20px" : "7px",
                        height:       "7px",
                        borderRadius: i === current ? "4px" : "50%",
                        background:   i === current ? "#000" : "#ccc",
                        border:       "none",
                        padding:      0,
                        cursor:       "pointer",
                        transition:   "all 0.2s",
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Mobile explore link */}
              <div className="text-center mt-40 d-md-none">
                <Link href="/services" className="btn-six">
                  Explore all
                </Link>
              </div>
            </>
          )}

        </div>
      </section>
    </>
  );
};

export default ServiceProvider;