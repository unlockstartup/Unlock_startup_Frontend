import Link from "next/link";
import { Bookmark, CheckSquare, Cpu, Users, Tag } from "lucide-react";

const BLUE = "rgb(232, 131, 58)";

const statusBadge = { background: "#E6F1FB", color: "#0C447C" };

function getInitial(name = "") {
  return name.trim().charAt(0).toUpperCase() || "?";
}

export default function ProductLaunchCard({ product, index }) {
  const title = product?.productName || "Untitled";
  const image = product?.productLogo?.url || null;
  const slug = product?._id || "#";
  const orgName = product?.companyName || product?.brandName || "";

  const techSnippet = product?.technology
    ? product.technology.split(",").slice(0, 3).map((t) => t.trim()).join(", ")
    : null;

  const founderLine = [
    product?.establishedYear && `Est. ${product.establishedYear}`,
    product?.founderName,
  ].filter(Boolean).join(" · ");

  const websiteDisplay = product?.websiteUrl
    ? product.websiteUrl.replace(/^https?:\/\//, "")
    : null;

  const iconProps = { size: 13, strokeWidth: 2, color: BLUE, style: { flexShrink: 0 } };

  return (
      <article
        className="product-meta-one xs-mt-20 wow fadeInUp"
        data-wow-delay={`${index * 0.1}s`}
        style={{
          borderRadius: "12px", overflow: "hidden", background: "#fff",
          border: "0.5px solid #e0dede", transition: "transform 0.2s ease, box-shadow 0.2s ease",
          cursor: "pointer", display: "flex", flexDirection: "column", width: "100%", height: "380px",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.10)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
      >
        {/* Image */}
        <Link href={`/products/${slug}`} style={{
          display: "block", width: "100%", height: "160px", flexShrink: 0,
          overflow: "hidden", position: "relative", backgroundColor: "#1a1a2e",
        }}>
          {image ? (
            <img src={image} alt={title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Cpu size={48} color="rgba(255,255,255,0.3)" strokeWidth={1.5} />
            </div>
          )}

{/* Innovation category badge */}
{product?.innovationCategory && (
  <span
    style={{
      position: "absolute",
      top: 10,
      left: 10,
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "11px",
      fontWeight: 600,
      padding: "4px 10px",
      borderRadius: "20px",
      whiteSpace: "nowrap",
      maxWidth: "80%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      ...statusBadge,
    }}
  >
    <Tag size={10} strokeWidth={2} />
    <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
      {product.innovationCategory}
    </span>
  </span>
)}

          {/* Product status badge */}
          {product?.productStatus && (
            <span style={{
              position: "absolute", top: 10, right: 10,
              fontSize: "11px", fontWeight: 700, padding: "3px 9px",
              borderRadius: "20px", ...statusBadge,
            }}>
              {product.productStatus}
            </span>
          )}
        </Link>

        {/* Body */}
        <div style={{ padding: "12px 14px 14px", flex: 1, display: "flex", flexDirection: "column", gap: "5px", overflow: "hidden" }}>

          {/* Industry label */}
          <p style={{ margin: 0, fontSize: "11px", fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {product?.targetIndustry || "\u00A0"}
          </p>

          {/* Title */}
          <Link href={`/products/${slug}`} style={{ display: "block", marginBottom: "2px" }}>
           <h5 style={{fontSize: "20px",  fontWeight: 700, lineHeight: "1.35", margin: 0, color: "#1a1a1a", whiteSpace: "nowrap", overflow: "hidden",textOverflow: "ellipsis"}}>
              {title}
            </h5>
          </Link>

          <div style={{ height: "0.5px", background: "#ebebeb", margin: "1px 0" }} />

          {/* Innovation status */}
          {product?.innovationStatus && (
            <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", overflow: "hidden" }}>
              <CheckSquare {...iconProps} />
              <span style={{ color: BLUE, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {product.innovationStatus}
              </span>
            </div>
          )}

          {/* Patent status */}
          {product?.patentStatus && (
            <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "#555", overflow: "hidden" }}>
              <Bookmark {...iconProps} />
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.patentStatus}</span>
            </div>
          )}

          {/* Technology */}
          {techSnippet && (
            <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "#555", overflow: "hidden" }}>
              <Cpu {...iconProps} />
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{techSnippet}</span>
            </div>
          )}

          {/* Founder + Est. year */}
          {founderLine && (
            <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "#555", overflow: "hidden" }}>
              <Users {...iconProps} />
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{founderLine}</span>
            </div>
          )}

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginTop: "auto", paddingTop: "6px", borderTop: "0.5px solid #ebebeb" }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: BLUE, flexShrink: 0, border: `1px solid ${BLUE}33` }}>
              {getInitial(orgName)}
            </div>
            <span style={{ fontSize: "11px", color: "#888", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {orgName}
            </span>
        <Link
              href={`/products/${product._id}`}
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