"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import api from "@/app/api";
import {
  MapPin, User, Mail, Phone, Clock, Monitor, Users, Calendar,
  Building2, Briefcase, AlertCircle, GraduationCap, Send, Banknote,
  ArrowLeft, Share2, Info, ExternalLink, Globe, ChevronRight,
  Wallet, Clock3, Award, ListChecks, CheckCircle2, FileText,
  Zap, TrendingUp, DollarSign, Briefcase as BriefcaseIcon
} from "lucide-react";
import "./jobDetail.css";
import { useAuth } from "@/context/AuthContext";
import ApplyModal from "@/components/uiElements/ApplyModal";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import { TrackPublicAppyClick } from "@/app/apiServices/publicapi";

export default function Page() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/publisher/jobs/sorted");
        const jobs = res.data?.jobs ?? [];
        setJob(jobs.find((j) => String(j._id) === String(id)) ?? null);
      } catch (err) {
        console.error("Failed to fetch job:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ── loading ── */
  if (loading) {
    return (
      <main>
        <div className="jobDetailPage">
          <div className="container">
            <div className="jd-loader">
              <div className="jd-spinner" />
              <p>Loading job details…</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ── not found ── */
  if (!job) {
    return (
      <main>
        <div className="jobDetailPage">
          <div className="container">
            <div className="notFoundWrap">
              <AlertCircle size={40} color="#d1d5db" />
              <h2>Job Not Found</h2>
              <p>This listing may have been removed or expired.</p>
              <a href="/jobs" className="jd-btn-back">← Browse All Jobs</a>
            </div>
          </div>
        </div>
      </main>
    );
  }

/* ── derived values ── */
const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

// Normalize workMode to a deduped array regardless of what the API sends
const workModes = (() => {
  const raw = job.workMode;
  if (!raw) return [];
  const arr = Array.isArray(raw) ? raw : raw.split(",").map(s => s.trim());
  // dedupe case-insensitively, then capitalize
  const seen = new Set();
  return arr.filter(s => {
    const key = s.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
})();

  const formatSalary = (min, max) => {
    if (!min && !max) return "Not disclosed";
    const format = (num) => {
      if (num >= 100000) return `₹${(num / 100000).toFixed(0)}L`;
      return `₹${num.toLocaleString("en-IN")}`;
    };
    if (min && max) return `${format(min)} - ${format(max)}`;
    return format(min || max);
  };

  const salary = formatSalary(job.salaryMin, job.salaryMax);
  const location = [job.jobLocationCity, job.jobLocationState, job.jobLocationCountry]
    .filter(Boolean).join(", ") || "Not specified";

  const applyLastDate = job.applyLastDate
    ? new Date(job.applyLastDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : null;
  const postedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : null;

  const allSkills = job.mustHaveSkills
    ? job.mustHaveSkills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const responsibilities = job.keyResponsibilities
    ? job.keyResponsibilities.split(/[;.]/).map((s) => s.trim()).filter(Boolean)
    : [];

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: job.title, url: window.location.href });
    else navigator.clipboard.writeText(window.location.href);
  };

const handleApply = () => {
  if (!user) return;
  TrackPublicAppyClick(job._id).catch(() => {}); // silent fail
  if (job.externalApplicationUrl && job.externalApplicationUrl !== "link") {
    window.open(job.externalApplicationUrl, "_blank", "noopener,noreferrer");
  } else {
    setModalOpen(true);
  }
};

  return (
    <main>
      <div className="jobDetailPage">
        <div className="container">
          <Breadcrumb title="Jobs" dynamicTitle={job?.title} />
          {/* ── Back link ── */}
          <a href="/jobs" className="backLink" style={{marginTop : "30px"}}>
            <ArrowLeft size={14} strokeWidth={2} /> All Jobs
          </a>

          {/* ── HERO SECTION ── */}
          <div className="jd-hero">
            <div className="jd-heroLeft">
              <div className="jd-logoWrap">
                {job.companyLogo?.url ? (
                  <Image 
                    src={job.companyLogo.url} 
                    alt={job.companyName}
                    width={80}
                    height={80}
                    className="jd-logo"
                  />
                ) : (
                  <div className="jd-logoPlaceholder">
                    <Building2 size={32} />
                  </div>
                )}
                <div className="jd-logoMeta">
                  <span className="jd-activityBadge">
                    <span className="jd-activityDot" /> Actively hiring
                  </span>
{workModes.some(m => m.toLowerCase() === "remote") && (
  <span className="jd-remoteBadge">Remote</span>
)}
                </div>
              </div>
              <div className="jd-titleWrap">
                <h1 className="jd-jobTitle">{job.title}</h1>
                <p className="jd-companyName">{job.companyName}</p>
              </div>
            </div>

            <div className="jd-heroRight">
              <div className="jd-statsGrid">
                {(job.salaryMin || job.salaryMax) && (
                  <div className="jd-statCard jd-statCard--salary">
                    <div className="jd-statIconWrap jd-statIconWrap--green">
                      <Banknote size={20} />
                    </div>
                    <div className="jd-statContent">
                      <span className="jd-statValue">{salary}</span>
                      <span className="jd-statLabel">{job.salaryType || "ANNUAL CTC"}</span>
                    </div>
                  </div>
                )}
                {job.jobType && (
                  <div className="jd-statCard jd-statCard--type">
                    <div className="jd-statIconWrap jd-statIconWrap--blue">
                      <BriefcaseIcon size={20} />
                    </div>
                    <div className="jd-statContent">
                      <span className="jd-statValue">{capitalize(job.jobType)}</span>
                      <span className="jd-statLabel">Job Type</span>
                    </div>
                  </div>
                )}
                {job.yearsExperienceRequired && (
                  <div className="jd-statCard jd-statCard--exp">
                    <div className="jd-statIconWrap jd-statIconWrap--purple">
                      <TrendingUp size={20} />
                    </div>
                    <div className="jd-statContent">
                      <span className="jd-statValue">{job.yearsExperienceRequired}+ Years</span>
                      <span className="jd-statLabel">Experience</span>
                    </div>
                  </div>
                )}
                {job.openings && (
                  <div className="jd-statCard jd-statCard--openings">
                    <div className="jd-statIconWrap jd-statIconWrap--orange">
                      <Users size={20} />
                    </div>
                    <div className="jd-statContent">
                      <span className="jd-statValue jd-statValue--accent">{job.openings} Position{job.openings > 1 ? "s" : ""}</span>
                      <span className="jd-statLabel">OPENINGS</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── INFO CARDS ROW ── */}
          <div className="jd-infoRow">
            {/* Company Details */}
            <div className="jd-infoCard">
              <div className="jd-infoHeader">
                <div className="jd-infoIcon jd-infoIcon--gray">
                  <Building2 size={18} />
                </div>
                <h3>Company Details</h3>
              </div>
              <div className="jd-infoBody">
                <p className="jd-companyDesc">
                  {job.companyDescription || job.description || "No company description available."}
                </p>
                <div className="jd-companyMetaRow">
                  {job.companySize && (
                    <div className="jd-metaItem">
                      <span className="jd-metaLabel">COMPANY SIZE</span>
                      <span className="jd-metaValue">{job.companySize}</span>
                    </div>
                  )}
                  {job.industrySector && (
                    <div className="jd-metaItem">
                      <span className="jd-metaLabel">INDUSTRY</span>
                      <span className="jd-metaValue">{job.industrySector}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hiring Manager - with blur for non-logged in users */}
            <div className="jd-infoCard jd-infoCard--manager">
              <div className="jd-infoHeader">
                <div className="jd-infoIcon jd-infoIcon--purple">
                  <User size={18} />
                </div>
                <h3>Hiring Manager</h3>
              </div>
              <div className="jd-infoBody">
                <div className={`jd-managerContent ${!user ? 'jd-blurred' : ''}`}>
                  {job.hiringManagerName && (
                    <p className="jd-managerName">{job.hiringManagerName}</p>
                  )}
                  {job.hiringManagerEmail && (
                    <a href={`mailto:${job.hiringManagerEmail}`} className="jd-contactRow">
                      <Mail size={14} />
                      <span>{job.hiringManagerEmail}</span>
                    </a>
                  )}
                  {job.hiringManagerPhone && (
                    <a href={`tel:${job.hiringManagerPhone}`} className="jd-contactRow">
                      <Phone size={14} />
                      <span>{job.hiringManagerPhone}</span>
                    </a>
                  )}
                </div>

                {!user && (
                  <div className="jd-blurOverlay">
                    <div className="jd-blurCard">
                      <User size={24} color="#7c3aed" />
                      <p>Login to view contact details</p>
                      <a href="/login" className="jd-blurLogin">
                        Login <ChevronRight size={14} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="jd-infoCard">
              <div className="jd-infoHeader">
                <div className="jd-infoIcon jd-infoIcon--gray">
                  <Calendar size={18} />
                </div>
                <h3>Timeline</h3>
              </div>
              <div className="jd-infoBody">
                <div className="jd-timelineGrid">
                  {postedDate && (
                    <div className="jd-timelineItem">
                      <span className="jd-timelineDate">{postedDate}</span>
                      <span className="jd-timelineLabel">POSTED ON</span>
                    </div>
                  )}
                  {applyLastDate && (
                    <div className="jd-timelineItem">
                      <span className="jd-timelineDate">{applyLastDate}</span>
                      <span className="jd-timelineLabel">APPLY BY</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── ROLE OVERVIEW ── */}
          {job.roleOverview && (
            <div className="jd-sectionCard">
              <div className="jd-sectionHeader">
                <div className="jd-sectionIcon jd-sectionIcon--blue">
                  <Info size={18} />
                </div>
                <h2>Role Overview</h2>
              </div>
              <p className="jd-sectionText">{job.roleOverview}</p>
            </div>
          )}

          {/* ── REQUIREMENTS & LOCATION ROW ── */}
          <div className="jd-splitRow">
            {/* Requirements */}
            <div className="jd-sectionCard jd-sectionCard--compact">
              <div className="jd-sectionHeader">
                <div className="jd-sectionIcon jd-sectionIcon--purple">
                  <ListChecks size={18} />
                </div>
                <h2>Requirements</h2>
              </div>
              <div className="jd-requirementsBody">
                {job.requiredEducation && (
                  <div className="jd-reqItem">
                    <span className="jd-reqLabel">EDUCATION</span>
                    <span className="jd-reqValue">{job.requiredEducation}</span>
                  </div>
                )}
                {job.yearsExperienceRequired && (
                  <div className="jd-reqItem">
                    <span className="jd-reqLabel">EXPERIENCE REQUIRED</span>
                    <span className="jd-reqValue">{job.yearsExperienceRequired}+ Years</span>
                  </div>
                )}
                {allSkills.length > 0 && (
                  <div className="jd-skillsWrap">
                    <span className="jd-reqLabel">MUST-HAVE SKILLS</span>
                    <div className="jd-skillsGrid">
                      {allSkills.map((skill, i) => (
                        <span key={i} className="jd-skillTag">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location & Salary */}
            <div className="jd-sectionCard jd-sectionCard--compact">
              <div className="jd-sectionHeader">
                <div className="jd-sectionIcon jd-sectionIcon--green">
                  <MapPin size={18} />
                </div>
                <h2>Location & Salary</h2>
              </div>
              <div className="jd-locSalBody">
                <div className="jd-locSection">
                  <span className="jd-locLabel">LOCATION DETAILS</span>
                  <p className="jd-locMain">{location}</p>
                  {job.jobLocationAddress && (
                    <p className="jd-locAddress">{job.jobLocationAddress}</p>
                  )}
                  <div className="jd-locMeta">
                    {job.jobLocationCity && (
                      <div className="jd-locMetaItem">
                        <span className="jd-locMetaLabel">City/State</span>
                        <span className="jd-locMetaValue">{job.jobLocationCity}{job.jobLocationState ? `, ${job.jobLocationState}` : ""}</span>
                      </div>
                    )}
                    {job.jobLocationCountry && (
                      <div className="jd-locMetaItem">
                        <span className="jd-locMetaLabel">Country</span>
                        <span className="jd-locMetaValue">{job.jobLocationCountry}</span>
                      </div>
                    )}
                  </div>
                </div>
<div className="jd-salSection">
  <span className="jd-salLabel">Salary Range</span>
  <div className="jd-salRow">
    <p className="jd-salAmount">{formatSalary(job.salaryMin, null)}</p>
    {job.salaryMin && job.salaryMax && <span className="jd-salDash">–</span>}
    {job.salaryMax && <p className="jd-salAmount">{formatSalary(null, job.salaryMax)}</p>}
  </div>
  <p className="jd-salType">Annual CTC &nbsp;·&nbsp; Based on experience</p>

  <div className="jd-salRange">
    <div className="jd-salTrack"><div className="jd-salFill" /></div>
    <div className="jd-salTicks">
      <span className="jd-salTick jd-salTick--active">{formatSalary(job.salaryMin, null)}</span>
      <span className="jd-salTick jd-salTick--active">{formatSalary(null, job.salaryMax)}</span>
    </div>
  </div>

  <div className="jd-salPills">
    {job.salaryType && (
      <span className="jd-salPill jd-salPill--green">
        <span className="jd-salPillDot" />{job.salaryType}
      </span>
    )}
{/* Line ~290 — Work mode pills */}
{workModes.map((mode, i) => (
  <span key={i} className={`jd-salPill jd-salPill--${i === 0 ? 'purple' : 'blue'}`}>
    <span className="jd-salPillDot" />{capitalize(mode)}
  </span>
))}
  </div>
</div>
              </div>
            </div>
          </div>

          {/* ── KEY RESPONSIBILITIES ── */}
          <div className="jd-sectionCard">
            <div className="jd-sectionHeader jd-sectionHeader--center">
              <div className="jd-sectionIcon jd-sectionIcon--purple">
                <CheckCircle2 size={18} />
              </div>
              <h2>Key Responsibilities</h2>
            </div>
            {responsibilities.length > 0 ? (
              <div className="jd-responsibilitiesGrid">
                {responsibilities.map((item, i) => (
                  <div key={i} className="jd-respItem">
                    <span className="jd-respNumber">{String(i + 1).padStart(2, '0')}</span>
                    <p className="jd-respText">{item}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="jd-sectionText" style={{ color: "#9ca3af", textAlign: "center" }}>
                No responsibilities listed.
              </p>
            )}
          </div>

          {/* ── APPLY NOW ── */}
{/* ── APPLY NOW ── */}
<div className="jd-applySection">
  <h2 className="jd-applyTitle">Apply Now</h2>

  {user ? (
    <button
      className="jd-submitBtn"
      onClick={handleApply}
    >
      <Send size={16} />
      Submit Application
    </button>
  ) : (
    <a href="/login" className="jd-submitBtn" style={{ textAlign: "center", justifyContent: "center", textDecoration: "none" }}>
      <User size={16} />
      Login to Apply
    </a>
  )}
</div>

        </div>
      </div>
    </main>
  );
}