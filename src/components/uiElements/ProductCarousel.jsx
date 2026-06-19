'use client';

import { useState, useEffect, useRef } from 'react';
import './carousel.css';

const ProductCarousel = ({ images, productName }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef(null);
  const autoPlayRef = useRef(null);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setIsAutoPlaying(false);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
  };

  useEffect(() => {
    if (isAutoPlaying && images.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }, 4000);
    }
    return () => clearInterval(autoPlayRef.current);
  }, [isAutoPlaying, images.length]);

  // Pause on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  if (!images || images.length === 0) {
    return (
      <div className="carouselFallback">
        <span>{productName?.charAt(0).toUpperCase()}</span>
      </div>
    );
  }

  return (
    <div 
      className="carouselContainer"
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="carousel">
        {images.map((image, index) => {
          const offset = index - activeIndex;
          const absOffset = Math.abs(offset);
          const isVisible = absOffset <= 2; // Only render visible cards for performance
          
          if (!isVisible) return null;

          return (
            <div
              key={index}
              className={`${"card"} ${absOffset === 0 ? "active" : ''}`}
              style={{
                '--offset': offset,
                '--abs-offset': absOffset,
              }}
              onClick={() => goToSlide(index)}
            >
              <div className="cardInner">
                <img 
                  src={image.url || image} 
                  alt={`${productName} - ${index + 1}`}
                  className="image"
                  loading="lazy"
                  style={{objectFit: "fill"}}
                />
                {absOffset === 0 && (
                  <div className="imageOverlay" />
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Controls */}
      {images.length > 1 && (
        <>
          <button 
            className={`${"control"} ${"prev"}`} 
            onClick={handlePrev}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button 
            className={`${"control"} ${"next"}`} 
            onClick={handleNext}
            aria-label="Next image"
          >
            ›
          </button>
          
          {/* Indicators */}
          <div className="indicators">
            {images.map((_, index) => (
              <button
                key={index}
                className={`${"dot"} ${index === activeIndex ? "activeDot" : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductCarousel;