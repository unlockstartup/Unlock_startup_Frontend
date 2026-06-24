"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { logout } from "@/app/apiServices/auth";
import publisherApi from "@/app/publisherapi";

function NameAvatar({ name, size = 42 }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #4338ca, #6366f1)",
        color: "#fff",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.42,
        flexShrink: 0,
        userSelect: "none",
        boxShadow: "0 2px 6px rgba(67, 56, 202, 0.2)",
      }}
    >
      {initials}
    </span>
  );
}

export default function PublisherTopbar({ onToggle }) {
  const router = useRouter();
  const [profileurl, setProfileurl] = useState(null);
  const [name, setName] = useState("Profile");
  const [unreadCount, setUnreadCount] = useState(0);

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await publisherApi.get("/api/publisher/me");
      const p = res.data?.publisher;
      setProfileurl(p?.userId?.profileurl?.url || null);
      setName(p?.userId?.name || "Profile");
    } catch (err) {
      console.error("Failed to load profile for topbar", err);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await publisherApi.get("/api/notifications/my?page=1&limit=100");
      const items = res.data?.items || [];
      const unread = items.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch {
      // silently ignore
    }
  };

  fetchProfile();
  fetchUnreadCount();

  const handleUpdate = () => fetchUnreadCount();
  window.addEventListener("notifications:updated", handleUpdate);

  return () => {
    window.removeEventListener("notifications:updated", handleUpdate);
  };
}, []);

  return (
    <div className="ventic-topbar">
      {/* Sidebar Toggle */}
      <button
        className="btn btn-light ventic-icon-btn"
        onClick={onToggle}
      >
        <i className="bi bi-list" style={{ fontSize: "1.6rem" }} />
      </button>

      <div
        className="ventic-topbar__right"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem", 
        }}
      >
        <button
          className="btn btn-light ventic-icon-btn"
          onClick={() => router.push("/publisher/notifications")}
          style={{
            position: "relative",
            width: 44,
            height: 44,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          <i className="bi bi-bell" style={{ fontSize: "1.45rem" }} />

          {unreadCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: 2,
                right: 2,
                fontSize: "0.7rem",
                minWidth: 18,
                height: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "999px",
                padding: "0 5px",
                fontWeight: 700,
                background: "#dc3545", 
                color: "#fff",
                border: "2px solid #fff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                zIndex: 2,
              }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* Profile Dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-light d-flex align-items-center gap-2 dropdown-toggle"
            data-bs-toggle="dropdown"
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              padding: "6px 12px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              height: 44,       
            }}
          >
            {profileurl ? (
              <Image
                src={profileurl}
                alt="profile"
                className="rounded-circle"
                width={32}
                height={32}
                style={{ objectFit: "cover" }}
              />
            ) : (
              <NameAvatar name={name} size={32} />
            )}
            <span className="d-none d-sm-inline">{name}</span>
          </button>

          <ul
            className="dropdown-menu dropdown-menu-end"
            style={{
              fontSize: "0.9rem",
              minWidth: "200px",
              borderRadius: "12px",
              padding: "6px 0",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.12)",
              border: "1px solid #e2e8f0",
              marginTop: "8px",
            }}
          >
            <li>
              <button
                className="dropdown-item d-flex align-items-center gap-2"
                style={{ padding: "10px 16px", borderRadius: "6px", margin: "2px 8px" }}
                onClick={() => router.push("/publisher/profile")}
              >
                <i className="bi bi-person-circle" style={{ fontSize: "1.1rem", color: "#4338ca" }} />
                My Profile
              </button>
            </li>
            <li>
              <hr className="dropdown-divider mx-3 my-1" />
            </li>
            <li>
              <button
                className="dropdown-item d-flex align-items-center gap-2 text-danger"
                style={{ padding: "10px 16px", borderRadius: "6px", margin: "2px 8px" }}
                onClick={() => {
                  logout();
                  window.location.href = "/";
                }}
              >
                <i className="bi bi-box-arrow-right" style={{ fontSize: "1.1rem" }} />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}