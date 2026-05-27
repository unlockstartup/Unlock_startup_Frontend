import Link from "next/link";
import { Clock, MapPin, Users, Tag, Building2, CheckCircle } from "lucide-react";

const TEAL = "rgb(232, 131, 58)";
const badgeStyle = { background: "#E1F5EE", color: "#0F6E56" };

function getInitial(name = "") {
  return name.trim().charAt(0).toUpperCase() || "?";
}

export default function ServiceCard({ service, index }) {
  const iconProps = { size: 13, strokeWidth: 2, color: TEAL, style: { flexShrink: 0 } };

  // Use first image from serviceImages array
  const bannerUrl = service?.serviceImages?.[0]?.url || null;

  return (
    <article
      className="service-meta-one xs-mt-20 wow fadeInUp"
      data-wow-delay={`${index * 0.1}s`}
      style={{
        borderRadius: "12px", overflow: "hidden", background: "#fff",
        border: "0.5px solid #e0dede", transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "pointer", display: "flex", flexDirection: "column", width: "100%", height: "450px",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.10)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Image */}
      <Link href={`/services/${service?._id}`} style={{
        display: "block", width: "100%", height: "220px", flexShrink: 0,
        overflow: "hidden", position: "relative", backgroundColor: "#1a1a2e",
      }}>
        {bannerUrl ? (
          <img src={bannerUrl} alt={service?.serviceTitle}
            style={{ width: "100%", height: "100%", objectFit: "fill", display: "block" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle size={48} color="rgba(255,255,255,0.3)" strokeWidth={1.5} />
          </div>
        )}

        {/* Category badge */}
        {service?.serviceCategory && (
          <span style={{
            position: "absolute", top: 10, left: 10,
            display: "flex", alignItems: "center", gap: "4px",
            fontSize: "11px", fontWeight: 600, padding: "3px 9px",
            borderRadius: "20px", ...badgeStyle,
          }}>
            <Tag size={10} strokeWidth={2} />
            {service.serviceCategory}
          </span>
        )}

        {/* Service Type badge (replaces serviceMode) */}
        {service?.serviceType && (
          <span style={{
            position: "absolute", top: 10, right: 10,
            display: "flex", alignItems: "center", gap: "4px",
            fontSize: "11px", fontWeight: 700, padding: "3px 9px",
            borderRadius: "20px", background: "rgba(0,0,0,0.55)", color: "#fff",
          }}>
            <Tag size={10} strokeWidth={2} />
            {service.serviceType}
          </span>
        )}
      </Link>

      {/* Body */}
      <div style={{ padding: "12px 14px 14px", flex: 1, display: "flex", flexDirection: "column", gap: "5px", overflow: "hidden" }}>

        {/* Category label */}
        <p style={{ margin: 0, fontSize: "11px", fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {service?.serviceCategory || "\u00A0"}
        </p>

        {/* Title */}
        <Link href={`/services/${service?._id}`} style={{ display: "block", marginBottom: "2px" }}>
          <h5 style={{ fontSize: "20px", fontWeight: 700, lineHeight: "1.35", margin: 0, color: "#1a1a1a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {service?.serviceTitle}
          </h5>
        </Link>

        <div style={{ height: "0.5px", background: "#ebebeb", margin: "1px 0" }} />

        {/* Service Area (replaces location) */}
        {service?.serviceArea && (
          <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "#555", overflow: "hidden" }}>
            <MapPin {...iconProps} />
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{service.serviceArea}</span>
          </div>
        )}

        {/* Team Size (replaces duration) */}
        {service?.teamSize && (
          <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "#555", overflow: "hidden" }}>
            <Users {...iconProps} />
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{service.teamSize}</span>
          </div>
        )}

        {/* Target Industry (replaces targetAudience) */}
        {service?.targetIndustry && (
          <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "#555", overflow: "hidden" }}>
            <Tag {...iconProps} />
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{service.targetIndustry}</span>
          </div>
        )}

        {/* Established Year */}
        {service?.establishedYear && (
          <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "#555", overflow: "hidden" }}>
            <Clock {...iconProps} />
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Est. {service.establishedYear}</span>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: "7px", marginTop: "auto", paddingTop: "6px", borderTop: "0.5px solid #ebebeb" }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: TEAL, flexShrink: 0, border: `1px solid ${TEAL}33` }}>
            {getInitial(service?.companyName)}
          </div>
          <span style={{ fontSize: "11px", color: "#888", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {service?.brandName || service?.companyName}
          </span>
          <Link
            href={`/services/${service?._id}`}
            style={{
              marginLeft: "auto", fontSize: "13px", fontWeight: 700, color: "#fff",
              padding: "6px 20px", borderRadius: "30px", textDecoration: "none",
              flexShrink: 0, display: "inline-flex", alignItems: "center",
              justifyContent: "center", transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(29, 158, 117, 0.25)",
            }}
            className="theme_button"
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(29, 158, 117, 0.35)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(29, 158, 117, 0.25)"; }}
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}