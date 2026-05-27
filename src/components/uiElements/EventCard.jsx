import Link from "next/link";
import { Calendar, Clock, MapPin, Users, Tag, Wifi, MapPinned } from "lucide-react";

const PURPLE = "rgb(232, 131, 58)";

function getInitial(name = "") {
  return name.trim().charAt(0).toUpperCase() || "?";
}

export default function EventCard({ event, index }) {
  const regType = event.registrationType ?? "";
  const isOnline = event.eventFormat === "online";
  const formatLabel = isOnline ? "Online" : "In-Person";

const startDateOnly = event.startDateTime
  ? new Date(event.startDateTime).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      timeZone: "Asia/Kolkata",  // ← was "UTC"
    })
  : null;

const endDateOnly = event.endDateTime
  ? new Date(event.endDateTime).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      timeZone: "Asia/Kolkata",  // ← was "UTC"
    })
  : null;

const timeRange = (() => {
  if (!event.startDateTime) return null;
  const start = new Date(event.startDateTime);
const fmt = (d) =>
  d.toLocaleTimeString("en-IN", {
    hour: "numeric", minute: "2-digit", hour12: true,
    timeZone: "Asia/Kolkata",
  }).replace(/am|pm/i, (m) => m.toUpperCase());
  if (!event.endDateTime) return fmt(start);
  const end = new Date(event.endDateTime);
  return `${fmt(start)} – ${fmt(end)}`;
})();


  const orgName = event.publisherName ?? event.organizationName ?? "";
  const audience = Array.isArray(event.targetAudience)
    ? event.targetAudience.join(", ")
    : event.targetAudience ?? "";

  const iconProps = { size: 13, strokeWidth: 2, color: PURPLE, style: { flexShrink: 0 } };

  return (
    <article
      className="event-meta-one xs-mt-20 wow fadeInUp"
      data-wow-delay={`${index * 0.1}s`}
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        background: "#fff",
        border: "0.5px solid #e0dede",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "400px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.10)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Image */}
      <Link
        href={`/events/${event.slug}`}
        style={{
          display: "block",
          width: "100%",
          height: "180px",
          flexShrink: 0,
          overflow: "hidden",
          position: "relative",
          backgroundColor: "#1a1a2e",
        }}
      >
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Calendar size={48} color="rgba(255,255,255,0.3)" strokeWidth={1.5} />
          </div>
        )}

        {/* Format badge */}
        <span style={{
          position: "absolute", top: 10, right: 10,
          display: "flex", alignItems: "center", gap: "4px",
          fontSize: "11px", fontWeight: 700, padding: "3px 9px",
          borderRadius: "20px",
          background: "rgba(0,0,0,0.55)", color: "#fff",
        }}>
          {isOnline
            ? <Wifi size={10} strokeWidth={2} />
            : <MapPinned size={10} strokeWidth={2} />
          }
          {formatLabel}
        </span>
      </Link>

      {/* Body */}
      <div style={{
        padding: "12px 14px 14px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        overflow: "hidden",
      }}>

        {/* Category */}
        <p style={{
          margin: 0, fontSize: "11px", fontWeight: 700,
          color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {event.category?.[0] || "\u00A0"}
        </p>

        {/* Title */}
        <Link href={`/events/${event.slug}`} style={{ display: "block", marginBottom: "2px" }}>
          <h5 style={{ fontSize: "20px", fontWeight: 700, lineHeight: "1.35", margin: 0, color: "#1a1a1a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {event.title}
          </h5>
        </Link>

        <div style={{ height: "0.5px", background: "#ebebeb", margin: "1px 0" }} />

{/* Date */}
{startDateOnly && (
  <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", overflow: "hidden" }}>
    <Calendar {...iconProps} />
    <span style={{ color: PURPLE, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
      {startDateOnly}
      {endDateOnly && endDateOnly !== startDateOnly ? ` – ${endDateOnly}` : ""}
    </span>
  </div>
)}

        {/* Time */}
        {timeRange && (
          <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "#555", overflow: "hidden" }}>
            <Clock {...iconProps} />
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{timeRange}</span>
          </div>
        )}

        {/* Location */}
        <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "#555", overflow: "hidden" }}>
          <MapPin {...iconProps} />
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {event.location || "\u00A0"}
          </span>
        </div>

        {/* Target Audience */}
        {audience && (
          <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "#555", overflow: "hidden" }}>
            <Users {...iconProps} />
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{audience}</span>
          </div>
        )}

        {/* Footer: org + price */}
        <div style={{
          display: "flex", alignItems: "center", gap: "7px",
          marginTop: "auto", paddingTop: "6px",
          borderTop: "0.5px solid #ebebeb",
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: "50%",
            background: "#fff4ec", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "10px", fontWeight: 700,
            color: PURPLE, flexShrink: 0,
            border: `1px solid ${PURPLE}33`,
          }}>
            {getInitial(orgName)}
          </div>
          <span style={{
            fontSize: "11px", color: "#888",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {orgName}
          </span>
          <Link
            href={`/events/${event.slug}`}
            style={{
              marginLeft: "auto",
              fontSize: "13px",
              fontWeight: 700,
              color: "#fff",
              padding: "6px 20px",
              borderRadius: "30px",
              textDecoration: "none",
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(232, 131, 58, 0.25)",
            }}
            className="theme_button"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(232, 131, 58, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(232, 131, 58, 0.25)";
            }}
          >
            Apply
          </Link>
        </div>
      </div>
    </article>
  );
}