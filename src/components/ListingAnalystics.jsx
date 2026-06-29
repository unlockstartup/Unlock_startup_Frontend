
"use client";

import { useEffect, useState, useCallback } from "react";
import { Briefcase, CalendarDays, Trophy, Package, Settings, DollarSign } from "lucide-react";
import publisherApi from "@/app/publisherapi";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const BLUE = "#0194df";
const fmtINR = (val) => {
  if (!val) return null;
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(2).replace(/\.00$/, "")} L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(2).replace(/\.00$/, "")} K`;
  return `₹${val}`;
};
const TYPE_META = {
  jobs: { label: "Job", color: BLUE, bg: "#fff4f0", icon: "💼" },
  competitions: { label: "Competition", color: BLUE, bg: "#f0f8ff", icon: "🏆" },
  events: { label: "Event", color: BLUE, bg: "#f0fdf6", icon: "📅" },
  products: { label: "Product", color: BLUE, bg: "#f1f5f9", icon: "📦" },
  services: { label: "Service", color: BLUE, bg: "#f5f3ff", icon: "⚙️" },
  investors: { label: "Investor", color: BLUE, bg: "#fffbea", icon: "💰" },
};

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
const fmtDateTime = (d) =>
  d ? new Date(d).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  }) : "—";
const fetchStats = () => publisherApi.get("/api/listings/apply-stats");
const fetchPlan = () => publisherApi.get("/api/publisher/dashboard/getmyplan");
const fetchJobs = () => publisherApi.get("/api/publisher/jobs");
const fetchComps = () => publisherApi.get("/api/publisher/funding-calls");
const fetchEvents = () => publisherApi.get("/api/publisher/dashboard/events");
const fetchProducts = () => publisherApi.get("/api/publisher/innovation-products/mine");
const fetchServices = () => publisherApi.get("/api/publisher/service-listings/mine");
const investorProfile = () => publisherApi.get("/api/publisher/investors/mine");

function TypeBadge({ type }) {
  const m = TYPE_META[type] || { label: type, color: BLUE, bg: "#f1f5f9" };
  return (
    <span
      className="pd__badge"
      style={{ background: m.bg, color: m.color, border: `1px solid ${m.color}33` }}
    >
      {m.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const s = status || "—";
  const color = s === "approved" ? "#065f46" : s === "rejected" ? "#7f1d1d" : "#78350f";
  const bg = s === "approved" ? "rgba(29,191,115,.10)" : s === "rejected" ? "rgba(220,38,38,.08)" : "rgba(252,207,2,.12)";
  return (
    <span className="pd__badge" style={{ background: bg, color }}>{s}</span>
  );
}

function ClickBar({ value, max, color }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="pd__click-bar-wrap">
      <div className="pd__click-bar-track">
        <div className="pd__click-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="pd__click-bar-val" style={{ color }}>{value}</span>
    </div>
  );
}

/*  Custom Recharts Tooltip  */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="pd__tooltip">
      <div className="pd__tooltip-label">{label}</div>
      <div className="pd__tooltip-value" style={{ color: payload[0].color }}>
        {payload[0].value} listings
      </div>
    </div>
  );
}

function DetailModal({ item, onClose }) {
  if (!item) return null;
  const [logoPreview, setLogoPreview] = useState(null);
  const m = TYPE_META[item._type] || {};
  const clicks = item._clicks ?? 0;

  const renderField = (label, val) => {
    if (val == null || val === "" || (Array.isArray(val) && val.length === 0)) return null;
    const display = Array.isArray(val) ? val.join(", ") : String(val);
    return { label, val: display, isLink: false, isFallback: false };
  };
  const renderImage = (label, url) => {
    if (!url) return null;
    return { label, val: url, isLink: false, isFallback: false, isImage: true };
  };
const renderImages = (label, arr) => {
  if (!arr) return null;
  const safeArr = Array.isArray(arr) ? arr : Object.values(arr).filter(v => v && typeof v === "object");
  if (!safeArr.length) return null;
  const urls = safeArr.map(a => a?.url).filter(Boolean);
  if (!urls.length) return null;
  return { label, val: urls, isImages: true };
};
const renderBullets = (label, val) => {
  if (!val) return null;
  const lines = val
    .split("\n")
    .map(l => l.replace(/^[•\-\*]\s*/, "").trim())
    .filter(Boolean);
  if (!lines.length) return null;
  return { label, val: lines, isBullets: true };
};
  const renderLink = (label, url, fallbackLabel = null) => {
    if (url) return { label, val: url, isLink: true, href: url, isFallback: false };
    if (fallbackLabel) return { label, val: fallbackLabel, isLink: false, isFallback: true };
    return null;
  };

  const rows = [];
  if (item._type === "jobs") {
    rows.push(renderImage("Company Logo", item.companyLogo?.url));
    rows.push(renderField("Job Title / Position Name", item.title));
    rows.push(renderField("Job Category", item.jobCategory));
    rows.push(renderField("Number of Openings", item.openings));
    rows.push(renderField("Job Type", item.jobType));
    rows.push(renderField("Work Mode", item.workMode));
    rows.push(renderField("Experience Level", item.experienceLevel));
    rows.push(renderField("Required Education", item.requiredEducation));
    rows.push(renderField("Company / Startup Name", item.companyName));
    rows.push(renderLink("Company Website", item.companyWebsite));
    rows.push(renderField("Company Size", item.companySize));
    rows.push(renderField("Industry / Sector", item.industrySector));
    rows.push(renderField("Company Details", item.description || item.detailedDescription || item.companyDescription || item.about));
    rows.push(renderField("Hiring Manager Name", item.hiringManagerName));
    rows.push(renderField("Hiring Manager Email", item.hiringManagerEmail));
    rows.push(renderField("Hiring Manager Phone", item.hiringManagerPhone));
    rows.push(renderField("Role Overview", item.roleOverview));
    rows.push(renderField("Key Responsibilities", item.keyResponsibilities));
    rows.push(renderField("Years of Experience Required", item.yearsExperienceRequired ? `${item.yearsExperienceRequired}+ yrs` : null));
    rows.push(renderField("Must-Have Skills", item.mustHaveSkills));
    rows.push(renderField("Minimum (₹)", item.salaryMin ? `₹${(item.salaryMin / 100000).toFixed(0)}L` : null));
    rows.push(renderField("Maximum (₹)", item.salaryMax ? `₹${(item.salaryMax / 100000).toFixed(0)}L` : null));
    rows.push(renderField("Salary Type", item.salaryType));
    rows.push(renderField("Office Address", item.jobLocationAddress));
    rows.push(renderField("City", item.jobLocationCity));
    rows.push(renderField("State", item.jobLocationState));
    rows.push(renderField("Application Deadline", fmt(item.applyLastDate)));
    rows.push(renderField("Expected Start Date", fmt(item.applyDate)));
    rows.push(renderLink("External Application URL", item.externalApplicationUrl));
  }

  else if (item._type === "competitions") {
    rows.push(renderImage("Main Image", item.attachments?.[0]?.url));
    rows.push(renderField("Challenge Name / Title", item.title || item.fundName));
    rows.push(renderField("Challenge Type", item.challengeType));
    rows.push(renderField("Challenge Category", item.challengeCategory));
    rows.push(renderField("Startup Stage Requirements", item.startupStage));
    rows.push(renderField("Start Date", fmt(item.launchDate || item.startDate)));
    rows.push(renderField("Submission Deadline", fmt(item.submissionDeadline || item.deadline)));
    rows.push(renderField("Result Date", fmt(item.resultDate)));
    rows.push(renderField("Company Name", item.organizingCompany));
    rows.push(renderField("Company Type", item.organizerType));
    rows.push(renderField("Contact Person Name", item.contactPersonName));
    rows.push(renderField("Official Email", item.officialEmail));
    rows.push(renderField("Contact Person Phone", item.contactPhone));
    rows.push(renderLink("Website Url", item.websiteUrl || item.registrationLink));
    rows.push(renderField("Problem Statement", item.problemStatement));
    rows.push(renderField("Description", item.description || item.detailedDescription || item.about));
    rows.push(renderField("Challenge Objective", item.challengeObjective));
    rows.push(renderField("Key Focus Areas", item.keyFocusAreas));
    rows.push(renderField("Who can participate", item.eligibleParticipants));
    rows.push(renderField("Additional Rewards", item.additionalRewards));
    rows.push(renderField("Application Type", item.applicationType));
    rows.push(renderField("Location", item.location || item.geographicRestrictions));
    rows.push(renderLink("Registration Link", item.registrationLink));
  }

  else if (item._type === "events") {
    rows.push(renderField("Event Name / Title", item.title));
    rows.push(renderField("Event Type", item.eventType));
    rows.push(renderField("Event Category", Array.isArray(item.eventCategory) ? item.eventCategory.join(", ") : item.eventCategory));
    rows.push(renderField("Event Format", item.eventFormat));
    rows.push(renderField("Start Date & Time", fmtDateTime(item.startDateTime)));
    rows.push(renderField("End Date & Time", fmtDateTime(item.endDateTime)));
    rows.push(renderField("Venue Name", item.venueName));
    rows.push(renderField("Full Address", item.fullAddress));
    rows.push(renderField("State", item.jobLocationState));
    rows.push(renderField("Company Name", item.organizationName));
    rows.push(renderField("Company Contact Person", item.organizerContactPerson));
    rows.push(renderField("Work Email", item.workEmail));
    rows.push(renderField("Phone Number", item.phoneNumber));
    rows.push(renderLink("Company Website", item.organizationWebsite));
    rows.push(renderField("About / Event Description", item.eventDescription || item.description));
    rows.push(renderField("Featured Speakers", item.featuredSpeakers));
    rows.push(renderField("Target Audience", Array.isArray(item.targetAudience) ? item.targetAudience.join(", ") : item.targetAudience));
    rows.push(renderField("Key Topics", Array.isArray(item.keyTopics) ? item.keyTopics.join(", ") : item.keyTopics));
    rows.push(renderField("Attendee Benefits", Array.isArray(item.attendeeBenefits) ? item.attendeeBenefits.join(", ") : item.attendeeBenefits));
    rows.push(renderField("Registration Type", item.registrationType));
    rows.push(renderField("Registration Deadline", fmtDateTime(item.registrationDeadline)));
    rows.push(renderField("Ticket Tiers", item.ticketPricingTiers?.length ? item.ticketPricingTiers.map(t => `${t.label}: ₹${t.price}`).join(", ") : null));
    rows.push(renderLink("Registration Link / URL", item.registrationUrl, "Apply via Platform"));
  }

  else if (item._type === "products") {
    rows.push(renderImage("Product Logo / Icon", item.productLogo?.url));
    rows.push(renderField("Company Name", item.companyName));
    rows.push(renderField("Established Year", item.establishedYear));
    rows.push(renderField("Brand Name", item.brandName));
    rows.push(renderField("Product Name", item.productName));
    rows.push(renderField("Product Category", item.innovationCategory));
    rows.push(renderImages("Product Images", item.productImages));
    rows.push(renderField("Technology", item.technology));
    rows.push(renderField("Patent / IP Status", item.patentStatus));
    rows.push(renderField("Short Product Description", item.shortProductDescription));
    rows.push(renderField("Detailed Description", item.detailedDescription || item.description));
    rows.push(renderField("Key Features / Innovations", item.keyFeatures));
    rows.push(renderLink("Product Demo / Video URL", item.productDemoUrl));
    rows.push(renderField("Target Industry / Market", item.targetIndustry));
    rows.push(renderField("Challenge Solved", item.challengeSolved));
    rows.push(renderField("Contact Email", item.contactEmail));
    rows.push(renderField("Contact Number", item.contactNumber));
    rows.push(renderLink("Website URL", item.websiteUrl));
    rows.push(renderField("Product Status", item.productStatus));
    rows.push(renderField("Innovation Status", item.innovationStatus));
    rows.push(renderField("Founder / Lead Innovator", item.founderName));
    rows.push(renderField("Awards / Recognition", item.awardsRecognition));
  }

else if (item._type === "services") {
  rows.push(renderField("Company Name", item.companyName));
  rows.push(renderField("Brand Name", item.brandName));
  rows.push(renderField("Established Year", item.establishedYear));
  rows.push(renderField("Service Title", item.serviceTitle));
  rows.push(renderField("Service Type", item.serviceType));
  rows.push(renderField("Service Plan", item.serviceCategory));
  rows.push(renderField("Detailed Description", item.detailedDescription || item.description));
  rows.push(renderBullets("Benefits / Key Features", item.benefits));
  rows.push(renderImages("Service Images", item.serviceImages));
  rows.push(renderField("Service Area", item.serviceArea));
  rows.push(renderField("Target Industry / Market", item.targetIndustry));
  rows.push(renderField("Certifications & Credentials", item.certifications));
  rows.push(renderField("Team Size", item.teamSize));
  rows.push(renderField("Contact Email", item.contactEmail));
  rows.push(renderField("Contact Number", item.contactNumber));
  rows.push(renderField("Contact Address", item.contactAddress));
  rows.push(renderLink("Website URL", item.websiteUrl));
}

  else if (item._type === "investors") {
    rows.push(renderImage("Profile Image", item.logo));
    rows.push(renderField("Investor Name", item.fundName || item.title));
    rows.push(renderField("Investor Type", item.investorType));
    rows.push(renderField("About", item.about));
    rows.push(renderField("Fund Size", item.fundSize ? `${fmtINR(item.fundSize)} ${item.currency !== "INR" ? item.currency || "" : ""}`.trim() : null));
    rows.push(renderField("Years of Experience", item.yearsOfExperience));

    rows.push(renderField("Portfolio Companies Count", item.portfolioCompaniesCount));
    rows.push(renderField("Ticket Size Range", item.ticketSize
      ? `Min: ${fmtINR(item.ticketSize.minimum)} – Max: ${fmtINR(item.ticketSize.maximum)}`
      : null
    ));
    rows.push(
      item.portfolioCompanies?.length
        ? { label: "Portfolio Companies", val: item.portfolioCompanies, isPortfolio: true }
        : null
    );
    rows.push(renderField("Preferred Stages", item.preferredStages));
    rows.push(renderField("Industry Sector Focus", item.industrySectorFocus));
    rows.push(renderField("Contact Person Name", item.contact?.name));
    rows.push(renderField("Designation", item.contact?.title));
    rows.push(renderField("Contact Email", item.contact?.email));
    rows.push(renderField("Contact Phone", item.contact?.phone));
    rows.push(renderLink("LinkedIn", item.linkedIn));
    rows.push(renderField("State", item.officeLocation));
    rows.push(renderField("Office Address", item.profileVisibility));
    rows.push(renderLink("Pitch Deck Apply Url", item.applyLink));
  }

  rows.push(renderField("Status", item.status || item.approvalStatus));

  const validRows = rows.filter(Boolean);

  return (
    <div className="pd__modal-overlay" onClick={onClose}>
      <div className="pd__modal pd__modal--full" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div
          className="pd__modal-header"
          style={{
            background: `${m.color || BLUE}10`,
            borderBottom: `1px solid ${m.color || BLUE}22`,
          }}
        >
          <div
            className="pd__modal-icon"
            style={{
              background: m.bg || "#f0f8ff",
              border: `1.5px solid ${m.color || BLUE}33`,
            }}
          >
            {m.icon || "📋"}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
              <TypeBadge type={item._type} />
              <span
                className="pd__badge"
                style={{
                  background: clicks > 0 ? "#fef3c7" : "#f1f5f9",
                  color: clicks > 0 ? "#92400e" : "#6b7280",
                  border: `1px solid ${clicks > 0 ? "#fde68a" : "#e2e8f0"}`,
                }}
              >
                {clicks} click{clicks !== 1 ? "s" : ""}
              </span>
              {item.isActive != null && (
                <span
                  className="pd__badge"
                  style={{
                    background: item.isActive ? "rgba(29,191,115,.10)" : "rgba(220,38,38,.08)",
                    color: item.isActive ? "#065f46" : "#7f1d1d",
                  }}
                >
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              )}
            </div>
            <h3 className="pd__modal-title">{item._title || "—"}</h3>
          </div>

          <button className="pd__modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="pd__modal-body pd__modal-body--scrollable">
          <div className="pd__modal-grid pd__modal-grid--full">
{validRows.map(({ label, val, isLink, href, isFallback, isPortfolio, isImage, isImages, isBullets }) => (
  <div key={label} className="pd__modal-field">
    <div className="pd__modal-field-label">{label}</div>
    <div className="pd__modal-field-value">

      {isImage ? (
        <>
          <img
            src={val}
            alt={label}
            onClick={() => setLogoPreview(val)}
            style={{
              maxHeight: 72,
              maxWidth: 180,
              objectFit: "contain",
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              background: "#f8fafc",
              padding: 6,
              cursor: "zoom-in",
            }}
            onError={e => { e.currentTarget.style.display = "none"; }}
          />
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
            Click to view full size
          </div>
        </>

      ) : isImages ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 2 }}>
          {val.map((url, i) => (
            <div key={i} style={{ position: "relative" }}>
              <img
                src={url}
                alt={`image-${i + 1}`}
                onClick={() => setLogoPreview(url)}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  cursor: "zoom-in",
                }}
                onError={e => { e.currentTarget.style.display = "none"; }}
              />
              <div style={{
                position: "absolute",
                bottom: 4,
                right: 4,
                background: "rgba(0,0,0,0.45)",
                borderRadius: 4,
                padding: "1px 5px",
                fontSize: 10,
                color: "#fff",
              }}>
                {i + 1}
              </div>
            </div>
          ))}
          <div style={{ width: "100%", fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
            Click any image to view full size
          </div>
        </div>

      ) : isPortfolio ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {val.map((p, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 8,
              padding: "6px 10px", borderRadius: 6,
              background: "#f8fafc", border: "1px solid #e2e8f0",
            }}>
              <span style={{
                minWidth: 22, height: 22, borderRadius: "50%",
                background: BLUE, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, flexShrink: 0,
              }}>
                {i + 1}
              </span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 20, color: "#1e293b" }}>{p.companyName}</div>
                {p.description && (
                  <div style={{ fontSize: 18, color: "#64748b", marginTop: 2 }}>{p.description}</div>
                )}
              </div>
            </div>
          ))}
        </div>

) : isBullets ? (
  <ul style={{
    margin: 0,
    paddingLeft: 0,
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  }}>
    {val.map((line, i) => (
      <li key={i} style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        fontSize: 20,
        color: "#1e293b",
        lineHeight: 1.5,
      }}>
        <span style={{
          marginTop: 8,
          flexShrink: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: BLUE,
          display: "inline-block",
        }} />
        {line}
      </li>
    ))}
  </ul>

      ) : isLink ? (
        <a
          href={href.startsWith("http") ? href : `https://${href}`}
          target="_blank"
          rel="noreferrer"
          style={{ color: BLUE, textDecoration: "underline", wordBreak: "break-all" }}
        >
          {val}
        </a>

      ) : isFallback ? (
        <span>{val}</span>

      ) : (
        val
      )}

    </div>
  </div>
))}
          </div>
        </div>

        {/* Footer */}
        <div className="pd__modal-footer">
          <button className="pd__modal-close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
      {logoPreview && (
        <div
          onClick={() => setLogoPreview(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setLogoPreview(null)}
            style={{
              position: "absolute",
              top: 20,
              right: 24,
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "50%",
              width: 38,
              height: 38,
              color: "#fff",
              fontSize: 18,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
            }}
          >
            ✕
          </button>

          {/* Image */}
          <img
            src={logoPreview}
            alt="Company Logo"
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: "88vw",
              maxHeight: "88vh",
              objectFit: "contain",
              borderRadius: 12,
              boxShadow: "0 8px 48px rgba(0,0,0,0.6)",
              background: "#fff",
              padding: 16,
            }}
          />

          {/* Hint */}
          <div style={{
            position: "absolute",
            bottom: 24,
            color: "rgba(255,255,255,0.5)",
            fontSize: 13,
          }}>
            Click anywhere outside to close
          </div>
        </div>
      )}
    </div>
  );
}

export default function ListingsAnalytics() {
  const [stats, setStats] = useState(null);
  const [plan, setPlan] = useState(null);
  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState(null);
  useEffect(() => {
    setCategory(localStorage.getItem("publisher_category"));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, planRes, jobsRes, compRes, eventsRes, productsRes, servicesRes, investorRes] =
        await Promise.allSettled([fetchStats(), fetchPlan(), fetchJobs(), fetchComps(), fetchEvents(), fetchProducts(), fetchServices(), investorProfile()]);
      if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
      if (planRes.status === "fulfilled") setPlan(planRes.value.data);

      const jobMap = {}, compMap = {}, eventsMap = {}, productsMap = {}, servicesMap = {}, investorMap = {};
      if (jobsRes.status === "fulfilled") (jobsRes.value.data?.jobs ?? jobsRes.value.data?.items ?? []).forEach(j => { jobMap[j._id] = j; });
      if (compRes.status === "fulfilled") (compRes.value.data?.items ?? compRes.value.data?.fundings ?? []).forEach(c => { compMap[c._id] = c; });
      if (eventsRes.status === "fulfilled") (eventsRes.value.data?.items ?? []).forEach(e => { eventsMap[e._id] = e; });
      if (productsRes.status === "fulfilled") (productsRes.value.data?.products ?? []).forEach(p => { productsMap[p._id] = p; });
      if (servicesRes.status === "fulfilled") (servicesRes.value.data?.listings ?? []).forEach(s => { servicesMap[s._id] = s; });
      if (investorRes.status === "fulfilled" && investorRes.value.data?.investor) {
        const inv = investorRes.value.data.investor;
        investorMap[String(inv._id)] = inv;
      }
      const rows = [];
      const bd = statsRes.status === "fulfilled" ? (statsRes.value.data?.breakdown ?? {}) : {};

const pushFromStats = (type, arr, map, titleKey) => {
  arr.forEach(item => {
    const detail = map[String(item.id)] ?? {};
    rows.push({
      ...detail,
      ...item,
      _id: item.id,
      _type: type,
      _title: item.title || detail[titleKey] || detail.title || "—",
      _clicks: item.total ?? item.applyClicks ?? item.submissionCount ?? 0,
      productImages: detail.productImages ?? [],
      attachments:   detail.attachments   ?? [],
      serviceImages: detail.serviceImages  ?? [], 
      companyLogo:   detail.companyLogo   ?? {},
      productLogo:   detail.productLogo   ?? {},
      mainImage:     detail.mainImage     ?? {},
    });
  });
};
      pushFromStats("jobs", bd.jobs ?? [], jobMap, "title");
      pushFromStats("competitions", bd.competitions ?? [], compMap, "title");
      pushFromStats("events", bd.events ?? [], eventsMap, "title");
      pushFromStats("products", bd.products ?? [], productsMap, "productName");
      pushFromStats("services", bd.services ?? [], servicesMap, "serviceTitle");
      pushFromStats("investors", bd.investors ?? [], investorMap, "fundName");

      const addZero = (type, items, titleKey) => {
        items.forEach(item => {
          if (!rows.find(r => String(r._id) === String(item._id))) {
            rows.push({ ...item, _id: item._id, _type: type, _title: item[titleKey] || item.title || "—", _clicks: 0 });
          }
        });
      };
      addZero("jobs", Object.values(jobMap), "title");
      addZero("competitions", Object.values(compMap), "title");
      addZero("events", Object.values(eventsMap), "title");
      addZero("products", Object.values(productsMap), "productName");
      addZero("services", Object.values(servicesMap), "serviceTitle");

      const cat = localStorage.getItem("publisher_category");
      const finalRows = cat === "investor"
        ? rows.filter(r => r._type !== "products")
        : rows.filter(r => r._type !== "investors");

      finalRows.sort((a, b) => (b._clicks || 0) - (a._clicks || 0));
      setAllRows(finalRows);
    } catch (err) {
      console.error("ListingsAnalytics load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const summary = stats?.summary ?? {};
  const grand = stats?.grandTotal ?? 0;
  const usage = plan?.usage ?? {};
  const limits = plan?.limits ?? {};
  const isTrial = plan?.plan?.plan === "trial" || plan?.serviceplan?.plan === "trial";

  const overviewCards = [
    { label: "Jobs", value: allRows.filter(r => r._type === "jobs").length, Icon: Briefcase },
    { label: "Events", value: allRows.filter(r => r._type === "events").length, Icon: CalendarDays },
    { label: "Competitions", value: allRows.filter(r => r._type === "competitions").length, Icon: Trophy },
    { label: "Services", value: allRows.filter(r => r._type === "services").length, Icon: Settings },
    ...(category !== "investor" ? [
      { label: "Products", value: allRows.filter(r => r._type === "products").length, Icon: Package },
    ] : []),
    ...(category === "investor" ? [
      { label: "Investor", value: allRows.filter(r => r._type === "investors").length, Icon: DollarSign },
    ] : []),
  ];

  const barData = [
    { name: "Jobs", value: allRows.filter(r => r._type === "jobs").length },
    { name: "Events", value: allRows.filter(r => r._type === "events").length },
    { name: "Competitions", value: allRows.filter(r => r._type === "competitions").length },
    { name: "Services", value: allRows.filter(r => r._type === "services").length },
    ...(category !== "investor" ? [
      { name: "Products", value: allRows.filter(r => r._type === "products").length },
    ] : []),
    ...(category === "investor" ? [
      { name: "Investor", value: allRows.filter(r => r._type === "investors").length },
    ] : []),
  ];

  const clicksData = [
    { label: "Job", value: summary.jobs ?? 0 },
    { label: "Competition", value: summary.competitions ?? 0 },
    {
      label: "Event", value: typeof summary.events === "object"
        ? (summary.events?.total ?? 0)
        : (summary.events ?? 0)
    },
    { label: "Product", value: summary.products ?? 0 },
    { label: "Service", value: summary.services ?? 0 },
    { label: "Investor", value: summary.investors ?? 0 },
  ].filter(d => d.value > 0);

  const totalListings = allRows.length;
  const activeListings = allRows.filter(r => (r._clicks || 0) > 0).length;
  const engagementPct = totalListings > 0 ? Math.round((activeListings / totalListings) * 100) : 0;
  const allTabs = [
    "all", "jobs", "competitions", "events", "services",
    ...(category !== "investor" ? ["products"] : []),
    ...(category === "investor" ? ["investors"] : []),
  ];

  const getLimitLeft = (row) => {
    if (row._type === "jobs") return limits.jobLimit != null ? Math.max(0, (limits.jobLimit || 0) - (usage.jobs || 0)) : null;
    if (row._type === "competitions") return limits.fundingCallsLimit != null ? Math.max(0, (limits.fundingCallsLimit || 0) - (usage.fundingCalls || 0)) : null;
    if (row._type === "events") return limits.eventLimit != null ? Math.max(0, (limits.eventLimit || 0) - (usage.events || 0)) : null;
    if (row._type === "products") return limits.productsLimit != null ? Math.max(0, (limits.productsLimit || 0) - (usage.products || 0)) : null;
    if (row._type === "services") return limits.serviceListingLimit != null ? Math.max(0, (limits.serviceListingLimit || 0) - (usage.serviceListings || 0)) : null;
    return null;
  };

  const filtered = filter === "all" ? allRows : allRows.filter(r => r._type === filter);
  const maxClicks = Math.max(1, ...allRows.map(r => r._clicks || 0));

  /*  Render  */
  return (
    <>
      <div className="pd__analytics-top-grid">

        {/*  Left: Listing Overview  */}
        <div className="pd__panel">
          <div className="pd__panel-header">
            <div className="pd__panel-header-left">
              <span className="pd__section-bar" />
              <span className="pd__panel-title">Created Listings Overview</span>
            </div>
            <span className="pd__panel-meta">Updated today</span>
          </div>

          {/* Count cards */}
          <div className="pd__count-grid">
            {overviewCards.map(({ label, value, Icon }) => (
              <div
                key={label}
                className="pd__count-card"
                style={{
                  border: `1px solid ${BLUE}22`,
                  boxShadow: `0 2px 8px ${BLUE}18, 0 1px 3px rgba(0,0,0,0.06)`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = `0 6px 20px ${BLUE}30, 0 2px 6px rgba(0,0,0,0.08)`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = `0 2px 8px ${BLUE}18, 0 1px 3px rgba(0,0,0,0.06)`;
                }}
              >
                <div
                  className="pd__count-card-icon"
                  style={{ background: `${BLUE}15` }}
                >
                  <Icon size={18} color={BLUE} strokeWidth={2} />
                </div>
                <div>
                  <div className="pd__count-card-value" style={{ color: BLUE }}>{value}</div>
                  <div className="pd__count-card-label">{label}</div>
                </div>
                <div
                  className="pd__count-card-bar"
                  style={{ background: `linear-gradient(90deg, ${BLUE}, ${BLUE}33)` }}
                />
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div className="pd__barchart-wrap">
            <ResponsiveContainer width="100%" height={165}>
              <BarChart data={barData} barCategoryGap="28%" margin={{ top: 6, right: 8, bottom: 0, left: -20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 22, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 15, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
                <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                  {barData.map((_, i) => <Cell key={i} fill={BLUE} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/*  Right: Apply Clicks  */}
        <div className="pd__panel" style={{ display: "flex", flexDirection: "column" }}>
          <div className="pd__panel-header">
            <div className="pd__panel-header-left">
              <span className="pd__section-bar" />
              <span className="pd__panel-title">Listing Apply Clicks</span>
            </div>
          </div>

          <div style={{ padding: "12px 20px", flex: 1 }}>
            {loading ? (
              <div className="pd__empty-state" style={{ paddingTop: 12 }}>Loading…</div>
            ) : clicksData.length === 0 ? (
              <div className="pd__empty-state">No clicks tracked yet.</div>
            ) : (
              clicksData.map(({ label, value }) => (
                <div key={label} className="pd__clicks-row">
                  <div className="pd__clicks-row-left">
                    <span className="pd__clicks-dot" style={{ background: BLUE }} />
                    <span className="pd__clicks-type-label">{label}</span>
                    <span className="pd__clicks-sub-label">apply clicks</span>
                  </div>
                  <span className="pd__clicks-value" style={{ color: BLUE }}>{value}</span>
                </div>
              ))
            )}
          </div>

          {/* Engagement % */}
          <div className="pd__engagement-footer">
            <div className="pd__engagement-meta">Overall engagement rate across all listings</div>
            <div className="pd__engagement-row">
              <div className="pd__engagement-pct" style={{ color: BLUE }}>{engagementPct}%</div>
              <div className="pd__engagement-track">
                <div className="pd__engagement-bar-bg">
                  <div
                    className="pd__engagement-bar-fill"
                    style={{
                      width: `${engagementPct}%`,
                      background: `linear-gradient(90deg, ${BLUE}, ${BLUE}99)`,
                    }}
                  />
                </div>
                <div className="pd__engagement-caption">
                  {activeListings} of {totalListings} listings got clicks
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  BOTTOM ROW: Listings Details table  */}
      <div className="pd__table-panel">

        {/* Header */}
        <div className="pd__panel-header">
          <div className="pd__panel-header-left">
            <span className="pd__section-bar" />
            <div>
              <span className="pd__panel-title">Listings Details</span>
              <span className="pd__panel-subtitle">
                {allRows.length} listing{allRows.length !== 1 ? "s" : ""} · {grand} total clicks
              </span>
            </div>
          </div>
          <button className="pd__refresh-btn" onClick={load} disabled={loading}>
            ↻ Refresh
          </button>
        </div>

        {/* Filter tabs */}
        <div className="pd__filter-bar">
          {allTabs.map(t => (
            <button
              key={t}
              className={`pd__filter-btn${filter === t ? " pd__filter-active" : ""}`}
              onClick={() => setFilter(t)}
            >
              {t === "all"
                ? `All (${allRows.length})`
                : `${t} (${allRows.filter(r => r._type === t).length})`}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="pd__table-scroll">
          {loading ? (
            <div className="pd__empty-state">Loading listings…</div>
          ) : filtered.length === 0 ? (
            <div className="pd__empty-state">No listings found.</div>
          ) : (
            <table className="pd__table">
              <thead className="pd__thead">
                <tr>
                  {[
                    { h: "#", align: "pd__th--left" },
                    { h: "Listing Name", align: "pd__th--left" },
                    { h: "Type", align: "pd__th--left" },
                    { h: "Status", align: "pd__th--left" },
                    { h: "Apply Clicks", align: "pd__th--left" },
                    { h: "Creation Limit Left", align: "pd__th--center" },
                    { h: "", align: "pd__th--right" },
                  ].map(({ h, align }, i) => (
                    <th key={i} className={`pd__th ${align}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => {
                  const m = TYPE_META[row._type] || {};
                  const limitLeft = getLimitLeft(row);

                  return (
                    <tr key={`${row._type}-${row._id}-${idx}`} className="pd__tr">

                      <td className="pd__td pd__td-index">{idx + 1}</td>

                      <td className="pd__td" style={{ maxWidth: 220 }}>
                        <div className="pd__listing-name" title={row._title}>{row._title}</div>
                        {(row.companyName || row.organizingCompany) && (
                          <div className="pd__listing-company">
                            {row.companyName || row.organizingCompany}
                          </div>
                        )}
                      </td>

                      <td className="pd__td"><TypeBadge type={row._type} /></td>

                      <td className="pd__td">
                        <StatusBadge status={row.status || row.approvalStatus} />
                      </td>

                      <td className="pd__td" style={{ minWidth: 140 }}>
                        <ClickBar value={row._clicks} max={maxClicks} color={m.color || BLUE} />
                      </td>

                      <td className="pd__td" style={{ textAlign: "center" }}>
                        {limitLeft !== null ? (
                          limitLeft === 0 ? (
                            <span
                              className="pd__limit-left"
                              style={{ color: "#7f1d1d" }}
                            >
                              Limit reached
                            </span>
                          ) : (
                            <span
                              className="pd__limit-left"
                              style={{ color: limitLeft <= 2 ? BLUE : "#059669" }}
                            >
                              {limitLeft} left
                            </span>
                          )
                        ) : (
                          <span className="pd__limit-none">—</span>
                        )}
                      </td>

                      <td className="pd__td" style={{ textAlign: "right" }}>
                        <button
                          className="pd__preview-btn"
                          onClick={() => setPreview(row)}
                          style={{
                            border: `1px solid ${BLUE}`,
                            color: BLUE,
                            background: "#f0f8ff",
                          }}
                        >
                          Preview
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {!loading && filtered.length > 0 && (
          <div className="pd__table-footer">
            Showing {filtered.length} of {allRows.length} listings
          </div>
        )}
      </div>

      {preview && <DetailModal item={preview} onClose={() => setPreview(null)} />}

    </>
  );
}