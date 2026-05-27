"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  User, Pencil, Lock, Bell, Briefcase, LogOut,
  Camera, Mail, Phone, MapPin, Globe,
  CheckCircle, GitBranch, Link2, AlertCircle, Loader2,
  Building2, Clock, CalendarDays, ChevronDown,
  PartyPopper, DollarSign
} from "lucide-react";
import "./profile-dashboard.css";
import api from "../api";

const BLUE   = "#0194df";
const ORANGE = "#e25c26";
const YELLOW = "#fccf02";

const sidebarItems = [
  {
    group: "Account",
    items: [
      { id: "profile",       label: "My Profile",    icon: User },
      { id: "edit",          label: "Edit Profile",  icon: Pencil },
    ],
  },
  {
    group: "Activity",
    items: [
      { id: "event-apps",    label: "Event Applications",    icon: PartyPopper },
      { id: "job-apps",      label: "Service Applications",  icon: Briefcase },
      { id: "investor-apps", label: "Investor Applications", icon: DollarSign },
    ],
  },
];

export default function ProfileDashboard() {
  const { user, logout, token, setUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab]     = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editData, setEditData] = useState({
    name:      user?.name                   || "",
    phone:     user?.phone                  || "",
    address:   user?.address                || "",
    bio:       user?.bio                    || "",
    website:   user?.website                || "",
    linkedin:  user?.socialLinks?.linkedin  || "",
    github:    user?.socialLinks?.github    || "",
    instagram: user?.socialLinks?.instagram || "",
    twitter:   user?.socialLinks?.twitter   || "",
  });
  const [saving, setSaving]   = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);
  const fileInputRef = useRef(null);

  const getInitials = (email) => (email ? email.charAt(0).toUpperCase() : "U");

  const handleLogout = () => { logout(); router.push("/login"); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    try {
      const { data } = await api.put("/api/auth/update-profile", {
        name:    editData.name,
        phone:   editData.phone,
        address: editData.address,
        bio:     editData.bio,
        website: editData.website,
        socialLinks: {
          linkedin:  editData.linkedin,
          github:    editData.github,
          instagram: editData.instagram,
          twitter:   editData.twitter,
        },
      });
      if (setUser) setUser(data.user);
      setSaveMsg({ type: "success", text: "Profile updated successfully" });
    } catch (err) {
      setSaveMsg({ type: "error", text: err.response?.data?.message || err.message });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(null), 3000);
    }
  };

  const submissionTypeFromTab = (tab) => {
    if (tab === "event-apps")    return "listing";
    if (tab === "investor-apps") return "investor";
    if (tab === "job-apps")      return "service";
    return null;
  };

  // Close sidebar when switching tabs on mobile
  const handleTabChange = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":       return <ProfileView user={user} editData={editData} getInitials={getInitials} fileInputRef={fileInputRef} />;
      case "edit":          return <EditProfile editData={editData} setEditData={setEditData} handleSave={handleSave} saving={saving} saveMsg={saveMsg} />;
      // case "notifications": return <Notifications />;
      case "event-apps":
      case "job-apps":
      case "investor-apps": return <Applications token={token} submissionType={submissionTypeFromTab(activeTab)} tabLabel={activeTab} />;
      default:              return <ProfileView user={user} editData={editData} getInitials={getInitials} fileInputRef={fileInputRef} />;
    }
  };

  return (
    <div className="pd-root">
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="pd-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ── Sidebar ── */}
      <aside className={`pd-sidebar ${sidebarOpen ? "pd-sidebar--open" : ""}`}>
        {/* Mobile-only close header */}
        <div className="pd-sidebar__header">
          <span style={{ fontWeight: 700, fontSize: 14, color: "#1f2937" }}>Menu</span>
          <button className="pd-close-btn" onClick={() => setSidebarOpen(false)} aria-label="Close menu">✕</button>
        </div>

        <div className="pd-avatar-wrap">
          <div className="pd-avatar-ring">
            {user?.profileurl?.url ? (
              <Image src={user.profileurl.url} alt="avatar" width={56} height={56} className="pd-avatar-img" />
            ) : (
              <div className="pd-avatar-placeholder">{getInitials(user?.email)}</div>
            )}
          </div>
          <p className="pd-avatar-name">{user?.name || "User"}</p>
          <span className="pd-avatar-role">{user?.role || "Member"}</span>
        </div>

        <nav className="pd-nav">
          {sidebarItems.map((group) => (
            <div key={group.group} className="pd-nav__group">
              <p className="pd-nav__label">{group.group}</p>
              {group.items.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleTabChange(id)}
                  className={`pd-nav__btn ${activeTab === id ? "pd-nav__btn--active" : ""}`}
                >
                  <Icon size={17} strokeWidth={activeTab === id ? 2.5 : 2} color={activeTab === id ? BLUE : "#9ca3af"} />
                  <span>{label}</span>
                  {activeTab === id && <div className="pd-active-pip" />}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div style={{ padding: "10px 14px", borderTop: "1px solid #e9ecef" }}>
          <button onClick={handleLogout} className="pd-logout-btn">
            <LogOut size={16} color={ORANGE} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="pd-main">
        {/* Topbar */}
        <div className="pd-topbar">
          <button
            className="pd-hamburger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            aria-expanded={sidebarOpen}
          >
            <span className="pd-hamburger__line" />
            <span className="pd-hamburger__line" />
            <span className="pd-hamburger__line" />
          </button>

          <div className="pd-breadcrumb">
            <Link href="/" className="pd-breadcrumb__link">Home</Link>
            <span className="pd-breadcrumb__sep">/</span>
            <span className="pd-breadcrumb__current">Dashboard</span>
          </div>

          <div className="pd-topbar__right">
            {/* <div className="pd-topbar__user">
              {user?.profileurl?.url ? (
                <Image src={user.profileurl.url} alt="avatar" width={32} height={32} className="pd-topbar__user-img" />
              ) : (
                <div className="pd-topbar__avatar-placeholder">{getInitials(user?.email)}</div>
              )}
              <span className="pd-topbar__user-name">{user?.name || user?.email}</span>
            </div> */}
          </div>
        </div>

        <div className="pd-page-body">{renderContent()}</div>
      </main>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Sub-components
══════════════════════════════════════════════ */

function OpportunityDetails({ sub, listingLoc, description, eventDates }) {
  if (sub.investorId) {
    const inv = sub.investorId;
    return (
      <DetailSection title="Investor Details" variant="blue">
        <DetailRow label="Fund name"     value={inv.fundName} />
        <DetailRow label="Investor type" value={inv.investorType} />
        <DetailRow label="Website"       value={inv.website} link />
        <DetailRow label="About"         value={description?.length > 200 ? description.slice(0, 200) + "…" : description} />
      </DetailSection>
    );
  }
  if (sub.serviceId) {
    const svc = sub.serviceId;
    return (
      <DetailSection title="Service Details" variant="blue">
        <DetailRow label="Service"  value={svc.serviceTitle} />
        <DetailRow label="Category" value={svc.serviceCategory} />
        <DetailRow label="Company"  value={svc.companyName} />
        <DetailRow label="About"    value={description?.length > 200 ? description.slice(0, 200) + "…" : description} />
      </DetailSection>
    );
  }
  return (
    <DetailSection title="Event Details" variant="blue">
      <DetailRow label="Location" value={listingLoc} />
      <DetailRow label="Dates"    value={eventDates} />
      <DetailRow label="About"    value={description?.length > 200 ? description.slice(0, 200) + "…" : description} />
    </DetailSection>
  );
}

function ProfileView({ user, editData, getInitials, fileInputRef }) {
  return (
    <div>
      <SectionHeading title="My Profile" subtitle="Your public profile overview" />

      <div className="pd-hero-card">
        <div className="pd-hero-banner" />
        <div className="pd-hero-body">
          <div className="pd-hero-avatar-wrap">
            {user?.profileurl?.url ? (
              <Image src={user.profileurl.url} alt="avatar" width={72} height={72} className="pd-hero-avatar" />
            ) : (
              <div className="pd-hero-avatar pd-hero-avatar--fallback">{getInitials(user?.email)}</div>
            )}
            <button className="pd-camera-btn" onClick={() => fileInputRef.current?.click()} title="Change photo" aria-label="Change photo">
              <Camera size={14} color="#6b7280" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} />
          </div>

          <div className="pd-hero-info">
            <h2 className="pd-hero-name">{editData.name || user?.name || "Your Name"}</h2>
            <p className="pd-hero-role">{user?.role || "Member"}</p>
            {editData.address && (
              <p className="pd-hero-meta">
                <MapPin size={13} color="#6b7280" />
                {editData.address}
              </p>
            )}
            {editData.website && (
              <a href={editData.website} className="pd-hero-link" target="_blank" rel="noreferrer">
                <Globe size={13} color={BLUE} />
                {editData.website}
              </a>
            )}
          </div>

          <div className="pd-hero-badge">
            <span className="pd-verified-badge">
              <CheckCircle size={12} color="#1f2937" />
              Verified
            </span>
          </div>
        </div>

        {editData.bio && (
          <div className="pd-hero-bio"><p>{editData.bio}</p></div>
        )}
      </div>

      <div className="pd-info-grid">
        <InfoCard title="Contact Information">
          <InfoRow icon={Mail}   label="Email"    value={user?.email          || "—"} />
          <InfoRow icon={Phone}  label="Phone"    value={editData.phone       || "Not added"} />
          <InfoRow icon={MapPin} label="Location" value={editData.address     || "Not added"} />
          <InfoRow icon={Globe}  label="Website"  value={editData.website     || "Not added"} />
        </InfoCard>

        <InfoCard title="Social Links">
          <InfoRow icon={Link2}     label="LinkedIn"  value={editData.linkedin  || "Not added"} />
          <InfoRow icon={GitBranch} label="GitHub"    value={editData.github    || "Not added"} />
          <InfoRow icon={Globe}     label="Instagram" value={editData.instagram || "Not added"} />
          <InfoRow icon={Globe}     label="Twitter"   value={editData.twitter   || "Not added"} />
        </InfoCard>
      </div>
    </div>
  );
}

function EditProfile({ editData, setEditData, handleSave, saving, saveMsg }) {
  const set = (key) => (e) => setEditData((p) => ({ ...p, [key]: e.target.value }));

  return (
    <div>
      <SectionHeading title="Edit Profile" subtitle="Update your personal information" />
      <div className="pd-form-card">
        <form onSubmit={handleSave}>
          <div className="pd-form-grid">
            <FormField label="Full Name"    id="name"      value={editData.name}      onChange={set("name")}      placeholder="John Doe" />
            <FormField label="Phone"        id="phone"     value={editData.phone}     onChange={set("phone")}     placeholder="+1 555 000 0000" type="tel" />
            <FormField label="Location"     id="address"   value={editData.address}   onChange={set("address")}   placeholder="New York, USA" />
            <FormField label="Website"      id="website"   value={editData.website}   onChange={set("website")}   placeholder="https://yoursite.com" />
            <FormField label="LinkedIn URL" id="linkedin"  value={editData.linkedin}  onChange={set("linkedin")}  placeholder="https://linkedin.com/in/you" />
            <FormField label="GitHub URL"   id="github"    value={editData.github}    onChange={set("github")}    placeholder="https://github.com/you" />
            <FormField label="Instagram"    id="instagram" value={editData.instagram} onChange={set("instagram")} placeholder="https://instagram.com/you" />
            <FormField label="Twitter / X"  id="twitter"   value={editData.twitter}   onChange={set("twitter")}   placeholder="https://twitter.com/you" />
          </div>

          <div className="pd-mt-4">
            <label className="pd-form-label">Bio</label>
            <textarea
              value={editData.bio}
              onChange={set("bio")}
              rows={4}
              placeholder="Tell employers a bit about yourself…"
              className="pd-form-input"
            />
          </div>

          <div className="pd-mt-5 pd-flex pd-items-center pd-gap-2_5" style={{ flexWrap: "wrap" }}>
            <button type="submit" className="pd-save-btn" disabled={saving}>
              {saving && <Loader2 size={15} className="pd-spin" />}
              {saving ? "Saving…" : "Save Changes"}
            </button>
            {saveMsg && (
              <span className={`pd-saved-msg ${saveMsg.type === "error" ? "pd-saved-msg--error" : ""}`}>
                {saveMsg.type === "error"
                  ? <AlertCircle size={14} />
                  : <CheckCircle size={14} />}
                {saveMsg.text}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function Applications({ token, tabLabel }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [expanded, setExpanded]       = useState(null);

  const typeFilter =
    tabLabel === "investor-apps" ? "investor" :
    tabLabel === "job-apps"      ? "service"  : "listing";

  const fetchApplications = useCallback(async (p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/api/submissions/user-application", {
        params: { page: p, limit: 10, type: typeFilter },
      });
      setSubmissions(data.submissions || []);
      setTotalPages(data.pages || 1);
      setPage(p);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => { fetchApplications(1); }, [fetchApplications]);

  const resolveTitle   = (sub) => sub.listingId?.title || sub.investorId?.fundName || sub.serviceId?.serviceTitle || "—";
  const resolveCompany = (sub) => {
    const p = sub.publisherId;
    if (!p) return "—";
    return p.companyName || p.organizationName || p.contactName || "—";
  };
  const resolveListingLocation = (sub) => sub.listingId?.location || null;
  const resolveDescription     = (sub) =>
    sub.listingId?.description || sub.investorId?.description || sub.serviceId?.description || null;

  const resolveEventDates = (sub) => {
    const l = sub.listingId;
    if (!l) return null;
    const fmt = (d) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : null;
    const start = fmt(l.eventStartDate);
    const end   = fmt(l.eventEndDate);
    if (start && end) return `${start} – ${end}`;
    return start || null;
  };

  const resolvePublisherContact = (sub) => {
    const p = sub.publisherId;
    if (!p) return {};
    return { website: p.website || null, address: p.address || null, phone: p.phone || null, contactName: p.contactName || null };
  };

  const resolveDate = (sub) =>
    new Date(sub.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const statusMeta = (status) => {
    const map = {
      pending:        { bg: "#fef9c3", color: "#854d0e" },
      "under-review": { bg: "#fef9c3", color: "#854d0e" },
      shortlisted:    { bg: "#dbeafe", color: "#1e40af" },
      approved:       { bg: "#dcfce7", color: "#166534" },
      rejected:       { bg: "#fee2e2", color: "#991b1b" },
    };
    return map[(status || "").toLowerCase()] || { bg: "#f3f4f6", color: "#374151" };
  };

  const headingMap = {
    "event-apps":    { title: "Event Applications",    subtitle: "Events and competitions you applied to" },
    "job-apps":      { title: "Service Applications",  subtitle: "Services you applied to" },
    "investor-apps": { title: "Investor Applications", subtitle: "Investor opportunities you applied to" },
  };
  const { title, subtitle } = headingMap[tabLabel] || { title: "Applications", subtitle: "" };

  return (
    <div>
      <SectionHeading title={title} subtitle={subtitle} />
      <div className="pd-form-card">
        {loading ? (
          <div className="pd-state-center">
            <Loader2 size={28} color={BLUE} className="pd-spin" />
            <p className="pd-state-text">Loading applications…</p>
          </div>
        ) : error ? (
          <div className="pd-state-center">
            <AlertCircle size={28} color={ORANGE} />
            <p className="pd-state-text">{error}</p>
            <button className="pd-save-btn" style={{ marginTop: 12 }} onClick={() => fetchApplications(page)}>Retry</button>
          </div>
        ) : submissions.length === 0 ? (
          <div className="pd-state-center">
            <Briefcase size={36} color="#d1d5db" />
            <p className="pd-state-text" style={{ color: "#9ca3af" }}>No applications found</p>
          </div>
        ) : (
          <>
            <div className="app-list">
              {submissions.map((sub) => {
                const { bg, color }  = statusMeta(sub.status);
                const isOpen         = expanded === sub._id;
                const pubContact     = resolvePublisherContact(sub);
                const listingLoc     = resolveListingLocation(sub);
                const eventDates     = resolveEventDates(sub);
                const description    = resolveDescription(sub);

                return (
                  <div key={sub._id} className="app-card">
                    {/* Header */}
                    <div
                      className="app-card__header"
                      onClick={() => setExpanded(isOpen ? null : sub._id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && setExpanded(isOpen ? null : sub._id)}
                      aria-expanded={isOpen}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="app-card__title-row">
                          <span className="app-card__title">{resolveTitle(sub)}</span>
                          <span className="app-card__status" style={{ background: bg, color }}>
                            {sub.status || "Submitted"}
                          </span>
                        </div>
                        <div className="app-card__meta">
                          <span className="app-card__meta-item">
                            <Building2 size={13} /> {resolveCompany(sub)}
                          </span>
                          {listingLoc && (
                            <span className="app-card__meta-item">
                              <MapPin size={13} /> {listingLoc}
                            </span>
                          )}
                          <span className="app-card__meta-item">
                            <CalendarDays size={13} /> Applied {resolveDate(sub)}
                          </span>
                          {eventDates && (
                            <span className="app-card__meta-item">
                              <Clock size={13} /> {eventDates}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`app-card__chevron ${isOpen ? "app-card__chevron--open" : ""}`}
                      />
                    </div>

                    {/* Expanded body */}
                    {isOpen && (
                      <div className="app-card__body">
                        <div>
                          <OpportunityDetails
                            sub={sub}
                            listingLoc={listingLoc}
                            description={description}
                            eventDates={eventDates}
                          />
                          <DetailSection title="Organiser / Publisher">
                            {!sub.serviceId && (
                              <DetailRow label="Company Name" value={resolveCompany(sub)} />
                            )}
                            <DetailRow label="Website"      value={pubContact.website}     link />
                            <DetailRow label="Address"      value={pubContact.address} />
                            <DetailRow label="Phone"        value={pubContact.phone} />
                            <DetailRow label="Contact Name" value={pubContact.contactName} />
                          </DetailSection>
                        </div>

                        {/* Your Submission — 2-col grid */}
                        <DetailSection title="My Submitted Details" variant="orange">
                          <div className="detail-section__rows-grid">
                            <DetailRow label="Full name"        value={sub.fullName} />
                            <DetailRow label="Email"            value={sub.email} />
                            <DetailRow label="Phone"            value={sub.phone} />
                            <DetailRow label="Organisation"     value={sub.organisation} />
                            <DetailRow label="Organisation type" value={sub.orgType} />
                            <DetailRow label="Role"             value={sub.role} />
                            <DetailRow label="State"            value={sub.location} />
                            <DetailRow label="Funding stage"    value={sub.fundingStage} />
                            <DetailRow label="Website"          value={sub.website} />
                          </div>
                        </DetailSection>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="pd-pagination">
                <button className="pd-page-btn" disabled={page <= 1}           onClick={() => fetchApplications(page - 1)}>← Previous</button>
                <span className="pd-page-info">Page {page} of {totalPages}</span>
                <button className="pd-page-btn" disabled={page >= totalPages}  onClick={() => fetchApplications(page + 1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ── Primitives ── */

function DetailSection({ title, children, variant = "blue" }) {
  return (
    <div className={`detail-section detail-section--${variant}`}>
      <p className="detail-section__heading">{title}</p>
      <div className="detail-section__rows">{children}</div>
    </div>
  );
}

function DetailRow({ label, value, link }) {
  if (!value) return null;
  return (
    <div className="detail-row">
      <span className="detail-row__label">{label}</span>
      {link ? (
        <a href={value} target="_blank" rel="noreferrer" className="detail-row__value detail-row__value--link">
          {value}
        </a>
      ) : label === "About" ? (
        <span className="detail-row__value detail-row__value--desc">{value}</span>
      ) : (
        <span className="detail-row__value">{value}</span>
      )}
    </div>
  );
}

// function Notifications() {
//   const [prefs, setPrefs] = useState({
//     newJobs: true, appUpdates: true, messages: false, newsletter: false,
//   });
//   const toggle = (k) => setPrefs((p) => ({ ...p, [k]: !p[k] }));
//   const items = [
//     { key: "newJobs",    label: "New Job Matches",     desc: "Get notified when jobs matching your skills are posted." },
//     { key: "appUpdates", label: "Application Updates", desc: "Updates on your submitted job applications." },
//     { key: "messages",   label: "New Messages",        desc: "Alerts for new recruiter messages." },
//     { key: "newsletter", label: "Weekly Newsletter",   desc: "Career tips and platform news." },
//   ];
//   return (
//     <div>
//       <SectionHeading title="Notifications" subtitle="Choose what you hear about and when" />
//       <div className="pd-form-card">
//         {items.map(({ key, label, desc }) => (
//           <div key={key} className="pd-notif-row">
//             <div style={{ flex: 1, minWidth: 0 }}>
//               <p className="pd-notif-row__label">{label}</p>
//               <p className="pd-notif-row__desc">{desc}</p>
//             </div>
//             <button
//               onClick={() => toggle(key)}
//               className={`pd-toggle ${prefs[key] ? "pd-toggle--on" : "pd-toggle--off"}`}
//               aria-checked={prefs[key]}
//               role="switch"
//               aria-label={label}
//             >
//               <div className={`pd-toggle__knob ${prefs[key] ? "pd-toggle__knob--on" : ""}`} />
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

function SectionHeading({ title, subtitle }) {
  return (
    <div className="pd-section-head">
      <h2 className="pd-section-head__title">{title}</h2>
      {subtitle && <p className="pd-section-head__subtitle">{subtitle}</p>}
    </div>
  );
}

function InfoCard({ title, children }) {
  return (
    <div className="pd-info-card">
      <h3 className="pd-info-card__title">{title}</h3>
      <div className="pd-info-card__body">{children}</div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="pd-info-row">
      <Icon size={16} color={BLUE} className="pd-info-row__icon" />
      <div style={{ minWidth: 0 }}>
        <p className="pd-info-row__label">{label}</p>
        <p className="pd-info-row__value">{value}</p>
      </div>
    </div>
  );
}

function FormField({ label, id, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="pd-form-field">
      <label htmlFor={id} className="pd-form-label">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pd-form-input"
        autoComplete="off"
      />
    </div>
  );
}