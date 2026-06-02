"use client";

import { useState, useRef, useEffect } from "react";
import "./customselect.css"

export default function CustomSelect({
  value = "",
  onChange,
  options = [],
  placeholder = "Select",
  disabled = false,
  className = "select",
  maxVisible = 5,
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  /* Normalise options to { value, label } */
  const normalised = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );

  const selected = normalised.find((o) => o.value === value);

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const pick = (val) => {
    onChange?.(val);
    setOpen(false);
  };

  /* Option row height — must match CSS */
  const OPTION_H = 42;
  const listMaxH = maxVisible * OPTION_H;

  return (
    <div
      ref={wrapRef}
      className="customSelect__wrap"
      style={{ position: "relative", width: "100%" }}
    >
      {/* Trigger */}
      <button
        type="button"
        className={`customSelect__trigger ${className} ${open ? "customSelect__trigger--open" : ""}`}
        onClick={() => !disabled && setOpen((p) => !p)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className={
            selected
              ? "customSelect__triggerText"
              : "customSelect__triggerPlaceholder"
          }
        >
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className={`customSelect__chevron ${open ? "customSelect__chevron--up" : ""}`}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1 1l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          role="listbox"
          className="customSelect__menu"
          style={{ maxHeight: listMaxH }}
        >
          {/* Blank / placeholder row */}
          <li
            role="option"
            aria-selected={value === ""}
            className={`customSelect__option customSelect__option--placeholder ${
              value === "" ? "customSelect__option--active" : ""
            }`}
            onMouseDown={() => pick("")}
          >
            {placeholder}
          </li>

          {normalised.map((o) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              className={`customSelect__option ${
                o.value === value ? "customSelect__option--active" : ""
              }`}
              onMouseDown={() => pick(o.value)}
            >
              {o.label}
              {o.value === value && (
                <svg
                  className="customSelect__check"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 7l3.5 3.5L12 3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}