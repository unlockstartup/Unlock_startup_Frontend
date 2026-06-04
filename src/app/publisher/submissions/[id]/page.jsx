"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import publisherApi from "@/app/publisherapi";
import ConfirmationModal from "@/components/ConfirmationModal";

import "../../styles/publishercretepages.css";

/* ─── Constants  */
const STATUS_BADGE = {
  new:         "badgePrimary",
  reviewing:   "badgeWarning",
  shortlisted: "badgeSuccess",
  rejected:    "badgeDanger",
};

const STATUS_OPTIONS = ["new", "reviewing", "shortlisted", "rejected"];

const TYPE_META = {
  listing:  { label: "Event / Job", color: "var(--blue)" },
  investor: { label: "Investor",    color: "var(--orange)" },
  service:  { label: "Service",     color: "var(--yellow-hover)" },
};

function InfoItem({ label, value, isLink = false, icon }) {
  if (!value) return null;
  return (
    <div className="pubModal__field">
      <span className="pubModal__label">
        {icon && <span className="pubModal__labelIcon">{icon}</span>}
        {label}
      </span>
      {isLink ? (
        <a className="pubModal__value pubModal__value--link" href={value} target="_blank" rel="noopener noreferrer">
          {value} ↗
        </a>
      ) : (
        <span className="pubModal__value">{value}</span>
      )}
    </div>
  );
}

export default function Page() {
  const routeParams    = useParams();
  const listingId      = routeParams?.listingId || routeParams?.id;
  const router         = useRouter();
  const searchParams   = useSearchParams();
  const listingType    = searchParams.get("type") || "listing";

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [total, setTotal]             = useState(0);
  const [page, setPage]               = useState(1);
  const [pages, setPages]             = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected]       = useState(null);
  const [updatingId, setUpdatingId]   = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: "", message: "",
    confirmText: "Confirm", cancelText: "Cancel",
    confirmVariant: "danger", onConfirm: () => {},
  });

  const limit = 20;

  /* ── Data loading ──────────────────────────────────────────────────────────── */
  const load = async () => {
    if (!listingId) return;
    try {
      setLoading(true);
      const params = { page, limit };
      if (statusFilter) params.status = statusFilter;
      if (listingId) {
        if (listingType === "investor")     params.investorId = listingId;
        else if (listingType === "service") params.serviceId  = listingId;
        else                               params.listingId  = listingId;
      }
      const res = await publisherApi.get("/api/publisher/submissions", { params });
      const all = res.data?.submissions || [];
      setSubmissions(all);
      setTotal(res.data?.total ?? all.length);
      setPages(res.data?.pages ?? (Math.ceil(all.length / limit) || 1));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [listingId, listingType, page, statusFilter]);

  /* ── Helpers ───────────────────────────────────────────────────────────────── */
  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      await publisherApi.patch(`/api/publisher/submissions/${id}/status`, { status });
      toast.success("Status updated");
      setSubmissions((prev) => prev.map((s) => (s._id === id ? { ...s, status } : s)));
      if (selected?._id === id) setSelected((s) => ({ ...s, status }));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally { setUpdatingId(null); }
  };

  const deleteSubmission = (id) => {
    if (!id) return;
    setConfirmConfig({
      title: "Delete this Submission",
      message: "Are you sure you want to permanently delete this submission? This action cannot be undone.",
      confirmText: "Yes, Delete Submission", cancelText: "Cancel", confirmVariant: "danger",
      onConfirm: async () => {
        try {
          await publisherApi.delete(`/api/publisher/submissions/${id}`);
          toast.success("Deleted");
          if (selected?._id === id) setSelected(null);
          load();
        } catch (err) { toast.error(err?.response?.data?.message || "Delete failed"); }
      },
    });
    setShowConfirm(true);
  };

  const getSubmissionType = (sub) => {
    if (sub.investorId || sub.submissionType === "investor") return "investor";
    if (sub.serviceId  || sub.submissionType === "service")  return "service";
    return "listing";
  };

  const getSourceTitle = (sub) => {
    const source = sub.listingId || sub.investorId || sub.serviceId;
    if (!source) return "Unknown";
    if (typeof source === "object")
      return source.title || source.fundName || source.serviceTitle || "Unknown";
    return `ID: …${source.toString().slice(-6)}`;
  };

  const getSourceSubtitle = (sub) => {
    const source = sub.listingId || sub.investorId || sub.serviceId;
    if (!source || typeof source !== "object") return "";
    return source.type || source.investorType || source.serviceCategory || "";
  };

  return (
    <div className="page">

      {/* ── Topbar ── */}
      <header className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <button className="btn btnSecondary btnSm" onClick={() => router.back()}>← Back</button>
          <div>
            <h1 className="topbarTitle">Submissions</h1>
          </div>
        </div>
        <div className="topbarActions">
          <span className="badge badgeNeutral" style={{ fontSize: "var(--text-xs)" }}>
            {total} total
          </span>
        </div>
      </header>

      {/* ── Filters ── */}
      <div className="tableShell">
        <div className="tableHead">
          <h2 className="tableHeadTitle">Filter</h2>
        </div>
        <div className="tableBody">
          <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "flex-end", flexWrap: "wrap" }}>
            <div className="field" style={{ minWidth: "180px" }}>
              <label className="label">Filter by Status</label>
              <select
                className="select"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <button
              className="btn btnSecondary btnSm"
              style={{ marginBottom: "0.1rem" }}
              onClick={() => { setStatusFilter(""); setPage(1); }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="tableShell">
        <div className="tableHead">
          <h2 className="tableHeadTitle">All Submissions</h2>
        </div>
        <div className="tableBody">
          {loading ? (
            <p className="loadingState">Loading…</p>
          ) : submissions.length === 0 ? (
            <p className="emptyState">No submissions found.</p>
          ) : (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Type</th>
                    <th>Applicant</th>
                    <th>Organisation</th>
                    <th>Applied For</th>
                    <th>Date</th>
                    <th className="tdRight" style={{textAlign: "right"}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub, idx) => {
                    const type     = getSubmissionType(sub);
                    const typeMeta = TYPE_META[type] || TYPE_META.listing;
                    return (
                      <tr key={sub._id} style={{ cursor: "pointer" }} onClick={() => setSelected(sub)}>
                        <td className="tdMuted">{(page - 1) * limit + idx + 1}</td>
                        <td>
                          <span className="badge" style={{ background: typeMeta.color, color: "#fff" }}>
                            {typeMeta.label}
                          </span>
                        </td>
                        <td>
                          <div className="tdSemibold">{sub.fullName}</div>
                          <div className="tdMuted">{sub.email}</div>
                        </td>
                        <td className="tdMuted">{sub.organisation || "—"}</td>
                        <td>
                          <div className="tdSemibold" style={{ fontSize: "var(--text-xs)" }}>{getSourceTitle(sub)}</div>
                        </td>
                        <td className="tdMuted">{new Date(sub.createdAt).toLocaleDateString()}</td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <div className="actionGroup">
                            <button className="btn btnSm btnPrimary"  onClick={() => setSelected(sub)}>View</button>
                            <button className="btn btnSm btnDanger"   onClick={() => deleteSubmission(sub._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              {pages > 1 && (
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "0.6rem", marginTop: "1rem" }}>
                  <button className="btn btnSecondary btnSm" disabled={page === 1}     onClick={() => setPage((p) => p - 1)}>← Prev</button>
                  <span className="tdMuted">Page <strong>{page}</strong> / <strong>{pages}</strong></span>
                  <button className="btn btnSecondary btnSm" disabled={page === pages} onClick={() => setPage((p) => p + 1)}>Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Detail modal (full screen) ── */}
{selected && (
  <div className="pubModal__overlay" onClick={() => setSelected(null)}>
    <div className="pubModal__dialog" onClick={(e) => e.stopPropagation()}>

      {/* Header */}
      <div className="pubModal__header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.2rem" }}>
            <h2 className="pubModal__title">{selected.fullName}</h2>
            <span className="pubModal__badge pubModal__badge--blue" style={{ background: TYPE_META[getSubmissionType(selected)]?.color, color: "#fff", border: "none" }}>
              {TYPE_META[getSubmissionType(selected)]?.label || "Unknown"}
            </span>
          </div>
          <p className="pubModal__subtitle">
            Applied for: <strong>{getSourceTitle(selected)}</strong>
          </p>
        </div>
        <button className="pubModal__close" onClick={() => setSelected(null)} aria-label="Close">✕</button>
      </div>

      {/* Body */}
      <div className="pubModal__body">


        {/* Contact */}
        <section className="pubModal__section">
          <h3 className="pubModal__sectionTitle">Contact information</h3>
          <div className="pubModal__grid">
            <InfoItem label="Full Name"    value={selected.fullName} />
            <InfoItem label="Email"        value={selected.email} />
            <InfoItem label="Phone"        value={selected.phone} />
            <InfoItem label="Organisation" value={selected.organisation} />
            <InfoItem label="Org Type"     value={selected.orgType} />
            <InfoItem label="Role"         value={selected.role} />
            <InfoItem label="Location"         value={selected.location} />
          </div>
        </section>

        {/* Investor */}
        {getSubmissionType(selected) === "investor" && (
          <section className="pubModal__section">
            <h3 className="pubModal__sectionTitle">Investment details</h3>
            <div className="pubModal__grid">
              <InfoItem label="Funding Stage" value={selected.fundingStage} />
              <InfoItem label="Industry Type" value={selected.industryType} />
              <InfoItem label="Location"      value={selected.location} />
              <InfoItem label="Website"       value={selected.website} isLink />
            </div>
          </section>
        )}

        {/* Service */}
      {getSubmissionType(selected) === "service" && (
  <section className="pubModal__section pubModal__section--compact">
            <h3 className="pubModal__sectionTitle">Service requirements</h3>
            <div className="pubModal__grid">
              <InfoItem label="Industry Type" value={selected.industryType} />
              <InfoItem label="Location"      value={selected.location} />
              <InfoItem label="Website"       value={selected.website} isLink />
            </div>
            {selected.requirements && (
              <div className="pubModal__requirementBox">
                {selected.requirements}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Footer */}
      <div className="pubModal__footer">
        <button className="pubModal__btn pubModal__btn--danger" onClick={() => deleteSubmission(selected._id)}>
          Delete Submission
        </button>
        <button className="pubModal__btn pubModal__btn--secondary" onClick={() => setSelected(null)}>
          Close
        </button>
      </div>

    </div>
  </div>
)}

      <ConfirmationModal show={showConfirm} config={confirmConfig} onClose={() => setShowConfirm(false)} />
      <ToastContainer position="top-center" />
    </div>
  );
}