"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import FundingCard from "@/components/uiElements/FundingCard";
import api from "@/app/api";

const UpcomingFundingCalls = () => {
  const [fundings, setFundings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [current, setCurrent]   = useState(0);
  const trackRef                = useRef(null);
const [needsScroll, setNeedsScroll] = useState(false);
const [cardsPerView, setCardsPerView] = useState(4);

  useEffect(() => {
    const fetchFundings = async () => {
      try {
        const response = await api.get("/api/publisher/funding-calls/all");
        const items = response.data?.fundings ?? [];

        const mapped = items.filter(Boolean).map((item) => ({
          slug:                    item._id,
          title:                   item.title ?? "",
          description:             item.description ?? "",
          organizingCompany:       item.organizingCompany ?? "",
          organizerType:           item.organizerType ?? "",
          contactPersonName:       item.contactPersonName ?? "",
          officialEmail:           item.officialEmail ?? "",
          contactPhone:            item.contactPhone ?? "",
          publisherName:           item.publisherId?.organizationName ?? "",
          challengeType:           item.challengeType ?? "",
          challengeCategory:       item.challengeCategory ?? "",
          challengeObjective:      item.challengeObjective ?? "",
          startupStage:            item.startupStage ?? "",
          geographicRestrictions:  item.geographicRestrictions ?? "",
          launchDate:              item.launchDate ?? null,
          submissionDeadline:      item.submissionDeadline ?? null,
          resultDate:              item.resultDate ?? null,
          keyFocusAreas:           item.keyFocusAreas ?? "",
          eligibleParticipants:    item.eligibleParticipants ?? "",
          eligibilityVerification: item.eligibilityVerification ?? [],
          additionalRewards:       item.additionalRewards ?? [],
          applicationFee:          item.applicationFee ?? 0,
          registrationLink:        item.registrationLink ?? "",
          attachments:             item.attachments ?? [],
          location:                item.location ?? "",
        }));

        setFundings(mapped);
      } catch (err) {
        console.error("Failed to fetch funding calls:", err);
        setError("Failed to load funding calls.");
      } finally {
        setLoading(false);
      }
    };

    fetchFundings();
  }, []);


useEffect(() => {
  const track = trackRef.current;
  if (!track || fundings.length === 0) return;

  const checkOverflow = () => {
    const firstCard = track.children[0];
    if (!firstCard) return;
    const cardWidth = firstCard.getBoundingClientRect().width + 16; // +gap
    const visible = Math.max(1, Math.round(track.clientWidth / cardWidth));
    setCardsPerView(visible);
    setNeedsScroll(track.scrollWidth > track.clientWidth + 1);
  };

  checkOverflow();
  const ro = new ResizeObserver(checkOverflow);
  ro.observe(track);
  return () => ro.disconnect();
}, [fundings]);

const totalPages = Math.ceil(fundings.length / cardsPerView);
const currentPage = Math.floor(current / cardsPerView);

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
        .fundings-track {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .fundings-track::-webkit-scrollbar {
          display: none;
        }

        .funding-card-wrap {
          /* 4 cards on large screens */
          flex: 0 0 calc(25% - 12px);
          scroll-snap-align: start;
          min-width: 0;
        }

        /* 3 cards */
        @media (max-width: 1024px) {
          .funding-card-wrap {
            flex: 0 0 calc(33.333% - 11px);
          }
        }

        /* 2 cards */
        @media (max-width: 768px) {
          .funding-card-wrap {
            flex: 0 0 calc(50% - 8px);
          }
        }

        /* 1 card */
        @media (max-width: 480px) {
          .funding-card-wrap {
            flex: 0 0 100%;
          }
        }
      `}</style>

      <section className="competition-section-one">
        <div className="container position-relative">

          {/* Header */}
          <div className="row align-items-center mt-50 mb-20">
            <div className="col-md-7">
              <div className="title-one mb-30 lg-mb-10">
                <h2 className="fw-semibold fs-1 fs-lg-3 fs-md-4 fs-sm-5">
                  Unlock Competitions
                </h2>
              </div>
            </div>
            <div className="col-md-5 d-none d-md-block">
              <div className="text-end explore-btn sm-mt-50">
                <Link href="/competitions" className="btn-six">
                  Explore More
                </Link>
              </div>
            </div>
          </div>

          {/* States */}
          {loading && (
            <div className="text-center py-5">
              <p>Loading competitions...</p>
            </div>
          )}
          {error && (
            <div className="text-center py-5">
              <p className="text-danger">{error}</p>
            </div>
          )}

          {/* Carousel */}
          {!loading && !error && (
            <>
              {fundings.length === 0 ? (
                <div className="col-12 text-center py-5">
                  <p>No active competitions found.</p>
                </div>
              ) : (
                <>
                  {/* Carousel track — CSS handles all sizing & snap */}
                  <div ref={trackRef} className="fundings-track">
                    {fundings.map((funding, index) => (
                      <div key={funding.slug} className="funding-card-wrap">
                        <FundingCard funding={funding} index={index} />
                      </div>
                    ))}
                  </div>

                  {/* Dot indicators */}
{needsScroll && (
  <div className="d-flex justify-content-center gap-2 mt-4">
    {Array.from({ length: totalPages }).map((_, i) => (
      <button
        key={i}
        onClick={() => scrollToIndex(i * cardsPerView)} // scroll to first card of that page
        aria-label={`Go to page ${i + 1}`}
        style={{
          width:        i === currentPage ? "20px" : "7px",
          height:       "7px",
          borderRadius: i === currentPage ? "4px" : "50%",
          background:   i === currentPage ? "#6c5ce7" : "#ccc",
          border:       "none",
          padding:      0,
          cursor:       "pointer",
          transition:   "all 0.2s",
        }}
      />
    ))}
  </div>
)}
                </>
              )}
            </>
          )}

          {/* Mobile explore link */}
          <div className="row d-md-none mt-4">
            <div className="col-12">
              <div className="text-center explore-btn">
                <Link href="/competitions" className="btn-six">
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

export default UpcomingFundingCalls;