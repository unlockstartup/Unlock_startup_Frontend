"use client";
import { useEffect, useState } from "react";
import InvestorCard from "@/components/uiElements/InvestorCard";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import api from "@/app/api";

import "swiper/css";
import "swiper/css/pagination";

const TopInvestor = () => {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <section className="expert-section-one position-relative mt-80 xl-mt-150 md-mt-100">
      <div className="container position-relative">
        <div className="row justify-content-between align-items-center mt-50 mb-20">
          <div className="col-md-6">
            <div className="title-one">
               <h2 className="fw-semibold fs-1 fs-lg-3 fs-md-4 fs-sm-5">
                Unlock Investors
              </h2>
            </div>
          </div>
          <div className="col-md-5">
            <div className="d-flex justify-content-md-end">
              <Link href="/investors" className="btn-six d-none d-md-inline-block">
                Explore all
              </Link>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="investor-slider-parent pt-70 lg-pt-40">
              {loading ? (
                <div className="text-center py-4 text-muted">Loading investors...</div>
              ) : investors.length === 0 ? (
                <div className="text-center py-4 text-muted">No investors available.</div>
              ) : (
                <Swiper
                  modules={[Pagination]}
                  spaceBetween={30}
                  slidesPerView={4}
                  breakpoints={{
                    320: { slidesPerView: 1 },
                    576: { slidesPerView: 2 },
                    992: { slidesPerView: 3 },
                    1200: { slidesPerView: 4 },
                  }}
                  pagination={{ clickable: true }}
                  className="investor-slider"
                >
                  {investors.map((investor) => (
                    <SwiperSlide key={investor._id}>
                      <InvestorCard investor={investor} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-40 d-md-none">
          <a href="/investors" className="btn-six">Explore all</a>
        </div>
      </div>
    </section>
  );
};

export default TopInvestor;