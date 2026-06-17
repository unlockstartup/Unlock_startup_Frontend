"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/app/api";
import { useAuth } from "@/context/AuthContext";
import "./competitions.css";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import { TrackPublicAppyClick } from "@/app/apiServices/publicapi";
import {
  ArrowLeft,
  BookOpen,
  Info,
  Globe,
  Share2,
  ExternalLink,
  Building2,
  Phone,
  Mail,
  ShieldCheck,
  CalendarClock,
  Gift,
  Tag,
  FileText,
  Paperclip,
  Send,
  CheckCircle2,
  MapPin,
  Calendar,
  Target,
  Layers,
  BadgeIndianRupee,
  Users,
  Lightbulb,
  ListChecks,
  Trophy,
  User,
  ChevronRight,
  InfoIcon
} from "lucide-react";
import Image from "next/image";

export default function CompetitionPage({ params }) {
  const [funding, setFunding] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFunding = async () => {
      const { id } = await params;
      try {
        const response = await api.get(`/api/publisher/funding-calls/all`);
        const items = response.data?.fundings ?? [];
        const raw = items.find((f) => String(f._id) === String(id));

        if (raw) {
          const fmt = (dateStr) =>
            dateStr
              ? new Date(dateStr).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : null;

          setFunding({
            id: raw._id,
            title: raw.title ?? "",
            description: raw.description ?? "",
            status: raw.status ?? "",
            location: raw.location ?? "",
            organizingCompany: raw.organizingCompany ?? "",
            organizerType: raw.organizerType ?? "",
            contactPersonName: raw.contactPersonName ?? "",
            officialEmail: raw.officialEmail ?? "",
            contactPhone: raw.contactPhone ?? "",
            publisherName: raw.publisherId?.organizationName ?? "",
            publisherWebsite: raw.publisherId?.website || null,
            challengeType: raw.challengeType ?? "",
            challengeCategory: raw.challengeCategory ?? "",
            challengeObjective: raw.challengeObjective ?? "",
            problemStatement: raw.problemStatement ?? "",
            startupStage: raw.startupStage ?? "",
            geographicRestrictions: raw.geographicRestrictions ?? "",
            keyFocusAreas: raw.keyFocusAreas ?? "",
            eligibleParticipants: raw.eligibleParticipants ?? "",
            eligibilityVerification: raw.eligibilityVerification ?? [],
            additionalRewards: raw.additionalRewards ?? [],
            launchDate: fmt(raw.launchDate),
            submissionDeadline: fmt(raw.submissionDeadline ?? raw.deadline),
            resultDate: fmt(raw.resultDate),
            applicationFee: raw.applicationFee ?? 0,
            applicationType: raw.applicationType || (raw.applicationFee > 0 ? "paid" : "free"),
            registrationLink: raw.registrationLink ?? "",
            image: raw.attachments?.[0]?.url ?? null,
          });
        }
      } catch (err) {
        console.error("Failed to fetch funding call:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFunding();
  }, [params]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: funding?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <main>
        <div className="competitionDetailPage">
          <div className="competitionContainer" style={{ display: "flex", justifyContent: "center", paddingTop: "120px" }}>
            <div style={{ textAlign: "center" }}>
              <div className="competitionLoadingSpinner" style={{ margin: "0 auto 20px" }} />
              <p style={{ color: "var(--sdp-text-muted)", fontSize: "16px", fontWeight: 500 }}>
                Loading Competition...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!funding) {
    return (
      <main>
        <div className="competitionDetailPage">
          <div className="competitionContainer">
            <div className="competitionNotFoundWrap">
              <h2>Competition Not Found</h2>
              <p>This Competition may have closed or been removed.</p>
              <Link href="/competitions" className="competitionCtaPrimary" style={{ display: "inline-flex", width: "auto", padding: "14px 28px" }}>
                <ArrowLeft size={18} />
                Browse All Competitions
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div className="competitionDetailPage">
        <div className="competitionContainer">
<Breadcrumb title="Competitions"  dynamicTitle={funding?.title}/>
          {/*  Back Link  */}
          <Link href="/competitions" className="competitionBackLink">
            <ArrowLeft size={16} strokeWidth={2} />
            All Competitions
          </Link>

          {/*  Hero Image  */}
          {funding.image && (
            <div className="competitionHeroImageContainer">
              <Image src={funding.image} fill style={{ objectFit: "fill" }} alt={funding.title} priority />
            </div>
          )}

          {/*  Hero Metadata  */}
          <div className="competitionHeroMetadataContainer">
            <div className="competitionHeroMetaTop">

              {/* Left: badge + title + org */}
              <div className="competitionHeroMetaLeft">
                {funding.challengeCategory && (
                  <span className="competitionBadgeCategory">{funding.challengeCategory}</span>
                )}
                <h1>{funding.title}</h1>
                <div className="competitionHeroOrgRow">
                 
                  <span className="competitionHeroOrgName">
                    by <strong>{funding.organizingCompany || funding.publisherName}</strong>
                  </span>
                </div>
              </div>

              {/* Right: challenge type + fee badges */}
              <div className="competitionHeroMetaRight">
                {funding.challengeType && (
                  <span className="competitionAvailBadge">
                    <span className="competitionAvailDot" />
                    {funding.challengeType}
                  </span>
                )}
                {funding.applicationType === "paid" && funding.applicationFee > 0 ? (
                  <span className="competitionAvailBadge" style={{ background: "var(--yellow-100)", border: "1px solid var(--yellow-400)", color: "var(--yellow-900)" }}>
                    ₹{funding.applicationFee} Fee
                  </span>
                ) : funding.applicationType === "invite only" ? (
                  <span className="competitionAvailBadge" style={{ background: "var(--purple-50)", border: "1px solid var(--purple-200)", color: "var(--purple-800)" }}>
                    Invite Only
                  </span>
                ) : (
                  <span className="competitionAvailBadge" style={{ background: "var(--blue-50)", border: "1px solid var(--blue-200)", color: "var(--blue-800)" }}>
                    Free to Apply
                  </span>
                )}
              </div>
            </div>

            {/* Quick stats strip */}
            <div className="competitionHeroStatsStrip">
              {funding.launchDate && (
                <div className="competitionHeroStatItem">
                  <span className="competitionHeroStatIcon competitionHeroStatIcon--date">
                    <Calendar size={20} strokeWidth={2} />
                  </span>
                  <div className="competitionHeroStatMeta">
                    <span className="competitionHeroStatLabel">Start Date</span>
                    <span className="competitionHeroStatValue">{funding.launchDate}</span>
                  </div>
                </div>
              )}

              {funding.submissionDeadline && (
                <div className="competitionHeroStatItem">
                  <span className="competitionHeroStatIcon competitionHeroStatIcon--reg">
                    <CalendarClock size={20} strokeWidth={2} />
                  </span>
                  <div className="competitionHeroStatMeta">
                    <span className="competitionHeroStatLabel">Submission Last Date</span>
                    <span className="competitionHeroStatValue competitionHeroStatValue--red">{funding.submissionDeadline}</span>
                  </div>
                </div>
              )}

              {/* {funding.location && (
                <div className="competitionHeroStatItem">
                  <span className="competitionHeroStatIcon competitionHeroStatIcon--loc">
                    <MapPin size={20} strokeWidth={2} />
                  </span>
                  <div className="competitionHeroStatMeta">
                    <span className="competitionHeroStatLabel">Location</span>
                    <span className="competitionHeroStatValue">{funding.location}</span>
                  </div>
                </div>
              )} */}

              {funding.startupStage && (
                <div className="competitionHeroStatItem">
                  <span className="competitionHeroStatIcon competitionHeroStatIcon--date">
                    <Layers size={20} strokeWidth={2} />
                  </span>
                  <div className="competitionHeroStatMeta">
                    <span className="competitionHeroStatLabel">Startup Stage</span>
                    <span className="competitionHeroStatValue">{funding.startupStage}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="competitionLayout">

            {/*  LEFT COLUMN  */}
            <div className="competitionLeft">
              {/* Description */}
              {funding.description && (
                <div className="competitionCard">
                  <div className="competitionSectionHeader">
                    <div className="competitionSectionIcon"><BookOpen size={20} strokeWidth={2} /></div>
                    <h2 className="competitionSectionTitle">Overview</h2>
                  </div>
                  {funding.description.split("\n").filter(Boolean).map((para, i, arr) => (
                    <p key={i} className="competitionBodyText" style={{ marginBottom: i < arr.length - 1 ? "16px" : 0 }}>
                      {para}
                    </p>
                  ))}
                </div>
              )}
                            {/* Challenge Objective */}
              {funding.challengeObjective && (
                <div className="competitionCard">
                  <div className="competitionSectionHeader">
                    <div className="competitionSectionIcon"><Target size={20} strokeWidth={2} /></div>
                    <h2 className="competitionSectionTitle">Challenge Objective</h2>
                  </div>
                  <p className="competitionBodyText">{funding.challengeObjective}</p>
                </div>
              )}
              {/* Key Information */}
              <div className="competitionCard">
                <div className="competitionSectionHeader">
                  <div className="competitionSectionIcon"><Info size={20} strokeWidth={2} /></div>
                  <h2 className="competitionSectionTitle">Key Information</h2>
                </div>
                <div className="competitionMetaGrid">
                  {funding.challengeType && (
                    <div className="competitionMetaItem">
                      <span className="competitionMetaLabel">Challenge Type</span>
                      <span className="competitionMetaValue">{funding.challengeType}</span>
                    </div>
                  )}
                  {funding.challengeCategory && (
                    <div className="competitionMetaItem">
                      <span className="competitionMetaLabel">Category</span>
                      <span className="competitionMetaValue competitionMetaValue--yellow">{funding.challengeCategory}</span>
                    </div>
                  )}
                  {funding.startupStage && (
                    <div className="competitionMetaItem">
                      <span className="competitionMetaLabel">Startup Stage</span>
                      <span className="competitionMetaValue competitionMetaValue--blue">{funding.startupStage}</span>
                    </div>
                  )}
                  {funding.location && (
                    <div className="competitionMetaItem">
                      <span className="competitionMetaLabel">location</span>
                      <span className="competitionMetaValue">{funding.location}</span>
                    </div>
                  )}
                  {funding.launchDate && (
                    <div className="competitionMetaItem">
                      <span className="competitionMetaLabel">Start Date</span>
                      <span className="competitionMetaValue">{funding.launchDate}</span>
                    </div>
                  )}
                  {funding.resultDate && (
                    <div className="competitionMetaItem">
                      <span className="competitionMetaLabel">Result Date</span>
                      <span className="competitionMetaValue">{funding.resultDate}</span>
                    </div>
                  )}
                </div>

                {/* Submission deadline alert */}
                {funding.submissionDeadline && (
                  <div className="competitionDeadlineAlert">
                    <span className="competitionDeadlineIcon"><CalendarClock size={20} strokeWidth={2} /></span>
                    <div className="competitionDeadlineMeta">
                      <span className="competitionDeadlineLabel">Submission Last Date</span>
                      <span className="competitionDeadlineValue">{funding.submissionDeadline}</span>
                    </div>
                  </div>
                )}

              </div>
                            {/* Challenge Objective */}
              {funding.problemStatement && (
                <div className="competitionCard">
                  <div className="competitionSectionHeader">
                    <div className="competitionSectionIcon"><Target size={20} strokeWidth={2} /></div>
                    <h2 className="competitionSectionTitle">Problem Statement</h2>
                  </div>
                  <p className="competitionBodyText">{funding.problemStatement}</p>
                </div>
              )}
              {/* Eligibility - Blue themed */}
              {(funding.eligibleParticipants || funding.eligibilityVerification?.length > 0) && (
                <div className="competitionCard">
                  <div className="competitionSectionHeader">
                    <div className="competitionSectionIcon"><ShieldCheck size={20} strokeWidth={2} /></div>
                    <h2 className="competitionSectionTitle">Who Can Participate</h2>
                  </div>
                  {funding.eligibleParticipants && (
                    <p className="competitionBodyText" style={{ marginBottom: funding.eligibilityVerification?.length > 0 ? "16px" : 0 }}>
                     <strong> Eligible Participants: </strong> {funding.eligibleParticipants}
                    </p>
                  )}
          
                </div>
              )}
              {/* Key Focus Areas - Yellow themed tags */}
              {funding.keyFocusAreas && (
                <div className="competitionCard">
                  <div className="competitionSectionHeader">
                    <div className="competitionSectionIcon competitionSectionIcon--benefits"><Lightbulb size={20} strokeWidth={2} /></div>
                    <h2 className="competitionSectionTitle">Key Focus Areas</h2>
                  </div>
                  <div className="competitionTagCloud">
                    {funding.keyFocusAreas.split(",").map((area, i) => (
                      <span key={i} className="competitionTopicTag">
                        <CheckCircle2 size={14} strokeWidth={2} />{area.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Rewards - Yellow themed */}
              {funding.additionalRewards?.length > 0 && (
                <div className="competitionCard">
                  <div className="competitionSectionHeader">
                    <div className="competitionSectionIcon competitionSectionIcon--benefits"><Trophy size={20} strokeWidth={2} /></div>
                    <h2 className="competitionSectionTitle">Rewards &amp; Prizes</h2>
                  </div>
                  <div className="competitionBenefitsList">
                    {funding.additionalRewards.map((reward, i) => (
                      <div key={i} className="competitionBenefitItem">
                        <span className="competitionBenefitDot" />
                        <span className="competitionBenefitText">{reward}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/*  RIGHT SIDEBAR  */}
            <div className="competitionRight">

{/* CTA Card */}
<div className="competitionCtaCard">
  <p className="competitionCtaTitle">Join the Competition</p>

  {funding.registrationLink && (
    user ? (
      <a
        href={funding.registrationLink}
        target="_blank"
        rel="noopener noreferrer"
        className="competitionCtaPrimary"
        onClick={() => {
          TrackPublicAppyClick(funding.id).catch(() => {});
        }}
      >
        <ExternalLink size={18} strokeWidth={2} />
        Apply via External Link
      </a>
    ) : (
      <>
        <button
          className="competitionCtaPrimary"
          disabled
          style={{ opacity: 0.5, cursor: "not-allowed", pointerEvents: "none" }}
        >
          <ExternalLink size={18} strokeWidth={2} />
          Apply via External Link
        </button>
        <a href="/login" className="competitionCtaSecondary" style={{ marginTop: "8px", textAlign: "center", justifyContent: "center" }}>
          <User size={18} strokeWidth={2} />
          Login to Apply
        </a>
      </>
    )
  )}

  {/* Share Button */}
  <button
    className="competitionCtaSecondary"
    type="button"
    onClick={handleShare}
    style={{ marginTop: "12px" }}
  >
    <Share2 size={18} strokeWidth={2} />
    Share Competition
  </button>
</div>

              {/* Organizer Card – with login blur on contact details (identical logic) */}
              <div className="competitionInfoCard competitionInfoCard--organizer">
                <div className="competitionInfoBlock">
                  <div className="competitionInfoBlockTitle">
                    <span className="competitionInfoBlockIcon"><Building2 size={18} strokeWidth={2} /></span>
                    Company Details
                  </div>

                  {/* Blurred contact content */}
                  <div className={`competitionContactContent ${!user ? "competitionBlurred" : ""}`}>
                    {funding.organizingCompany && (
                      <div className="competitionInfoLine">
                        <span className="competitionRegIcon"><Building2 size={16} strokeWidth={2} /></span>
                        <div className="competitionRegMeta">
                          <span className="competitionRegLabel">Company Name</span>
                          <span>{funding.organizingCompany}</span>
                        </div>
                      </div>
                    )}
                    {funding.organizerType && (
                      <div className="competitionInfoLine">
                        <span className="competitionRegIcon"><Tag size={16} strokeWidth={2} /></span>
                        <div className="competitionRegMeta">
                          <span className="competitionRegLabel">Company Type</span>
                          <span>{funding.organizerType}</span>
                        </div>
                      </div>
                    )}
                    {funding.contactPersonName && (
                      <div className="competitionInfoLine">
                        <span className="competitionRegIcon"><Users size={16} strokeWidth={2} /></span>
                        <div className="competitionRegMeta">
                          <span className="competitionRegLabel">Contact Person</span>
                          <span>{funding.contactPersonName}</span>
                        </div>
                      </div>
                    )}
                    {funding.contactPhone && (
                      <div className="competitionInfoLine">
                        <span className="competitionRegIcon"><Phone size={16} strokeWidth={2} /></span>
                        <div className="competitionRegMeta">
                          <span className="competitionRegLabel">Phone</span>
                          <a href={`tel:${funding.contactPhone}`} className="competitionInfoLineLink">{funding.contactPhone}</a>
                        </div>
                      </div>
                    )}
                    {funding.officialEmail && (
                      <div className="competitionInfoLine">
                        <span className="competitionRegIcon"><Mail size={16} strokeWidth={2} /></span>
                        <div className="competitionRegMeta">
                          <span className="competitionRegLabel">Email</span>
                          <a href={`mailto:${funding.officialEmail}`} className="competitionInfoLineLink">{funding.officialEmail}</a>
                        </div>
                      </div>
                    )}
                    {funding.publisherWebsite && (
                      <div className="competitionInfoLine">
                        <span className="competitionRegIcon"><Globe size={16} strokeWidth={2} /></span>
                        <div className="competitionRegMeta">
                          <span className="competitionRegLabel">Website</span>
                          <a href={funding.publisherWebsite} target="_blank" rel="noopener noreferrer" className="competitionInfoLineLink">
                            {funding.publisherWebsite.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Blur overlay (only for non-logged-in users) */}
                  {!user && (
                    <div className="competitionBlurOverlay">
                      <div className="competitionBlurCard">
                        <User size={24} color="#7c3aed" />
                        <p>Login to view contact details</p>
                        <a href="/login" className="competitionBlurLogin">
                          Login <ChevronRight size={14} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Application Details Card - Yellow themed */}
              <div className="competitionInfoCard competitionInfoCard--register">
                <div className="competitionInfoBlock">
                  <div className="competitionInfoBlockTitle">
                    <span className="competitionInfoBlockIcon"><InfoIcon size={18} strokeWidth={2} /></span>
                    Application Details
                  </div>
<div className="competitionRegRow">
  <span className="competitionRegIcon"><BadgeIndianRupee size={16} strokeWidth={2} /></span>
  <div className="competitionRegMeta">
    <span className="competitionRegLabel">Application Type</span>
    <span className="competitionRegValue" style={{ textTransform: "capitalize" }}>
      {funding.applicationFee > 0 ? "Paid" : funding.applicationType || "Free"}
    </span>
  </div>
</div>

{funding.applicationFee > 0 && (
  <div className="competitionRegRow">
    <span className="competitionRegIcon"><BadgeIndianRupee size={16} strokeWidth={2} /></span>
    <div className="competitionRegMeta">
      <span className="competitionRegLabel">Application Fee</span>
      <span className="competitionRegValue">₹{funding.applicationFee}</span>
    </div>
  </div>
)}
                  {funding.submissionDeadline && (
                    <div className="competitionRegRow">
                      <span className="competitionRegIcon"><CalendarClock size={16} strokeWidth={2} /></span>
                      <div className="competitionRegMeta">
                        <span className="competitionRegLabel">Submission Last Date</span>
                        <span className="competitionRegValue">{funding.submissionDeadline}</span>
                      </div>
                    </div>
                  )}
                  {funding.resultDate && (
                    <div className="competitionRegRow">
                      <span className="competitionRegIcon"><Gift size={16} strokeWidth={2} /></span>
                      <div className="competitionRegMeta">
                        <span className="competitionRegLabel">Result Date</span>
                        <span className="competitionRegValue">{funding.resultDate}</span>
                      </div>
                    </div>
                  )}
                  {funding.startupStage && (
                    <div className="competitionRegRow">
                      <span className="competitionRegIcon"><Layers size={16} strokeWidth={2} /></span>
                      <div className="competitionRegMeta">
                        <span className="competitionRegLabel">Startup Stage</span>
                        <span className="competitionRegValue">{funding.startupStage}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}