"use client"

import { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import publisherApi from "@/app/publisherapi";
import RichTextEditor from "@/components/RichTextEditor";
import { getPublisherPlanInfo } from "@/app/apiServices/subscriptions";
import ConfirmationModal from "@/components/ConfirmationModal";
import { INDIA_STATES } from "@/app/constants";
import {
  getPublicEventCategories,
  getPublicEventTypes,
} from "@/app/apiServices/publicapi";
import { formatServerError } from "@/app/formatServerError";
import "../styles/publishercretepages.css";

/*  Constants */
const defaultForm = {
  title: "",
  eventCategory: [],
  startDateTime: "",
  endDateTime: "",
  venueName: "",
  fullAddress: "",
  eventFormat: "in-person",
  organizationName: "",
  organizationWebsite: "",
  organizerContactPerson: "",
  workEmail: "",
  phoneNumber: "",
  eventDescription: "",
  targetAudience: "",
  keyTopics: "",
  attendeeBenefits: "",
  featuredSpeakers: "",
  eventWebsite: "",
  registrationType: "",
  registrationDeadline: "",
  registrationUrl: "",
  registrationPrice: "",
  eventType: "",
  location: "",
  ticketPricingTiers: [],
  jobLocationState: "",
  disclosureConsent: false, 
};

const registrationTypes = ["Free", "Paid", "Invite Only"];
const applicationMethods = [
  {
    value: "platform",
    label: "Apply by Platform",
    tooltip: "Attendees register directly through our platform. All applications are tracked and managed here.",
  },
  {
    value: "external",
    label: "Apply by External Link",
    tooltip: "Attendees are redirected to an external URL (e.g. your own website or Eventbrite) to complete registration.",
  },
];
const formats = [
  { value: "in-person", label: "In-Person" },
  { value: "offline", label: "Offline" },
  { value: "online", label: "Online" },
  { value: "hybrid", label: "Hybrid" },
];
const stripHtml = (html) => (html || "").replace(/<[^>]*>/g, "").trim();
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

/*  Component */
export default function PublisherEventPage() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [planInfo, setPlanInfo] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [serverError, setServerError] = useState(null);
  const [applicationMethod, setApplicationMethod] = useState("");
  const [confirmConfig, setConfirmConfig] = useState({
    title: "", message: "",
    confirmText: "Confirm", cancelText: "Cancel",
    confirmVariant: "danger", onConfirm: () => { },
  });

  /*  Data fetching  */
  const fetchEvents = async (overrides = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      const s = overrides.status !== undefined ? overrides.status : status;
      const search = overrides.q !== undefined ? overrides.q : q;
      if (s !== "all") params.append("status", s);
      if (search.trim()) params.append("q", search.trim());
      const res = await publisherApi.get(`/api/publisher/dashboard/events?${params}`);
      setEvents(res.data?.items || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    (async () => {
      try {
        const [types, cats] = await Promise.all([
          getPublicEventTypes(),
          getPublicEventCategories(),   // no typeId argument
        ]);
        setEventTypes(types.data?.eventTypes || []);
        setCategories(cats.data?.categories || []);
      } catch (err) {
        toast.error("Failed to load dropdown data");
      }
    })();

    (async () => {
      try { const res = await getPublisherPlanInfo(); setPlanInfo(res.data); } catch { }
    })();
  }, []);



  const openModal = () => {
    setServerError(null);
    setForm(defaultForm);
    setEditId(null);
    setMainImage(null);
    setApplicationMethod("");
    setShowModal(true);
  };
  const openEdit = (ev) => {
    const alreadyEdited = (ev.editCount ?? 0) >= 1;

    setConfirmConfig({
      title: alreadyEdited ? "Edit Not Allowed" : "Edit Event",
      message: alreadyEdited
        ? "This listing has already been edited once and can no longer be modified."
        : "You can only update this listing once. Please review all details carefully before submitting, as no further edits will be allowed after this.",
      confirmText: alreadyEdited ? "OK" : "I Understand, Proceed",
      cancelText: alreadyEdited ? "" : "Cancel",
      confirmVariant: alreadyEdited ? "danger" : "primary",
      onConfirm: () => {
        if (alreadyEdited) return;
        setServerError(null);
        const pad = (n) => String(n).padStart(2, "0");
        const fmt = (iso) => {
          if (!iso) return "";
          const d = new Date(iso);
          return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        };
        const arr = (v) => (Array.isArray(v) ? v.join(", ") : v || "");

        setForm({
          ...defaultForm, ...ev,
          targetAudience: arr(ev.targetAudience),
          keyTopics: arr(ev.keyTopics),
          attendeeBenefits: arr(ev.attendeeBenefits),
          eventDescription: ev.eventDescription || "",
          featuredSpeakers: ev.featuredSpeakers || "",
          startDateTime: fmt(ev.startDateTime),
          endDateTime: fmt(ev.endDateTime),
          registrationDeadline: fmt(ev.registrationDeadline),
          registrationPrice: ev.registrationPrice?.toString() || "",
          eventCategory: Array.isArray(ev.eventCategory) ? ev.eventCategory
            : ev.eventCategory ? [ev.eventCategory] : [],
        });
        setEditId(ev._id);
        setMainImage(ev.mainImage || null);
        setApplicationMethod("");
        setShowModal(true);
      },
    });
    setShowConfirm(true);
  };



  const closeModal = () => { setServerError(null); setShowModal(false); };

const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
};
  const handleNumberOnly = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) setForm((prev) => ({ ...prev, [name]: value }));
  };

const handleTextOnly = (e) => {
  const { name, value } = e.target;
  if (/^[a-zA-Z\s.&'-]*$/.test(value)) setForm((prev) => ({ ...prev, [name]: value }));
};
  const addTier = () => setForm((p) => ({ ...p, ticketPricingTiers: [...p.ticketPricingTiers, { label: "", price: "" }] }));
  const removeTier = (idx) => setForm((p) => ({ ...p, ticketPricingTiers: p.ticketPricingTiers.filter((_, i) => i !== idx) }));
  const updateTier = (idx, field, value) =>
    setForm((p) => { const t = [...p.ticketPricingTiers]; t[idx] = { ...t[idx], [field]: value }; return { ...p, ticketPricingTiers: t }; });

  const addCategoryTag = (cat) => { if (cat && !form.eventCategory.includes(cat)) setForm((p) => ({ ...p, eventCategory: [...p.eventCategory, cat] })); };
  const removeCategoryTag = (cat) => setForm((p) => ({ ...p, eventCategory: p.eventCategory.filter((c) => c !== cat) }));


const isValidUrl = (url) => {
  try { new URL(url); return true; } catch { return false; }
};

const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test((email || "").trim());
const isValidPhone = (v) => {
  if (!v) return false;
  return /^[6-9]\d{9}$/.test(v.replace(/\D/g, ""));
};
const validate = () => {
  if (!form.title.trim())          return "Event Name is required";
  if (!form.eventType)             return "Event Type is required";
  if (!form.eventCategory?.length) return "Event Category is required";
  if (!form.startDateTime)         return "Start Date & Time is required";
  if (!form.endDateTime)           return "End Date & Time is required";
  if (!form.eventFormat)           return "Event Format is required";
  if (!form.venueName.trim())      return "Venue Name is required";
  if (!form.jobLocationState)      return "State is required";
  if (!form.fullAddress.trim())    return "Full Address is required";
  if (!form.organizationName.trim()) return "Company Name is required";
  if (!form.organizerContactPerson.trim()) return "Company Contact Person is required";
  if (!form.workEmail.trim())      return "Work Email is required";
  if (!isValidEmail(form.workEmail)) return "Enter a valid Work Email";
  if (!form.phoneNumber?.trim())   return "Phone Number is required";
  if (!isValidPhone(form.phoneNumber)) return "Enter a valid phone number";
  if (!form.organizationWebsite?.trim()) return "Company Website is required";
  if (!isValidUrl(form.organizationWebsite)) return "Enter a valid Company Website URL";
  if (!mainImage?.url)             return "Main image / banner is required";
  if (!form.registrationType)      return "Registration Type is required";
  if (!form.registrationDeadline)  return "Registration Deadline is required";
  if (applicationMethod !== "platform" && !form.registrationUrl?.trim())
                                   return "Registration Link is required for external applications";
  if (applicationMethod !== "platform" && form.registrationUrl && !isValidUrl(form.registrationUrl))
                                   return "Enter a valid Registration Link URL";
  if (!stripHtml(form.eventDescription).trim()) return "Event Description is required";
  if (!form.targetAudience.trim()) return "Target Audience is required";
    if (form.endDateTime && new Date(form.endDateTime) <= new Date(form.startDateTime))
    return "End Date & Time must be after Start Date & Time";
  if (form.registrationDeadline && new Date(form.registrationDeadline) >= new Date(form.startDateTime))
    return "Registration Deadline must be before the event starts";
  if (!form.disclosureConsent)     return "You must agree to the disclosure consent";
  if (form.eventWebsite && !isValidUrl(form.eventWebsite))
                                   return "Enter a valid Event Website URL";

  const wordCount = stripHtml(form.eventDescription)
    .split(/\s+/)
    .filter(Boolean).length;
  if (wordCount > 500) return "Event description must be 500 words or less";

  return null;
};

const saveEvent = async () => {
    const msg = validate();
    if (msg) return toast.warn(msg);
    const toUTC = (str) => (str ? new Date(str).toISOString() : "");
    try {
      setSaving(true);
      const payload = {
        ...form,
        description: stripHtml(form.eventDescription),
        eventDescription: stripHtml(form.eventDescription),
        featuredSpeakers: stripHtml(form.featuredSpeakers),
        targetAudience: form.targetAudience.split(",").map((s) => s.trim()).filter(Boolean),
        keyTopics: form.keyTopics.split(",").map((s) => s.trim()).filter(Boolean),
        attendeeBenefits: form.attendeeBenefits.split(",").map((s) => s.trim()).filter(Boolean),
        ticketPricingTiers: form.ticketPricingTiers.map((t) => ({ label: t.label, price: parseFloat(t.price) || 0 })),
        mainImage: mainImage,
        banner: mainImage,
        startDateTime: toUTC(form.startDateTime),
        endDateTime: toUTC(form.endDateTime),
        registrationDeadline: toUTC(form.registrationDeadline),
        registrationUrl: applicationMethod === "platform" ? "" : form.registrationUrl,
      };

      if (editId) {
        await publisherApi.patch(`/api/publisher/dashboard/events/${editId}`, payload);
        toast.success("Event updated (pending approval)");
      } else {
        await publisherApi.post("/api/publisher/dashboard/events", payload);
        toast.success("Event created (pending approval)");
      }
      setShowModal(false); setEditId(null); fetchEvents();
    }  catch (err) {
  const errMsg = err?.response?.data?.message;
  const formatted = errMsg ? formatServerError(errMsg) : "Failed to save event";
  toast.error(formatted);
  setServerError(formatted);
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return;
    const fd = new FormData();
    fd.append("files", file);
    try {
      setUploadingImage(true);
      const res = await publisherApi.post("/api/uploads", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const uploaded = res.data?.files?.[0];
      if (uploaded) {
        setMainImage({ url: uploaded.url, publicId: uploaded.publicId, resourceType: uploaded.resourceType });
        toast.success("Image uploaded");
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

const deleteEvent = (id) => {
  if (!id) { toast.error("Invalid Event ID"); return; }
  setConfirmConfig({
    title: "Delete Event",
    message: "Are you sure you want to permanently delete this event? This action cannot be undone.",
    confirmText: "Yes, Delete Event",
    cancelText: "Cancel",
    confirmVariant: "danger",
    onConfirm: async () => {
      try {
        await publisherApi.delete(`/api/publisher/dashboard/events/${id}`);
        toast.success("Event deleted successfully");
        fetchEvents();
      } catch (err) {
        const msg = err?.response?.data?.message;
        toast.error(msg ? formatServerError(msg) : "Delete failed");
      }
    },
  });
  setShowConfirm(true);
};

  const confirmToggleEvent = (ev) => {
    if (!ev?._id) return;

    const toggleCount = ev.toggleCount ?? 0;

    if (toggleCount >= 2) {
      setConfirmConfig({
        title: "Toggle Not Allowed",
        message: "This event has already been deactivated and reactivated once. No further activation or deactivation is allowed.",
        confirmText: "OK",
        cancelText: "",
        confirmVariant: "danger",
        onConfirm: () => { },
      });
      setShowConfirm(true);
      return;
    }

    const isDeactivating = ev.isActive;

    setConfirmConfig({
      title: isDeactivating ? "Deactivate Event" : "Activate Event",
      message: isDeactivating
        ? "You may reactivate this event once after deactivating, but after that no further toggling will be allowed. Are you sure you want to deactivate?"
        : "You can activate this listing once more. After reactivating, no further deactivation or activation will be permitted. Proceed?",
      confirmText: isDeactivating ? "Yes, Deactivate" : "Yes, Activate",
      cancelText: "Cancel",
      confirmVariant: isDeactivating ? "warning" : "success",
      onConfirm: async () => {
        try {
          await publisherApi.patch(`/api/publisher/dashboard/${ev._id}/toggle`, {});
          toast.success(`Event ${ev.isActive ? "deactivated" : "activated"}`);
          fetchEvents();
        } catch (err) {
          toast.error(err?.response?.data?.message || "Toggle failed");
        }
      },
    });
    setShowConfirm(true);
  };


  /*  Plan limits  */
  const subscriptionExpired = planInfo && (
  planInfo.subscriptionStatus !== "active" ||
  (planInfo.expiry && new Date(planInfo.expiry) < new Date())
);
  const eventLimitReached = planInfo && !subscriptionExpired && planInfo.limits?.eventLimit > 0 && planInfo.usage?.events >= planInfo.limits?.eventLimit;
  const eventButtonDisabled = subscriptionExpired || eventLimitReached;

  const addBtnLabel = subscriptionExpired
    ? "Subscription Expired"
    : eventLimitReached
      ? `Limit Reached (${planInfo.usage.events}/${planInfo.limits.eventLimit})`
      : "+ Add Event";

  /*  Render  */
  return (
    <div className="page">

      {/*  Topbar  */}
      <header className="topbar">
        <div>
          <h1 className="topbarTitle">Events</h1>
          <p className="topbarSub tdNoWrap">Create and manage your events (pending admin approval)</p>
        </div>
        <div className="topbarActions">
          <button
            className={`btn ${eventButtonDisabled ? "btnSecondary btnSm" : "btnPrimary btnSm"}`}
            onClick={eventButtonDisabled ? undefined : openModal}
            disabled={eventButtonDisabled}
            title={
              subscriptionExpired ? "Your subscription has expired. Please renew to add events."
                : eventLimitReached ? `Event limit of ${planInfo.limits.eventLimit} reached for your current plan`
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
                onChange={(e) => { setStatus(e.target.value); fetchEvents({ status: e.target.value }); }}
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
                placeholder="Search by title or company…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchEvents()}
              />
            </div>
            <div className="field">
              <label className="label" style={{ visibility: "hidden" }}>_</label>
              <div style={{ display: "flex", gap: "0.6rem" }}>
                <button className="btn btnPrimary btnSm" onClick={() => fetchEvents()} disabled={loading}>Search</button>
                <button
                  className="btn btnSecondary btnSm"
                  onClick={() => { setStatus("all"); setQ(""); fetchEvents({ status: "all", q: "" }); }}
                  disabled={loading}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  Events table  */}
      <div className="tableShell">
        <div className="tableHead">
          <h2 className="tableHeadTitle">All Events</h2>
        </div>
        <div className="tableBody">
          {loading ? (
            <p className="loadingState">Loading events…</p>
          ) : events.length === 0 ? (
            <p className="emptyState">No events yet. Click "Add Event" to get started.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Banner</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Start</th>
                  <th>End</th>
                  <th className="tdRight" style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev, idx) => {
                  const editLocked = (ev.editCount ?? 0) >= 1;
                  return (
                    <tr key={ev._id}>

                      {/* 1 */}
                      <td className="tdMuted" data-label="#">
                        {idx + 1}
                      </td>

                      <td className="tdSemibold" data-label="Title">
                        {ev.title}
                      </td>

                      {/* 3 – Banner */}
                      <td data-label="Banner">
                        {ev.mainImage?.url
                          ? <img src={ev.mainImage.url} alt="banner" className="thumb" />
                          : <span className="tdMuted">No image</span>}
                      </td>

                      {/* 4 – Type */}
                      <td className="tdNoWrap" data-label="Type">
                        {ev.eventType || <span className="tdMuted">—</span>}
                      </td>

                      <td data-label="Status">
                        <StatusBadge
                          status={ev.status}
                          reason={ev.status === "approved" ? ev.approvalReason : ev.rejectionReason}
                        />
                      </td>

                      {/* 6 – Start */}
                      <td className="tdMuted tdNoWrap" data-label="Start">
                        {ev.startDateTime ? (
                          <>
                            <span className="dateOnly">
                              {new Date(ev.startDateTime).toLocaleDateString("en-IN", {
                                timeZone: "Asia/Kolkata",
                              })}
                            </span>
                            <span className="timeOnly">
                              {", " +
                                new Date(ev.startDateTime)
                                  .toLocaleTimeString("en-IN", {
                                    timeZone: "Asia/Kolkata",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                  .replace(/am|pm/gi, (m) => m.toUpperCase())}
                            </span>
                          </>
                        ) : "—"}
                      </td>

                      {/* 7 – End */}
                      <td className="tdMuted tdNoWrap" data-label="End">
                        {ev.endDateTime ? (
                          <>
                            <span className="dateOnly">
                              {new Date(ev.endDateTime).toLocaleDateString("en-IN", {
                                timeZone: "Asia/Kolkata",
                              })}
                            </span>
                            <span className="timeOnly">
                              {", " +
                                new Date(ev.endDateTime)
                                  .toLocaleTimeString("en-IN", {
                                    timeZone: "Asia/Kolkata",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                  .replace(/am|pm/gi, (m) => m.toUpperCase())}
                            </span>
                          </>
                        ) : "—"}
                      </td>

                      {/* 8 – Actions */}
                      <td data-label="Actions">
                        <div className="actionGroup">
                          <button
                            className={`btn btnSm ${(ev.editCount ?? 0) >= 1 ? "btnSecondary" : "btnPrimary"}`}
                            onClick={() => openEdit(ev)}
                            title={(ev.editCount ?? 0) >= 1 ? "Already edited once" : "Edit event"}
                          >
                            Edit
                          </button>
                          <button
                            className={`btn btnSm ${ev.isActive ? "btnWarning" : "btnSuccess"}`}
                            onClick={() => confirmToggleEvent(ev)}
                            title={
                              (ev.toggleCount ?? 0) >= 2
                                ? "Toggle limit reached"
                                : ev.isActive ? "Deactivate" : "Activate"
                            }
                          >
                            {ev.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            className="btn btnSm btnDanger"
                            onClick={() => deleteEvent(ev._id)}
                          >
                            Delete
                          </button>
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
              <h2 className="modalTitle">{editId ? "Edit Event" : "Create Event"}</h2>
              <button className="modalClose" onClick={closeModal} aria-label="Close">✕</button>
            </div>

            {/* Body */}
            <div className="modalBody">
{serverError && (
  <div style={{
    padding: "0.9rem 1rem",
    borderRadius: "var(--radius-lg)",
    background: "rgba(220,53,69,0.08)",
    border: "1px solid rgba(220,53,69,0.25)",
    color: "#b02a37",
    fontSize: "var(--text-sm)",
    marginBottom: "1.25rem",
    display: "flex",
    alignItems: "center",
    gap: "0.6rem"
  }}>
    <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>⚠️</span>
    <span>{serverError}</span>
  </div>
)}
              {/*  Core details  */}
              <section className="section">
                <h3 className="sectionTitle">Core details</h3>

                <div className="field">
                  <label className="label">Event Name / Title *</label>
                  <input className="input" name="title" value={form.title} onChange={handleChange} placeholder="Enter event name" />
                </div>

                <div className="row2" style={{ alignItems: "start" }}>
                  <div className="field">
                    <label className="label">Event Type *</label>
                    <select className="select" name="eventType" value={form.eventType} onChange={handleChange}>
                      <option value="">Select Type</option>
                      {eventTypes.map((t) => <option key={t._id} value={t.name}>{t.name}</option>)}
                    </select>
                  </div>

                  <div className="field">
                    <label className="label">Event Category *</label>
                    <select
                      className="select"
                      disabled={categories.length === 0}
                      value=""
                      onChange={(e) => { if (e.target.value) addCategoryTag(e.target.value); }}
                    >
                      <option value="">
                        {categories.length === 0 ? "No categories available" : "Add a category…"}
                      </option>
                      {categories.filter((c) => !form.eventCategory.includes(c.name)).map((c) => (
                        <option key={c._id || c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                    {form.eventCategory.length > 0 && (
                      <div className="tagList">
                        {form.eventCategory.map((cat) => (
                          <span key={cat} className="tag">
                            {cat}
                            <button type="button" className="tagRemove" onClick={() => removeCategoryTag(cat)}>✕</button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="field">
                  <label className="label">Event Format *</label>
                  <select className="select" name="eventFormat" value={form.eventFormat} onChange={handleChange}>
                    <option value="">Select Format</option>
                    {formats.map((fmt) => (
                      <option key={fmt.value} value={fmt.value}>{fmt.label}</option>
                    ))}
                  </select>
                </div>
              </section>

              {/*  Date & venue  */}
              <section className="section">
                <h3 className="sectionTitle">Date &amp; venue</h3>

                <div className="row2">
                  <div className="field">
                    <label className="label">Start Date &amp; Time *</label>
                    <input type="datetime-local" className="input" name="startDateTime" value={form.startDateTime} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label className="label">End Date &amp; Time *</label>
                    <input type="datetime-local" className="input" name="endDateTime" value={form.endDateTime} onChange={handleChange} />
                  </div>
                </div>

                <div className="row2">
                  <div className="field">
                    <label className="label">Venue Name *</label>
                    <input className="input" name="venueName" value={form.venueName} onChange={handleChange} placeholder="Enter venue name" />
                  </div>
                  <div className="field">
                    <label className="label">State *</label>
                    <div className="stateDropdownWrapper">
                      <div className="select" style={{ cursor: "pointer", userSelect: "none" }} onClick={() => setStateOpen((p) => !p)}>
                        {form.jobLocationState || "Select State"}
                      </div>
                      {stateOpen && (
                        <div className="stateDropdownMenu">
                          <div className="statePlaceholder" onClick={() => { setForm({ ...form, jobLocationState: "" }); setStateOpen(false); }}>

                          </div>
                          {INDIA_STATES.map((state) => (
                            <div
                              key={state}
                              className={form.jobLocationState === state ? "stateOptionActive" : "stateOption"}
                              onClick={() => { setForm({ ...form, jobLocationState: state }); setStateOpen(false); }}
                            >
                              {state}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="field">
                  <label className="label">Full Address *</label>
                  <textarea className="textarea" rows={2} name="fullAddress" value={form.fullAddress} onChange={handleChange} placeholder="Enter full address" />
                </div>
              </section>

              {/*  Organizer  */}
              <section className="section">
                <h3 className="sectionTitle">Company information</h3>

                <div className="row2">
                  <div className="field">
                    <label className="label">Company Name *</label>
                    <input
                      className="input"
                      name="organizationName"
                      value={form.organizationName}
                      onChange={handleTextOnly}
                      placeholder="Enter Company name"
                    />
                  </div>
                  <div className="field">
                    <label className="label">Company Contact Person *</label>
                    <input
                      className="input"
                      name="organizerContactPerson"
                      value={form.organizerContactPerson}
                      onChange={handleTextOnly}
                      placeholder="Enter contact person name"
                    />
                  </div>
                </div>

                <div className="row3">
                  <div className="field">
                    <label className="label">Work Email *</label>
                    <input type="email" className="input" name="workEmail" value={form.workEmail} onChange={handleChange} placeholder="Enter work email" />
                  </div>
                  <div className="field">
                    <label className="label">Phone Number *</label>
                    <input
                      className="input"
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setForm((prev) => ({ ...prev, phoneNumber: digits }));
                      }}
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
                      inputMode="numeric"
                    />
                  </div>
                  <div className="field">
                    <label className="label">Company Website *</label>
                    <input type="url" className="input" name="organizationWebsite" value={form.organizationWebsite} onChange={handleChange} placeholder="https://" />
                  </div>
                </div>
              </section>

              {/*  Content  */}
              <section className="section">
                <h3 className="sectionTitle">Content information</h3>

                <div className="field">
                  <label className="label">
                      Main Image / Banner *
                    <span className="labelNote">Recommended: 1500 × 750 px</span>
                  </label>
                  <div className="imageRow">
                    <input
                      type="file"
                      accept="image/*"
                      className="input"
                      style={{ flex: 1 }}
                      onChange={(e) => uploadImage(e.target.files?.[0])}
                      disabled={uploadingImage}
                    />
                    {mainImage?.url && <img src={mainImage.url} alt="banner preview" className="imagePreview" />}
                  </div>
                </div>

                <div className="field">
                  <label className="label">About / Event Description  *<span className="labelNote">(500 words)</span></label>
                  <RichTextEditor value={form.eventDescription} onChange={(val) => setForm((p) => ({ ...p, eventDescription: val }))} placeholder="Describe the event" />
                </div>

                <div className="field">
                  <label className="label">Featured Speakers<span className="labelNote">(comma separated)</span></label>
                  <RichTextEditor value={form.featuredSpeakers} onChange={(val) => setForm((p) => ({ ...p, featuredSpeakers: val }))} placeholder="List the featured speakers" />
                </div>

                <div className="row2">
                  <div className="field">
                    <label className="label">Target Audience  *<span className="labelNote">(comma separated)</span></label>
                    <input className="input" name="targetAudience" value={form.targetAudience} onChange={handleChange} placeholder="e.g. Developers, Designers" />
                  </div>
                  <div className="field">
                    <label className="label">Key Topics <span className="labelNote">(comma separated)</span></label>
                    <input className="input" name="keyTopics" value={form.keyTopics} onChange={handleChange} placeholder="e.g. AI, Cloud, DevOps" />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Attendee Benefits <span className="labelNote">(comma separated)</span></label>
                  <input className="input" name="attendeeBenefits" value={form.attendeeBenefits} onChange={handleChange} placeholder="e.g. Networking, Certificate, Workshop kit" />
                </div>
              </section>

              {/*  Registration  */}
              <section className="section">
                <h3 className="sectionTitle">Registration &amp; links</h3>
                {/* Application Method — UI only, not persisted */}
                <div className="field">
                  <label className="label">Application Method</label>
                  <select
                    className="select"
                    value={applicationMethod}
                    onChange={(e) => setApplicationMethod(e.target.value)}
                  >
                    <option value="">Select Application Method</option>
                    {applicationMethods.map((method) => (
                      <option key={method.value} value={method.value} title={method.tooltip}>
                        {method.label}
                      </option>
                    ))}
                  </select>

                  {/* Inline hint for the selected option */}
                  {applicationMethod && (
                    <p style={{ marginTop: "0.4rem", fontSize: "0.8rem", color: "#6b7280" }}>
                      ℹ️ {applicationMethods.find((m) => m.value === applicationMethod)?.tooltip}
                    </p>
                  )}
                </div>
                <div className="row2">
                  <div className="field">
                    <label className="label">Registration Type *</label>
                    <select className="select" name="registrationType" value={form.registrationType} onChange={handleChange}>
                      <option value="">Select Registration Type</option>
                      {registrationTypes.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label className="label">Registration Deadline *</label>
                    <input type="datetime-local" className="input" name="registrationDeadline" value={form.registrationDeadline} onChange={handleChange} />
                  </div>
                </div>

                {form.registrationType === "Paid" && (
                  <div className="field">
                    <label className="label">Ticket Pricing Tiers</label>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {form.ticketPricingTiers.map((tier, idx) => (
                        <div key={idx} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                          <input
                            className="input"
                            placeholder="e.g. Early Bird"
                            value={tier.label}
                            onChange={(e) => updateTier(idx, "label", e.target.value)}
                            style={{ flex: 2 }}
                          />
                          <input
                            type="number"
                            className="input"
                            placeholder="Price (₹)"
                            min="0"
                            value={tier.price}
                            onChange={(e) => updateTier(idx, "price", e.target.value)}
                            style={{ flex: 1 }}
                          />
                          <button
                            type="button"
                            className="btn btnSm btnDanger"
                            onClick={() => removeTier(idx)}
                            style={{ whiteSpace: "nowrap", flexShrink: 0 }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: "0.5rem" }}>
                      <button
                        type="button"
                        className="btn btnSm btnPrimary"
                        onClick={addTier}
                        style={{ width: "auto" }}
                      >
                        + Add Tier
                      </button>
                    </div>
                  </div>
                )}

                {applicationMethod !== "platform" && (
                  <div className="row2">
                    <div className="field">
                      <label className="label">Registration Link / URL *</label>
                      <input type="url" className="input" name="registrationUrl" value={form.registrationUrl} onChange={handleChange} placeholder="https://" />
                    </div>
                  </div>
                )}
              </section>
              <section className="section">
                <h3 className="sectionTitle">Use &amp; disclosure consent</h3>

                {/* Consent checkbox */}
                <div style={{
                  padding: "1rem", borderRadius: "var(--radius-lg)",
                  background: "var(--blue-soft)", border: "1px solid rgba(1,148,223,0.25)",
                }}>
                  <label style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      name="disclosureConsent"
                      checked={form.disclosureConsent}
                      onChange={handleChange}
                      style={{ width: "18px", height: "18px", accentColor: "var(--blue)", flexShrink: 0, marginTop: "2px" }}
                    />
                    <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text)", lineHeight: 1.6 }}>
                      I / We confirm that all information submitted in this application is non-confidential and may be reviewed, shared, or published for evaluation and listing purposes.{" "}
                      <strong style={{ color: "var(--orange)" }}>*</strong>
                    </span>
                  </label>
                </div>

                {/* Notice */}
              <div style={{ padding: "0.9rem 1rem", borderRadius: "0.85rem", background: "var(--yellow-soft)", border: "1px solid rgba(252,207,2,0.4)", color: "var(--yellow-hover)", fontSize: "var(--text-sm)" }}>
                Note: After submission, your listing will be reviewed. If all details are correct, approval will be completed within 24 hours. Updates will be sent via Dashboard Notifications.
              </div>
              </section>
              <div style={{ display: "flex", justifyContent: "center", gap: "1rem", paddingTop: "3.75rem" }}>
                <button className="btn btnSecondary btcancel" onClick={closeModal} disabled={saving}>Cancel</button>
                <button className="btn btnPrimary btsubmit" onClick={saveEvent} disabled={saving}>
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