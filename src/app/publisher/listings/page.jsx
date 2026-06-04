"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import publisherApi from "@/app/publisherapi";

import "../styles/publishercretepages.css";

/*  Constants  */
const STATUS_BADGE = {
  approved: "badgeSuccess",
  rejected: "badgeDanger",
  pending:  "badgeWarning",
};

const TYPE_META = {
  event:    { label: "Event",    color: "var(--blue)" },
  investor: { label: "Investor", color: "var(--orange)" },
  service:  { label: "Service",  color: "var(--yellow-hover)" },
};

/*  Main component  */
export default function AllListingandSubmissions() {
  const router = useRouter();

  const [listings, setListings]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [typeFilter, setTypeFilter]     = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [counts, setCounts]             = useState({});
  const [error, setError]               = useState(null);

  /*  Data loading  */
  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      const [eventsRes, investorsRes, servicesRes] = await Promise.all([
        publisherApi.get("/api/publisher/dashboard/events").catch(() => ({ data: { items: [] } })),
        publisherApi.get("/api/publisher/investors/mine").catch(() => ({ data: { investor: null } })),
        publisherApi.get("/api/publisher/service-listings/mine").catch(() => ({ data: { listings: [] } })),
      ]);

      const events = (eventsRes.data?.items || []).map((e) => ({
        ...e, _type: "event", _title: e.title,
        _subtitle: e.organizationName || "", _status: e.status,
      }));

      let investors = [];
      const investorData = investorsRes.data?.investor;
      if (investorData) {
        const arr = Array.isArray(investorData) ? investorData : [investorData];
        investors = arr.map((i) => ({
          ...i, _type: "investor", _title: i.fundName,
          _subtitle: i.investorType || "",
          _status: i.profileVisibility === "Public" ? "approved" : "pending",
        }));
      }

      const services = (servicesRes.data?.listings || servicesRes.data?.items || []).map((s) => ({
        ...s, _type: "service", _title: s.serviceTitle,
        _subtitle: s.companyName || "", _status: s.approvalStatus || "pending",
      }));

      setListings([...events, ...investors, ...services]);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load listings: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCounts = async (list) => {
    if (!list?.length) return;
    const results = {};
    await Promise.allSettled(
      list.map(async (listing) => {
        try {
          const params = { limit: 1 };
          if (listing._type === "investor")    params.investorId = listing._id;
          else if (listing._type === "service") params.serviceId  = listing._id;
          else                                  params.listingId  = listing._id;
          const res = await publisherApi.get("/api/publisher/submissions", { params });
          results[listing._id] = res.data?.total || 0;
        } catch { results[listing._id] = 0; }
      })
    );
    setCounts(results);
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { if (listings.length > 0) loadCounts(listings); }, [listings]);

  /*  Filtering  */
  const filtered = listings.filter((l) => {
    if (typeFilter   && l._type   !== typeFilter)   return false;
    if (statusFilter && l._status !== statusFilter) return false;
    return true;
  });

  /*  Error state  */
  if (error) {
    return (
      <div className="page">
        <div style={{
          padding: "1rem 1.25rem", borderRadius: "var(--radius-xl)",
          background: "var(--orange-soft)", border: "1px solid rgba(226,92,38,0.3)",
          color: "var(--orange)", display: "flex", alignItems: "center", gap: "1rem",
        }}>
          <span style={{ fontSize: "var(--text-sm)" }}>Error loading data: {error}</span>
          <button className="btn btnSm btnDanger" onClick={load}>Retry</button>
        </div>
      </div>
    );
  }

  /*  Render  */
  return (
    <div className="page">

      {/*  Topbar  */}
      <header className="topbar">
        <div>
          <h1 className="topbarTitle">All Listings</h1>
          <p className="topbarSub tdNoWrap">Click "View Submissions" to see applicants for any listing</p>
        </div>
        <div className="topbarActions">
          <span className="badge badgeNeutral" style={{ fontSize: "var(--text-xs)" }}>
            {filtered.length} listing{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </header>

      {/*  Filters  */}
      <div className="tableShell">
        <div className="tableHead">
          <h2 className="tableHeadTitle">Filter</h2>
        </div>
        <div className="tableBody">
          <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div className="field" style={{ minWidth: "160px" }}>
              <label className="label">Type</label>
              <select className="select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="">All Types</option>
                <option value="event">Events</option>
                <option value="investor">Investors</option>
                <option value="service">Services</option>
              </select>
            </div>

            <div className="field" style={{ minWidth: "160px" }}>
              <label className="label">Status</label>
              <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <button
              className="btn btnSecondary btnSm"
              style={{ marginBottom: "0.1rem" }}
              onClick={() => { setTypeFilter(""); setStatusFilter(""); }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/*  Table  */}
      <div className="tableShell">
        <div className="tableHead">
          <h2 className="tableHeadTitle">Listings &amp; Submission Counts</h2>
        </div>
        <div className="tableBody">
          {loading ? (
            <p className="loadingState">Loading listings…</p>
          ) : filtered.length === 0 ? (
            <p className="emptyState">No listings found.</p>
          ) : (
            <table className="table">
<thead>
  <tr>
    <th>#</th>
    <th>Title</th>
    <th>Type</th>
    <th>Status</th>
    <th>Submissions</th>
    <th>Created</th>
    <th className="tdRight" style={{ textAlign: "center" }}>Actions</th>
  </tr>
</thead>
<tbody>
  {filtered.map((listing, idx) => {
    const typeMeta = TYPE_META[listing._type] || { label: listing._type, color: "var(--blue)" };
    const count    = counts[listing._id];
    return (
      <tr key={listing._id}>
        <td className="tdMuted" data-label="#">{idx + 1}</td>

        <td className="tdSemibold" data-label="Title">
          {listing._title}
          {listing._subtitle && <div className="tdMuted">{listing._subtitle}</div>}
        </td>

        <td data-label="Type">
          <span className="badge" style={{ background: typeMeta.color, color: "#fff" }}>
            {typeMeta.label}
          </span>
        </td>

        <td data-label="Status">
          <span className={`badge ${STATUS_BADGE[listing._status] || "badgeNeutral"}`}>
            {listing._status}
          </span>
        </td>

        <td data-label="Submissions">
          {count !== undefined ? (
            <span className="badge badgePrimary">
              {count} applicant{count !== 1 ? "s" : ""}
            </span>
          ) : (
            <span className="tdMuted">Loading…</span>
          )}
        </td>

        <td className="tdMuted tdNoWrap" data-label="Created">
          {listing.createdAt ? (
            <>
              <span className="dateOnly">
                {new Date(listing.createdAt).toLocaleDateString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })}
              </span>
              <span className="timeOnly">
                {", " +
                  new Date(listing.createdAt)
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

        <td data-label="Actions">
          <div className="actionGroup">
            <button
              className="btn btnSm btnPrimary"
              onClick={() => router.push(`/publisher/submissions/${listing._id}?type=${listing._type}`)}
            >
              View Submissions
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

      <ToastContainer position="top-center" />
    </div>
  );
}