import Link from "next/link";
import { Calendar, MapPin, Users, Tag, Trophy, BadgeIndianRupee, Building2, Layers } from "lucide-react";


const ORANGE = "#e8833a";

function getInitial(name = "") {
  return name.trim().charAt(0).toUpperCase() || "?";
}

export default function FundingCard({ funding, index }) {
  if (!funding) return null;

  const isFree = !funding.applicationFee || funding.applicationFee === 0;

  const deadlineFormatted = funding.submissionDeadline
    ? new Date(funding.submissionDeadline).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      })
    : null;

  const launchFormatted = funding.launchDate
    ? new Date(funding.launchDate).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      })
    : null;

  const orgName = funding.organizingCompany || funding.publisherName || "";

  const iconProps = { size: 13, strokeWidth: 2, color: ORANGE, style: { flexShrink: 0 } };

  return (
    <article
      className="wow fadeInUp"
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
      {/* Header Banner — gradient with category initial since funding has no image */}
<Link
  href={`/competitions/${funding.slug}`}
  style={{
    display: "block",
    width: "100%",
    height: "180px",
    flexShrink: 0,
    overflow: "hidden",
    position: "relative",
    background: "linear-gradient(135deg, #2d1b69 0%, #6c5ce7 60%, #a29bfe 100%)",
  }}
>
  {/* Attachment image — shown if available */}
  {funding.attachments?.[0]?.url ? (
    <img
      src={funding.attachments[0].url}
      alt={funding.title}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  ) : (
    /* Large initial fallback — only when no image */
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <span style={{
        fontSize: "72px", fontWeight: 800, color: "rgba(255,255,255,0.12)",
        lineHeight: 1, userSelect: "none", fontFamily: "sans-serif",
      }}>
        {getInitial(orgName)}
      </span>
    </div>
  )}

  {/* Challenge type badge — top right */}
  {funding.challengeType && (
    <span style={{
      position: "absolute", top: 10, right: 10,
      fontSize: "11px", fontWeight: 700, padding: "3px 9px",
      borderRadius: "20px",
      background: "rgba(0,0,0,0.45)", color: "#fff",
    }}>
      {funding.challengeType}
    </span>
  )}


  {/* Startup stage — bottom left */}
  {funding.startupStage && (
    <span style={{
      position: "absolute", bottom: 10, left: 10,
      fontSize: "10px", fontWeight: 700, padding: "3px 9px",
      borderRadius: "20px", letterSpacing: "0.3px",
      background: "rgba(255,255,255,0.18)", color: "#fff",
      backdropFilter: "blur(4px)",
    }}>
      {funding.startupStage}
    </span>
  )}
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
          {funding.challengeCategory || "\u00A0"}
        </p>

        {/* Title */}
        <Link href={`/competitions/${funding.slug}`} style={{ display: "block", marginBottom: "2px" }}>
          <h5 style={{
            fontSize: "20px", fontWeight: 700, lineHeight: "1.35",
            margin: 0, color: "#1a1a1a",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {funding.title}
          </h5>
        </Link>

        <div style={{ height: "0.5px", background: "#ebebeb", margin: "1px 0" }} />

        {/* Submission Deadline */}
        {deadlineFormatted && (
          <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", overflow: "hidden" }}>
            <Calendar {...iconProps} />
            <span style={{ color: ORANGE, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Last Date: {deadlineFormatted}
            </span>
          </div>
        )}

        {/* Launch Date */}
        {launchFormatted && (
          <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "#555", overflow: "hidden" }}>
            <Layers {...iconProps} />
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Start Date: {launchFormatted}
            </span>
          </div>
        )}

        {/* Location */}
        {funding.location && (
          <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "#555", overflow: "hidden" }}>
            <MapPin {...iconProps} />
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {funding.location}
            </span>
          </div>
        )}


        {/* Footer: org + apply button */}
        <div style={{
          display: "flex", alignItems: "center", gap: "7px",
          marginTop: "auto", paddingTop: "6px",
          borderTop: "0.5px solid #ebebeb",
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: "50%",
            background: "#f0eeff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "10px", fontWeight: 700,
            color: ORANGE, flexShrink: 0,
            border: `1px solid ${ORANGE}33`,
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
            href={`/competitions/${funding.slug}`}
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
              boxShadow: `0 2px 8px ${ORANGE}40`,
            }}
            className="theme_button"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = `0 4px 12px ${ORANGE}55`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 2px 8px ${ORANGE}40`;
            }}
          >
            Apply
          </Link>
        </div>
      </div>
    </article>
  );
}