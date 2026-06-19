"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProductLaunchCard from "@/components/uiElements/ProductLaunchCard";
import api from "@/app/api";

const ProductLaunches = () => {
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [cardsPerSlide, setCardsPerSlide] = useState(4);

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
  for (let i = 0; i < products.length; i += cardsPerSlide) {
    slides.push(products.slice(i, i + cardsPerSlide));
  }

  const showControls = slides.length > 1;

  return (
    <>
      <section className="product-section pt-120 xl-pt-100 md-pt-60 pb-130 xl-pb-100 lg-pb-100 mt-110 xl-mt-90 md-mt-50">
        <div className="container">
          <div className="row justify-content-between align-items-center mt-50 mb-20">
            <div className="col-md-6">
              <div className="title-one mb-30 lg-mb-10">
                <h2 className="fw-semibold fs-1 fs-lg-3 fs-md-4 fs-sm-5">Unlock Latest Products</h2>
              </div>
            </div>
            <div className="col-md-5">
              <div className="d-flex justify-content-md-end">
                <Link href="/products" className="btn-six d-none d-md-inline-block">Explore all</Link>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-4 text-muted">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-4 text-muted">No product launches available.</div>
          ) : (
            <div className="products-carousel-wrapper">
              <div
                id="productsCarousel"
                className="carousel slide"
                data-bs-ride="false"
                data-bs-wrap="true"
                data-bs-touch="true"
              >
                <div className="carousel-inner">
                  {slides.map((slideCards, slideIndex) => (
                    <div key={slideIndex} className={`carousel-item ${slideIndex === 0 ? "active" : ""}`}>
                      <div className="row g-3">
                        {slideCards.map((product, index) => (
                          <div key={product._id || index} className={`col-${12 / cardsPerSlide}`}>
                            <ProductLaunchCard product={product} index={index} />
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
                        data-bs-target="#productsCarousel"
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
                    <button className="carousel-control-prev" type="button" data-bs-target="#productsCarousel" data-bs-slide="prev">
                      <span className="carousel-control-prev-icon" aria-hidden="true" />
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#productsCarousel" data-bs-slide="next">
                      <span className="carousel-control-next-icon" aria-hidden="true" />
                      <span className="visually-hidden">Next</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="text-center mt-40 d-md-none">
            <Link href="/products" className="btn-six">Explore all</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductLaunches;