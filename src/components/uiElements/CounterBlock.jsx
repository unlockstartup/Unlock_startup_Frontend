"use client";

import { useEffect, useState } from "react";

export default function CounterBlock({
  number = 10,
  duration = 1000,
  suffix = "",
  label = "Enter your label",
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = number / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= number) {
        start = number;
        clearInterval(counter);
      }
      setCount(Math.floor(start));
    }, 16);

    return () => clearInterval(counter);
  }, [number, duration]);

  return (
    <div
      className="counter-block-one text-center wow fadeInUp"
      data-wow-delay="0.2s"
    >
      <h2 className="main-count fw-500">
        <span className="counter me-2">{Math.floor(count)}</span>
        {suffix}
      </h2>
      <p>{label}</p>
    </div>
  );
}
