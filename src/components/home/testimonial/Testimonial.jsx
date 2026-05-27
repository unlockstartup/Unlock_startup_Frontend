"use client";

import testimonialData from "@/data/testimonialData";
import TestimonialCard from "@/components/uiElements/TestimonialCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const Testimonial = () => {
  return (
    <section className="feedback-section-two position-relative pt-65 lg-pt-20 mt-80 xl-mt-150 md-mt-30">
      <div className="container position-relative">
        <div className="row">
          <div className="col-lg-4">
            <div className="title-one mt-50">
              <div className="sub-title">TESTIMONIAL</div>
              <h2 className="fw-600">Clients loves Unlock Startup.</h2>
            </div>
            <div className="fw-500 rating-title mt-80 lg-mt-40 mb-5">
              A+ Rating
            </div>
            <p>Avg rating 4.8 makes us best market place.</p>
          </div>

          <div className="col-lg-8 ms-auto">
            <div className="testimonial-slider-parent slider-wrapper">
              <Swiper
                modules={[Pagination]}
                spaceBetween={30}
                slidesPerView={2}
                pagination={{ clickable: true }}
                loop
                breakpoints={{
                  320: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  992: { slidesPerView: 2 },
                  1200: { slidesPerView: 3 },
                }}
                className="feedback-slider-two"
              >
                {testimonialData.map((item) => (
                  <SwiperSlide key={item.id}>
                    <TestimonialCard item={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
