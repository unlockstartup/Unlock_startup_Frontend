"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import ProductLaunchCard from "@/components/uiElements/ProductLaunchCard";
import api from "@/app/api";

const ProductLaunches = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [current, setCurrent]   = useState(0);
  const trackRef                = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/publisher/innovation-products/sorted");
        setProducts(res.data?.products || res.data?.items || []);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // total items = products + 1 promo card
  const totalItems = products.length + 1;

  // Sync dot indicator with native scroll position
  useEffect(() => {
    const track = trackRef.current;
    if (!track || totalItems === 0) return;

    const onScroll = () => {
      const firstCard = track.children[0];
      if (!firstCard) return;
      const cardWidth = firstCard.getBoundingClientRect().width + 16; // +gap
      const idx = Math.round(track.scrollLeft / cardWidth);
      setCurrent(Math.max(0, Math.min(idx, totalItems - 1)));
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [totalItems]);

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
        .products-track {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .products-track::-webkit-scrollbar {
          display: none;
        }

        .product-card-wrap {
          /* 4 cards on large screens */
          flex: 0 0 calc(25% - 12px);
          scroll-snap-align: start;
          min-width: 0;
        }

        /* 3 cards */
        @media (max-width: 1024px) {
          .product-card-wrap {
            flex: 0 0 calc(33.333% - 11px);
          }
        }

        /* 2 cards */
        @media (max-width: 768px) {
          .product-card-wrap {
            flex: 0 0 calc(50% - 8px);
          }
        }

        /* 1 card */
        @media (max-width: 480px) {
          .product-card-wrap {
            flex: 0 0 100%;
          }
        }
      `}</style>

      <section className="product-section pt-120 xl-pt-100 md-pt-60 pb-130 xl-pb-100 lg-pb-100 mt-110 xl-mt-90 md-mt-50">
        <div className="container position-relative">

          {/* Header */}
          <div className="row justify-content-between align-items-center mt-50 mb-20">
            <div className="col-md-6">
              <div className="title-one mb-30 lg-mb-10">
                <h2 className="fw-semibold fs-1 fs-lg-3 fs-md-4 fs-sm-5">
                  Unlock Latest Products
                </h2>
              </div>
            </div>
            <div className="col-md-5">
              <div className="d-flex justify-content-md-end">
                <Link href="/products" className="btn-six d-none d-md-inline-block">
                  Explore all
                </Link>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-4 text-muted">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-4 text-muted">
              No product launches available.
            </div>
          ) : (
            <>
              {/* Carousel track — CSS handles all sizing & snap */}
              <div ref={trackRef} className="products-track">
                {products.map((product, index) => (
                  <div key={product._id || index} className="product-card-wrap">
                    <ProductLaunchCard product={product} index={index} />
                  </div>
                ))}

                {/* Static promo card — always last */}
                <div className="product-card-wrap">
                  <div
                    className="card-style-four bg-color tran3s w-100 wow fadeInUp"
                    style={{ height: "100%" }}
                  >
                    <Link
                      href="/products"
                      className="d-flex flex-column justify-content-between h-100"
                    >
                      <div className="title text-white">13k+</div>
                      <div className="text-lg text-white">
                        Products launched by founders on Unlock Startup
                      </div>
                      <div className="d-flex align-items-center justify-content-end lg-mt-120 xs-mt-60 mb-30">
                        <img
                          src="/assets/images/shape/shape_22.svg"
                          data-src="/assets/images/shape/shape_22.svg"
                          alt=""
                          className="lazy-img"
                        />
                        <div className="icon tran3s d-flex align-items-center justify-content-center ms-5">
                          <img
                            src="/assets/images/icon/icon_19.svg"
                            data-src="/assets/images/icon/icon_19.svg"
                            alt=""
                            className="lazy-img"
                          />
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Dot indicators */}
              {totalItems > 1 && (
                <div className="d-flex justify-content-center gap-2 mt-4">
                  {Array.from({ length: totalItems }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToIndex(i)}
                      aria-label={`Go to item ${i + 1}`}
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
                <Link href="/products" className="btn-six">
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

export default ProductLaunches;