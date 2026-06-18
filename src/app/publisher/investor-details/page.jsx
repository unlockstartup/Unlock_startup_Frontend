"use client"

import { useState, useEffect } from "react";
import publisherApi from "@/app/publisherapi";
import ConfirmationModal from "@/components/ConfirmationModal";
import { INDIA_STATES } from "@/app/constants";
import { toast, ToastContainer } from "react-toastify";
import {
  getPublicInvestorTypes,
  getPublicPreferredStages,
} from "@/app/apiServices/publicapi";

import "../styles/publishercretepages.css";



function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: "1.25rem", paddingBottom: "0.75rem", borderBottom: "2px solid var(--blue-soft)" }}>
      <h3 style={{ margin: 0, fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
        {title}
      </h3>
      {subtitle && (
        <p style={{ margin: "0.25rem 0 0", fontSize: "var(--text-xs)", color: "var(--color-text-faint)" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function TagButton({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn btnSm ${selected ? "btnPrimary" : "btnSecondary"}`}
      style={{ borderRadius: "var(--radius-full)" }}
    >
      {selected && <span style={{ marginRight: "0.25rem" }}>✓</span>}
      {label}
    </button>
  );
}

/*  Main component  */
export default function Page() {
  const [isEdit, setIsEdit]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [fundName, setFundName]             = useState("");
  const [investorType, setInvestorType]     = useState("");
  const [logo, setLogo]                     = useState("");
  const [fundSize, setFundSize]             = useState("");
  const [currency, setCurrency]             = useState("INR");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [ticketMin, setTicketMin]           = useState("");
  const [ticketMax, setTicketMax]           = useState("");
  const [preferredStages, setPreferredStages]     = useState([]);
  const [geographicFocus, setGeographicFocus]     = useState([]);
  const [industrySectorFocus, setIndustrySectorFocus] = useState([]);
  const [portfolioCompaniesCount, setPortfolioCompaniesCount] = useState("");
  const [portfolioCompanies, setPortfolioCompanies] = useState([]);
  const [about, setAbout]                   = useState("");
  const [contactName, setContactName]       = useState("");
  const [contactTitle, setContactTitle]     = useState("");
  const [contactEmail, setContactEmail]     = useState("");
  const [contactPhone, setContactPhone]     = useState("");
  const [linkedIn, setLinkedIn]             = useState("");
  const [officeLocation, setOfficeLocation] = useState("");
  const [profileVisibility, setProfileVisibility] = useState("Public");
  const [stateOpen, setStateOpen]           = useState(false);
  const [applyLink, setApplyLink]           = useState("");
const [sectors, setSectors] = useState([]);

  const [showConfirm, setShowConfirm]   = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: "", message: "",
    confirmText: "Confirm", cancelText: "Cancel",
    confirmVariant: "danger", onConfirm: () => {},
  });

  const [investorTypes, setInvestorTypes] = useState([]);
  const [stages, setStages]               = useState([]);

  const itemValue = (item) => item.value ?? item.name ?? item._id;
  const itemLabel = (item) => item.name  ?? item.value ?? item._id;

  /*  Data loading  */
  useEffect(() => {
    fetchProfile();

    (async () => {
      try {
        const res = await getPublicInvestorTypes();
        setInvestorTypes(res.data?.investorTypes ?? res.data?.data ?? (Array.isArray(res.data) ? res.data : []));
      } catch (err) { toast.error(err?.response?.data?.message || "Failed to load investor types"); }
    })();
(async () => {
  try {
    const res = await publisherApi.get("/api/public/industry-sectors");
    setSectors(res.data?.sectors || []);
  } catch (err) { toast.error(err?.response?.data?.message || "Failed to load industry sectors"); }
})();
    (async () => {
      try {
        const res = await getPublicPreferredStages();
        setStages(res.data?.preferredStages ?? res.data?.stages ?? res.data?.data ?? (Array.isArray(res.data) ? res.data : []));
      } catch (err) { toast.error(err?.response?.data?.message || "Failed to load preferred stages"); }
    })();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await publisherApi.get("/api/publisher/investors/mine");
      const inv = res.data.investor;
      setFundName(inv.fundName || "");
      setInvestorType(inv.investorType || "");
      setLogo(inv.logo || "");
      setFundSize(inv.fundSize || "");
      setCurrency(inv.currency || "INR");
      setYearsOfExperience(inv.yearsOfExperience || "");
      setTicketMin(inv.ticketSize?.minimum || "");
      setTicketMax(inv.ticketSize?.maximum || "");
      setPreferredStages(inv.preferredStages || []);
      setGeographicFocus(inv.geographicFocus || []);
      setIndustrySectorFocus(inv.industrySectorFocus || []);
      setPortfolioCompaniesCount(inv.portfolioCompaniesCount || "");
      setPortfolioCompanies(inv.portfolioCompanies || []);
      setAbout(inv.about || "");
      setContactName(inv.contact?.name || "");
      setContactTitle(inv.contact?.title || "");
      setContactEmail(inv.contact?.email || "");
      setContactPhone(inv.contact?.phone || "");
      setLinkedIn(inv.linkedIn || "");
      setOfficeLocation(inv.officeLocation || "");
      setProfileVisibility(inv.profileVisibility || "Public");
      setApplyLink(inv.applyLink || "");
      setIsEdit(true);
    } catch {
      // No profile yet
    } finally {
      setFetching(false);
    }
  };

  /*  Helpers  */
  const toggleMultiSelect = (value, selected, setSelected) =>
    selected.includes(value)
      ? setSelected(selected.filter((v) => v !== value))
      : setSelected([...selected, value]);

  const addPortfolioCompany = () =>
    setPortfolioCompanies([...portfolioCompanies, { companyName: "", description: "" }]);

  const removePortfolioCompany = (i) =>
    setPortfolioCompanies(portfolioCompanies.filter((_, idx) => idx !== i));

  const updatePortfolioCompany = (i, field, value) => {
    const updated = [...portfolioCompanies];
    updated[i][field] = value;
    setPortfolioCompanies(updated);
  };

  /*  Submit / delete  */
  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      fundName, investorType, logo,
      fundSize: Number(fundSize),
      currency,
      yearsOfExperience: Number(yearsOfExperience),
      ticketSize: { minimum: Number(ticketMin), maximum: Number(ticketMax) },
      preferredStages, geographicFocus, industrySectorFocus,
      portfolioCompaniesCount: Number(portfolioCompaniesCount),
      portfolioCompanies, about,
      contact: { name: contactName, title: contactTitle, email: contactEmail, phone: contactPhone },
      linkedIn, officeLocation, profileVisibility, applyLink,
    };
    try {
      if (isEdit) {
        await publisherApi.patch("/api/publisher/investors/", payload);
        toast.success("Investor profile updated successfully.");
      } else {
        await publisherApi.post("/api/publisher/investors/create", payload);
        toast.success("Investor profile created successfully.");
        setIsEdit(true);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setConfirmConfig({
      title: "Delete Investor Profile",
      message: "Are you sure you want to permanently delete your investor profile? This action cannot be undone.",
      confirmText: "Yes, Delete Profile", cancelText: "Cancel", confirmVariant: "danger",
      onConfirm: async () => {
        setLoading(true);
        try {
          await publisherApi.delete("/api/publisher/investors/");
          setIsEdit(false);
          toast.success("Investor profile deleted successfully.");
          setFundName(""); setInvestorType(""); setLogo(""); setFundSize("");
          setCurrency("INR"); setYearsOfExperience(""); setTicketMin(""); setTicketMax("");
          setPreferredStages([]); setGeographicFocus([]); setIndustrySectorFocus([]);
          setPortfolioCompaniesCount(""); setPortfolioCompanies([]); setAbout("");
          setContactName(""); setContactTitle(""); setContactEmail(""); setContactPhone("");
          setLinkedIn(""); setOfficeLocation(""); setProfileVisibility("Public"); setApplyLink("");
        } catch (err) {
          toast.error(err?.response?.data?.message || "Delete failed.");
        } finally {
          setLoading(false);
        }
      },
    });
    setShowConfirm(true);
  };

  /*  Loading skeleton  */
  if (fetching) {
    return (
      <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60dvh" }}>
        <p className="loadingState">Loading your profile…</p>
      </div>
    );
  }

  /*  Render  */
  return (
    <div className="page">

      {/*  Page header  */}
      <header className="topbar">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>

          </div>
          <h1 className="topbarTitle">{isEdit ? "Edit Investor Profile" : "Create Investor Profile"}</h1>
          <p className="topbarSub">
            {isEdit
              ? "Keep your fund information up to date for founders to find you."
              : "Set up your investor profile to start connecting with startups."}
          </p>
        </div>
      </header>

      {/*  Basic information  */}
      <section className="section">
        <SectionHeader title="Basic information" subtitle="Firm identity and public-facing details" />

        <div className="field">
          <label className="label">Investor Name <span style={{ color: "var(--orange)" }}>*</span></label>
          <input className="input" value={fundName} onChange={(e) => setFundName(e.target.value)} placeholder="Enter Investor Name" />
        </div>

        <div className="row2">
          <div className="field">
            <label className="label">Investor Type <span style={{ color: "var(--orange)" }}>*</span></label>
            <select className="select" value={investorType} onChange={(e) => setInvestorType(e.target.value)} disabled={investorTypes.length === 0}>
              <option value="">{investorTypes.length === 0 ? "Loading…" : "Select type"}</option>
              {investorTypes.map((t) => (
                <option key={t._id ?? itemValue(t)} value={itemValue(t)}>{itemLabel(t)}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label">Logo URL <span style={{ color: "var(--orange)" }}>*</span></label>
            <input className="input" value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="https://" />
          </div>
        </div>

        <div className="field">
          <label className="label">
            About <span style={{ color: "var(--orange)" }}>*</span>
            <span className="labelNote">{about.length} characters</span>
          </label>
          <textarea className="textarea" rows={4} value={about} onChange={(e) => setAbout(e.target.value)} placeholder="Brief background about the investor or fund…" />
        </div>
      </section>

      {/*  Fund details  */}
      <section className="section">
        <SectionHeader title="Fund details" subtitle="Investment capacity and experience" />

        <div className="row3">
          <div className="field">
            <label className="label">Fund Size <span style={{ color: "var(--orange)" }}>*</span></label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <select className="select" style={{ width: "90px", flexShrink: 0 }} value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="INR">INR</option>
                <option value="USD">USD</option>
              </select>
              <input type="number" className="input" value={fundSize} onChange={(e) => setFundSize(e.target.value)} placeholder="50000000" />
            </div>
          </div>

          <div className="field">
            <label className="label">Years of Experience <span style={{ color: "var(--orange)" }}>*</span></label>
            <input type="number" className="input" value={yearsOfExperience} onChange={(e) => setYearsOfExperience(e.target.value)} placeholder="12" />
          </div>

          <div className="field">
            <label className="label">Portfolio Companies <span style={{ color: "var(--orange)" }}>*</span></label>
            <input type="number" className="input" value={portfolioCompaniesCount} onChange={(e) => setPortfolioCompaniesCount(e.target.value)} placeholder="45" />
          </div>
        </div>

        <div className="field">
          <label className="label">Ticket Size Range <span style={{ color: "var(--orange)" }}>*</span></label>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <input type="number" className="input" value={ticketMin} onChange={(e) => setTicketMin(e.target.value)} placeholder="Min" />
            <span className="tdMuted">—</span>
            <input type="number" className="input" value={ticketMax} onChange={(e) => setTicketMax(e.target.value)} placeholder="Max" />
          </div>
        </div>
      </section>

      {/*  Portfolio companies  */}
      <section className="section">
        <SectionHeader title="Portfolio companies" subtitle="Details of companies you have invested in" />

        {portfolioCompanies.length === 0 && (
          <p className="emptyState" style={{ padding: "1.5rem 0" }}>No portfolio companies added yet.</p>
        )}

        {portfolioCompanies.map((company, i) => (
          <div key={i} style={{
            border: "1px solid var(--color-border)",
            borderLeft: "4px solid var(--yellow)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-5)",
            marginBottom: "var(--space-4)",
            background: "var(--color-surface)",
          }}>
            <div className="row2">
              <div className="field">
                <label className="label">Company Name <span style={{ color: "var(--orange)" }}>*</span></label>
                <input className="input" value={company.companyName} onChange={(e) => updatePortfolioCompany(i, "companyName", e.target.value)} placeholder="e.g. StartupX" />
              </div>
              <div className="field">
                <label className="label">Description <span style={{ color: "var(--orange)" }}>*</span></label>
                <textarea className="textarea" rows={3} value={company.description} onChange={(e) => updatePortfolioCompany(i, "description", e.target.value)} placeholder="Brief description of investment, role, and impact…" />
              </div>
            </div>
            <button type="button" className="btn btnSm btnDanger" style={{ marginTop: "0.75rem" }} onClick={() => removePortfolioCompany(i)}>
              Remove Company
            </button>
          </div>
        ))}

        <button type="button" className="btn btnSecondary" onClick={addPortfolioCompany}>
          + Add Portfolio Company
        </button>
      </section>

      {/*  Investment preferences  */}
      <section className="section">
        <SectionHeader title="Investment preferences" subtitle="Stages, geographies, and sectors you focus on" />

        <div className="field">
          <label className="label">
            Preferred Stages <span style={{ color: "var(--orange)" }}>*</span>
            {preferredStages.length > 0 && (
              <span className="badge badgePrimary" style={{ marginLeft: "0.5rem" }}>{preferredStages.length} selected</span>
            )}
          </label>
          {stages.length === 0 ? (
            <span className="labelNote">Loading…</span>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.25rem" }}>
              {stages.map((s) => (
                <TagButton
                  key={s._id ?? itemValue(s)}
                  label={itemLabel(s)}
                  selected={preferredStages.includes(itemValue(s))}
                  onClick={() => toggleMultiSelect(itemValue(s), preferredStages, setPreferredStages)}
                />
              ))}
            </div>
          )}
        </div>

<div className="field">
  <label className="label">
    Industry / Sector Focus <span style={{ color: "var(--orange)" }}>*</span>
    {industrySectorFocus.length > 0 && (
      <span className="badge badgePrimary" style={{ marginLeft: "0.5rem" }}>{industrySectorFocus.length} selected</span>
    )}
  </label>
  {sectors.length === 0 ? (
    <span className="labelNote">Loading…</span>
  ) : (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.25rem" }}>
      {sectors.map((s) => (
        <TagButton
          key={s._id}
          label={s.name}
          selected={industrySectorFocus.includes(s.name)}
          onClick={() => toggleMultiSelect(s.name, industrySectorFocus, setIndustrySectorFocus)}
        />
      ))}
    </div>
  )}
</div>
      </section>

      {/*  Contact details  */}
      <section className="section">
        <SectionHeader title="Contact details" subtitle="Primary point of contact for founders" />

        <div className="row2">
          <div className="field">
            <label className="label">Contact Person Name <span style={{ color: "var(--orange)" }}>*</span></label>
            <input className="input" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Enter Name" />
          </div>
          <div className="field">
            <label className="label">Designation <span style={{ color: "var(--orange)" }}>*</span></label>
            <input className="input" value={contactTitle} onChange={(e) => setContactTitle(e.target.value)} placeholder="Enter Designation" />
          </div>
        </div>

        <div className="row2">
          <div className="field">
            <label className="label">Contact Email <span style={{ color: "var(--orange)" }}>*</span></label>
            <input type="email" className="input" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="Enter Email ID" />
          </div>
          <div className="field">
            <label className="label">Contact Phone <span style={{ color: "var(--orange)" }}>*</span></label>
            <input className="input" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+91-9999999999" />
          </div>
        </div>
      </section>

      {/*  Profile details  */}
      <section className="section">
        <SectionHeader title="Profile details" subtitle="Online presence and visibility settings" />

        <div className="row2">
          <div className="field">
            <label className="label">LinkedIn URL <span style={{ color: "var(--orange)" }}>*</span></label>
            <input className="input" value={linkedIn} onChange={(e) => setLinkedIn(e.target.value)} placeholder="https://" />
          </div>

          <div className="field">
            <label className="label">Office Location <span style={{ color: "var(--orange)" }}>*</span></label>
            <div className="stateDropdownWrapper">
              <div className="select" style={{ cursor: "pointer", userSelect: "none" }} onClick={() => setStateOpen((p) => !p)}>
                {officeLocation || "Select State"}
              </div>
              {stateOpen && (
                <div className="stateDropdownMenu">
                  <div className="statePlaceholder" onClick={() => { setOfficeLocation(""); setStateOpen(false); }}>
                    Select State
                  </div>
                  {INDIA_STATES.map((state) => (
                    <div
                      key={state}
                      className={officeLocation === state ? "stateOptionActive" : "stateOption"}
                      onClick={() => { setOfficeLocation(state); setStateOpen(false); }}
                    >
                      {state}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="row2">
          <div className="field">
            <label className="label">Apply Link <span style={{ color: "var(--orange)" }}>*</span></label>
            <input className="input" value={applyLink} onChange={(e) => setApplyLink(e.target.value)} placeholder="https://" />
          </div>

          <div className="field">
            <label className="label">Profile Visibility <span style={{ color: "var(--orange)" }}>*</span></label>
            <select className="select" value={profileVisibility} onChange={(e) => setProfileVisibility(e.target.value)}>
              <option value="Public">🌍 Public</option>
              <option value="Private">🔒 Private</option>
              <option value="Limited visibility">👥 Limited Visibility</option>
            </select>
          </div>
        </div>
      </section>

      {/*  Sticky action bar  */}
      <div style={{
        position: "sticky", bottom: "1rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "var(--space-4) var(--space-5)",
        background: "var(--color-glass)",
        backdropFilter: "blur(16px)",
        border: "1px solid var(--color-border)",
        borderTop: "3px solid var(--yellow)",
        borderRadius: "calc(var(--radius-xl) + 0.2rem)",
        boxShadow: "var(--shadow-md)",
        zIndex: 100,
      }}>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          {isEdit && (
            <button className="btn btnDanger" onClick={handleDelete} disabled={loading}>
              Delete Profile
            </button>
          )}
        </div>
        <button className="btn btnPrimary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving…" : isEdit ? "Update Profile" : "Create Profile"}
        </button>
      </div>

      <ConfirmationModal show={showConfirm} config={confirmConfig} onClose={() => setShowConfirm(false)} />
      <ToastContainer position="top-center" />
    </div>
  );
}