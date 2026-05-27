"use client";

import { useState, useRef, useEffect } from "react";

export default function Accordion({ data }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [heights, setHeights] = useState([]);
  const contentRefs = useRef([]);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    const newHeights = data.map(
      (_, index) => contentRefs.current[index]?.scrollHeight || 0,
    );
    setHeights(newHeights);
  }, [data]);

  return (
    <div className="accordion accordion-style-one color-two ps-xxl-5 ms-xxl-4">
      {data.map((item, index) => (
        <div className="accordion-item" key={index}>
          <div className="accordion-header">
            <button
              className={`accordion-button ${
                activeIndex !== index ? "collapsed" : ""
              }`}
              onClick={() => toggleAccordion(index)}
            >
              {item.question}
            </button>
          </div>

          <div
            ref={(el) => (contentRefs.current[index] = el)}
            className="accordion-collapse"
            style={{
              height: activeIndex === index ? `${heights[index]}px` : "0px",
              overflow: "hidden",
              transition: "height 0.3s ease",
            }}
          >
            <div className="accordion-body">
              <p>{item.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
