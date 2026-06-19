"use client"

import { useEffect, useState } from "react";
import publisherApi from "@/app/publisherapi";
import { toast, ToastContainer } from "react-toastify";
import '../../styles/publisherprofile.css';

const PLAN_LABELS = {
  "3m":    "Startup Basic",
  "6m":    "Startup Plus",
  "9m":    "Startup Pro",
  "12m":   "Startup Elite",
  "trial": "Trial",
};

const SERVICE_PLAN_LABELS = {
  "trial": "Trial",
  "6m":    "Standard",
  "12m":   "Premium",
};

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

export default function Page() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profileurl, setProfileurl] = useState(null);
const [downloadingServiceId, setDownloadingServiceId] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [serviceSubscriptions, setServiceSubscriptions] = useState([]);
  const [subsLoading, setSubsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("platform"); // "platform" | "service"
  const [downloadingId, setDownloadingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", companyName: "",
    organizationName: "", organizationType: "", contactName: "",
    website: "", description: "", address: "",
  });

  useEffect(() => { fetchProfile(); fetchSubscriptionHistory(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await publisherApi.get("/api/publisher/me");
      const p = res.data?.publisher;
      setProfile(p);
      const rawProfileurl = p.userId?.profileurl;
      setProfileurl(rawProfileurl?.url ? rawProfileurl : null);
      setFormData({
        name:             p.userId?.name     || p.contactName || "",
        phone:            p.phone            || "",
        email:            p.userId?.email    || "",
        companyName:      p.companyName      || "",
        organizationName: p.organizationName || "",
        organizationType: p.organizationType || "",
        contactName:      p.contactName      || "",
        website:          p.website          || "",
        description:      p.description      || "",
        address:          p.address          || "",
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionHistory = async () => {
    try {
      setSubsLoading(true);
      const res = await publisherApi.get("/api/publisher/subscriptions/history");
      setSubscriptions(res.data?.subscriptions || []);
      setServiceSubscriptions(res.data?.serviceSubscriptions || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load subscription history");
    } finally {
      setSubsLoading(false);
    }
  };


  const handleDownloadInvoice = async (subscriptionId, invoiceNumber) => {
    setDownloadingId(subscriptionId);
    try {
      const response = await publisherApi.get(
        `/api/publisher/subscription/invoice/${subscriptionId}`,
        { responseType: "blob" }
      );
      const url = URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.href = url; a.download = `Invoice_${invoiceNumber}.pdf`; a.click();
      URL.revokeObjectURL(url);
      toast.success("Invoice downloaded");
    } catch {
      toast.error("Failed to download invoice");
    } finally {
      setDownloadingId(null);
    }
  };
const handleDownloadServiceInvoice = async (serviceSubscriptionId, invoiceNumber) => {
  setDownloadingServiceId(serviceSubscriptionId);
  try {
    const response = await publisherApi.get(
      `/api/publisher/subscription/invoice/${serviceSubscriptionId}?type=service`, 
      { responseType: "blob" }
    );
    const url = URL.createObjectURL(response.data);
    const a   = document.createElement("a");
    a.href = url; a.download = `Invoice_${invoiceNumber}.pdf`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Invoice downloaded");
  } catch {
    toast.error("Failed to download invoice");
  } finally {
    setDownloadingServiceId(null);
  }
};
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImage = async (file) => {
    if (!file) return;
    const fd = new FormData(); fd.append("files", file);
    try {
      setUploadingImage(true);
      const res = await publisherApi.post("/api/uploads", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const uploaded = res.data?.files?.[0];
      if (uploaded) {
        setProfileurl({ url: uploaded.url, publicId: uploaded.publicId, resourceType: uploaded.resourceType || "image" });
        toast.success("Image uploaded");
      } else toast.error("Upload failed");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await publisherApi.patch("/api/publisher/update", { ...formData, profileurl });
      toast.success("Profile updated successfully");
      setEditMode(false); fetchProfile();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ padding: "2rem", color: "#888", fontSize: "1.2rem" }}>Loading profile…</div>
  );
  if (!profile) return (
    <div style={{ padding: "2rem", color: "#ef4444", fontSize: "1.2rem" }}>Profile not found.</div>
  );

  const subscriptionExpiry = profile.subscriptionExpiry
    ? new Date(profile.subscriptionExpiry).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "Not set";
  const daysLeft = profile.subscriptionExpiry
    ? Math.max(0, Math.ceil((new Date(profile.subscriptionExpiry) - new Date()) / (1000 * 60 * 60 * 24))) : 0;
  const isSubActive = profile.subscriptionStatus === "active";

  const orgFields = [
    ["Name",         formData.name],
    ["Email",        profile.userId?.email],
    ["Phone",        formData.phone],
    ["Company Name", formData.organizationName],
    ["Company Type", formData.organizationType],
    ["Address",      formData.address],
  ];

const DownloadBtn = ({ sub, invNumber, onDownload, isDownloading }) => (
  <button
    className="pp-inv-btn"
    style={{ fontSize: "1.2rem", gap: "6px", padding: "7px 14px" }}
    onClick={() => onDownload(sub._id, invNumber)}
    disabled={isDownloading}
    title={`Download ${invNumber}`}
  >
    {isDownloading ? (
      <><span className="pp-spinner pp-spinner--sm" /> Generating…</>
    ) : (
      <>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {invNumber}
      </>
    )}
  </button>
);
  const StatusBadge = ({ sub }) => {
    const isExpired = new Date(sub.expiryDate) < new Date();
    const isActive  = sub.isActive && !isExpired;
    return (
      <span
        className={`pp-badge ${isActive ? "pp-badge--active" : "pp-badge--expired"}`}
        style={{ fontSize: "1.2rem", padding: "5px 14px" }}
      >
        {isActive ? "Active" : "Expired"}
      </span>
    );
  };

  const renderPlatformTable = () => {
    if (subscriptions.length === 0) return <EmptyState label="No platform subscription history found." />;
    return (
      <div className="pp-table-wrap">
        <table className="pp-table" style={{ fontSize: "1.2rem" }}>
          <thead>
            <tr>
              {["#", "Plan", "Price", "Start Date", "Expiry Date", "Payment Ref", "Status", "Invoice"].map(h => (
                <th key={h} style={{ fontSize: "1.05rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub, index) => {
              const invNumber = `SRV-${String(sub._id).slice(-8).toUpperCase()}`;
              return (
                <tr key={sub._id}>
                  <td className="pp-td-muted" style={{ fontSize: "1.2rem" }}>{index + 1}</td>
                  <td>
                    <span className="pp-plan-badge" style={{ fontSize: "1.2rem", padding: "5px 14px" }}>
                      {PLAN_LABELS[sub.plan] || sub.plan}
                    </span>
                  </td>
                  <td className="pp-td-bold" style={{ fontSize: "1.2rem" }}>
                    ₹{Number(sub.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="pp-td-muted" style={{ fontSize: "1.2rem" }}>{fmtDate(sub.startDate || sub.createdAt)}</td>
                  <td className="pp-td-muted" style={{ fontSize: "1.2rem" }}>{fmtDate(sub.expiryDate)}</td>
                  <td>
                    {sub.paymentId
                      ? <span className="pp-mono" style={{ fontSize: "1.2rem" }}>{sub.paymentId}</span>
                      : <span className="pp-td-muted" style={{ fontSize: "1.2rem" }}>—</span>}
                  </td>
                  <td><StatusBadge sub={sub} /></td>
                  <td><DownloadBtn
  sub={sub}
  invNumber={invNumber}
  onDownload={handleDownloadInvoice}          
  isDownloading={downloadingId === sub._id}  
/></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderServiceTable = () => {
    if (serviceSubscriptions.length === 0) return <EmptyState label="No service subscription history found." />;
    return (
      <div className="pp-table-wrap">
        <table className="pp-table" style={{ fontSize: "1.2rem" }}>
          <thead>
            <tr>
              {["#", "Plan", "Price", "Start Date", "Expiry Date", "Payment Ref", "Status" , "Invoice"].map(h => (
                <th key={h} style={{ fontSize: "1.05rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
<tbody>
  {serviceSubscriptions.map((sub, index) => {
   const invNumber = `SRV-${String(sub._id).slice(-8).toUpperCase()}`;
    return (
      <tr key={sub._id}>
        <td className="pp-td-muted" style={{ fontSize: "1.2rem" }}>{index + 1}</td>
        <td>
          <span className="pp-plan-badge pp-plan-badge--service" style={{ fontSize: "1.2rem", padding: "5px 14px" }}>
            {SERVICE_PLAN_LABELS[sub.durationType] || sub.durationType}
          </span>
        </td>
        <td className="pp-td-bold" style={{ fontSize: "1.2rem" }}>
          {Number(sub.price) === 0
            ? <span style={{ color: "#16a34a", fontWeight: 700 }}>Free</span>
            : `₹${Number(sub.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
        </td>
        <td className="pp-td-muted" style={{ fontSize: "1.2rem" }}>{fmtDate(sub.startDate || sub.createdAt)}</td>
        <td className="pp-td-muted" style={{ fontSize: "1.2rem" }}>{fmtDate(sub.expiryDate)}</td>
        <td>
          {sub.paymentId
            ? <span className="pp-mono" style={{ fontSize: "1.2rem" }}>{sub.paymentId}</span>
            : <span className="pp-td-muted" style={{ fontSize: "1.2rem" }}>—</span>}
        </td>
        <td><StatusBadge sub={sub} /></td>
        <td>
<DownloadBtn
  sub={sub}
  invNumber={invNumber}
  onDownload={handleDownloadServiceInvoice}
  isDownloading={downloadingServiceId === sub._id}
/>
        </td>
      </tr>
    );
  })}
</tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="pp-page">

      {/* Page Header */}
      <div className="pp-header">
        <div>
          <h1 className="pp-title" style={{ fontSize: "1.5rem", fontWeight: 700 }}>My Profile</h1>
          <p className="pp-subtitle" style={{ fontSize: "1.2rem", color: "#6b7280" }}>
            View and update your publisher details.
          </p>
        </div>
        {!editMode && (
          <button
            className="pp-btn pp-btn--primary"
            style={{ fontSize: "1.2rem", padding: "10px 22px" }}
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="pp-layout">

        {/* Left: Organization */}
        <div className="pp-main">
          <div className="pp-card">
            <p className="pp-card-title" style={{ fontSize: "1.35rem", fontWeight: 700 }}>Company Info</p>

            {editMode ? (
              <form onSubmit={handleSubmit}>
                <div className="pp-edit-form">
                  <div className="pp-upload-row">
                    <img src={profileurl?.url || "https://via.placeholder.com/60"} alt="avatar" className="pp-avatar-sm" style={{ width: 64, height: 64 }} />
                    <div>
                      <input type="file" accept="image/*" className="form-control form-control-sm" style={{ fontSize: "1.2rem" }}
                        onChange={(e) => uploadImage(e.target.files?.[0])} disabled={uploadingImage} />
                      <p className="pp-upload-hint" style={{ fontSize: "1.2rem" }}>
                        {uploadingImage ? "Uploading…" : "JPG, PNG up to 5 MB"}
                      </p>
                    </div>
                  </div>

 {[
  ["name", "Name", "text"],
  ["email", "Email", "email"],
  ["phone", "Phone", "text"],
  ["companyName", "Company Name", "text"],
  ["organizationType", "Company Type", "text"],
  ["website", "Website", "url"],
  ["address", "Address", "text"],
].map(([name, label, type]) => (
  <div key={name}>
    <label className="pp-field-label" style={{ fontSize: "1.2rem", fontWeight: 600 }}>
      {label}
    </label>
    <input
      type={type}
      className="pp-input"
      style={{
        fontSize: "1.2rem",
        ...(name === "email" && {
          backgroundColor: "#f1f5f9",
          color: "#64748b",
          cursor: "not-allowed",
          border: "1px solid #e2e8f0",
        }),
      }}
      name={name}
      value={formData[name]}
      onChange={handleChange}
      readOnly={name === "email"}  
    />
  </div>
))}

                  <div className="pp-field-full">
                    <label className="pp-field-label" style={{ fontSize: "1.2rem", fontWeight: 600 }}>About Company</label>
                    <textarea className="pp-input pp-textarea" style={{ fontSize: "1.2rem" }}
                      name="description" value={formData.description} onChange={handleChange} rows={3} />
                  </div>

                  <div className="pp-edit-actions">
                    <button type="submit" className="pp-btn pp-btn--primary"
                      style={{ fontSize: "1.2rem", padding: "10px 22px" }} disabled={saving || uploadingImage}>
                      {saving ? "Saving…" : "Save Changes"}
                    </button>
                    <button type="button" className="pp-btn"
                      style={{ fontSize: "1.2rem", padding: "10px 22px" }} onClick={() => setEditMode(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <>
                <div className="pp-avatar-row">
                  <img src={profileurl?.url || "https://via.placeholder.com/60"} alt="avatar" className="pp-avatar-sm" style={{ width: 64, height: 64 }} />
                  <div>
                    <p className="pp-avatar-name" style={{ fontSize: "1.35rem", fontWeight: 700 }}>{formData.name || "—"}</p>
                    <p className="pp-avatar-sub" style={{ fontSize: "1.2rem", color: "#6b7280" }}>{profile.userId?.email || "—"}</p>
                  </div>
                </div>
                <div className="pp-info-grid">
                  {orgFields.map(([label, value]) => (
                    <div className="pp-info-cell" key={label}>
                      <p className="pp-info-label" style={{ fontSize: "1.0rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
                      <p className="pp-info-value" style={{ fontSize: "1.2rem", color: "#1e293b", fontWeight: 500 }}>{value || "—"}</p>
                    </div>
                  ))}
                  <div className="pp-info-cell">
                    <p className="pp-info-label" style={{ fontSize: "1.0rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Website</p>
                    <p className="pp-info-value" style={{ fontSize: "1.2rem" }}>
                      {formData.website
                        ? <a href={formData.website} target="_blank" rel="noreferrer" className="pp-link">{formData.website}</a>
                        : "—"}
                    </p>
                  </div>
                  {formData.description && (
                    <div className="pp-info-cell pp-info-cell--full">
                      <p className="pp-info-label" style={{ fontSize: "1.0rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>About Company</p>
                      <p className="pp-info-value" style={{ fontSize: "1.2rem", color: "#1e293b" }}>{formData.description}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Subscription sidebar */}
        <div className="pp-sidebar">
          <div className="pp-mini-card">
            <p className="pp-card-title" style={{ fontSize: "1.35rem", fontWeight: 700 }}>Subscription</p>
            <div className="pp-sub-row">
              <span className="pp-sub-label" style={{ fontSize: "1.2rem" }}>Status</span>
              <span className={`pp-badge ${isSubActive ? "pp-badge--active" : "pp-badge--expired"}`}
                style={{ fontSize: "1.2rem", padding: "5px 14px" }}>
                {profile.subscriptionStatus || "—"}
              </span>
            </div>
            <div className="pp-sub-row">
              <span className="pp-sub-label" style={{ fontSize: "1.2rem" }}>Expiry</span>
              <span className="pp-sub-value" style={{ fontSize: "1.2rem", fontWeight: 600 }}>{subscriptionExpiry}</span>
            </div>
            <div className="pp-sub-row">
              <span className="pp-sub-label" style={{ fontSize: "1.2rem" }}>Days left</span>
              <span className={`pp-sub-value ${daysLeft <= 30 ? "pp-sub-value--warn" : ""}`}
                style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                {daysLeft}
              </span>
            </div>
            {profile.subscriptionExpiry && (
              <div className="pp-progress-wrap">
                <div className="pp-progress-bar" style={{
                  width: `${Math.min(100, (daysLeft / 365) * 100)}%`,
                  background: daysLeft <= 30 ? "#f59e0b" : "#22c55e",
                }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Subscription History ─────────────────────────────────────────────── */}
      <div className="pp-card pp-card--full mt-3">

        {/* Card header */}
        <div className="pp-table-header">
          <div>
            <p className="pp-card-title" style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: 2 }}>
              Subscription History
            </p>
            <p className="pp-table-sub" style={{ fontSize: "1.2rem", color: "#6b7280" }}>
              All plans purchased, oldest to newest.
            </p>
          </div>
          <button
            className="pp-btn"
            style={{ fontSize: "1.2rem", padding: "9px 20px" }}
            onClick={fetchSubscriptionHistory}
            disabled={subsLoading}
          >
            {subsLoading ? "Loading…" : "↻ Refresh"}
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", borderBottom: "2px solid #e2e8f0", marginBottom: "1.25rem" }}>
          {[
            { key: "platform", label: "Platform Plans", count: subscriptions.length },
            { key: "service",  label: "Service Plans",  count: serviceSubscriptions.length },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                padding: "10px 20px",
                fontSize: "1.15rem",
                fontWeight: activeTab === key ? 700 : 500,
                color: activeTab === key ? "#1a56db" : "#64748b",
                background: "none",
                border: "none",
                borderBottom: activeTab === key ? "2px solid #1a56db" : "2px solid transparent",
                marginBottom: "-2px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "color 0.15s",
              }}
            >
              {label}
              <span style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                background: activeTab === key ? "#dbeafe" : "#f1f5f9",
                color:      activeTab === key ? "#1a56db" : "#94a3b8",
                borderRadius: "999px",
                padding: "1px 8px",
                minWidth: "22px",
                textAlign: "center",
              }}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        {subsLoading ? (
          <div className="pp-empty">
            <div className="pp-spinner" />
            <p style={{ fontSize: "1.2rem" }}>Loading history…</p>
          </div>
        ) : activeTab === "platform" ? renderPlatformTable() : renderServiceTable()}
      </div>

      <ToastContainer position="top-center" autoClose={2500} />
    </div>
  );
}

function EmptyState({ label }) {
  return (
    <div className="pp-empty">
      <span style={{ fontSize: "2.5rem" }}>📋</span>
      <p style={{ fontSize: "1.2rem" }}>{label}</p>
    </div>
  );
}