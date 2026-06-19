"use client";
import { useEffect, useState } from "react";
import InvestorCard from "@/components/uiElements/InvestorCard";
import Link from "next/link";
import api from "@/app/api";
import "@/app/carousel.css"

const TopInvestor = () => {
  const [investors, setInvestors]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [cardsPerSlide, setCardsPerSlide] = useState(4);

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
  for (let i = 0; i < investors.length; i += cardsPerSlide) {
    slides.push(investors.slice(i, i + cardsPerSlide));
  }

  const showControls = slides.length > 1;

  return (
    <>
      <section className="expert-section-one position-relative mt-80 xl-mt-150 md-mt-100">
        <div className="container">
          <div className="row justify-content-between align-items-center mt-50 mb-20">
            <div className="col-md-6">
              <div className="title-one">
                <h2 className="fw-semibold fs-1 fs-lg-3 fs-md-4 fs-sm-5">Unlock Investors</h2>
              </div>
            </div>
            <div className="col-md-5">
              <div className="d-flex justify-content-md-end">
                <Link href="/investors" className="btn-six d-none d-md-inline-block">Explore all</Link>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-4 text-muted">Loading investors...</div>
          ) : investors.length === 0 ? (
            <div className="text-center py-4 text-muted">No investors available.</div>
          ) : (
            <div className="investors-carousel-wrapper">
              <div
                id="investorsCarousel"
                className="carousel slide"
                data-bs-ride="false"
                data-bs-wrap="true"
                data-bs-touch="true"
              >
                <div className="carousel-inner">
                  {slides.map((slideCards, slideIndex) => (
                    <div key={slideIndex} className={`carousel-item ${slideIndex === 0 ? "active" : ""}`}>
                      <div className="row g-3">
                        {slideCards.map((investor) => (
                          <div key={investor._id} className={`col-${12 / cardsPerSlide}`}>
                            <InvestorCard investor={investor} />
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
                        data-bs-target="#investorsCarousel"
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
                    <button className="carousel-control-prev" type="button" data-bs-target="#investorsCarousel" data-bs-slide="prev">
                      <span className="carousel-control-prev-icon" aria-hidden="true" />
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#investorsCarousel" data-bs-slide="next">
                      <span className="carousel-control-next-icon" aria-hidden="true" />
                      <span className="visually-hidden">Next</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="text-center mt-40 d-md-none">
            <Link href="/investors" className="btn-six">Explore all</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default TopInvestor;