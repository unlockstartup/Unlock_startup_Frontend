"use client"

export default function FundingCalls() {
  return <FundingCallsCrud />;
}

import { useEffect, useMemo, useState , useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { INDIA_STATES } from "@/app/constants";

import {
  createFundingCall,
  deleteFundingCall,
  listFundingCalls,
  toggleFundingCallActive,
  updateFundingCall,
} from "@/app/apiServices/fundingcalls";
import { getPublisherPlanInfo } from "@/app/apiServices/subscriptions";
import {
  getPublicChallengeCategories,
  getPublicCompetitionTypes,
  getPublicOrganizerTypes,
  getPublicStartupStages,
} from "@/app/apiServices/publicapi";
import ConfirmationModal from "@/components/ConfirmationModal";
import { uploadFiles } from "@/app/apiServices/uploads";

import "../styles/publishercretepages.css";

/*  Field helper  */
function Field({ label, children, note }) {
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

function StatusBadge({ status = "pending", reason }) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);

  const cls = status === "approved" ? "badgeSuccess"
    : status === "rejected" ? "badgeDanger"
    : "badgeWarning";

  const showTooltip = (hovered || pinned) && !!reason;

  useEffect(() => {
    if (!pinned) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setPinned(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [pinned]);

  return (
    <span className="statusBadgeWrapper">
      <span className={`badge ${cls}`}>{status}       {reason && (
        <span ref={ref} className="statusBadgeInfo">
          <span
            className={`statusInfoBtn statusInfoBtn--${status} ${pinned ? "statusInfoBtn--pinned" : ""}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={(e) => { e.stopPropagation(); setPinned((p) => !p); }}
          >
            i
          </span>

          {showTooltip && (
            <span className={`statusTooltip statusTooltip--${status}`}>
              <span className={`statusTooltipLabel statusTooltipLabel--${status}`}>
                {status === "approved" ? "Approval Note" : "Rejection Reason"}
              </span>
              <span className="statusTooltipDivider" />
              <span className="statusTooltipText">{reason}</span>
              <span className={`statusTooltipCaret statusTooltipCaret--${status}`} />
            </span>
          )}
        </span>
      )}</span>


    </span>
  );
}

/*  Date helpers  */
function toDateInput(v) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/*  URL helper  */
const isValidUrl = (url) => {
  try { new URL(url); return true; } catch { return false; }
};

/*  Main component  */
function FundingCallsCrud() {
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [rows, setRows]         = useState([]);
  const [planInfo, setPlanInfo] = useState(null);
  const [status, setStatus]     = useState("all");
  const [q, setQ]               = useState("");
  const [page, setPage]         = useState(1);
  const [limit, setLimit]       = useState(10);
  const [pages, setPages]       = useState(1);
  const [stateOpen, setStateOpen] = useState(false);

  const [challengeCategories, setChallengeCategories] = useState([]);
  const [organizerTypes, setOrganizerTypes]           = useState([]);
  const [startupStages, setStartupStages]             = useState([]);
  const [competitionTypes, setCompetitionTypes]       = useState([]);

  const [open, setOpen]       = useState(false);
  const [mode, setMode]       = useState("create");
  const [editing, setEditing] = useState(null);

  const [showConfirm, setShowConfirm]   = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: "", message: "",
    confirmText: "Confirm", cancelText: "Cancel",
    confirmVariant: "danger", onConfirm: () => {},
  });

  const initialForm = useMemo(() => ({
    title: "",
    challengeType: "",
    challengeCategory: "",
    challengeObjective: "",
    launchDate: "",
    submissionDeadline: "",
    resultDate: "",
    organizingCompany: "",
    organizerType: "",
    contactPersonName: "",
    officialEmail: "",
    contactPhone: "",
    description: "",
    keyFocusAreas: "",
    eligibleParticipants: "",
    startupStage: "",
    geographicRestrictions: "",
    additionalRewards: "",
    applicationFee: 0,
    eligibilityVerification: "",
    location: "",
    registrationLink: "",
    organizationWebsite: "",
    problemStatement: "",
    attachments: [],
    applicationType: "",
  }), []);

  const [form, setForm] = useState(initialForm);
  const [attachmentsUploading, setAttachmentsUploading] = useState(false);

  const sf = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const loadMeta = async () => {
    try {
      const [types, orgs, stages, cats] = await Promise.all([
        getPublicCompetitionTypes(),
        getPublicOrganizerTypes(),
        getPublicStartupStages(),
        getPublicChallengeCategories(),
      ]);
      setCompetitionTypes(types.data?.competitionTypes || types.data?.types || []);
      setOrganizerTypes(orgs.data?.organizerTypes     || orgs.data?.types   || []);
      setStartupStages(stages.data?.startupStages     || stages.data?.stages || []);
      setChallengeCategories([...(cats.data?.categories || [])].reverse());
    } catch {
      toast.error("Failed to load dropdown data");
    }
  };

  const handleNumberOnly = (field) => (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) setForm((p) => ({ ...p, [field]: value }));
  };

  const handleTextOnly = (field) => (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) setForm((p) => ({ ...p, [field]: value }));
  };

  const load = async () => {
    try {
      setLoading(true);
      const res = await listFundingCalls({ status, q: q || undefined, page, limit });
      setRows(res.data?.items || []);
      const pg = res.data?.pagination || {};
      setPages(pg.pages || 1);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load Competitions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeta();
    (async () => {
      try { const res = await getPublisherPlanInfo(); setPlanInfo(res.data); } catch {}
    })();
  }, []);

  useEffect(() => { load(); }, [status, page, limit]);

  /*  Modal helpers  */
  const openCreate = () => { setMode("create"); setEditing(null); setForm(initialForm); setOpen(true); };

  const openEdit = (row) => {
    const alreadyEdited = (row.editCount ?? 0) >= 1;
    setConfirmConfig({
      title: alreadyEdited ? "Edit Not Allowed" : "Edit Competition",
      message: alreadyEdited
        ? "This competition has already been edited once and can no longer be modified."
        : "You can only update this listing once. Please review all details carefully before submitting, as no further edits will be allowed after this.",
      confirmText: alreadyEdited ? "OK" : "I Understand, Proceed",
      cancelText: alreadyEdited ? "" : "Cancel",
      confirmVariant: alreadyEdited ? "danger" : "primary",
      onConfirm: () => {
        if (alreadyEdited) return;

        const resolveOrgType = (val) => {
          if (!val) return "";
          if (typeof val === "object") return val._id || "";
          const byId = organizerTypes.find((t) => t._id === val);
          if (byId) return byId._id;
          return organizerTypes.find((t) => t.name === val)?._id || "";
        };
        setMode("edit");
        setEditing(row);
        setForm({
          ...initialForm, ...row,
          organizerType:      resolveOrgType(row.organizerType),
          challengeType:      row.challengeType     || "",
          challengeCategory:  row.challengeCategory || "",
          launchDate:         toDateInput(row.launchDate),
          submissionDeadline: toDateInput(row.submissionDeadline),
          resultDate:         toDateInput(row.resultDate),
          additionalRewards: Array.isArray(row.additionalRewards)
            ? row.additionalRewards.join(", ") : row.additionalRewards || "",
          eligibilityVerification: Array.isArray(row.eligibilityVerification)
            ? row.eligibilityVerification.join(", ") : row.eligibilityVerification || "",
          organizationWebsite: row.organizationWebsite || "",
          problemStatement:    row.problemStatement   || "",
          attachments:         row.attachments        || [],
          applicationType:     row.applicationType    || "",
        });
        setOpen(true);
      },
    });
    setShowConfirm(true);
  };

  const closeModal = () => { if (saving || attachmentsUploading) return; setOpen(false); };

  const validate = () => {
    if (!form.title.trim()) return "Challenge Name / Title is required";
    if (!form.challengeCategory.trim()) return "Challenge Category is required";
    if (!form.submissionDeadline) return "Submission Deadline is required";
    if (!form.organizingCompany.trim()) return "Organizing Company / Institution is required";
    if (!form.organizerType.trim()) return "Company Type is required";
    if (!form.officialEmail.trim()) return "Official Email is required";
    if (!form.description.trim()) return "Description is required";
    if (!form.startupStage.trim()) return "Startup Stage Requirements is required";
    if (!form.location.trim()) return "Location is required";
    if (!form.registrationLink.trim()) return "Registration Link is required";
    if (form.officialEmail && !/^\S+@\S+\.\S+$/.test(form.officialEmail.trim())) {
      return "Enter a valid official email";
    }
    if (form.registrationLink && !isValidUrl(form.registrationLink.trim())) {
      return "Enter a valid registration link URL";
    }
    if (!form.attachments?.length) return "Please upload at least one image/attachment";
    if (form.organizationWebsite && !isValidUrl(form.organizationWebsite.trim())) {
      return "Enter a valid website URL";
    }
    return null;
  };

  const save = async () => {
    const msg = validate();
    if (msg) return toast.warn(msg);

    try {
      setSaving(true);
      const toISO = (s) => { if (!s) return undefined; const d = new Date(s + "T00:00:00"); return isNaN(d.getTime()) ? undefined : d.toISOString(); };
      const payload = {
        ...form,
        title:                   form.title.trim(),
        challengeType:           form.challengeType.trim() || undefined,
        challengeCategory:       form.challengeCategory.trim(),
        challengeObjective:      form.challengeObjective.trim() || undefined,
        launchDate:              toISO(form.launchDate),
        submissionDeadline:      toISO(form.submissionDeadline),
        resultDate:              toISO(form.resultDate),
        organizingCompany:       form.organizingCompany.trim(),
        organizerType:           form.organizerType.trim(),
        contactPersonName:       form.contactPersonName.trim() || undefined,
        officialEmail:           form.officialEmail.trim(),
        contactPhone:            form.contactPhone.trim() || undefined,
        description:             form.description.trim(),
        keyFocusAreas:           form.keyFocusAreas.trim() || undefined,
        eligibleParticipants:    form.eligibleParticipants.trim() || undefined,
        startupStage:            form.startupStage.trim(),
        geographicRestrictions:  form.geographicRestrictions.trim() || undefined,
        additionalRewards:       form.additionalRewards ? form.additionalRewards.split(",").map((s) => s.trim()).filter(Boolean) : [],
        applicationFee:          Number(form.applicationFee) || 0,
        eligibilityVerification: form.eligibilityVerification ? form.eligibilityVerification.split(",").map((s) => s.trim()).filter(Boolean) : [],
        organizationWebsite:     form.organizationWebsite?.trim() || undefined,
        problemStatement:        form.problemStatement?.trim() || undefined,
        location:                form.location.trim(),
        registrationLink:        form.registrationLink.trim(),
        attachments:             form.attachments?.length ? form.attachments : [],
        applicationType:         form.applicationType?.trim() || undefined,
      };
      if (mode === "create") {
        await createFundingCall(payload);
        toast.success("Competition created (pending admin approval)");
      } else {
        await updateFundingCall(editing._id, payload);
        toast.success("Competition updated (pending re-approval)");
      }
      setOpen(false);
      setForm(initialForm);
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  /*  Delete / toggle  */
  const onDelete = (row) => {
    if (!row?._id) { toast.error("Invalid Competition ID"); return; }
    setConfirmConfig({
      title: "Delete Competition",
      message: "Are you sure you want to permanently delete this competition? This action cannot be undone.",
      confirmText: "Yes, Delete this Competition", cancelText: "Cancel", confirmVariant: "danger",
      onConfirm: async () => {
        try {
          await deleteFundingCall(row._id);
          toast.success("Competition deleted successfully");
          load();
        } catch (e) {
          toast.error(e?.response?.data?.message || "Failed to delete Competition");
        }
      },
    });
    setShowConfirm(true);
  };


  
  const onToggleActiveConfirm = (row) => {
    if (!row?._id) { toast.error("Invalid Competition ID"); return; }
    const toggleCount = row.toggleCount ?? 0;
    if (toggleCount >= 2) {
      setConfirmConfig({
        title: "Toggle Not Allowed",
        message: "This competition has already been deactivated and reactivated once. No further activation or deactivation is allowed.",
        confirmText: "OK",
        cancelText: "",
        confirmVariant: "danger",
        onConfirm: () => {},
      });
      setShowConfirm(true);
      return;
    }
    const isDeactivating = row.isActive;
    setConfirmConfig({
      title: isDeactivating ? "Deactivate Competition" : "Activate Competition",
      message: isDeactivating
        ? "You may reactivate this competition once after deactivating, but after that no further toggling will be allowed. Are you sure you want to deactivate?"
        : "You can activate this listing once more. After reactivating, no further deactivation or activation will be permitted. Proceed?",
      confirmText: isDeactivating ? "Yes, Deactivate" : "Yes, Activate",
      cancelText: "Cancel",
      confirmVariant: isDeactivating ? "warning" : "success",
      onConfirm: async () => {
        try {
          await toggleFundingCallActive(row._id);
          toast.success(isDeactivating ? "Deactivated" : "Activated");
          load();
        } catch (e) {
          toast.error(e?.response?.data?.message || "Toggle failed");
        }
      },
    });
    setShowConfirm(true);
  };

  /*  Attachments  */
  const onAttachmentsPick = async (files) => {
    if (!files?.length) return;
    try {
      setAttachmentsUploading(true);
      const res = await uploadFiles(Array.from(files));
      const uploaded = res.data?.files || [];
      if (!uploaded.length) throw new Error("Upload failed");
      setForm((p) => ({
        ...p,
        attachments: [
          ...p.attachments,
          ...uploaded.map((f) => ({ url: f.url, publicId: f.publicId, resourceType: f.resourceType || "raw" })),
        ],
      }));
      toast.success(`${uploaded.length} file(s) uploaded`);
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message || "Upload failed");
    } finally {
      setAttachmentsUploading(false);
    }
  };

  const removeAttachment = (publicId) =>
    setForm((p) => ({ ...p, attachments: p.attachments.filter((a) => a.publicId !== publicId) }));

  /*  Plan limits  */
const isDateExpired = planInfo?.expiry && new Date(planInfo.expiry) < new Date();
const isExpired = planInfo && (
  planInfo.subscriptionStatus !== "active" || isDateExpired
);
const hasAccess           = planInfo ? !isExpired : false;
const subscriptionExpired = isExpired;
const fundingLimitReached  = planInfo && !subscriptionExpired && planInfo.limits?.fundingCallsLimit > 0 && planInfo.usage?.fundingCalls >= planInfo.limits?.fundingCallsLimit;
const fundingButtonDisabled = !hasAccess || fundingLimitReached;

const addBtnLabel = subscriptionExpired
  ? "Subscription Expired"
  : !hasAccess
  ? "Create (Subscribe)"
  : fundingLimitReached
  ? `Limit Reached (${planInfo.usage.fundingCalls}/${planInfo.limits.fundingCallsLimit})`
  : "+ Add Competition";

  /*  Render  */
  return (
    <div className="page">

      {/*  Topbar  */}
      <header className="topbar">
        <div>
          <h1 className="topbarTitle">Competitions</h1>
          <p className="topbarSub tdNoWrap">Publish competitions (pending admin approval)</p>
        </div>
        <div className="topbarActions">
          <button
            className={`btn ${fundingButtonDisabled ? "btnSecondary" : "btnPrimary"}`}
onClick={
  subscriptionExpired ? undefined
  : !hasAccess ? () => toast.info("Please purchase a subscription to create Competition")
  : fundingLimitReached ? undefined
  : openCreate
}
disabled={subscriptionExpired || fundingLimitReached}
title={
  subscriptionExpired ? "Your subscription has expired. Please renew to add competitions."
  : !hasAccess ? "Subscribe to create Competition"
  : fundingLimitReached ? `Competitions limit of ${planInfo.limits.fundingCallsLimit} reached`
  : ""
}
          >
            {addBtnLabel}
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
              <label className="label">Status</label>
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
                placeholder="Search by title…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (setPage(1), load())}
              />
            </div>

            <div className="field">
              <label className="label" style={{ visibility: "hidden" }}>_</label>
              <div style={{ display: "flex", gap: "0.6rem" }}>
                <button className="btn btnPrimary btnSm" onClick={() => { setPage(1); load(); }} disabled={loading}>
                  Search
                </button>
                <button className="btn btnSecondary btnSm" onClick={() => { setStatus("all"); setQ(""); setPage(1); setLimit(10); setTimeout(load, 0); }} disabled={loading}>
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  Table  */}
      <div className="tableShell">
        <div className="tableHead">
          <h2 className="tableHeadTitle">All Competitions</h2>
        </div>
        <div className="tableBody">
          {loading ? (
            <p className="loadingState">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="emptyState">No competitions yet. Click "Add Competition" to get started.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Banner</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Active</th>
                  <th>Deadline</th>
                  <th className="tdRight" style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => {
                  const editLocked = (r.editCount ?? 0) >= 1;
                  return (
                    <tr key={r._id}>
                      <td className="tdMuted" data-label="#">{(page - 1) * limit + idx + 1}</td>

                      <td className="tdSemibold" data-label="Title">
                        <div>{r.title}</div>
                        {r.organizingCompany && <div className="tdMuted">{r.organizingCompany}</div>}
                      </td>

                      <td data-label="Banner">
                        {r.attachments?.[0]?.url ? (
                          <img src={r.attachments[0].url} alt="banner" className="thumb" />
                        ) : (
                          <span className="tdMuted">No image</span>
                        )}
                      </td>

                      <td className="tdMuted tdNoWrap" data-label="Category">
                        {r.challengeCategory || "—"}
                      </td>

                      <td data-label="Status">
                           <StatusBadge
     status={r.status}
     reason={r.status === "approved" ? r.approvalReason : r.rejectionReason}
   />
                      </td>

                      <td data-label="Active">
                        <span className={`badge ${r.isActive ? "badgeSuccess" : "badgeNeutral"}`}>
                          {r.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="tdMuted tdNoWrap" data-label="Deadline">
                        {r.submissionDeadline ? (
                          <>
                            <span className="dateOnly">
                              {r.submissionDeadline ? new Date(r.submissionDeadline).toLocaleDateString() : "—"}
                            </span>
                          </>
                        ) : "—"}
                      </td>

                      <td data-label="Actions">
                        <div className="actionGroup">
<button
  className={`btn btnSm ${editLocked ? "btnSecondary" : "btnPrimary"}`}
  onClick={() => openEdit(r)}
  title={editLocked ? "Edit not allowed — already edited once" : "Edit competition"}
>
  Edit
</button>
                          <button
                            className={`btn btnSm ${r.isActive ? "btnWarning" : "btnSuccess"}`}
                            onClick={() => onToggleActiveConfirm(r)}
                            title={(r.toggleCount ?? 0) >= 2 ? "Toggle limit reached" : r.isActive ? "Deactivate" : "Activate"}
                          >
                            {r.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button className="btn btnSm btnDanger" onClick={() => onDelete(r)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {pages > 1 && (
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "0.6rem", marginTop: "1rem" }}>
              <button className="btn btnSecondary btnSm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
              <span className="tdMuted">Page <strong>{page}</strong> / <strong>{pages}</strong></span>
              <button className="btn btnSecondary btnSm" disabled={page === pages} onClick={() => setPage((p) => p + 1)}>Next →</button>
            </div>
          )}
        </div>
      </div>

      {/*  Create / Edit modal  */}
      {open && (
        <div className="modalOverlay">
          <div className="modalDialog">

            {/* Header */}
            <div className="modalHeader">
              <h2 className="modalTitle">{mode === "create" ? "Add Competition" : "Edit Competition"}</h2>
              <button className="modalClose" onClick={closeModal} aria-label="Close">✕</button>
            </div>

            {/* Body */}
            <div className="modalBody">

              {/*  Core details  */}
              <section className="section">
                <h3 className="sectionTitle">Core details</h3>

                <Field label="Challenge Name / Title *">
                  <input className="input" value={form.title} onChange={sf("title")} placeholder="Enter challenge name" />
                </Field>

                <div className="row3">
                  <Field label="Challenge Type">
                    <select className="select" value={form.challengeType} onChange={(e) => setForm({ ...form, challengeType: e.target.value, challengeCategory: "" })}>
                      <option value="">Select</option>
                      {competitionTypes.map((t) => <option key={t._id} value={t.name}>{t.name}</option>)}
                    </select>
                  </Field>

                  <Field label="Challenge Category *">
                    <select
                      className="select"
                      value={form.challengeCategory}
                      onChange={sf("challengeCategory")}
                    >
                      <option value="">Select Category</option>
                      {challengeCategories.map((c) => (
                        <option key={c._id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Startup Stage Requirements *">
                    <select className="select" value={form.startupStage} onChange={sf("startupStage")}>
                      <option value="">Select</option>
                      {startupStages.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
                    </select>
                  </Field>
                </div>

                <div className="row3">
                  <Field label="Start Date">
                    <input type="date" className="input" value={form.launchDate} onChange={sf("launchDate")} />
                  </Field>
                  <Field label="Submission Deadline *">
                    <input type="date" className="input" value={form.submissionDeadline} onChange={sf("submissionDeadline")} />
                  </Field>
                  <Field label="Result Date">
                    <input type="date" className="input" value={form.resultDate} onChange={sf("resultDate")} />
                  </Field>
                </div>
              </section>

              {/*  Company information  */}
              <section className="section">
                <h3 className="sectionTitle">Company information</h3>

                <div className="row2">
                  <Field label="Company Name*">
                    <input className="input" value={form.organizingCompany} onChange={sf("organizingCompany")} placeholder="Enter company name" />
                  </Field>
                  <Field label="Company Type *">
                    <select className="select" value={form.organizerType} onChange={sf("organizerType")}>
                      <option value="">Select</option>
                      {organizerTypes.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
                    </select>
                  </Field>
                </div>

                <div className="row3">
                  <Field label="Contact Person Name">
                    <input className="input" value={form.contactPersonName} onChange={handleTextOnly("contactPersonName")} placeholder="Enter name" />
                  </Field>
                  <Field label="Official Email *">
                    <input type="email" className="input" value={form.officialEmail} onChange={sf("officialEmail")} placeholder="Enter email" />
                  </Field>
                  <Field label="Contact Phone">
                    <input className="input" value={form.contactPhone} onChange={handleNumberOnly("contactPhone")} placeholder="Enter phone" maxLength={10} />
                  </Field>
                </div>

                <Field label="Website Url">
                  <input type="url" className="input" placeholder="https://" value={form.organizationWebsite} onChange={sf("organizationWebsite")} />
                </Field>
              </section>

              {/*  Content  */}
              <section className="section">
                <h3 className="sectionTitle">About Challenges</h3>

                <Field label="Problem Statement">
                  <textarea className="textarea" rows={4} placeholder="Detailed challenge description / problem being solved" value={form.problemStatement} onChange={sf("problemStatement")} />
                </Field>

                <Field label="Description *">
                  <textarea className="textarea" rows={5} value={form.description} onChange={sf("description")} placeholder="Describe the competition" />
                </Field>

                <Field label="Challenge Objective">
                  <textarea className="textarea" rows={3} placeholder="What is the main goal of this challenge?" value={form.challengeObjective} onChange={sf("challengeObjective")} />
                </Field>

                <div className="row2">
                  <Field label="Key Focus Areas">
                    <input className="input" value={form.keyFocusAreas} onChange={sf("keyFocusAreas")} placeholder="e.g. Climate Tech, FinTech" />
                  </Field>
                  <Field label="Who can participate">
                    <input className="input" value={form.eligibleParticipants} onChange={sf("eligibleParticipants")} placeholder="e.g. Individual, Company, Startups, Innovators, Students" />
                  </Field>
                </div>
              </section>

              {/*  Requirements & rewards  */}
              <section className="section">
                <h3 className="sectionTitle">Requirements &amp; rewards</h3>

                <Field label="Additional Rewards" note="(comma separated)">
                  <input className="input" value={form.additionalRewards} onChange={sf("additionalRewards")} placeholder="Cash prize, Mentorship, Equity, etc." />
                </Field>

                <div className="row2">
                  <Field label="Application Type">
                    <select
                      className="select"
                      value={form.applicationType}
                      onChange={(e) => {
                        const val = e.target.value;
                        setForm((p) => ({
                          ...p,
                          applicationType: val,
                          applicationFee: val === "paid" ? p.applicationFee : 0,
                        }));
                      }}
                    >
                      <option value="">Select</option>
                      <option value="free">Free</option>
                      <option value="paid">Paid</option>
                      <option value="invite only">Invite Only</option>
                    </select>
                  </Field>
                  {form.applicationType === "paid" && (
                    <Field label="Application Fee (₹)">
                      <input type="number" className="input" value={form.applicationFee} onChange={sf("applicationFee")} min="0" step="1" placeholder="0" />
                    </Field>
                  )}
                </div>
              </section>

              {/*  Location & registration  */}
              <section className="section">
                <h3 className="sectionTitle">Location &amp; registration</h3>

                <div className="row2">
                  <Field label="Location *">
                    <div className="stateDropdownWrapper">
                      <div
                        className="select"
                        style={{ cursor: "pointer", userSelect: "none" }}
                        onClick={() => setStateOpen((p) => !p)}
                      >
                        {form.location || "Select State"}
                      </div>
                      {stateOpen && (
                        <div className="stateDropdownMenu">
                          <div
                            className="statePlaceholder"
                            onClick={() => { setForm((p) => ({ ...p, location: "" })); setStateOpen(false); }}
                          >
                          </div>
                          {INDIA_STATES.map((state) => (
                            <div
                              key={state}
                              className={form.location === state ? "stateOptionActive" : "stateOption"}
                              onClick={() => { setForm((p) => ({ ...p, location: state })); setStateOpen(false); }}
                            >
                              {state}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Field>

                  <Field label="Registration Link *">
                    <input type="url" className="input" placeholder="https://" value={form.registrationLink} onChange={sf("registrationLink")} />
                  </Field>
                </div>
              </section>

              {/*  Attachments  */}
              <section className="section">
                <h3 className="sectionTitle">Main image / attachments</h3>

                <Field label="Upload files" note="Recommended banner: 1300 × 580 px">
                  <div className="imageRow" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                    <input
                      type="file"
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                      multiple
                      className="input"
                      disabled={attachmentsUploading}
                      onChange={(e) => onAttachmentsPick(e.target.files)}
                    />
                    {form.attachments?.length > 0 && (
                      <div className="tagList">
                        {form.attachments.map((a, idx) => (
                          <span key={a.publicId || idx} className="tag">
                            {a.publicId || `File ${idx + 1}`}
                            <button type="button" className="tagRemove" onClick={() => removeAttachment(a.publicId)}>✕</button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Field>
              </section>

              {/*  Notice  */}
              <div style={{ padding: "0.9rem 1rem", borderRadius: "0.85rem", background: "var(--yellow-soft)", border: "1px solid rgba(252,207,2,0.4)", color: "var(--yellow-hover)", fontSize: "var(--text-sm)" }}>
                Note: Creating or updating a competition sets its status to <strong>Pending</strong> until an admin approves it.
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: "1rem", paddingTop: "3.75rem" }}>
                <button className="btn btnSecondary btcancel" onClick={closeModal} disabled={saving || attachmentsUploading}>Cancel</button>
                <button className="btn btnPrimary btsubmit" onClick={save} disabled={saving || attachmentsUploading}>
                  {saving ? "Submitting…" : mode === "create" ? "Submit" : "Update"}
                </button>
              </div>
            </div>{/* /modalBody */}
          </div>
        </div>
      )}

      <ConfirmationModal show={showConfirm} config={confirmConfig} onClose={() => setShowConfirm(false)} />
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}