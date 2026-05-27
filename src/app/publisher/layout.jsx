"use client";
import { useState, useEffect } from "react";
import PublisherSidebar from "@/components/PublisherSidebar";
import PublisherTopbar from "@/components/PublisherTopbar";
import "@/app/styles/layout.css";
import "@/app/styles/theme.css";

function useBreakpoint() {
  const [bp, setBp] = useState("desktop");
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setBp(w < 768 ? "mobile" : w < 1200 ? "tablet" : "desktop");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return bp;
}

export default function PublisherLayout({ children }) {
  const bp = useBreakpoint();

  // Desktop: controls collapsed (icon-only) vs full
  const [collapsed, setCollapsed] = useState(false);

  // Mobile: controls drawer open/closed
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggle = () => {
    if (bp === "mobile") {
      setMobileOpen((v) => !v);
    } else {
      setCollapsed((v) => !v);
    }
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="ventic-shell">
      {/* Backdrop — mobile only */}
      {bp === "mobile" && (
        <div
          className={`ventic-backdrop ${mobileOpen ? "visible" : ""}`}
          onClick={closeMobile}
        />
      )}

      <PublisherSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onClose={closeMobile}
      />

      <div className="ventic-main">
        <PublisherTopbar onToggle={handleToggle} />
        <div className="ventic-content">{children}</div>
      </div>
    </div>
  );
}