"use client"

import { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import publisherApi from "@/app/publisherapi";
import RichTextEditor from "@/components/RichTextEditor";
import { getPublisherPlanInfo } from "@/app/apiServices/subscriptions";
import {
  getPublicJobTypes,
  getPublicWorkModes,
  getPublicWorkExperiences,
} from "@/app/apiServices/publicapi";
import ConfirmationModal from "@/components/ConfirmationModal";
import { INDIA_STATES } from "@/app/constants";
import "../styles/publishercretepages.css";

/*  Constants  */
const defaultForm = {
  title: "",
  jobCategory: "",
  jobType: "",
  workMode: "",
  experienceLevel: "",
  openings: 1,
  companyName: "",
  companyWebsite: "",
  companyDescription: "",
  companySize: "",
  industrySector: "",
  companyLogo: null,
  hiringManagerName: "",
  hiringManagerEmail: "",
  hiringManagerPhone: "",
  roleOverview: "",
  keyResponsibilities: "",
  requiredEducation: "",
  yearsExperienceRequired: "",
  mustHaveSkills: "",
  salaryMin: "",
  salaryMax: "",
  salaryType: "",
  jobLocationAddress: "",
  jobLocationCity: "",
  jobLocationState: "",
  jobLocationCountry: "India",
  applyLastDate: "",
  applyDate: "",
  applicationMethod: "",
  externalApplicationUrl: "",
};

const companySizes    = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];
const educationLevels = ["High School", "Bachelor's", "Master's", "PhD", "No Degree Required"];
const salaryTypes     = ["Annual", "Monthly", "Hourly", "Project-based"];

const statusBadge = (status) => {
  if (status === "approved") return "badgeSuccess";
  if (status === "rejected") return "badgeDanger";
  return "badgeWarning";
};

function StatusBadge({ status, reason }) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);

  const cls = statusBadge(status);
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
      <span className={`badge ${cls}`}>
        {status}
        {reason && (
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
        )}
      </span>
    </span>
  );
}

/*  Component  */
export default function JobPage() {
  const [jobs, setJobs]         = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [form, setForm]         = useState(defaultForm);
  const [editId, setEditId]     = useState(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [planInfo, setPlanInfo] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [status, setStatus] = useState("all");
const [q, setQ]           = useState("");
  const [confirmConfig, setConfirmConfig] = useState({
    title: "", message: "",
    confirmText: "Confirm", cancelText: "Cancel",
    confirmVariant: "danger", onConfirm: () => {},
  });

  const [jobTypes, setJobTypes]           = useState([]);
  const [workModes, setWorkModes]         = useState([]);
  const [workExperiences, setWorkExperiences] = useState([]);

  const itemValue = (item) => item.value ?? item.name ?? item._id;
  const itemLabel = (item) => item.name  ?? item.value ?? item._id;

const fetchJobs = async (overrides = {}) => {
  try {
    setLoading(true);
    const params = new URLSearchParams();
    const s      = overrides.status !== undefined ? overrides.status : status;
    const search = overrides.q      !== undefined ? overrides.q      : q;
    if (s !== "all")   params.append("status", s);
    if (search.trim()) params.append("q", search.trim());
    const res = await publisherApi.get(`/api/publisher/jobs?${params}`);
    setJobs(res.data?.items || []);
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to load jobs");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchJobs();

    (async () => {
      try {
        const res = await publisherApi.get("/api/public/job-categories");
        setCategories(res.data?.categories || []);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load categories");
      }
    })();

    (async () => {
      try { const res = await getPublisherPlanInfo(); setPlanInfo(res.data); } catch (_) {}
    })();

    (async () => {
      try {
        const res = await getPublicJobTypes();
        setJobTypes(res.data?.jobTypes ?? res.data?.data ?? (Array.isArray(res.data) ? res.data : []));
      } catch (err) { toast.error(err?.response?.data?.message || "Failed to load job types"); }
    })();

    (async () => {
      try {
        const res = await getPublicWorkModes();
        setWorkModes(res.data?.workModes ?? res.data?.data ?? (Array.isArray(res.data) ? res.data : []));
      } catch (err) { toast.error(err?.response?.data?.message || "Failed to load work modes"); }
    })();

    (async () => {
      try {
        const res = await getPublicWorkExperiences();
        setWorkExperiences(res.data?.workExperiences ?? res.data?.data ?? (Array.isArray(res.data) ? res.data : []));
      } catch (err) { toast.error(err?.response?.data?.message || "Failed to load work experiences"); }
    })();
  }, []);

  /*  Modal helpers  */
  const openCreate = () => { setForm(defaultForm); setEditId(null); setShowModal(true); };

const openEdit = (job) => {
  const alreadyEdited = (job.editCount ?? 0) >= 1;

  setConfirmConfig({
    title: alreadyEdited ? "Edit Not Allowed" : "Edit Job",
    message: alreadyEdited
      ? "This job has already been edited once and can no longer be modified."
      : "You can only update this listing once. Please review all details carefully before submitting, as no further edits will be allowed after this.",
    confirmText: alreadyEdited ? "OK" : "I Understand, Proceed",
    cancelText: alreadyEdited ? "" : "Cancel",
    confirmVariant: alreadyEdited ? "danger" : "primary",
    onConfirm: () => {
      if (alreadyEdited) return;

      const fmtDate = (iso) => (iso ? iso.split("T")[0] : "");
      const normalizeWorkMode = (mode) => {
        if (!mode) return "";
        if (Array.isArray(mode)) return String(mode[0] || "").trim();
        return String(mode).split(",")[0].trim();
      };
      setEditId(job._id);
setForm({
    ...defaultForm, ...job,
    applyLastDate: fmtDate(job.applyLastDate || job.deadline),
    applyDate:     fmtDate(job.applyDate),
    jobType:       String(job.jobType || "").trim(),
    workMode:      normalizeWorkMode(job.workMode),  
    experienceLevel: String(job.experienceLevel || "").trim(), 
    companyLogo:   job.companyLogo || null,
  });
      setShowModal(true);
    },
  });
  setShowConfirm(true);
};



  const closeModal = () => setShowModal(false);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

const handleNumberOnly = (field) => (e) => {
  const value = e.target.value;
  if (/^\d*$/.test(value)) setForm((p) => ({ ...p, [field]: value }));
};

const handleTextOnly = (field) => (e) => {
  const value = e.target.value;
  if (/^[a-zA-Z\s]*$/.test(value)) setForm((p) => ({ ...p, [field]: value }));
};

const isValidUrl = (url) => {
  try { new URL(url); return true; } catch { return false; }
};

const validate = () => {
  if (!form.title.trim())                return "Job Title is required";
  if (!form.jobType)                     return "Job Type is required";
  if (!form.workMode)                    return "Work Mode is required";
  if (!form.experienceLevel)             return "Experience Level is required";
  if (!form.openings || Number(form.openings) < 1) return "Number of Openings is required";
  if (!form.companyName?.trim())         return "Company Name is required";
  if (!form.companyDescription?.trim())  return "Company Description is required";
  if (!form.companySize)                 return "Company Size is required";
  if (!form.industrySector?.trim())      return "Industry / Sector is required";
  if (!form.hiringManagerName?.trim())   return "Hiring Manager Name is required";
  if (!form.hiringManagerEmail?.trim())  return "Hiring Manager Email is required";
  if (!form.roleOverview?.trim())        return "Role Overview is required";
  if (!form.keyResponsibilities?.trim()) return "Key Responsibilities is required";
  if (!form.requiredEducation)           return "Required Education is required";
  if (!form.yearsExperienceRequired)     return "Years of Experience is required";
  if (!form.mustHaveSkills?.trim())      return "Must-Have Skills is required";
  if (!form.salaryType)                  return "Salary Type is required";
  if (!form.jobLocationAddress?.trim())  return "Job Location - Full Address is required";
  if (!form.jobLocationCity?.trim())     return "Job Location - City is required";
  if (!form.jobLocationState?.trim())    return "Job Location - State is required";
  if (!form.jobLocationCountry?.trim())  return "Job Location - Country is required";
  if (!form.applyLastDate)               return "Application Deadline is required";
  if (!form.applyDate)                   return "Expected Start Date is required";
  // if (!form.applicationMethod)           return "Application Method is required";
  if (form.companyWebsite && !isValidUrl(form.companyWebsite))
    return "Enter a valid Company Website URL";
  if (form.externalApplicationUrl && !isValidUrl(form.externalApplicationUrl))
    return "Enter a valid External Application URL";
  return null;
};

const stripHtml = (html) => {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const saveJob = async () => {
  const msg = validate();
  if (msg) return toast.warn(msg);
  const payload = {
    ...form,
    companyDescription: stripHtml(form.companyDescription),
    roleOverview: stripHtml(form.roleOverview),
    keyResponsibilities: stripHtml(form.keyResponsibilities),
    openings: Number(form.openings) || 0,
    salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
    salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
    yearsExperienceRequired: form.yearsExperienceRequired ? Number(form.yearsExperienceRequired) : undefined,
    workMode: form.workMode || "",
  };
    try {
      setSaving(true);
      if (editId) {
        await publisherApi.patch(`/api/publisher/jobs/${editId}`, payload);
        toast.success("Job updated (pending approval)");
      } else {
        await publisherApi.post("/api/publisher/jobs", payload);
        toast.success("Job created (pending approval)");
      }
      setShowModal(false);
      fetchJobs();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const uploadLogo = async (file) => {
    if (!file) return;
    const fd = new FormData();
    fd.append("files", file);
    try {
      setLogoUploading(true);
      const res = await publisherApi.post("/api/uploads", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const uploaded = res.data?.files?.[0];
      if (uploaded) {
        setForm((p) => ({ ...p, companyLogo: { url: uploaded.url, publicId: uploaded.publicId, resourceType: uploaded.resourceType } }));
        toast.success("Logo uploaded");
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setLogoUploading(false);
    }
  };

  const deleteJob = (id) => {
    if (!id) return;
    setConfirmConfig({
      title: "Delete Job",
      message: "Are you sure you want to permanently delete this job? This action cannot be undone.",
      confirmText: "Yes, Delete Job", cancelText: "Cancel", confirmVariant: "danger",
      onConfirm: async () => {
        try {
          await publisherApi.delete(`/api/publisher/jobs/${id}`);
          toast.success("Job deleted");
          fetchJobs();
        } catch (err) {
          toast.error(err?.response?.data?.message || "Delete failed");
        }
      },
    });
    setShowConfirm(true);
  };

const confirmToggleJob = (job) => {
  if (!job?._id) return;

  const toggleCount = job.toggleCount ?? 0;

  if (toggleCount >= 2) {
    setConfirmConfig({
      title: "Toggle Not Allowed",
      message: "This job has already been deactivated and reactivated once. No further activation or deactivation is allowed.",
      confirmText: "OK",
      cancelText: "",
      confirmVariant: "danger",
      onConfirm: () => {},
    });
    setShowConfirm(true);
    return;
  }

  const isDeactivating = job.isActive;

  setConfirmConfig({
    title: isDeactivating ? "Deactivate Job" : "Activate Job",
    message: isDeactivating
      ? "You may reactivate this job once after deactivating, but after that no further toggling will be allowed. Are you sure you want to deactivate?"
      : "You can activate this listing once more. After reactivating, no further deactivation or activation will be permitted. Proceed?",
    confirmText: isDeactivating ? "Yes, Deactivate" : "Yes, Activate",
    cancelText: "Cancel",
    confirmVariant: isDeactivating ? "warning" : "success",
    onConfirm: async () => {
      try {
        await publisherApi.post(`/api/publisher/jobs/${job._id}/toggle`);
        toast.success(job.isActive ? "Deactivated" : "Activated");
        fetchJobs();
      } catch (err) {
        toast.error(err?.response?.data?.message || "Update failed");
      }
    },
  });
  setShowConfirm(true);
};

  const toggleActive = async (job) => {
    try {
      await publisherApi.post(`/api/publisher/jobs/${job._id}/toggle`);
      toast.success(job.isActive ? "Deactivated" : "Activated");
      fetchJobs();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  /*  Plan limits  */
  const subscriptionExpired = planInfo && (
  planInfo.subscriptionStatus !== "active" ||
  (planInfo.expiry && new Date(planInfo.expiry) < new Date())
);
  const jobLimitReached     = planInfo && !subscriptionExpired && planInfo.limits?.jobLimit > 0 && planInfo.usage?.jobs >= planInfo.limits?.jobLimit;
  const jobButtonDisabled   = subscriptionExpired || jobLimitReached;

  const addBtnLabel = subscriptionExpired
    ? "Subscription Expired"
    : jobLimitReached
    ? `Limit Reached (${planInfo.usage.jobs}/${planInfo.limits.jobLimit})`
    : "+ Post a Job";

  /*  Render  */
  return (
    <div className="page">

      {/*  Topbar  */}
      <header className="topbar">
        <div>
          <h1 className="topbarTitle">Jobs</h1>
          <p className="topbarSub tdNoWrap">Create and manage job postings (pending admin approval)</p>
        </div>
        <div className="topbarActions">
          <button
            className={`btn ${jobButtonDisabled ? "btnSecondary" : "btnPrimary"}`}
            onClick={jobButtonDisabled ? undefined : openCreate}
            disabled={jobButtonDisabled}
            title={
              subscriptionExpired ? "Your subscription has expired. Please renew to post jobs."
              : jobLimitReached   ? `Job limit of ${planInfo.limits.jobLimit} reached for your current plan`
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
        <label className="label">Approval Status</label>
        <select
          className="select"
          value={status}
          onChange={(e) => { setStatus(e.target.value); fetchJobs({ status: e.target.value }); }}
        >
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
          placeholder="Search by title or category…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
        />
      </div>
      <div className="field">
        <label className="label" style={{ visibility: "hidden" }}>_</label>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <button className="btn btnPrimary btnSm" onClick={() => fetchJobs()} disabled={loading}>Search</button>
          <button
            className="btn btnSecondary btnSm"
            onClick={() => { setStatus("all"); setQ(""); fetchJobs({ status: "all", q: "" }); }}
            disabled={loading}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
      {/*  Jobs table  */}
      <div className="tableShell">
        <div className="tableHead">
          <h2 className="tableHeadTitle">All Jobs</h2>
        </div>
        <div className="tableBody">
          {loading ? (
            <p className="loadingState">Loading jobs…</p>
          ) : jobs.length === 0 ? (
            <p className="emptyState">No jobs yet. Click "Post a Job" to get started.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Active</th>
                  <th>Openings</th>
                  <th className="tdRight" style={{textAlign: "center"}}> Actions</th>
                </tr>
              </thead>
<tbody>
  {jobs.map((job, idx) => {
    const editLocked = (job.editCount ?? 0) >= 1;
    return (
      <tr key={job._id}>
        <td className="tdMuted" data-label="#">{idx + 1}</td>

        <td className="tdSemibold sp-font" data-label="Title">
          {job.title}
          {job.companyName && <div className="tdMuted">{job.companyName}</div>}
        </td>

        <td className="tdMuted tdNoWrap" data-label="Category">
          {job.jobCategory || "—"}
        </td>

<td data-label="Status">
  <StatusBadge
    status={job.status}
    reason={job.status === "approved" ? job.approvalReason : job.rejectionReason}
  />
</td>

        <td data-label="Active">
          <span className={`badge ${job.isActive ? "badgeSuccess" : "badgeNeutral"}`}>
            {job.isActive ? "Active" : "Inactive"}
          </span>
        </td>

        <td className="tdMuted tdNoWrap" data-label="Openings">
          {job.openings || "—"}
        </td>

        <td data-label="Actions">
          <div className="actionGroup">
            <button
              className={`btn btnSm ${editLocked ? "btnSecondary" : "btnPrimary"}`}
              onClick={() => openEdit(job)}
              title={editLocked ? "Already edited once" : "Edit job"}
            >
              Edit
            </button>
            <button
              className={`btn btnSm ${job.isActive ? "btnWarning" : "btnSuccess"}`}
              onClick={() => confirmToggleJob(job)}
              title={(job.toggleCount ?? 0) >= 2 ? "Toggle limit reached" : job.isActive ? "Deactivate" : "Activate"}
            >
              {job.isActive ? "Deactivate" : "Activate"}
            </button>
            <button className="btn btnSm btnDanger" onClick={() => deleteJob(job._id)}>Delete</button>
          </div>
        </td>
      </tr>
    );
  })}
</tbody>
            </table>
          )}
        </div>
      </div>

      {/*  Create / Edit modal  */}
      {showModal && (
        <div className="modalOverlay">
          <div className="modalDialog">

            {/* Header */}
            <div className="modalHeader">
              <h2 className="modalTitle">{editId ? "Edit Job" : "Post a Job"}</h2>
              <button className="modalClose" onClick={closeModal} aria-label="Close">✕</button>
            </div>

            {/* Body */}
            <div className="modalBody">

              {/*  Core details  */}
              <section className="section">
                <h3 className="sectionTitle">Core details</h3>
                <div className="field">
                  <label className="label">Job Title / Position Name *</label>
                  <input className="input" value={form.title} onChange={set("title")} placeholder="Enter job title" />
                </div>

                <div className="row2">
                  <div className="field">
                    <label className="label">Job Category *</label>
                    <select className="select" value={form.jobCategory} onChange={set("jobCategory")}>
                      <option value="">Select</option>
                      {categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>

                  <div className="field">
                    <label className="label">Number of Openings</label>
                    <input type="number" className="input" value={form.openings} onChange={set("openings")} />
                  </div>
                </div>

                <div className="row2">
                  <div className="field">
                    <label className="label">Job Type *</label>
                    {jobTypes.length === 0 ? (
                      <span className="labelNote">Loading…</span>
                    ) : (
                      <select 
                        className="select" 
                        value={form.jobType} 
                        onChange={set("jobType")}
                        required
                      >
                        <option value="">Select Job Type</option>
                        {jobTypes.map((t) => (
                          <option 
                            key={t._id ?? itemValue(t)} 
                            value={itemValue(t)}
                          >
                            {itemLabel(t)}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="field">
                    <label className="label">Work Mode</label>
                    {workModes.length === 0 ? (
                      <span className="labelNote">Loading…</span>
                    ) : (
                      <select 
                        className="select" 
                        value={form.workMode} 
                        onChange={set("workMode")}
                      >
                        <option value="">Select Work Mode</option>
                        {workModes.map((w) => {
                          const value = itemValue(w);
                          return (
                            <option 
                              key={w._id ?? value} 
                              value={value}
                            >
                              {itemLabel(w)}
                            </option>
                          );
                        })}
                      </select>
                    )}
                  </div>
                </div>

                <div className="row2">
                  <div className="field">
                    <label className="label">Experience Level</label>
                    <select className="select" value={form.experienceLevel} onChange={set("experienceLevel")}>
                      <option value="">Select</option>
                      {workExperiences.map((ex) => (
                        <option key={ex._id ?? itemValue(ex)} value={itemValue(ex)}>{itemLabel(ex)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label className="label">Required Education</label>
                    <select className="select" value={form.requiredEducation} onChange={set("requiredEducation")}>
                      <option value="">Select</option>
                      {educationLevels.map((el) => <option key={el} value={el}>{el}</option>)}
                    </select>
                  </div>
                </div>
              </section>

              {/*  Company information  */}
              <section className="section">
                <h3 className="sectionTitle">Company information</h3>

                <div className="row2">
                  <div className="field">
                    <label className="label">Company / Startup Name</label>
                    <input className="input" value={form.companyName} onChange={set("companyName")} placeholder="Enter company name" />
                  </div>
                  <div className="field">
                    <label className="label">Company Website</label>
                    <input type="url" className="input" value={form.companyWebsite} onChange={set("companyWebsite")} placeholder="https://" />
                  </div>
                </div>

                <div className="row2">
                  <div className="field">
                    <label className="label">Company Size</label>
                    <select className="select" value={form.companySize} onChange={set("companySize")}>
                      <option value="">Select</option>
                      {companySizes.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label className="label">Industry / Sector</label>
                    <input className="input" value={form.industrySector} onChange={set("industrySector")} placeholder="e.g. Artificial Intelligence & SaaS" />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Company Details</label>
                  <RichTextEditor
                    value={form.companyDescription}
                    onChange={(val) => setForm((p) => ({ ...p, companyDescription: val }))}
                    placeholder="Describe the company / startup"
                  />
                </div>

                <div className="field">
                  <label className="label">
                    Company Logo
                    <span className="labelNote">Recommended: 280 × 180 px</span>
                  </label>
                  <div className="imageRow">
                    <input
                      type="file"
                      accept="image/*"
                      className="input"
                      style={{ flex: 1 }}
                      onChange={(e) => uploadLogo(e.target.files?.[0])}
                      disabled={logoUploading}
                    />
                    {form.companyLogo?.url && (
                      <img src={form.companyLogo.url} alt="logo" className="imagePreview" />
                    )}
                  </div>
                </div>
              </section>

              {/*  Hiring manager  */}
              <section className="section">
                <h3 className="sectionTitle">Hiring manager</h3>

                <div className="row3">
                  <div className="field">
                    <label className="label">Name</label>
<input className="input" value={form.hiringManagerName} onChange={handleTextOnly("hiringManagerName")} placeholder="Enter name" />
                  </div>
                  <div className="field">
                    <label className="label">Email *</label>
                    <input type="email" className="input" value={form.hiringManagerEmail} onChange={set("hiringManagerEmail")} placeholder="Enter email" />
                  </div>
                  <div className="field">
                    <label className="label">Phone</label>
                    <input className="input" value={form.hiringManagerPhone} onChange={handleNumberOnly("hiringManagerPhone")} placeholder="Enter phone" maxLength={10} />
                  </div>
                </div>
              </section>

              {/*  Role details  */}
              <section className="section">
                <h3 className="sectionTitle">Role details</h3>

                <div className="field">
                  <label className="label">Role Overview</label>
                  <textarea className="textarea" rows={2} value={form.roleOverview} onChange={set("roleOverview")} placeholder="1-paragraph summary of the position" />
                </div>

<div className="field">
  <label className="label">Key Responsibilities</label>
  <textarea className="textarea" rows={3} value={form.keyResponsibilities} onChange={set("keyResponsibilities")} placeholder="List key responsibilities" />
  <span className="labelNote">Enter each responsibility separated by a comma, e.g. Manage team, Review code, Write documentation</span>
</div>

                <div className="row2">
                  <div className="field">
                    <label className="label">Years of Experience Required</label>
                    <input type="number" className="input" value={form.yearsExperienceRequired} onChange={set("yearsExperienceRequired")} />
                  </div>
                  <div className="field">
                    <label className="label">Must-Have Skills</label>
                    <textarea className="textarea" rows={2} value={form.mustHaveSkills} onChange={set("mustHaveSkills")} placeholder="e.g. React, Node.js, SQL" />
                  <span className="labelNote">Enter skills separated by commas, e.g. React, Node.js, SQL</span>
                  </div>
                </div>
              </section>

              {/*  Salary  */}
              <section className="section">
                <h3 className="sectionTitle">Salary</h3>

                <div className="row3">
                  <div className="field">
                    <label className="label">Minimum (₹)</label>
                    <input type="number" className="input" value={form.salaryMin} onChange={set("salaryMin")} placeholder="0" />
                  </div>
                  <div className="field">
                    <label className="label">Maximum (₹)</label>
                    <input type="number" className="input" value={form.salaryMax} onChange={set("salaryMax")} placeholder="0" />
                  </div>
                  <div className="field">
                    <label className="label">Salary Type</label>
                    <select className="select" value={form.salaryType} onChange={set("salaryType")}>
                      <option value="">Select</option>
                      {salaryTypes.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </section>

              {/*  Location  */}
              <section className="section">
                <h3 className="sectionTitle">Location</h3>

                <div className="field">
                  <label className="label">Full Address</label>
                  <textarea className="textarea" rows={2} value={form.jobLocationAddress} onChange={set("jobLocationAddress")} placeholder="Enter full address" />
                </div>

                <div className="row2">
                  <div className="field">
                    <label className="label">City</label>
                   <input className="input" value={form.jobLocationCity} onChange={handleTextOnly("jobLocationCity")} placeholder="Enter city" />
                  </div>

                  <div className="field">
                    <label className="label">State</label>
                    <div className="stateDropdownWrapper">
                      <div
                        className="select"
                        style={{ cursor: "pointer", userSelect: "none" }}
                        onClick={() => setStateOpen((p) => !p)}
                      >
                        {form.jobLocationState || "Select State"}
                      </div>
                      {stateOpen && (
                        <div className="stateDropdownMenu">
                          <div
                            className="statePlaceholder"
                            onClick={() => { setForm((p) => ({ ...p, jobLocationState: "" })); setStateOpen(false); }}
                          >
                          </div>
                          {INDIA_STATES.map((state) => (
                            <div
                              key={state}
                              className={form.jobLocationState === state ? "stateOptionActive" : "stateOption"}
                              onClick={() => { setForm((p) => ({ ...p, jobLocationState: state })); setStateOpen(false); }}
                            >
                              {state}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/*  Application  */}
              <section className="section">
                <h3 className="sectionTitle">Application</h3>

                <div className="row2">
                  <div className="field">
                    <label className="label">Application Deadline</label>
                    <input type="date" className="input" value={form.applyLastDate} onChange={set("applyLastDate")} />
                  </div>
                  <div className="field">
                    <label className="label">Expected Start Date</label>
                    <input type="date" className="input" value={form.applyDate} onChange={set("applyDate")} />
                  </div>
                </div>

                <div className="field">
                  <label className="label">External Application URL</label>
                  <input type="url" className="input" value={form.externalApplicationUrl} onChange={set("externalApplicationUrl")} placeholder="https://" />
                </div>
              </section>
              <div style={{ display: "flex", justifyContent: "center", gap: "1rem", paddingTop: "3.75rem" }}>
              <button className="btn btnSecondary btcancel" onClick={closeModal} disabled={saving}>Cancel</button>
              <button className="btn btnPrimary btsubmit" onClick={saveJob} disabled={saving}>
                  {saving ? "Submitting…" : editId ? "Update" : "Submit"}
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