"use client";
 
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/app/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  Link2,
  MapPin,
  Clock,
  Share2,
  ExternalLink,
  TrendingUp,
  Briefcase,
  Trophy,
  Target,
  DollarSign,
  Users,
  Info,
  BadgeCheck,
  Send,
  Tag,
  User,
  ChevronRight
} from "lucide-react";
import "./investorProfile.css";
import ApplyModal from "@/components/uiElements/ApplyModal";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
 
function formatINR(amount) {
  if (!amount || isNaN(amount)) return "N/A";
  const num = Number(amount);
  if (num >= 1_00_00_000) {
    const cr = num / 1_00_00_000;
    return `₹${cr % 1 === 0 ? cr : cr.toFixed(2)} Cr`;
  }
  if (num >= 1_00_000) {
    const lakh = num / 1_00_000;
    return `₹${lakh % 1 === 0 ? lakh : lakh.toFixed(2)} Lakh`;
  }
  if (num >= 1_000) {
    const k = num / 1_000;
    return `₹${k % 1 === 0 ? k : k.toFixed(1)}K`;
  }
  return `₹${num.toLocaleString("en-IN")}`;
}
 
function formatTicketSize(min, max) {
  if (!min && !max) return "N/A";
  if (min && max) return `${formatINR(min)} – ${formatINR(max)}`;
  if (min) return `From ${formatINR(min)}`;
  return `Up to ${formatINR(max)}`;
}
 
export default function InvestorPage({ params }) {
  const [investor, setInvestor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [id, setId] = useState(null);
  const [portfolioIndex, setPortfolioIndex] = useState(0);
const { user, loading: authLoading } = useAuth();
const router = useRouter();

useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchInvestor = async () => {
      const { id } = await params;
      setId(id);
      try {
        const res = await api.get(`/api/publisher/investors/${id}`);
        const data = res.data;
        const inv = data?.investors?.[0] || data?.investor || data;
        if (!inv) throw new Error("Investor data not found in response");
        setInvestor(inv);
      } catch (err) {
        console.error("Failed to fetch investor details:", err);
        setError("Unable to load investor profile at this time. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchInvestor();
  }, [params]);
 
  const getValue = (field) => {
    if (!investor) return "N/A";
    switch (field) {
      case "name":        return investor.fundName || "Unnamed Investor";
      case "logo":        return investor.logo || "";
      case "designation": return investor.contact?.title || investor.investorType || "N/A";
      case "company":     return investor.publisherId?.companyName || "N/A";
      case "email":       return investor.contact?.email || "N/A";
      case "phone":       return investor.contact?.phone || "N/A";
      case "focusSectors":
        return Array.isArray(investor.industrySectorFocus)
          ? investor.industrySectorFocus.join(", ")
          : "Not specified";
      case "website":     return investor.applyLink || "#";
      case "address":     return investor.profileVisibility || "";
      case "linkedin":    return investor.linkedIn || "#";
      case "fullAddress": return investor.officeLocation || "Delhi, India";
      case "timeZone":    return "IST (UTC+5:30)";
      case "investorType": return investor.investorType || "N/A";
      case "investmentPreference":
        return Array.isArray(investor.preferredStages)
          ? investor.preferredStages.join(", ")
          : "N/A";
      case "investmentSize": {
        const ticket = investor.ticketSize;
        return ticket
          ? formatTicketSize(ticket.minimum, ticket.maximum)
          : "N/A";
      }
      case "notableInvestments":
        return investor.portfolioCompaniesCount
          ? `${investor.portfolioCompaniesCount} companies`
          : "No portfolio information available";
      case "investmentExperience":
        return investor.yearsOfExperience
          ? `${investor.yearsOfExperience} years`
          : "N/A";
      case "geographicFocus":
        return Array.isArray(investor.geographicFocus)
          ? investor.geographicFocus.join(", ")
          : "N/A";
      case "fundSize":
        return investor.fundSize
          ? formatINR(investor.fundSize)
          : "N/A";
      case "contactName":  return investor.contact?.name || "N/A";
      case "about":        return investor.about || "";
      case "preferredDeal":
      case "exitStrategy": return "Not specified";
      default:             return "N/A";
    }
  };
 
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: investor?.fundName, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading || !user) {
    return (
      <main>
        <div className="serviceDetailPage">
          <div className="container" style={{ display: "flex", justifyContent: "center", paddingTop: "80px" }}>
            <p style={{ color: "var(--sdp-text-muted)", fontSize: "14px" }}>Loading investor profile…</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <div className="serviceDetailPage">
          <div className="container">
            <div className="notFoundWrap">
              <h2>Something went wrong</h2>
              <p>{error}</p>
              <Link href="/investors" className="btn-five">← Back to Investors</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!investor) {
    return (
      <main>
        <div className="serviceDetailPage">
          <div className="container">
            <div className="notFoundWrap">
              <h2>Investor Not Found</h2>
              <p>This profile may have been removed or is unavailable.</p>
              <Link href="/investors" className="btn-five">← Back to Investors</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const logoSrc = investor?.logo || "";
  const isExternalLogo = logoSrc && (logoSrc.startsWith("http") || logoSrc.startsWith("//"));
  const sectors  = getValue("focusSectors").split(", ").filter((s) => s && s !== "Not specified");
  const stages   = getValue("investmentPreference").split(", ").filter((s) => s && s !== "N/A");
  const geoFocus = getValue("geographicFocus").split(", ").filter((s) => s && s !== "N/A");
  const email    = getValue("email");

  return (
    <main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div className="serviceDetailPage">
        <div className="container">
<Breadcrumb title="Investors" dynamicTitle={investor?.fundName}/>
          {/* Back Link */}
          <Link href="/investors" className="backLink">
            <ArrowLeft size={14} strokeWidth={2} />
            All Investors
          </Link>

          {/*  Hero  */}
          <div className="serviceHeroPlaceholder">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>

              {/* Left: Logo + Name */}
              <div style={{ display: "flex", alignItems: "center", gap: "80px" }}>
                <div style={{
                  width: 200, height: 160, borderRadius: 14,
                  background: "rgba(255,255,255,0.12)",
                  border: "1.5px solid rgba(255,255,255,0.22)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  overflow: "hidden", flexShrink: 0,
                }}>
                  {isExternalLogo ? (
                    <Image src={logoSrc} alt={getValue("name")} width={200} height={160} style={{ objectFit: "fill" }} unoptimized priority />
                  ) : (
                    <span style={{ fontSize: 30, fontWeight: 800, color: "#fff" }}>
                      {getValue("name").charAt(0)}
                    </span>
                  )}
                </div>
              <div>
                  <span className="badgeCategory">{getValue("investorType")}</span>
                  <h1 style={{ marginBottom: 6 }}>{getValue("name")}</h1>
                  <p className="companySub" style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                    <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: "rgba(255,255,255,0.5)" }}>Designation</span>
                      <span>{getValue("designation")}</span>
                    </span>
                    {getValue("company") !== "N/A" && (
                      <>
                        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "18px", fontWeight: 300 }}>|</span>
                        <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: "rgba(255,255,255,0.5)" }}>Company</span>
                          <span>{getValue("company")}</span>
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/*  Right: Investor Type Badge (like eventAvailBadge)  */}
              <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
                <span className="availBadge">
                  <span className="availDot" />
                  Investor
                </span>
                {getValue("investmentExperience") !== "N/A" && (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.26)",
                    color: "#fff", fontSize: "12px", fontWeight: 700, padding: "6px 14px",
                    borderRadius: "999px", letterSpacing: "0.03em"
                  }}>
                    <Trophy size={12} strokeWidth={2} />
                    {getValue("investmentExperience")} Experience
                  </span>
                )}
              </div>

            </div>
          </div>

          {/* Two-column layout */}
          <div className="sdpLayout">

            {/*  LEFT COLUMN  */}
            <div className="sdpLeft">

              {/* About the Fund */}
              {getValue("about") && (
                <div className="sdpCard">
                  <div className="sdpSectionHeader">
                    <div className="sdpSectionIcon"><Info size={15} strokeWidth={1.8} /></div>
                    <h2 className="sdpSectionTitle">About the Invest</h2>
                  </div>
                  <p className="sdpBodyText">{getValue("about")}</p>
                </div>
              )}

              {/*  Investment Profile — eventMetaItem grid style  */}
              <div className="sdpCard">
                <div className="sdpSectionHeader">
                  <div className="sdpSectionIcon"><TrendingUp size={15} strokeWidth={1.8} /></div>
                  <h2 className="sdpSectionTitle">Investment Profile</h2>
                </div>
                <div className="sdpMetaGrid">
                  <div className="sdpMetaItem">
                    <span className="sdpMetaLabel">Investor Type</span>
                    <span className="sdpMetaValue sdpMetaValue--blue">{getValue("investorType")}</span>
                  </div>
                  <div className="sdpMetaItem">
                    <span className="sdpMetaLabel">Preferred Stages</span>
                    <span className="sdpMetaValue">{getValue("investmentPreference")}</span>
                  </div>
                  <div className="sdpMetaItem">
                    <span className="sdpMetaLabel">Ticket Size</span>
                    <span className="sdpMetaValue sdpMetaValue--blue">{getValue("investmentSize")}</span>
                  </div>
                  <div className="sdpMetaItem">
                    <span className="sdpMetaLabel">Fund Size</span>
                    <span className="sdpMetaValue sdpMetaValue--blue">{getValue("fundSize")}</span>
                  </div>
                </div>
              </div>

              {/*  Portfolio & Experience — eventMetaItem grid style  */}
              <div className="sdpCard">
                <div className="sdpSectionHeader">
                  <div className="sdpSectionIcon sdpSectionIcon--highlight"><Trophy size={15} strokeWidth={1.8} /></div>
                  <h2 className="sdpSectionTitle">Portfolio &amp; Experience</h2>
                </div>
                <div className="sdpMetaGrid">
                  <div className="sdpMetaItem">
                    <span className="sdpMetaLabel">Portfolio Companies</span>
                    <span className="sdpMetaValue sdpMetaValue--blue">{getValue("notableInvestments")}</span>
                  </div>
                  <div className="sdpMetaItem">
                    <span className="sdpMetaLabel">Years of Experience</span>
                    <span className="sdpMetaValue">{getValue("investmentExperience")}</span>
                  </div>
                </div>

                {/* Notable Portfolio Companies */}
                {investor.portfolioCompanies && investor.portfolioCompanies.length > 0 && (() => {
                  const companies = investor.portfolioCompanies;
                  const total = companies.length;
                  const isSlider = total > 1;
                  const comp = companies[portfolioIndex];
                  return (
                    <>
                      {/* Section divider */}
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "28px 0 16px" }}>
                        <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, var(--blue-200), transparent)" }} />
                        <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.4px", color: "var(--sdp-text-faint)", whiteSpace: "nowrap" }}>
                          Notable Portfolio Companies
                        </span>
                        <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, var(--blue-200))" }} />
                      </div>
 
                      {/* Slider controls */}
                      {isSlider && (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                          <button
                            onClick={() => setPortfolioIndex((portfolioIndex - 1 + total) % total)}
                            style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--blue-200)", background: "var(--blue-50)", color: "var(--blue-700)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", fontSize: "16px", fontWeight: 700 }}
                            onMouseEnter={e => { e.currentTarget.style.background = "var(--blue-500)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "var(--blue-500)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "var(--blue-50)"; e.currentTarget.style.color = "var(--blue-700)"; e.currentTarget.style.borderColor = "var(--blue-200)"; }}
                          >‹</button>
                          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                            {companies.map((_, i) => (
                              <button key={i} onClick={() => setPortfolioIndex(i)} style={{ width: i === portfolioIndex ? 20 : 8, height: 8, borderRadius: 999, border: "none", cursor: "pointer", background: i === portfolioIndex ? "var(--blue-500)" : "var(--blue-200)", transition: "all 0.25s ease", padding: 0 }} />
                            ))}
                          </div>
                          <button
                            onClick={() => setPortfolioIndex((portfolioIndex + 1) % total)}
                            style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--blue-200)", background: "var(--blue-50)", color: "var(--blue-700)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", fontSize: "16px", fontWeight: 700 }}
                            onMouseEnter={e => { e.currentTarget.style.background = "var(--blue-500)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "var(--blue-500)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "var(--blue-50)"; e.currentTarget.style.color = "var(--blue-700)"; e.currentTarget.style.borderColor = "var(--blue-200)"; }}
                          >›</button>
                        </div>
                      )}
 
                      {/* Card */}
                      <div style={{ borderRadius: "var(--radius-md)", border: "1px solid var(--blue-200)", overflow: "hidden", background: "var(--white)", boxShadow: "var(--shadow-sm)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px", background: "linear-gradient(135deg, var(--blue-50) 0%, var(--white) 100%)", borderBottom: "1px solid var(--blue-100)" }}>
                          <div style={{ width: 42, height: 42, minWidth: 42, borderRadius: "var(--radius-sm)", background: "linear-gradient(135deg, var(--blue-500) 0%, var(--blue-700) 100%)", color: "#fff", fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", textTransform: "uppercase", boxShadow: "var(--shadow-blue)", flexShrink: 0 }}>
                            {comp.companyName?.charAt(0) || "C"}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--sdp-text-primary)", letterSpacing: "-0.01em" }}>{comp.companyName}</span>
                              <span style={{ fontSize: 10, fontWeight: 700, background: "var(--yellow-100)", color: "var(--yellow-900)", border: "1px solid var(--yellow-300)", borderRadius: 999, padding: "2px 8px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                                {isSlider ? `${portfolioIndex + 1} / ${total}` : "Portfolio #1"}
                              </span>
                            </div>
                            <span style={{ fontSize: 12, color: "var(--sdp-text-faint)", fontWeight: 500 }}>Investment</span>
                          </div>
                        </div>
                        {comp.description && (
                          <div style={{ padding: "14px 20px" }}>
                            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--sdp-text-secondary)", fontWeight: 400 }}>{comp.description}</p>
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}

              </div>

              {/* Focus Areas */}
              {(sectors.length > 0 || stages.length > 0 || geoFocus.length > 0) && (
                <div className="sdpCard">
                  <div className="sdpSectionHeader">
                    <div className="sdpSectionIcon"><Target size={15} strokeWidth={1.8} /></div>
                    <h2 className="sdpSectionTitle">Focus Areas</h2>
                  </div>
                  {sectors.length > 0 && (
                    <>
                      <p className="sdpTagGroupLabel">Industry Sectors</p>
                      <div className="sdpTagRow" style={{ marginBottom: 0 }}>
                        {sectors.map((s, i) => (
                          <span key={i} className="sdpTag">
                            <Tag size={11} strokeWidth={1.75} />
                            <span className="icontag">{s}</span>
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                  {/* {stages.length > 0 && (
                    <>
                      <p className="sdpTagGroupLabel" style={{ marginTop: 16 }}>Investment Stages</p>
                      <div className="sdpTagRow" style={{ marginBottom: 0 }}>
                        {stages.map((s, i) => (
                          <span key={i} className="sdpTag">
                            <Tag size={11} strokeWidth={1.75} />
                            <span className="icontag">{s}</span>
                          </span>
                        ))}
                      </div>
                    </>
                  )} */}
                </div>
              )}
            </div>

            {/*  RIGHT SIDEBAR  */}
            <div className="sdpRight">

              {/* CTA */}
              <div className="sdpCtaCard">
                <p className="sdpCtaTitle">Pitch to this Investor</p>
                <a href={investor.applyLink}  target="_blank" rel="noopener noreferrer"  className="sdpCtaPrimary" >
                  <ExternalLink size={14} strokeWidth={2} />
                  Apply here
                </a>
                <div className="regDivider" style={{ textAlign: "center", margin: "10px 0" }}>
                  <div className="regDividerLine" />
                  <span className="regDividerText">or</span>
                  <div className="regDividerLine" />
                </div>
                <button className="sdpCtaPrimary" type="button" onClick={() => setModalOpen(true)}>
                  <Send size={13} strokeWidth={1.75} />
                  Contact to Investor
                </button>
                <ApplyModal
                  isOpen={modalOpen}
                  onClose={() => setModalOpen(false)}
                  jobTitle={investor.fundName}
                  companyName={investor.publisherId?.companyName}
                  listingId={investor._id}
                  listingType="investor"
                />
                <button className="sdpCtaSecondary" type="button" onClick={handleShare}>
                  <Share2 size={14} strokeWidth={1.75} />
                  Share Profile
                </button>
              </div>

              {/* Fund Overview */}
              <div className="sdpInfoCard">
                <div className="sdpInfoBlock">
                  <div className="sdpInfoBlockTitle">
                    <span className="sdpInfoBlockIcon"><Briefcase size={14} strokeWidth={2} /></span>
                    Fund Overview
                  </div>
                  <div className="sdpRegRow">
                    <span className="sdpRegIcon"><BadgeCheck size={13} strokeWidth={1.75} /></span>
                    <div className="sdpRegMeta">
                      <span className="sdpRegLabel">Investor Type</span>
                      <span className="sdpRegValue">{getValue("investorType")}</span>
                    </div>
                  </div>
                  <div className="sdpRegRow">
                    <span className="sdpRegIcon"><DollarSign size={13} strokeWidth={1.75} /></span>
                    <div className="sdpRegMeta">
                      <span className="sdpRegLabel">Ticket Size</span>
                      <span className="sdpRegValue highlight">{getValue("investmentSize")}</span>
                    </div>
                  </div>
                  <div className="sdpRegRow">
                    <span className="sdpRegIcon"><Trophy size={13} strokeWidth={1.75} /></span>
                    <div className="sdpRegMeta">
                      <span className="sdpRegLabel">Experience</span>
                      <span className="sdpRegValue">{getValue("investmentExperience")}</span>
                    </div>
                  </div>
                  {/* <div className="sdpRegRow">
                    <span className="sdpRegIcon"><Users size={13} strokeWidth={1.75} /></span>
                    <div className="sdpRegMeta">
                      <span className="sdpRegLabel">Portfolio</span>
                      <span className="sdpRegValue">{getValue("notableInvestments")}</span>
                    </div>
                  </div> */}
                </div>
              </div>

              {/* Location */}
              <div className="sdpInfoCard">
                <div className="sdpInfoBlock">
                  <div className="sdpInfoBlockTitle">
                    <span className="sdpInfoBlockIcon"><MapPin size={14} strokeWidth={2} /></span>
                    Location
                  </div>
                  <div className="sdpRegRow">
                    <span className="sdpRegIcon"><MapPin size={13} strokeWidth={1.75} /></span>
                    <div className="sdpRegMeta">
                      <span className="sdpRegLabel">State</span>
                      <span className="sdpRegValue">{getValue("fullAddress")}</span>
                    </div>
                  </div>
                                    <div className="sdpRegRow">
                    <span className="sdpRegIcon"><MapPin size={13} strokeWidth={1.75} /></span>
                    <div className="sdpRegMeta">
                      <span className="sdpRegLabel">Address</span>
                      <span className="sdpRegValue">{getValue("address")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Details – with login blur */}
              <div className="sdpInfoCard">
                <div className="sdpInfoBlock">
                  <div className="sdpInfoBlockTitle">
                    <span className="sdpInfoBlockIcon"><Mail size={14} strokeWidth={2} /></span>
                    Contact Details
                  </div>
                  <div className={`sdpContactContent ${!user ? "sdpBlurred" : ""}`}>
                    {getValue("contactName") !== "N/A" && (
                      <div className="sdpRegRow">
                        <div className="sdpContactIcon"><Users size={13} strokeWidth={1.75} /></div>
                        <div className="sdpRegMeta">
                          <span className="sdpRegLabel">Contact Person</span>
                          <span className="sdpRegValue">{getValue("contactName")}</span>
                        </div>
                      </div>
                    )}
                    {getValue("email") !== "N/A" && (
                      <div className="sdpRegRow">
                        <div className="sdpContactIcon"><Mail size={13} strokeWidth={1.75} /></div>
                        <div className="sdpRegMeta">
                          <span className="sdpRegLabel">Email</span>
                          <a href={`mailto:${getValue("email")}`} className="sdpInfoLineLink">{getValue("email")}</a>
                        </div>
                      </div>
                    )}
                    {getValue("phone") !== "N/A" && (
                      <div className="sdpRegRow">
                        <div className="sdpContactIcon"><Phone size={13} strokeWidth={1.75} /></div>
                        <div className="sdpRegMeta">
                          <span className="sdpRegLabel">Phone</span>
                          <a href={`tel:${getValue("phone")}`} className="sdpInfoLineLink">{getValue("phone")}</a>
                        </div>
                      </div>
                    )}
                    {getValue("website") !== "#" && (
                      <div className="sdpRegRow">
                        <div className="sdpContactIcon"><Globe size={13} strokeWidth={1.75} /></div>
                        <div className="sdpRegMeta">
                          <span className="sdpRegLabel">Website</span>
                          <a href={getValue("website")} target="_blank" rel="noopener noreferrer" className="sdpInfoLineLink">
                            {getValue("website").replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      </div>
                    )}
                    {getValue("linkedin") !== "#" && (
                      <div className="sdpRegRow">
                        <div className="sdpContactIcon"><Link2 size={13} strokeWidth={1.75} /></div>
                        <div className="sdpRegMeta">
                          <span className="sdpRegLabel">LinkedIn</span>
                          <a href={getValue("linkedin")} target="_blank" rel="noopener noreferrer" className="sdpInfoLineLink">
                            {getValue("linkedin").replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  {!user && (
                    <div className="sdpBlurOverlay">
                      <div className="sdpBlurCard">
                        <User size={24} color="#7c3aed" />
                        <p>Login to view contact details</p>
                        <a href="/login" className="sdpBlurLogin">
                          Login <ChevronRight size={14} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}