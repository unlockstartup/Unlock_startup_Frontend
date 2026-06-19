"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import FundingCard from "@/components/uiElements/FundingCard";
import api from "@/app/api";
import "@/app/carousel.css"

const UpcomingFundingCalls = () => {
  const [fundings, setFundings]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [cardsPerSlide, setCardsPerSlide] = useState(4);

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
  for (let i = 0; i < fundings.length; i += cardsPerSlide) {
    slides.push(fundings.slice(i, i + cardsPerSlide));
  }

  const showControls = slides.length > 1;

  return (
    <>
      <section className="competition-section-one">
        <div className="container">

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

          {/* Loading / Error */}
          {loading && <div className="text-center py-5"><p>Loading competitions...</p></div>}
          {error   && <div className="text-center py-5"><p className="text-danger">{error}</p></div>}

          {/* Carousel */}
          {!loading && !error && (
            fundings.length === 0 ? (
              <div className="col-12 text-center py-5">
                <p>No active competitions found.</p>
              </div>
            ) : (
              <div className="funding-carousel-wrapper">
                <div
                  id="fundingCarousel"
                  className="carousel slide"
                  data-bs-ride="false"
                  data-bs-wrap="true"
                  data-bs-touch="true"
                >
                  {/* Slides */}
                  <div className="carousel-inner">
                    {slides.map((slideCards, slideIndex) => (
                      <div
                        key={slideIndex}
                        className={`carousel-item ${slideIndex === 0 ? "active" : ""}`}
                      >
                        <div className="row g-3">
                          {slideCards.map((funding, index) => (
                            <div
                              key={funding.slug}
                              className={`col-${12 / cardsPerSlide}`}
                            >
                              <FundingCard funding={funding} index={index} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Indicators — below slides */}
                  {showControls && (
                    <div className="carousel-indicators">
                      {slides.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          data-bs-target="#fundingCarousel"
                          data-bs-slide-to={i}
                          className={i === 0 ? "active" : ""}
                          aria-label={`Slide ${i + 1}`}
                          aria-current={i === 0 ? "true" : undefined}
                        />
                      ))}
                    </div>
                  )}

                  {/* Arrows */}
                  {showControls && (
                    <>
                      <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#fundingCarousel"
                        data-bs-slide="prev"
                      >
                        <span className="carousel-control-prev-icon" aria-hidden="true" />
                        <span className="visually-hidden">Previous</span>
                      </button>
                      <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#fundingCarousel"
                        data-bs-slide="next"
                      >
                        <span className="carousel-control-next-icon" aria-hidden="true" />
                        <span className="visually-hidden">Next</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
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