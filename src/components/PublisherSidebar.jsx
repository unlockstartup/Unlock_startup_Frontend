"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "../../public/assets/images/logo/logo_04.jpg";
import { useState, useEffect } from "react";

const menu = [
  { label: "Dashboard",           icon: "bi-grid",            to: "/publisher/dashboard" },
  { label: "Profile",             icon: "bi-person-circle",   to: "/publisher/profile" },
  { label: "Competitions",        icon: "bi-cash-stack",      to: "/publisher/funding-calls" },
  { label: "Events",              icon: "bi-calendar-event",  to: "/publisher/events" },
  { label: "Jobs",                icon: "bi-briefcase",       to: "/publisher/jobs" },
  { label: "Investor Details",    icon: "bi-currency-dollar", to: "/publisher/investor-details", hideFor: ["publisher"] },  //  hidden for publishers
  { label: "Innovation Products", icon: "bi-lightbulb",       to: "/publisher/innovation-products", hideFor: ["investor"] }, // hidden for investors
  { label: "Submissions",         icon: "bi-speedometer2",    to: "/publisher/listings" },
  { label: "Service Listings",    icon: "bi-gear",            to: "/publisher/service-listings" },
];

export default function PublisherSidebar({ collapsed, mobileOpen, onClose }) {
  const pathname = usePathname();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    setCategory(localStorage.getItem("publisher_category")); // "publisher" | "investor"
  }, []);

  // ← filter out items hidden for this account category
  const visibleMenu = menu.filter(
    (item) => !item.hideFor || !item.hideFor.includes(category)
  );

  const classes = [
    "ventic-sidebar",
    collapsed  ? "collapsed"   : "",
    mobileOpen ? "mobile-open" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <div className="ventic-sidebar__brand">
        <Image
          src={logo} alt="Logo" className="ventic-logo-img"
          style={{ width: collapsed ? "32px" : "120px", height: "auto", transition: "width 0.25s" }}
        />
      </div>

      <div className="ventic-sidebar__menu">
        {visibleMenu.map((item) => ( // ← visibleMenu instead of menu
          <Link
            key={item.to} href={item.to} onClick={onClose}
            className={`ventic-nav ${pathname === item.to ? "active" : ""}`}
          >
            <i className={`bi ${item.icon} ventic-nav__icon`} />
            <span className="ventic-nav__text">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}