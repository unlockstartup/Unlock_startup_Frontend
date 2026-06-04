"use client"

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import publisherApi from "@/app/publisherapi";
import { getPublisherPlanInfo } from "@/app/apiServices/subscriptions";
import ConfirmationModal from "@/components/ConfirmationModal";
import {
  getPublicServiceTypes,
  getPublicServiceCategories,
} from "@/app/apiServices/publicapi";
import { INDIA_STATES } from "@/app/constants";

import "../styles/publishercretepages.css";

/*  Field helper */
function Field({ label, note, children }) {
  return (
    <div className="field">
      <label className="label">
        {label}
        {note && <span className="labelNote">{note}</span>}
      </label>
      {children}
    </div>
  );
}

/*  Status badge helper  */
function StatusBadge({ status }) {
  const cls = status === "approved" ? "badgeSuccess"
    : status === "rejected" ? "badgeDanger"
    : "badgeWarning";
  return <span className={`badge ${cls}`}>{status}</span>;
}

/*  Constants  */
const initialForm = {
  companyName: "", brandName: "", establishedYear: "",
  serviceTitle: "", serviceType: "", serviceCategory: "",
  detailedDescription: "", benefits: "", serviceArea: "",
  targetIndustry: "", teamSize: "", certifications: "",
  contactEmail: "", contactNumber: "", contactAddress: "",
  websiteUrl: "", disclosureConsent: false,
};

const MAX_IMAGES = 3;

/*  Main component  */
export default function ServiceListings() {
  const [listings, setListings]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [status, setStatus]                 = useState("all");
  const [q, setQ]                           = useState("");
  const [planInfo, setPlanInfo]             = useState(null);
  const [open, setOpen]                     = useState(false);
  const [mode, setMode]                     = useState("create");
  const [editing, setEditing]               = useState(null);
  const [saving, setSaving]                 = useState(false);
  const [uploadingIdx, setUploadingIdx]     = useState(null);
  const [serviceImages, setServiceImages]   = useState([]);
  const [serviceTypes, setServiceTypes]     = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [form, setForm]                     = useState(initialForm);
  const [stateOpen, setStateOpen]           = useState(false);
  const [showConfirm, setShowConfirm]       = useState(false);
  const [confirmConfig, setConfirmConfig]   = useState({
    title: "", message: "", confirmText: "Confirm",
    cancelText: "Cancel", confirmVariant: "danger", onConfirm: () => {},
  });

  /*  Fetch listings  */
  const fetchListings = async (overrides = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      const s      = overrides.status !== undefined ? overrides.status : status;
      const search = overrides.q      !== undefined ? overrides.q      : q;
      if (s !== "all")   params.append("status", s);
      if (search.trim()) params.append("q", search.trim());
      const res = await publisherApi.get(`/api/publisher/service-listings/mine?${params}`);
      setListings(res.data?.listings || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, [status]);

  useEffect(() => {
    (async () => { try { setPlanInfo((await getPublisherPlanInfo()).data); } catch {} })();

    (async () => {
      try {
        const res = await getPublicServiceTypes();
        setServiceTypes(res.data?.serviceTypes || []);
      } catch { toast.error("Failed to load service types"); }
    })();

    (async () => {
      try {
        const res = await getPublicServiceCategories();
        setServiceCategories(res.data?.categories || []);
      } catch { toast.error("Failed to load service categories"); }
    })();
  }, []);

  /*  Plan guards  */
  const subscriptionExpired  = planInfo && planInfo.subscriptionStatus !== "active";
  const serviceInactive      = planInfo && planInfo.servicePlanActive === false;
  const serviceLimitReached  = planInfo && !subscriptionExpired && !serviceInactive
    && planInfo.limits?.serviceListingLimit > 0
    && planInfo.usage?.serviceListings >= planInfo.limits?.serviceListingLimit;
  const addButtonDisabled    = subscriptionExpired || serviceInactive || serviceLimitReached;

  const addLabel = subscriptionExpired ? "Subscription Expired"
    : serviceInactive   ? "Service Plan Required"
    : serviceLimitReached ? `Limit Reached (${planInfo.usage.serviceListings}/${planInfo.limits.serviceListingLimit})`
    : "+ Add Service";

  /*  Modal helpers  */
  const openCreate = () => { setMode("create"); setEditing(null); setForm(initialForm); setServiceImages([]); setOpen(true); };

const openEdit = (listing) => {
  const alreadyEdited = (listing.editCount ?? 0) >= 1;
  setConfirmConfig({
    title: alreadyEdited ? "Edit Not Allowed" : "Edit Service Listing",
    message: alreadyEdited
      ? "This listing has already been edited once and can no longer be modified."
      : "You can only update this listing once. Please review all details carefully before submitting, as no further edits will be allowed after this.",
    confirmText: alreadyEdited ? "OK" : "I Understand, Proceed",
    cancelText: alreadyEdited ? "" : "Cancel",
    confirmVariant: alreadyEdited ? "danger" : "primary",
    onConfirm: () => {
      if (alreadyEdited) return;
      setMode("edit"); setEditing(listing);
      setForm({ ...initialForm, ...listing, disclosureConsent: false });
      setServiceImages(listing.serviceImages || []);
      setOpen(true);
    },
  });
  setShowConfirm(true);
};


  const closeModal = () => { if (saving || uploadingIdx !== null) return; setOpen(false); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  /*  Image upload  */
  const uploadImage = async (file, idx) => {
    if (!file) return;
    const fd = new FormData();
    fd.append("files", file);
    try {
      setUploadingIdx(idx);
      const res      = await publisherApi.post("/api/uploads", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const uploaded = res.data?.files?.[0];
      if (uploaded) {
        const newImg = { url: uploaded.url, publicId: uploaded.publicId, resourceType: uploaded.resourceType || "image" };
        setServiceImages((prev) => { const next = [...prev]; next[idx] = newImg; return next; });
        toast.success(`Image ${idx + 1} uploaded`);
      } else { toast.error("Upload failed"); }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally { setUploadingIdx(null); }
  };

  const removeImage = (idx) => setServiceImages((prev) => prev.filter((_, i) => i !== idx));

  /*  Validate & save  */
  const validate = () => {
    const checks = [
      [!form.companyName.trim(),         "Company name is required"],
      [!form.brandName.trim(),           "Brand name is required"],
      [!form.establishedYear.trim(),     "Established year is required"],
      [!form.serviceTitle.trim(),        "Service title is required"],
      [!form.serviceType,                "Service type is required"],
      [!form.serviceCategory,            "Service plan is required"],
      [!form.detailedDescription.trim(), "Detailed description is required"],
      [!form.benefits.trim(),            "Benefits / Key Features required"],
      [!form.serviceArea.trim(),         "Service area is required"],
      [!form.targetIndustry.trim(),      "Target industry is required"],
      [!form.teamSize.trim(),            "Team size is required"],
      [!form.contactEmail.trim(),        "Contact email is required"],
      [!form.disclosureConsent,          "You must provide consent to submit"],
    ];
    for (const [fail, msg] of checks) {
      if (fail) { toast.warn(msg); return false; }
    }
    return true;
  };

  const save = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      const payload = { ...form, serviceImages };
      if (mode === "create") {
        await publisherApi.post("/api/publisher/service-listings/create", payload);
        toast.success("Service listing submitted!");
      } else {
        await publisherApi.patch(`/api/publisher/service-listings/${editing._id}`, payload);
        toast.success("Service listing updated (pending re-approval)");
      }
      setOpen(false);
      fetchListings();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Submission failed");
    } finally { setSaving(false); }
  };

  /*  Delete / toggle  */
  const deleteListing = (id) => {
    if (!id) return;
    setConfirmConfig({
      title: "Delete this Service",
      message: "Are you sure you want to permanently delete this service? This action cannot be undone.",
      confirmText: "Yes, Delete Service", cancelText: "Cancel", confirmVariant: "danger",
      onConfirm: async () => {
        try {
          await publisherApi.delete(`/api/publisher/service-listings/${id}`);
          toast.success("Listing deleted");
          fetchListings();
        } catch (err) { toast.error(err?.response?.data?.message || "Delete failed"); }
      },
    });
    setShowConfirm(true);
  };

const confirmToggleListing = (listing) => {
  if (!listing?._id) return;
  const toggleCount = listing.toggleCount ?? 0;
  if (toggleCount >= 2) {
    setConfirmConfig({
      title: "Toggle Not Allowed",
      message: "This service has already been deactivated and reactivated once. No further activation or deactivation is allowed.",
      confirmText: "OK",
      cancelText: "",
      confirmVariant: "danger",
      onConfirm: () => {},
    });
    setShowConfirm(true);
    return;
  }
  const isDeactivating = listing.isActive;
  setConfirmConfig({
    title: isDeactivating ? "Deactivate Service" : "Activate Service",
    message: isDeactivating
      ? "You may reactivate this service once after deactivating, but after that no further toggling will be allowed. Are you sure you want to deactivate?"
      : "You can activate this listing once more. After reactivating, no further deactivation or activation will be permitted. Proceed?",
    confirmText: isDeactivating ? "Yes, Deactivate" : "Yes, Activate",
    cancelText: "Cancel",
    confirmVariant: isDeactivating ? "warning" : "success",
    onConfirm: async () => {
      try {
        await publisherApi.patch(`/api/publisher/service-listings/${listing._id}/toggle`);
        toast.success(`Service ${isDeactivating ? "deactivated" : "activated"}`);
        fetchListings();
      } catch (err) {
        toast.error(err?.response?.data?.message || "Toggle failed");
      }
    },
  });
  setShowConfirm(true);
};



  /*  Render  */
  return (
    <div className="page">

      {/*  Topbar  */}
      <header className="topbar">
        <div>
          <h1 className="topbarTitle">Service Listings</h1>
          <p className="topbarSub">Submit and manage your service offerings</p>
        </div>
        <div className="topbarActions">
          <button
            className={`btn ${addButtonDisabled ? "btnSecondary" : "btnPrimary"}`}
            onClick={addButtonDisabled ? undefined : openCreate}
            disabled={addButtonDisabled}
            title={
              subscriptionExpired ? "Your subscription has expired."
              : serviceInactive   ? "You need an active service plan."
              : serviceLimitReached ? `Limit of ${planInfo.limits.serviceListingLimit} reached` : ""
            }
          >
            {addLabel}
          </button>
        </div>
      </header>

      {/*  Filters  */}
      <div className="tableShell">
        <div className="tableHead">
          <h2 className="tableHeadTitle">Filter &amp; Search</h2>
        </div>
        <div className="tableBody">
          <div className="row3" style={{ alignItems: "flex-end" }}>
            <div className="field">
              <label className="label">Approval Status</label>
              <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="field">
              <label className="label">Search</label>
              <input
                className="input"
                placeholder="Search by title or company…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchListings()}
              />
            </div>
            <div className="field">
              <label className="label" style={{ visibility: "hidden" }}>_</label>
              <div style={{ display: "flex", gap: "0.6rem" }}>
                <button className="btn btnPrimary btnSm" onClick={() => fetchListings()} disabled={loading}>Search</button>
                <button className="btn btnSecondary btnSm" onClick={() => { setStatus("all"); setQ(""); fetchListings({ status: "all", q: "" }); }} disabled={loading}>Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  Table  */}
      <div className="tableShell">
        <div className="tableHead">
          <h2 className="tableHeadTitle">All Service Listings</h2>
        </div>
        <div className="tableBody">
          {loading ? (
            <p className="loadingState">Loading…</p>
          ) : listings.length === 0 ? (
            <div className="emptyState">
              <p>No service listings yet.</p>
              <button
                className={`btn ${addButtonDisabled ? "btnSecondary" : "btnPrimary"}`}
                onClick={addButtonDisabled ? undefined : openCreate}
                disabled={addButtonDisabled}
                style={{ marginTop: "0.75rem" }}
              >
                {subscriptionExpired ? "Subscription Expired"
                  : serviceInactive   ? "Service Plan Required"
                  : serviceLimitReached ? "Limit Reached"
                  : "+ Add Your First Service"}
              </button>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Service Title</th>
                  <th>Company / Brand</th>
                  <th style={{textAlign: "center"}}>Plan</th>
                  <th>Status</th>
                  <th>Active</th>
                  <th className="tdRight" style={{textAlign: "center"}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((l, idx) => (
                  <tr key={l._id}>
                    <td className="tdMuted">{idx + 1}</td>
                    <td className="tdSemibold">{l.serviceTitle}</td>
                    <td>
                      <div>{l.companyName || "—"}</div>
                      {l.brandName && <div className="tdMuted">{l.brandName}</div>}
                    </td>
                    <td>
                      <span className="badge badgePrimary">{l.serviceCategory}</span>
                    </td>
                    <td>
                      <StatusBadge status={l.approvalStatus} />
                      {l.approvalStatus === "rejected" && l.rejectionReason && (
                        <div style={{ color: "var(--orange)", fontSize: "var(--text-xs)", marginTop: "0.25rem" }}>
                          {l.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${l.isActive ? "badgeSuccess" : "badgeNeutral"}`}>
                        {l.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
<td>
  <div className="actionGroup">
    <button
      className={`btn btnSm ${(l.editCount ?? 0) >= 1 ? "btnSecondary" : "btnPrimary"}`}
      onClick={() => openEdit(l)}
      title={(l.editCount ?? 0) >= 1 ? "This listing has already been edited once" : "Edit listing"}
    >
      Edit
    </button>
    <button
      className={`btn btnSm ${l.isActive ? "btnWarning" : "btnSuccess"}`}
      onClick={() => confirmToggleListing(l)}
      title={(l.toggleCount ?? 0) >= 2 ? "Toggle limit reached" : l.isActive ? "Deactivate" : "Activate"}
    >
      {l.isActive ? "Deactivate" : "Activate"}
    </button>
    <button className="btn btnSm btnDanger" onClick={() => deleteListing(l._id)}>Delete</button>
  </div>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/*  Create / Edit modal  */}
      {open && (
        <div className="modalOverlay">
          <div className="modalDialog">

            {/* Header */}
            <div className="modalHeader">
              <h2 className="modalTitle">
                {mode === "create" ? "Add Service Listing" : "Edit Service Listing"}
              </h2>
              <button className="modalClose" onClick={closeModal} aria-label="Close">✕</button>
            </div>

            {/* Body */}
            <div className="modalBody">

              {/*  Company information  */}
              <section className="section">
                <h3 className="sectionTitle">Company information</h3>
                <div className="row3">
                  <Field label="Company Name *">
                    <input className="input" name="companyName" value={form.companyName} onChange={handleChange} placeholder="Enter company name" />
                  </Field>
                  <Field label="Brand Name *">
                    <input className="input" name="brandName" value={form.brandName} onChange={handleChange} placeholder="e.g. ABC" />
                  </Field>
                  <Field label="Established Year *">
                    <input className="input" name="establishedYear" value={form.establishedYear} onChange={handleChange} placeholder="e.g. 2015" />
                  </Field>
                </div>
              </section>

              {/*  Service information  */}
              <section className="section">
                <h3 className="sectionTitle">Service information</h3>

                <div className="row3">
                  <Field label="Service Title *">
                    <input className="input" name="serviceTitle" value={form.serviceTitle} onChange={handleChange} placeholder="Enter service title" />
                  </Field>
                  <Field label="Service Type *">
                    <select className="select" name="serviceType" value={form.serviceType} onChange={handleChange}>
                      <option value="">— Select service type —</option>
                      {serviceTypes.map((t) => <option key={t._id} value={t.name}>{t.name}</option>)}
                    </select>
                  </Field>
                  <Field label="Service Plan *">
                    <select className="select" name="serviceCategory" value={form.serviceCategory} onChange={handleChange}>
                      <option value="">— Select plan —</option>
                      {serviceCategories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                  </Field>
                </div>

                <Field label="Detailed Description *" note="max 500 words">
                  <textarea className="textarea" rows={5} name="detailedDescription" value={form.detailedDescription} onChange={handleChange} placeholder="Comprehensive service details…" />
                  <span className="labelNote" style={{ marginTop: "0.25rem", display: "block" }}>
                    {form.detailedDescription.trim().split(/\s+/).filter(Boolean).length} / 500 words
                  </span>
                </Field>

                <Field label="Benefits / Key Features *" note="max 300 words">
                  <textarea className="textarea" rows={4} name="benefits" value={form.benefits} onChange={handleChange} placeholder="What will the client receive? (bullet-point style)" />
                  <span className="labelNote" style={{ marginTop: "0.25rem", display: "block" }}>
                    {form.benefits.trim().split(/\s+/).filter(Boolean).length} / 300 words
                  </span>
                </Field>
              </section>

              {/*  Service images  */}
              <section className="section">
                <h3 className="sectionTitle">Service images <span className="labelNote">(up to {MAX_IMAGES} — recommended 1300 × 580 px)</span></h3>
                <div className="row3">
                  {[0, 1, 2].map((idx) => (
                    <div className="field" key={idx}>
                      <label className="label">Image {idx + 1}</label>
                      <div className="imageRow" style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.5rem" }}>
                        <input
                          type="file" accept="image/*" className="input"
                          onChange={(e) => uploadImage(e.target.files?.[0], idx)}
                          disabled={uploadingIdx !== null}
                        />
                        {uploadingIdx === idx && <span className="labelNote">Uploading…</span>}
                        {serviceImages[idx]?.url && (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                            <img src={serviceImages[idx].url} alt={`img-${idx}`} className="imagePreview" />
                            <button className="btn btnSm btnDanger" onClick={() => removeImage(idx)}>Remove</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/*  Audience & coverage  */}
              <section className="section">
                <h3 className="sectionTitle">Audience &amp; coverage</h3>
                <div className="row2">
                  <Field label="Service Area *">
                    <div className="stateDropdownWrapper">
                      <div className="select" style={{ cursor: "pointer", userSelect: "none" }} onClick={() => setStateOpen((p) => !p)}>
                        {form.serviceArea || "Select State"}
                      </div>
                      {stateOpen && (
                        <div className="stateDropdownMenu">
                          <div className="statePlaceholder" onClick={() => { setForm((p) => ({ ...p, serviceArea: "" })); setStateOpen(false); }}>
                          
                          </div>
                          {["Pan India", ...INDIA_STATES].map((state) => (
                            <div
                              key={state}
                              className={form.serviceArea === state ? "stateOptionActive" : "stateOption"}
                              onClick={() => { setForm((p) => ({ ...p, serviceArea: state })); setStateOpen(false); }}
                            >
                              {state}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Field>
                  <Field label="Target Industry / Market *">
                    <input className="input" name="targetIndustry" value={form.targetIndustry} onChange={handleChange} placeholder="e.g. SaaS startups, E-commerce, Enterprise" />
                  </Field>
                </div>
              </section>

              {/*  Team & credentials  */}
              <section className="section">
                <h3 className="sectionTitle">Team &amp; credentials</h3>
                <div className="row2">
                  <Field label="Team Size *">
                    <input className="input" name="teamSize" value={form.teamSize} onChange={handleChange} placeholder="e.g. 1 freelancer, 5-person team, 20+ member agency" />
                  </Field>
                  <Field label="Certifications / Credentials">
                    <input className="input" name="certifications" value={form.certifications} onChange={handleChange} placeholder="e.g. Google Certified, ISO 9001, AWS Certified Partner" />
                  </Field>
                </div>
              </section>

              {/*  Contact  */}
              <section className="section">
                <h3 className="sectionTitle">Contact</h3>
                <div className="row3">
                  <Field label="Contact Email *">
                    <input type="email" className="input" name="contactEmail" value={form.contactEmail} onChange={handleChange} placeholder="Enter email" />
                  </Field>
                  <Field label="Contact Number">
                    <input className="input" name="contactNumber" value={form.contactNumber} onChange={handleChange} placeholder="Enter phone" />
                  </Field>
                  <Field label="Contact Address">
                    <input className="input" name="contactAddress" value={form.contactAddress} onChange={handleChange} placeholder="City, State or full address" />
                  </Field>
                </div>
                <Field label="Website URL">
                  <input type="url" className="input" name="websiteUrl" value={form.websiteUrl} onChange={handleChange} placeholder="https://www.example.com" />
                </Field>
              </section>

              {/*  Consent  */}
              <section className="section">
                <h3 className="sectionTitle">Use &amp; disclosure consent</h3>

                <div style={{
                  padding: "1rem", borderRadius: "var(--radius-lg)",
                  background: "var(--blue-soft)", border: "1px solid rgba(1,148,223,0.25)",
                }}>
                  <label style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", cursor: "pointer" }}>
                    <input
                      type="checkbox" name="disclosureConsent"
                      checked={form.disclosureConsent} onChange={handleChange}
                      style={{ width: "18px", height: "18px", accentColor: "var(--blue)", flexShrink: 0, marginTop: "2px" }}
                    />
                    <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text)", lineHeight: 1.6 }}>
                      I / We confirm that all information submitted is non-confidential and may be reviewed, shared, or published for evaluation and listing purposes.{" "}
                      <strong style={{ color: "var(--orange)" }}>*</strong>
                    </span>
                  </label>
                </div>

                <div style={{
                  padding: "0.9rem 1rem", borderRadius: "var(--radius-lg)",
                  background: "var(--yellow-soft)", border: "1px solid rgba(252,207,2,0.4)",
                  color: "var(--yellow-hover)", fontSize: "var(--text-sm)",
                }}>
                  <strong>Note:</strong> Submitting does not guarantee listing. Our team will review and only approved listings will be published.
                </div>
              </section>
              <div style={{ display: "flex", justifyContent: "center", gap: "1rem", paddingTop: "3.75rem" }}>
              <button className="btn btnSecondary bt_submit" onClick={closeModal} disabled={saving || uploadingIdx !== null}>Cancel</button>
              <button className="btn btnPrimary bt_submit" onClick={save} disabled={saving || uploadingIdx !== null}>
                {saving ? "Submitting…" : mode === "create" ? "Submit" : "Update"}
              </button>
            </div>
            </div>{/* /modalBody */}
          </div>
        </div>
      )}

      <ConfirmationModal show={showConfirm} config={confirmConfig} onClose={() => setShowConfirm(false)} />
      <ToastContainer position="top-center" />
    </div>
  );
}