"use client";

import Link from "next/link";
import Image from "next/image";
import navLinksData from "@/data/navLinksData";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isSticky, setIsSticky] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY >= 150);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-dropdown-wrapper")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push("/login");
  };

  const handleProfileClick = () => {
    setDropdownOpen(false);
    router.push("/user-dashboard");
  };

  const getInitials = (email) => (email ? email.charAt(0).toUpperCase() : "U");

  return (
    <header
      className={`theme-main-menu menu-overlay ${pathname !== "/" ? "inner-page-header" : ""} sticky-menu ${isSticky ? "fixed" : ""}`}
    >
      <div className="inner-content position-relative">
        <div className="top-header">
          <div className="d-flex align-items-center justify-content-between">
            {/* Logo */}
            <div className="logo order-lg-0">
              <Link href="/" className="d-flex align-items-center">
                <Image
                  src="/assets/images/logo/logo_4.jpg"
                  alt="logo"
                  width={110}
                  height={60}
                  style={{ height: "auto" }}
                />
              </Link>
            </div>

            {/* Right Widget */}
            <div className="right-widget ms-auto ms-lg-0 order-lg-3">
              <ul className="d-flex align-items-center style-none">
                {user ? (
                  <li className="position-relative user-dropdown-wrapper">
                    <button
                      onClick={() => setDropdownOpen((prev) => !prev)}
                      className="d-flex align-items-center gap-2"
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      {user.profileurl?.url ? (
                        <Image
                          src={user.profileurl.url}
                          alt="avatar"
                          width={38}
                          height={38}
                          style={{ borderRadius: "50%", objectFit: "cover", border: "2px solid #1a3c6e" }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 38, height: 38, borderRadius: "50%",
                            background: "#1a3c6e", color: "#fff",
                            display: "flex", alignItems: "center",
                            justifyContent: "center", fontWeight: 600, fontSize: 15,
                          }}
                        >
                          {getInitials(user.email)}
                        </div>
                      )}

                      <svg
                        width="12" height="12" viewBox="0 0 12 12" fill="#1a3c6e"
                        style={{ transition: "transform 0.2s", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      >
                        <path d="M6 8L1 3h10z" />
                      </svg>
                    </button>

                    {dropdownOpen && (
                      <div
                        style={{
                          position: "absolute", top: "calc(100% + 10px)", right: 0,
                          background: "#fff", border: "1px solid #e5e7eb",
                          borderRadius: 10, minWidth: 210,
                          boxShadow: "0 8px 24px rgba(0,0,0,0.10)", zIndex: 999, padding: "8px 0",
                          animation: "dropdownFadeIn 0.15s ease",
                        }}
                      >
                        {/* User Info */}
                        <div style={{ padding: "10px 16px", borderBottom: "1px solid #f1f1f1" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            {user.profileurl?.url ? (
                              <Image
                                src={user.profileurl.url}
                                alt="avatar"
                                width={36}
                                height={36}
                                style={{ borderRadius: "50%", objectFit: "cover" }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: 36, height: 36, borderRadius: "50%",
                                  background: "#1a3c6e", color: "#fff",
                                  display: "flex", alignItems: "center",
                                  justifyContent: "center", fontWeight: 600, fontSize: 14,
                                  flexShrink: 0,
                                }}
                              >
                                {getInitials(user.email)}
                              </div>
                            )}
                            <div>
                              <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: "#1a3c6e", lineHeight: 1.3 }}>
                                {user.name || user.email}
                              </p>
                              <span style={{ fontSize: 11, color: "#6b7280", textTransform: "capitalize" }}>
                                {user.role}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Profile Option */}
                        <button
                          onClick={handleProfileClick}
                          style={{
                            display: "flex", alignItems: "center", gap: 10,
                            width: "100%", textAlign: "left",
                            padding: "10px 16px", fontSize: 14, color: "#374151",
                            background: "none", border: "none", cursor: "pointer",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                          onMouseLeave={e => e.currentTarget.style.background = "none"}
                        >
                          {/* Profile Icon */}
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a3c6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          My Profile
                        </button>


                        <div style={{ height: 1, background: "#f1f1f1", margin: "4px 0" }} />

                        {/* Logout */}
                        <button
                          onClick={handleLogout}
                          style={{
                            display: "flex", alignItems: "center", gap: 10,
                            width: "100%", textAlign: "left",
                            padding: "10px 16px", fontSize: 14, color: "#dc2626",
                            background: "none", border: "none", cursor: "pointer",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"}
                          onMouseLeave={e => e.currentTarget.style.background = "none"}
                        >
                          {/* Logout Icon */}
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    )}
                  </li>
                ) : (
                  <>
                    <li>
                      <Link href="/login" className="login-link fw-500 text-gray-900 dark:text-white">Login</Link>
                    </li>
                    <li className="d-none d-md-block ms-4">
                      <Link href="/signup" className="btn-five">Register</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Navbar */}
            <nav className="navbar navbar-expand-lg p0 ms-3 ms-lg-0 order-lg-2">
              <button
                className="navbar-toggler d-block d-lg-none"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
              >
                <span></span>
              </button>

              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="d-block d-lg-none">
                    <div className="logo">
                      <Link href="/" className="d-block">
                        <Image src="/assets/images/logo/logo_4.jpg" alt="logo" width={80} height={50} style={{ height: "auto" }} />
                      </Link>
                    </div>
                  </li>

                  {navLinksData.map((link, index) => (
                    <li key={index} className="nav-item">
                      <Link href={link.href} className={`nav-link ${
                        (link.href === "/"
                          ? pathname === "/"
                          : pathname.startsWith(link.href)) || activeSection === link.href
                          ? "active"
                          : ""
                      }`}>
                        {link.name}
                      </Link>
                    </li>
                  ))}

                  <li className="d-md-none mt-5">
                    <Link href="/signup" className="btn-five w-100">Register</Link>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}