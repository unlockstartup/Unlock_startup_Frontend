"use client";

import { useEffect, useState, useCallback } from "react";
import { Briefcase, CalendarDays, Trophy, Package, Settings } from "lucide-react";
import publisherApi from "@/app/publisherapi";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const BLUE = "#0194df";

const TYPE_META = {
  jobs:         { label: "Job",         color: BLUE, bg: "#fff4f0", icon: "💼" },
  competitions: { label: "Competition", color: BLUE, bg: "#f0f8ff", icon: "🏆" },
  events:       { label: "Event",       color: BLUE, bg: "#f0fdf6", icon: "📅" },
  products:     { label: "Product",     color: BLUE, bg: "#f1f5f9", icon: "📦" },
  services:     { label: "Service",     color: BLUE, bg: "#f5f3ff", icon: "⚙️" },
  investors:    { label: "Investor",    color: BLUE, bg: "#fffbea", icon: "💰" },
};

/*  Helpers  */
const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

/*  API fetchers  */
const fetchStats    = () => publisherApi.get("/api/listings/apply-stats");
const fetchPlan     = () => publisherApi.get("/api/publisher/dashboard/getmyplan");
const fetchJobs     = () => publisherApi.get("/api/publisher/jobs");
const fetchComps    = () => publisherApi.get("/api/publisher/funding-calls");
const fetchEvents   = () => publisherApi.get("/api/publisher/dashboard/events");
const fetchProducts = () => publisherApi.get("/api/publisher/innovation-products/mine");
const fetchServices = () => publisherApi.get("/api/publisher/service-listings/mine");

/*  TypeBadge  */
function TypeBadge({ type }) {
  const m = TYPE_META[type] || { label: type, color: BLUE, bg: "#f1f5f9" };
  return (
    <span
      className="pd__badge"
      style={{
        background: m.bg,
        color: m.color,
        border: `1px solid ${m.color}33`,
      }}
    >
      {m.label}
    </span>
  );
}

/*  StatusBadge  */
function StatusBadge({ status }) {
  const s = status || "—";
  const color = s === "approved" ? "#065f46" : s === "rejected" ? "#7f1d1d" : "#78350f";
  const bg    = s === "approved" ? "rgba(29,191,115,.10)" : s === "rejected" ? "rgba(220,38,38,.08)" : "rgba(252,207,2,.12)";
  return (
    <span className="pd__badge" style={{ background: bg, color }}>
      {s}
    </span>
  );
}

/*  ClickBar  */
function ClickBar({ value, max, color }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="pd__click-bar-wrap">
      <div className="pd__click-bar-track">
        <div
          className="pd__click-bar-fill"
          style={{ width: `${pct}%`, background: color }}
        />
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

/*  Detail Modal  */
function DetailModal({ item, onClose }) {
  if (!item) return null;
  const m = TYPE_META[item._type] || {};
  const clicks = item._clicks ?? 0;

  const renderField = (label, val) => {
    if (val == null || val === "" || (Array.isArray(val) && val.length === 0)) return null;
    const display = Array.isArray(val) ? val.join(", ") : String(val);
    return { label, val: display };
  };

  const rows = [];

  rows.push(renderField("Title", item._title || item.title || item.productName || item.serviceTitle || item.fundName));
  rows.push(renderField("Description", item.description || item.detailedDescription || item.companyDescription || item.eventDescription || item.about));
  rows.push(renderField("Status", item.status || item.approvalStatus));
  rows.push(renderField("Location", item.location));
  rows.push(renderField("Apply Clicks", clicks > 0 ? clicks : null));

  if (item._type === "jobs") {
    rows.push(renderField("Company", item.companyName));
    rows.push(renderField("Company Website", item.companyWebsite));
    rows.push(renderField("Company Size", item.companySize));
    rows.push(renderField("Industry Sector", item.industrySector));
    rows.push(renderField("Job Category", item.jobCategory));
    rows.push(renderField("Job Type", item.jobType));
    rows.push(renderField("Work Mode", item.workMode));
    rows.push(renderField("Experience Level", item.experienceLevel));
    rows.push(renderField("Years Experience Required", item.yearsExperienceRequired ? `${item.yearsExperienceRequired}+ yrs` : null));
    rows.push(renderField("Openings", item.openings));
    rows.push(renderField("Salary", item.salaryMin ? `₹${(item.salaryMin / 100000).toFixed(0)}L – ₹${(item.salaryMax / 100000).toFixed(0)}L ${item.salaryType || ""}` : null));
    rows.push(renderField("Location Address", item.jobLocationAddress));
    rows.push(renderField("City", item.jobLocationCity));
    rows.push(renderField("State", item.jobLocationState));
    rows.push(renderField("Country", item.jobLocationCountry));
    rows.push(renderField("Apply By", fmt(item.applyLastDate)));
    rows.push(renderField("Application Method", item.applicationMethod));
    rows.push(renderField("External URL", item.externalApplicationUrl));
    rows.push(renderField("Hiring Manager", item.hiringManagerName));
    rows.push(renderField("Hiring Manager Email", item.hiringManagerEmail));
    rows.push(renderField("Hiring Manager Phone", item.hiringManagerPhone));
    rows.push(renderField("Role Overview", item.roleOverview));
    rows.push(renderField("Key Responsibilities", item.keyResponsibilities));
    rows.push(renderField("Required Education", item.requiredEducation));
    rows.push(renderField("Must-Have Skills", item.mustHaveSkills));
    rows.push(renderField("Company Description", item.companyDescription));
    rows.push(renderField("Active", item.isActive != null ? (item.isActive ? "Yes" : "No") : null));
  }

  else if (item._type === "competitions") {
    rows.push(renderField("Organizer", item.organizingCompany));
    rows.push(renderField("Organizer Type", item.organizerType));
    rows.push(renderField("Challenge Type", item.challengeType));
    rows.push(renderField("Category", item.challengeCategory));
    rows.push(renderField("Objective", item.challengeObjective));
    rows.push(renderField("Problem Statement", item.problemStatement));
    rows.push(renderField("Key Focus Areas", item.keyFocusAreas));
    rows.push(renderField("Who can participate", item.eligibleParticipants));
    rows.push(renderField("Startup Stage", item.startupStage));
    rows.push(renderField("Geographic Restrictions", item.geographicRestrictions));
    rows.push(renderField("Start Date", fmt(item.launchDate)));
    rows.push(renderField("Submission Deadline", fmt(item.submissionDeadline || item.deadline)));
    rows.push(renderField("Result Date", fmt(item.resultDate)));
    rows.push(renderField("Result Date", fmt(item.applicationType)));
    rows.push(renderField("Application Fee", item.applicationFee > 0 ? `₹${item.applicationFee}` : "Free"));
    rows.push(renderField("Registration Link", item.registrationLink));
    rows.push(renderField("Contact Person", item.contactPersonName));
    rows.push(renderField("Official Email", item.officialEmail));
    rows.push(renderField("Contact Phone", item.contactPhone));
    rows.push(renderField("Additional Rewards", item.additionalRewards));
    rows.push(renderField("Active", item.isActive != null ? (item.isActive ? "Yes" : "No") : null));
  }

  else if (item._type === "events") {
    rows.push(renderField("Company Name", item.organizationName));
    rows.push(renderField("Company Website", item.organizationWebsite));
    rows.push(renderField("Event Type", item.eventType));
    rows.push(renderField("Categories", item.eventCategory));
    rows.push(renderField("Format", item.eventFormat));
    rows.push(renderField("Venue", item.venueName));
    rows.push(renderField("Full Address", item.fullAddress));
    rows.push(renderField("Start Date", fmt(item.startDateTime || item.startDate)));
    rows.push(renderField("End Date", fmt(item.endDateTime || item.endDate)));
    rows.push(renderField("Registration Deadline", fmt(item.registrationDeadline)));
    rows.push(renderField("Registration Type", item.registrationType));
    rows.push(renderField("Registration Price", item.registrationPrice ? `₹${item.registrationPrice}` : null));
    rows.push(renderField("Ticket Tiers", item.ticketPricingTiers?.map(t => `${t.label}: ₹${t.price}`).join(", ")));
    rows.push(renderField("Registration URL", item.registrationUrl));
    rows.push(renderField("Target Audience", item.targetAudience));
    rows.push(renderField("Key Topics", item.keyTopics));
    rows.push(renderField("Featured Speakers", item.featuredSpeakers));
    rows.push(renderField("Attendee Benefits", item.attendeeBenefits));
    rows.push(renderField("Organizer Contact", item.organizerContactPerson));
    rows.push(renderField("Work Email", item.workEmail));
    rows.push(renderField("Phone Number", item.phoneNumber));
    rows.push(renderField("Event Description", item.eventDescription));
    rows.push(renderField("Active", item.isActive != null ? (item.isActive ? "Yes" : "No") : null));
  }

  else if (item._type === "products") {
    rows.push(renderField("Company", item.companyName));
    rows.push(renderField("Brand", item.brandName));
    rows.push(renderField("Established Year", item.establishedYear));
    rows.push(renderField("Category", item.innovationCategory));
    rows.push(renderField("Technology", item.technology));
    rows.push(renderField("Product Status", item.productStatus));
    rows.push(renderField("Innovation Status", item.innovationStatus));
    rows.push(renderField("Patent Status", item.patentStatus));
    rows.push(renderField("Target Industry", item.targetIndustry));
    rows.push(renderField("Challenge Solved", item.challengeSolved));
    rows.push(renderField("Company/Institution", item.companyInstitution));
    rows.push(renderField("Founder Name", item.founderName));
    rows.push(renderField("Key Features", item.keyFeatures));
    rows.push(renderField("Product Demo URL", item.productDemoUrl));
    rows.push(renderField("Awards & Recognition", item.awardsRecognition));
    rows.push(renderField("Short Description", item.shortProductDescription));
    rows.push(renderField("Contact Email", item.contactEmail));
    rows.push(renderField("Contact Number", item.contactNumber));
    rows.push(renderField("Website", item.websiteUrl));
    rows.push(renderField("Active", item.isActive != null ? (item.isActive ? "Yes" : "No") : null));
  }

  else if (item._type === "services") {
    rows.push(renderField("Company", item.companyName));
    rows.push(renderField("Brand", item.brandName));
    rows.push(renderField("Established Year", item.establishedYear));
    rows.push(renderField("Service Title", item.serviceTitle));
    rows.push(renderField("Category", item.serviceCategory));
    rows.push(renderField("Service Type", item.serviceType));
    rows.push(renderField("Service Area", item.serviceArea));
    rows.push(renderField("Target Industry", item.targetIndustry));
    rows.push(renderField("Team Size", item.teamSize));
    rows.push(renderField("Certifications", item.certifications));
    rows.push(renderField("Benefits", item.benefits));
    rows.push(renderField("Detailed Description", item.detailedDescription));
    rows.push(renderField("Contact Email", item.contactEmail));
    rows.push(renderField("Contact Number", item.contactNumber));
    rows.push(renderField("Contact Address", item.contactAddress));
    rows.push(renderField("Website", item.websiteUrl));
    rows.push(renderField("Rejection Reason", item.rejectionReason || null));
    rows.push(renderField("Active", item.isActive != null ? (item.isActive ? "Yes" : "No") : null));
  }

  else if (item._type === "investors") {
    rows.push(renderField("Fund Name", item.fundName || item.title));
    rows.push(renderField("Investor Type", item.investorType));
    rows.push(renderField("Fund Size", item.fundSize ? `${item.fundSize} ${item.currency || ""}` : null));
    rows.push(renderField("Currency", item.currency));
    rows.push(renderField("Years of Experience", item.yearsOfExperience));
    rows.push(renderField("Ticket Size", item.ticketSize ? `Min: ${item.ticketSize.minimum} – Max: ${item.ticketSize.maximum} ${item.currency || ""}` : null));
    rows.push(renderField("Preferred Stages", item.preferredStages));
    rows.push(renderField("Geographic Focus", item.geographicFocus));
    rows.push(renderField("Industry Sector Focus", item.industrySectorFocus));
    rows.push(renderField("Portfolio Companies Count", item.portfolioCompaniesCount));
    rows.push(renderField("Portfolio Companies", item.portfolioCompanies?.map(p => `${p.companyName}${p.description ? ` (${p.description})` : ""}`).join(", ")));
    rows.push(renderField("About", item.about));
    rows.push(renderField("Contact Name", item.contact?.name));
    rows.push(renderField("Designation", item.contact?.title));
    rows.push(renderField("Contact Email", item.contact?.email));
    rows.push(renderField("Contact Phone", item.contact?.phone));
    rows.push(renderField("LinkedIn", item.linkedIn));
    rows.push(renderField("Office Location", item.officeLocation));
    rows.push(renderField("Profile Visibility", item.profileVisibility));
    rows.push(renderField("Apply Link", item.applyLink));
  }

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

        {/* Body - Full Details */}
        <div className="pd__modal-body pd__modal-body--scrollable">
          <div className="pd__modal-grid pd__modal-grid--full">
            {validRows.map(({ label, val }) => (
              <div key={label} className="pd__modal-field">
                <div className="pd__modal-field-label">{label}</div>
                <div className="pd__modal-field-value">{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pd__modal-footer">
          <button className="pd__modal-close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default function ListingsAnalytics() {
  const [stats,   setStats]   = useState(null);
  const [plan,    setPlan]    = useState(null);
  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("all");
  const [preview, setPreview] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, planRes, jobsRes, compRes, eventsRes, productsRes, servicesRes] =
        await Promise.allSettled([fetchStats(), fetchPlan(), fetchJobs(), fetchComps(), fetchEvents(), fetchProducts(), fetchServices()]);

      if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
      if (planRes.status  === "fulfilled") setPlan(planRes.value.data);

      const jobMap = {}, compMap = {}, eventsMap = {}, productsMap = {}, servicesMap = {};
      if (jobsRes.status     === "fulfilled") (jobsRes.value.data?.jobs ?? jobsRes.value.data?.items ?? []).forEach(j => { jobMap[j._id] = j; });
      if (compRes.status     === "fulfilled") (compRes.value.data?.items ?? compRes.value.data?.fundings ?? []).forEach(c => { compMap[c._id] = c; });
      if (eventsRes.status   === "fulfilled") (eventsRes.value.data?.items ?? []).forEach(e => { eventsMap[e._id] = e; });
      if (productsRes.status === "fulfilled") (productsRes.value.data?.products ?? []).forEach(p => { productsMap[p._id] = p; });
      if (servicesRes.status === "fulfilled") (servicesRes.value.data?.listings ?? []).forEach(s => { servicesMap[s._id] = s; });

      const rows = [];
      const bd = statsRes.status === "fulfilled" ? (statsRes.value.data?.breakdown ?? {}) : {};

      const pushFromStats = (type, arr, map, titleKey) => {
        arr.forEach(item => {
          const detail = map[String(item.id)] ?? {};
          rows.push({ ...detail, ...item, _id: item.id, _type: type, _title: item.title || detail[titleKey] || detail.title || "—", _clicks: item.applyClicks ?? item.submissionCount ?? 0 });
        });
      };
      pushFromStats("jobs",         bd.jobs         ?? [], jobMap,      "title");
      pushFromStats("competitions", bd.competitions  ?? [], compMap,     "title");
      pushFromStats("events",       bd.events        ?? [], eventsMap,   "title");
      pushFromStats("products",     bd.products      ?? [], productsMap, "productName");
      pushFromStats("services",     bd.services      ?? [], servicesMap, "serviceTitle");
      pushFromStats("investors",    bd.investors     ?? [], {},          "fundName");

      const addZero = (type, items, titleKey) => {
        items.forEach(item => {
          if (!rows.find(r => String(r._id) === String(item._id))) {
            rows.push({ ...item, _id: item._id, _type: type, _title: item[titleKey] || item.title || "—", _clicks: 0 });
          }
        });
      };
      addZero("jobs",         Object.values(jobMap),      "title");
      addZero("competitions", Object.values(compMap),     "title");
      addZero("events",       Object.values(eventsMap),   "title");
      addZero("products",     Object.values(productsMap), "productName");
      addZero("services",     Object.values(servicesMap), "serviceTitle");

      rows.sort((a, b) => (b._clicks || 0) - (a._clicks || 0));
      setAllRows(rows);
    } catch (err) {
      console.error("ListingsAnalytics load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  /*  Derived values  */
  const summary = stats?.summary ?? {};
  const grand   = stats?.grandTotal ?? 0;
  const usage   = plan?.usage  ?? {};
  const limits  = plan?.limits ?? {};
  const isTrial = plan?.plan?.plan === "trial" || plan?.serviceplan?.plan === "trial";

  const overviewCards = [
    { label: "Jobs",         value: usage.jobs            ?? 0, Icon: Briefcase   },
    { label: "Events",       value: usage.events           ?? 0, Icon: CalendarDays },
    { label: "Competitions", value: usage.fundingCalls     ?? 0, Icon: Trophy       },
    { label: "Products",     value: usage.products         ?? 0, Icon: Package      },
    { label: "Services",     value: usage.serviceListings  ?? 0, Icon: Settings     },
  ];

  const barData = [
    { name: "Jobs",         value: usage.jobs            ?? 0 },
    { name: "Events",       value: usage.events           ?? 0 },
    { name: "Competitions", value: usage.fundingCalls     ?? 0 },
    { name: "Products",     value: usage.products         ?? 0 },
    { name: "Services",     value: usage.serviceListings  ?? 0 },
  ];

  const clicksData = [
    { label: "Job",         value: summary.jobs         ?? 0 },
    { label: "Competition", value: summary.competitions  ?? 0 },
    { label: "Event",       value: summary.events        ?? 0 },
    { label: "Product",     value: summary.products      ?? 0 },
    { label: "Service",     value: summary.services      ?? 0 },
    { label: "Investor",    value: summary.investors     ?? 0 },
  ].filter(d => d.value > 0);

  const totalListings  = Object.values(usage).reduce((a, b) => a + (b || 0), 0);
  const activeListings = allRows.filter(r => (r._clicks || 0) > 0).length;
  const engagementPct  = totalListings > 0 ? Math.round((activeListings / totalListings) * 100) : 0;

  const getLimitLeft = (row) => {
    if (row._type === "jobs")         return limits.jobLimit           != null ? Math.max(0, (limits.jobLimit           || 0) - (usage.jobs            || 0)) : null;
    if (row._type === "competitions") return limits.fundingCallsLimit  != null ? Math.max(0, (limits.fundingCallsLimit  || 0) - (usage.fundingCalls    || 0)) : null;
    if (row._type === "events")       return limits.eventLimit         != null ? Math.max(0, (limits.eventLimit         || 0) - (usage.events           || 0)) : null;
    if (row._type === "products")     return limits.productsLimit      != null ? Math.max(0, (limits.productsLimit      || 0) - (usage.products         || 0)) : null;
    if (row._type === "services")     return limits.serviceListingLimit != null ? Math.max(0, (limits.serviceListingLimit || 0) - (usage.serviceListings || 0)) : null;
    return null;
  };

  const filtered  = filter === "all" ? allRows : allRows.filter(r => r._type === filter);
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
          {["all", "jobs", "competitions", "events", "products", "services"].map(t => (
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
                    { h: "#",                   align: "pd__th--left"   },
                    { h: "Listing Name",         align: "pd__th--left"   },
                    { h: "Type",                 align: "pd__th--left"   },
                    { h: "Status",               align: "pd__th--left"   },
                    { h: "Apply Clicks",         align: "pd__th--left"   },
                    { h: "Creation Limit Left",  align: "pd__th--center" },
                    { h: "",                     align: "pd__th--right"  },
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
        style={{ color: isTrial ? "#7c3aed" : "#7f1d1d" }}
      >
        {isTrial ? "Trial" : "Limit reached"}
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