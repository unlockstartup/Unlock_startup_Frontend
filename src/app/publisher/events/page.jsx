"use client"

import { useEffect, useState } from "react";
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

import "../styles/publishercretepages.css";

/* ─── Constants ─────────────────────────────────────────────────────────────── */
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
};

const registrationTypes = ["Free", "Paid", "Invite Only"];
const formats = [
  { value: "in-person", label: "In-Person" },
  { value: "online", label: "Online" },
  { value: "hybrid", label: "Hybrid" },
];

const statusBadge = (status) => {
  if (status === "approved") return "badgeSuccess";
  if (status === "rejected") return "badgeDanger";
  return "badgeWarning";
};

/* ─── Component ─────────────────────────────────────────────────────────────── */
export default function PublisherEventPage() {
  const [events, setEvents]         = useState([]);
  const [categories, setCategories] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [saving, setSaving]         = useState(false);
  const [form, setForm]             = useState(defaultForm);
  const [editId, setEditId]         = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [mainImage, setMainImage]   = useState(null);
  const [planInfo, setPlanInfo]     = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [stateOpen, setStateOpen]   = useState(false);
  const [status, setStatus] = useState("all");
const [q, setQ]           = useState("");
  const [confirmConfig, setConfirmConfig] = useState({
    title: "", message: "",
    confirmText: "Confirm", cancelText: "Cancel",
    confirmVariant: "danger", onConfirm: () => {},
  });

const fetchEvents = async (overrides = {}) => {
  try {
    setLoading(true);
    const params = new URLSearchParams();
    const s      = overrides.status !== undefined ? overrides.status : status;
    const search = overrides.q      !== undefined ? overrides.q      : q;
    if (s !== "all")   params.append("status", s);
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
        const types = await getPublicEventTypes();
        setEventTypes(types.data?.eventTypes || []);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load event types");
      }
    })();

    (async () => {
      try {
        const res = await getPublisherPlanInfo();
        setPlanInfo(res.data);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (!form.eventType) { setCategories([]); return; }
    const selectedType = eventTypes.find((t) => t.name === form.eventType);
    if (!selectedType) return;

    (async () => {
      try {
        const cats = await getPublicEventCategories(selectedType._id);
        setCategories(cats.data?.categories || []);
      } catch {
        toast.error("Failed to load categories");
      }
    })();
  }, [form.eventType, eventTypes]);

  /* ── Modal helpers ─────────────────────────────────────────────────────────── */
  const openModal = () => {
    setForm(defaultForm); setEditId(null); setMainImage(null); setShowModal(true);
  };

  const openEdit = (ev) => {
    const pad = (n) => String(n).padStart(2, "0");
    const fmt = (iso) => {
      if (!iso) return "";
      const d = new Date(iso);
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };
    const arr = (v) => (Array.isArray(v) ? v.join(", ") : v || "");

    setForm({
      ...defaultForm, ...ev,
      targetAudience:   arr(ev.targetAudience),
      keyTopics:        arr(ev.keyTopics),
      attendeeBenefits: arr(ev.attendeeBenefits),
      eventDescription: ev.eventDescription || "",
      featuredSpeakers: ev.featuredSpeakers  || "",
      startDateTime:        fmt(ev.startDateTime),
      endDateTime:          fmt(ev.endDateTime),
      registrationDeadline: fmt(ev.registrationDeadline),
      registrationPrice:    ev.registrationPrice?.toString() || "",
      eventCategory: Array.isArray(ev.eventCategory) ? ev.eventCategory
        : ev.eventCategory ? [ev.eventCategory] : [],
    });
    setEditId(ev._id);
    setMainImage(ev.mainImage || null);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  /* ── Form handlers ─────────────────────────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev, [name]: value,
      ...(name === "eventType" ? { eventCategory: [] } : {}),
    }));
  };

  const addTier    = () => setForm((p) => ({ ...p, ticketPricingTiers: [...p.ticketPricingTiers, { label: "", price: "" }] }));
  const removeTier = (idx) => setForm((p) => ({ ...p, ticketPricingTiers: p.ticketPricingTiers.filter((_, i) => i !== idx) }));
  const updateTier = (idx, field, value) =>
    setForm((p) => { const t = [...p.ticketPricingTiers]; t[idx] = { ...t[idx], [field]: value }; return { ...p, ticketPricingTiers: t }; });

  const addCategoryTag    = (cat) => { if (cat && !form.eventCategory.includes(cat)) setForm((p) => ({ ...p, eventCategory: [...p.eventCategory, cat] })); };
  const removeCategoryTag = (cat) => setForm((p) => ({ ...p, eventCategory: p.eventCategory.filter((c) => c !== cat) }));

  /* ── Save / delete / toggle ────────────────────────────────────────────────── */
  const validate = () => {
    if (!form.title.trim()) return "Event Name is required";
    if (!form.eventCategory?.length) return "Event Category is required";
    if (!form.startDateTime || !form.endDateTime) return "Start/End date-time required";
    if (!form.workEmail) return "Work Email is required";
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
        targetAudience:   form.targetAudience.split(",").map((s) => s.trim()).filter(Boolean),
        keyTopics:        form.keyTopics.split(",").map((s) => s.trim()).filter(Boolean),
        attendeeBenefits: form.attendeeBenefits.split(",").map((s) => s.trim()).filter(Boolean),
        ticketPricingTiers: form.ticketPricingTiers.map((t) => ({ label: t.label, price: parseFloat(t.price) || 0 })),
        mainImage: mainImage,
        banner:    mainImage,
        startDateTime:        toUTC(form.startDateTime),
        endDateTime:          toUTC(form.endDateTime),
        registrationDeadline: toUTC(form.registrationDeadline),
      };

      if (editId) {
        await publisherApi.patch(`/api/publisher/dashboard/events/${editId}`, payload);
        toast.success("Event updated (pending approval)");
      } else {
        await publisherApi.post("/api/publisher/dashboard/events", payload);
        toast.success("Event created (pending approval)");
      }
      setShowModal(false); setEditId(null); fetchEvents();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create event");
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
      if (uploaded) { setMainImage({ url: uploaded.url, publicId: uploaded.publicId, resourceType: uploaded.resourceType }); toast.success("Image uploaded"); }
      else toast.error("Upload failed");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const deleteEvent = (id) => {
    if (!id) return;
    setConfirmConfig({
      title: "Delete Event",
      message: "Are you sure you want to permanently delete this event? This action cannot be undone.",
      confirmText: "Yes, Delete Event", cancelText: "Cancel", confirmVariant: "danger",
      onConfirm: async () => {
        try {
          await publisherApi.delete(`/api/publisher/dashboard/events/${id}`);
          toast.success("Event deleted successfully");
          fetchEvents();
        } catch (err) {
          toast.error(err?.response?.data?.message || "Failed to delete event");
        }
      },
    });
    setShowConfirm(true);
  };

  const toggleEvent = async (ev) => {
    try {
      await publisherApi.patch(`/api/publisher/dashboard/${ev._id}/toggle`, {});
      toast.success(`Event ${ev.isActive ? "deactivated" : "activated"}`);
      fetchEvents();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Toggle failed");
    }
  };

  /* ── Plan limits ───────────────────────────────────────────────────────────── */
  const subscriptionExpired  = planInfo && planInfo.subscriptionStatus !== "active";
  const eventLimitReached    = planInfo && !subscriptionExpired && planInfo.limits?.eventLimit > 0 && planInfo.usage?.events >= planInfo.limits?.eventLimit;
  const eventButtonDisabled  = subscriptionExpired || eventLimitReached;

  const addBtnLabel = subscriptionExpired ? "Subscription Expired"
    : eventLimitReached ? `Limit Reached (${planInfo.usage.events}/${planInfo.limits.eventLimit})`
    : "+ Add Event";

  /* ── Render ────────────────────────────────────────────────────────────────── */
  return (
    <div className="page">
      {/* ── Topbar ── */}
      <header className="topbar">
        <div>
          <h1 className="topbarTitle">Events</h1>
          <p className="topbarSub">Create and manage your events (pending admin approval)</p>
        </div>
        <div className="topbarActions">
          <button
            className={`btn ${eventButtonDisabled ? "btnSecondary" : "btnPrimary"}`}
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
{/* ── Filters ── */}
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
          placeholder="Search by title or organizer…"
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
      {/* ── Events table ── */}
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
                  <th className="tdRight" style={{textAlign: "center"}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev, idx) => (
                  <tr key={ev._id}>
                    <td className="tdMuted">{idx + 1}</td>
                    <td className="tdSemibold">{ev.title}</td>
                    <td>
                      {ev.mainImage?.url
                        ? <img src={ev.mainImage.url} alt="banner" className="thumb" />
                        : <span className="tdMuted">No image</span>}
                    </td>
                    <td className="tdNoWrap">{ev.eventType || <span className="tdMuted">—</span>}</td>
                    <td>
                      <span className={`badge ${statusBadge(ev.status)}`}>{ev.status}</span>
                    </td>
                    <td className="tdMuted tdNoWrap">
                      {ev.startDateTime
                        ? new Date(ev.startDateTime).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }).replace(/am|pm/gi, (m) => m.toUpperCase())
                        : "—"}
                    </td>
                    <td className="tdMuted tdNoWrap">
                      {ev.endDateTime
                        ? new Date(ev.endDateTime).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }).replace(/am|pm/gi, (m) => m.toUpperCase())
                        : "—"}
                    </td>
                    <td>
                      <div className="actionGroup">
                        <button className="btn btnSm btnPrimary" onClick={() => openEdit(ev)}>Edit</button>
                        <button
                          className={`btn btnSm ${ev.isActive ? "btnWarning" : "btnSuccess"}`}
                          onClick={() => toggleEvent(ev)}
                          title={ev.isActive ? "Deactivate" : "Activate"}
                        >
                          {ev.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button className="btn btnSm btnDanger" onClick={() => deleteEvent(ev._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Create / Edit modal ── */}
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

              {/* ── Core details ── */}
              <section className="section">
                <h3 className="sectionTitle">Core details</h3>

                <div className="field">
                  <label className="label">Event Name / Title *</label>
                  <input className="input" name="title" value={form.title} onChange={handleChange} placeholder="Enter event name" />
                </div>

                <div className="row2" style={{ alignItems: "start" }}>
                  <div className="field">
                    <label className="label">Event Type</label>
                    <select className="select" name="eventType" value={form.eventType} onChange={handleChange}>
                      <option value="">Select Type</option>
                      {eventTypes.map((t) => <option key={t._id} value={t.name}>{t.name}</option>)}
                    </select>
                  </div>

                  <div className="field">
                    <label className="label">Event Category *</label>
                    {!form.eventType && <span className="labelNote">Select an Event Type first</span>}
                    <select
                      className="select"
                      disabled={!form.eventType || categories.length === 0}
                      value=""
                      onChange={(e) => { if (e.target.value) addCategoryTag(e.target.value); }}
                    >
                      <option value="">
                        {!form.eventType ? "Select a type first" : categories.length === 0 ? "No categories available" : "Add a category…"}
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
  <label className="label">Event Format</label>
  <select
    className="select"
    name="eventFormat"
    value={form.eventFormat}
    onChange={handleChange}
  >
    <option value="">Select Format</option>
{formats.map((fmt) => (
  <option key={fmt.value} value={fmt.value}>
    {fmt.label}
  </option>
))}
  </select>
</div>
              </section>

              {/* ── Date & venue ── */}
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
                    <label className="label">Venue Name</label>
                    <input className="input" name="venueName" value={form.venueName} onChange={handleChange} placeholder="Enter venue name" />
                  </div>
                  <div className="field">
                    <label className="label">State</label>
                    <div className="stateDropdownWrapper">
                      <div className="select" style={{ cursor: "pointer", userSelect: "none" }} onClick={() => setStateOpen((p) => !p)}>
                        {form.jobLocationState || "Select State"}
                      </div>
                      {stateOpen && (
                        <div className="stateDropdownMenu">
                          <div className="statePlaceholder" onClick={() => { setForm({ ...form, jobLocationState: "" }); setStateOpen(false); }}>
                            Select State
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
                  <label className="label">Full Address</label>
                  <textarea className="textarea" rows={2} name="fullAddress" value={form.fullAddress} onChange={handleChange} placeholder="Enter full address" />
                </div>
              </section>

              {/* ── Organizer ── */}
              <section className="section">
                <h3 className="sectionTitle">Organizer information</h3>

                <div className="row2">
                  <div className="field">
                    <label className="label">Organization Name</label>
                    <input className="input" name="organizationName" value={form.organizationName} onChange={handleChange} placeholder="Enter organization name" />
                  </div>
                  <div className="field">
                    <label className="label">Organizer Contact Person</label>
                    <input className="input" name="organizerContactPerson" value={form.organizerContactPerson} onChange={handleChange} placeholder="Enter contact person name" />
                  </div>
                </div>

                <div className="row3">
                  <div className="field">
                    <label className="label">Work Email *</label>
                    <input type="email" className="input" name="workEmail" value={form.workEmail} onChange={handleChange} placeholder="Enter work email" />
                  </div>
                  <div className="field">
                    <label className="label">Phone Number</label>
                    <input className="input" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Enter phone number" />
                  </div>
                  <div className="field">
                    <label className="label">Organization Website</label>
                    <input type="url" className="input" name="organizationWebsite" value={form.organizationWebsite} onChange={handleChange} placeholder="https://" />
                  </div>
                </div>
              </section>

              {/* ── Content ── */}
              <section className="section">
                <h3 className="sectionTitle">Content information</h3>

                <div className="field">
                  <label className="label">
                    Main Image / Banner
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
                  <label className="label">About / Event Description</label>
                  <RichTextEditor value={form.eventDescription} onChange={(val) => setForm((p) => ({ ...p, eventDescription: val }))} placeholder="Describe the event" />
                </div>

                <div className="field">
                  <label className="label">Featured Speakers</label>
                  <RichTextEditor value={form.featuredSpeakers} onChange={(val) => setForm((p) => ({ ...p, featuredSpeakers: val }))} placeholder="List the featured speakers with their credentials" />
                </div>

                <div className="row2">
                  <div className="field">
                    <label className="label">Target Audience <span className="labelNote">(comma separated)</span></label>
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

              {/* ── Registration ── */}
              <section className="section">
                <h3 className="sectionTitle">Registration &amp; links</h3>

                <div className="row2">
                  <div className="field">
                    <label className="label">Registration Type</label>
                    <select className="select" name="registrationType" value={form.registrationType} onChange={handleChange}>
                      <option value="">Select Registration Type</option>
                      {registrationTypes.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label className="label">Registration Deadline</label>
                    <input type="datetime-local" className="input" name="registrationDeadline" value={form.registrationDeadline} onChange={handleChange} />
                  </div>
                </div>

                {form.registrationType === "Paid" && (
                  <div className="field">
                    <label className="label">Ticket Pricing Tiers</label>
                    <table className="tierTable">
                      <thead>
                        <tr><th>Tier Label</th><th>Price (₹)</th><th></th></tr>
                      </thead>
                      <tbody>
                        {form.ticketPricingTiers.map((tier, idx) => (
                          <tr key={idx}>
                            <td><input className="inputSm" placeholder="e.g. Early Bird" value={tier.label} onChange={(e) => updateTier(idx, "label", e.target.value)} /></td>
                            <td><input type="number" className="inputSm" placeholder="0" min="0" value={tier.price} onChange={(e) => updateTier(idx, "price", e.target.value)} /></td>
                            <td><button type="button" className="btn btnSm btnDanger" onClick={() => removeTier(idx)}>Remove</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button type="button" className="btn btnSm btnSecondary" onClick={addTier}>+ Add tier</button>
                  </div>
                )}

                <div className="row2">
                  <div className="field">
                    <label className="label">Registration Link / URL</label>
                    <input type="url" className="input" name="registrationUrl" value={form.registrationUrl} onChange={handleChange} placeholder="https://" />
                  </div>
                  <div className="field">
                    <label className="label">Event Website</label>
                    <input type="url" className="input" name="eventWebsite" value={form.eventWebsite} onChange={handleChange} placeholder="https://" />
                  </div>
                </div>
              </section>

            </div>{/* /modalBody */}

            {/* Footer */}
            <div className="modalFooter">
              <button className="btn btnSecondary" onClick={closeModal} disabled={saving}>Cancel</button>
              <button className="btn btnPrimary" onClick={saveEvent} disabled={saving}>
               {saving ? "Submitting…" : editId ? "Update Event" : "Submit Event"}
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