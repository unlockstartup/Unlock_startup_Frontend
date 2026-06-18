"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  useEffect(() => {
    const WOW = require("wowjs");
    const wow = new WOW.WOW({ live: false });
    wow.init();
  }, []);

  return (
    <div className="hero-banner-two position-relative" style={{ overflow: "hidden" }}>
      
      {/* Background Image */}
      <Image
        src="/assets/images/assets/latest_banner.png"
        alt="Hero Background"
        fill
        style={{ objectFit: "fill", objectPosition: "center", zIndex: 0 }}
        className="lazy-img"
        priority
      />

      {/* Content sits on top */}
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="position-relative pt-225 xl-pt-200 lg-pt-150 pb-80 lg-pb-60">
          <div className="row">
            <div className="col-lg-6 col-md-8">
              <h1 className="main-title wow fadeInUp" data-wow-delay="0.1s">
                Unleashing Ideas, Empowering Entrepreneurs, Shaping Tomorrow's Success.
              </h1>

            </div>
          </div>

          <div className="position-relative">
            <div className="row">
              <div className="col-lg-6 col-md-8">
                <div
                  className="job-search-two position-relative me-xxl-5 wow fadeInUp"
                  data-wow-delay="0.3s"
                >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Box */}
      <div className="rating-box position-relative" style={{ zIndex: 1 }}>
        <div className="d-sm-flex justify-content-end">
          <div className="me-sm-5 pe-xxl-4">
            <div className="d-flex align-items-center"></div>
          </div>
          <div>
          </div>
        </div>
      </div>
    </div>
  );
}