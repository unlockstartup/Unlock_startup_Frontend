"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/app/api";
import { useAuth } from "@/context/AuthContext";
import "./events.css";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import {
  ArrowLeft,
  BookOpen,
  Info,
  Users,
  Tag,
  Globe,
  Share2,
  ExternalLink,
  Building2,
  Ticket,
  Phone,
  IndianRupee,
  ShieldCheck,
  CalendarClock,
  Mic2,
  Gift,
  Layers,
  Mail,
  FileText,
  Paperclip,
  Send,
  CheckCircle2,
  MapPin,
  Monitor,
  Calendar,
  Clock,
  User,
  ChevronRight
} from "lucide-react";
import ApplyModal from "@/components/uiElements/ApplyModal";
import { TrackPublicAppyClick } from "@/app/apiServices/publicapi";

export default function EventPage({ params }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvent = async () => {
      const { id } = await params;
      try {
        const response = await api.get(`/api/publisher/dashboard/getapprovedevents`);
        const items = response.data?.items ?? [];
        const raw = items.find((evt) => evt._id === id);
        if (raw) {
          setEvent({
            id: raw._id,
            image: raw.mainImage?.url ?? null,
            registrationDeadlineRaw: raw.registrationDeadline ?? null,
            title: raw.title,
            eventType: raw.eventType ?? "",
            content: raw.eventDescription || raw.description || "",
startDate: raw.startDateTime
  ? new Date(raw.startDateTime).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      timeZone: "Asia/Kolkata", 
    })
  : "TBA",

startTime: raw.startDateTime
  ? new Date(raw.startDateTime).toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit",
      timeZone: "Asia/Kolkata",
    }).replace(/am|pm/i, (m) => m.toUpperCase())  
  : null,

endDate: raw.endDateTime
  ? new Date(raw.endDateTime).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      timeZone: "Asia/Kolkata",  
    })
  : "TBA",

endTime: raw.endDateTime
  ? new Date(raw.endDateTime).toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit",
      timeZone: "Asia/Kolkata",
    }).replace(/am|pm/i, (m) => m.toUpperCase()) 
  : null,

            venueName: raw.venueName ?? "",
            fullAddress: raw.fullAddress ?? "",
            state: raw.jobLocationState ?? "",
            location: raw.venueName ? `${raw.venueName}, ${raw.fullAddress}` : raw.fullAddress ?? "TBA",
            category: raw.eventCategory ?? [],
            format: raw.eventFormat ?? "",
            organization: raw.organizationName ?? "",
            organizationWebsite: raw.organizationWebsite ?? "",
            targetAudience: raw.targetAudience ?? [],
            keyTopics: raw.keyTopics ?? [],
            registrationType: raw.registrationType ?? "",
            registrationUrl: raw.registrationUrl ?? "",
registrationDeadline: raw.registrationDeadline
  ? new Date(raw.registrationDeadline).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      timeZone: "Asia/Kolkata", 
    })
  : null,
            registrationPrice: raw.registrationPrice ?? null,
            ticketPricingTiers: raw.ticketPricingTiers ?? [],
            eligibility: raw.eligibility ?? "",
            applicationProcess: raw.applicationProcess ?? "",
            featuredSpeakers: raw.featuredSpeakers ?? "",
            attendeeBenefits: raw.attendeeBenefits ?? [],
            organizerContact: raw.organizerContactPerson ?? "",
            workEmail: raw.workEmail ?? "",
            phoneNumber: raw.phoneNumber ?? "",
            publisherName: raw.publisherId?.organizationName ?? "",
            eventWebsite: raw.eventWebsite ?? "",
            attachments: raw.attachments ?? [],
            eventType: raw.eventType ?? "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch event:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [params]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: event?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <main>
        <div className="eventDetailPage">
          <div className="eventContainer" style={{ display: "flex", justifyContent: "center", paddingTop: "80px" }}>
            <p style={{ color: "var(--sdp-text-muted)", fontSize: "14px" }}>Loading event…</p>
          </div>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main>
        <div className="eventDetailPage">
          <div className="eventContainer">
            <div className="eventNotFoundWrap">
              <h2>Event Not Found</h2>
              <p>This event may have ended or been removed.</p>
              <Link href="/events" className="btn-five">← Browse All Events</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div className="eventDetailPage">
        <div className="eventContainer">
<Breadcrumb title="Events" dynamicTitle={event?.title}/>
          {/*  Back Link  */}
          <Link href="/events" className="eventBackLink">
            <ArrowLeft size={14} strokeWidth={2} />
            All Events
          </Link>

          {/*  Hero Image  */}
          {event.image && (
            <div className="eventHeroImageContainer">
              <Image src={event.image} fill style={{ objectFit: "fill" }} alt={event.title} priority />
            </div>
          )}

          {/*  Hero Metadata  */}
          <div className="eventHeroMetadataContainer">
            <div className="eventHeroMetaTop">
              {/* Left: badge + title + org */}
              <div className="eventHeroMetaLeft">
                <h1>{event.title}</h1>

              </div>

              {/* Right: format + registration type badges */}
              <div className="eventHeroMetaRight">
                {event.format && (
                  <span className="eventAvailBadge">
                    <span className="eventAvailDot" />
                    {event.format}
                  </span>
                )}
              </div>
            </div>

            {/* Quick stats strip */}
            <div className="eventHeroStatsStrip">
              <div className="eventHeroStatItem">
                <span className="eventHeroStatIcon eventHeroStatIcon--date">
                  <Calendar size={15} strokeWidth={1.8} />
                </span>
                <div className="eventHeroStatMeta">
                  <span className="eventHeroStatLabel">Date</span>
                  <span className="eventHeroStatValue">
                    {event.startDate}
                    {event.startDate !== event.endDate && ` – ${event.endDate}`}
                  </span>
                </div>
              </div>

              {event.startTime && (
                <div className="eventHeroStatItem">
                  <span className="eventHeroStatIcon eventHeroStatIcon--date">
                    <Clock size={15} strokeWidth={1.8} />
                  </span>
                  <div className="eventHeroStatMeta">
                    <span className="eventHeroStatLabel">Time</span>
                    <span className="eventHeroStatValue">
                      {event.startTime}
                      {event.endTime && ` – ${event.endTime}`}
                    </span>
                  </div>
                </div>
              )}

              {/* {event.venueName && (
                <div className="eventHeroStatItem">
                  <span className="eventHeroStatIcon eventHeroStatIcon--loc">
                    <MapPin size={15} strokeWidth={1.8} />
                  </span>
                  <div className="eventHeroStatMeta">
                    <span className="eventHeroStatLabel">Venue</span>
                    <span className="eventHeroStatValue">{event.venueName}</span>
                  </div>
                </div>
              )} */}

              {event.registrationDeadline && (
                <div className="eventHeroStatItem">
                  <span className="eventHeroStatIcon eventHeroStatIcon--reg">
                    <CalendarClock size={15} strokeWidth={1.8} />
                  </span>
                  <div className="eventHeroStatMeta">
                    <span className="eventHeroStatLabel">Registration Deadline</span>
                    <span className="eventHeroStatValue eventHeroStatValue--red">
                      {event.registrationDeadline}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="eventLayout">

            {/*  LEFT COLUMN  */}
            <div className="eventLeft">
              {/* About this Event */}
              {event.content && (
                <div className="eventCard">
                  <div className="eventSectionHeader">
                    <div className="eventSectionIcon"><BookOpen size={15} strokeWidth={1.8} /></div>
                    <h2 className="eventSectionTitle">Event Description</h2>
                  </div>
                  {event.content.split("\n").filter(Boolean).map((para, i, arr) => (
                    <p key={i} className="eventBodyText" style={{ marginBottom: i < arr.length - 1 ? "12px" : 0 }}>
                      {para}
                    </p>
                  ))}
                </div>
              )}

              {/* Event Information */}
              <div className="eventCard">
                <div className="eventSectionHeader">
                  <div className="eventSectionIcon"><Info size={15} strokeWidth={1.8} /></div>
                  <h2 className="eventSectionTitle">Event Information</h2>
                </div>
                <div className="eventMetaGrid" style={{ gridTemplateColumns: "repeat(2,1fr)" }}>
                  {event.eventType && (
                    <div className="eventMetaItem">
                      <span className="eventMetaLabel">Event Type</span>
                      <span className="eventMetaValue eventMetaValue--blue">{event.eventType}</span>
                    </div>
                  )}
                  {event.category?.length > 0 && (
                    <div className="eventMetaItem" style={{ gridColumn: "0 / 1" }}>
                      <span className="eventMetaLabel">Event Category</span>
                      <div style={{ marginTop: "6px" }}>
                        {event.category.map((cat, i) => (
                          <span key={i} className="">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="eventMetaItem">
                    <span className="eventMetaLabel">Start Date &amp; Time</span>
                    <span className="eventMetaValue">
                      {event.startDate}
                      {event.startTime && <><br /><span style={{ color: "var(--sdp-text-muted)", fontWeight: 400 }}>{event.startTime}</span></>}
                    </span>
                  </div>
                  <div className="eventMetaItem">
                    <span className="eventMetaLabel">End Date &amp; Time</span>
                    <span className="eventMetaValue">
                      {event.endDate}
                      {event.endTime && <><br /><span style={{ color: "var(--sdp-text-muted)", fontWeight: 400 }}>{event.endTime}</span></>}
                    </span>
                  </div>
                  {event.fullAddress && (
  <div className="eventVenueBlock">
    <span className="eventVenueIcon"><MapPin size={14} strokeWidth={2} /></span>
    <div className="eventVenueMeta">
      <span className="eventVenueLabel">Address</span>
      <span className="eventVenueValue">{event.fullAddress}</span>
    </div>
  </div>
)}

{event.state && (
  <div className="eventVenueBlock" style={{width : "100%"}}>
    <span className="eventVenueIcon"><MapPin size={14} strokeWidth={2} /></span>
    <div className="eventVenueMeta">
      <span className="eventVenueLabel">State</span>
      <span className="eventVenueValue">{event.state}</span>
    </div>
  </div>
)}
  {event.venueName && (
  <div className="eventVenueBlock" style={{width : "100%"}}>
    <span className="eventVenueIcon"><MapPin size={14} strokeWidth={2} /></span>
    <div className="eventVenueMeta">
      <span className="eventVenueLabel">Venue</span>
      <span className="eventVenueValue">{event.venueName}</span>
    </div>
  </div>
)}
  {event.registrationDeadline && (
  <div className="eventVenueBlock" style={{width : "100%"}}>
    <span className="eventVenueIcon"><CalendarClock size={14} strokeWidth={2} /></span>
    <div className="eventVenueMeta">
      <span className="eventVenueLabel">Registration Deadline</span>
      <span className="eventVenueValue">{event.registrationDeadline}</span>
    </div>
  </div>
)}
                </div>
              </div>

              {/* Key Topics */}
              {(event.keyTopics?.length > 0 || event.category) && (
                <div className="eventCard">
                  <div className="eventSectionHeader">
                    <div className="eventSectionIcon"><Users size={15} strokeWidth={1.8} /></div>
                    <h2 className="eventSectionTitle">Key Topics</h2>
                  </div>
                  {event.keyTopics?.length > 0 && (
                    <div className="eventAudienceSection" style={{ marginBottom: 0 }}>
                      <div className="eventTagCloud">
                        {event.keyTopics.map((t, i) => (
                          <span key={i} className="eventTopicTag">
                            <Tag size={11} strokeWidth={2} />{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Attendee Benefits */}
              {event.attendeeBenefits?.length > 0 && (
                <div className="eventCard">
                  <div className="eventSectionHeader">
                    <div className="eventSectionIcon eventSectionIcon--benefits"><Gift size={15} strokeWidth={1.8} /></div>
                    <h2 className="eventSectionTitle">Attendee Benefits</h2>
                  </div>
                  <div className="eventBenefitsList">
                    {event.attendeeBenefits.map((benefit, i) => (
                      <div key={i} className="eventBenefitItem">
                        <span className="eventBenefitDot" />
                        <span className="eventBenefitText">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Featured Speakers */}
              {event.featuredSpeakers && (
                <div className="eventCard">
                  <div className="eventSectionHeader">
                    <div className="eventSectionIcon eventSectionIcon--speakers"><Mic2 size={15} strokeWidth={1.8} /></div>
                    <h2 className="eventSectionTitle">Featured Speakers</h2>
                  </div>
                  <div className="eventSpeakerList">
                    {event.featuredSpeakers.split(",").map((speaker, i) => (
                      <div key={i} className="eventSpeakerChip">
                        <span className="eventSpeakerAvatar">{speaker.trim().charAt(0)}</span>
                        <span className="eventSpeakerName">{speaker.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Audience & Topics */}
              {(event.targetAudience?.length > 0 || event.keyTopics?.length > 0 || event.category) && (
                <div className="eventCard">
                  <div className="eventSectionHeader">
                    <div className="eventSectionIcon"><Users size={15} strokeWidth={1.8} /></div>
                    <h2 className="eventSectionTitle">Audience</h2>
                  </div>
                  {event.targetAudience?.length > 0 && (
                    <div className="eventAudienceSection">
                      <span className="eventAudienceSectionLabel">Target Audience</span>
                      <div className="eventTagCloud">
                        {event.targetAudience.map((a, i) => (
                          <span key={i} className="eventAudienceTag">
                            <Users size={11} strokeWidth={2} />{a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Application Process */}
              {event.applicationProcess && (
                <div className="eventCard">
                  <div className="eventSectionHeader">
                    <div className="eventSectionIcon eventSectionIcon--process"><FileText size={15} strokeWidth={1.8} /></div>
                    <h2 className="eventSectionTitle">Application Process</h2>
                  </div>
                  <p className="eventBodyText">{event.applicationProcess}</p>
                </div>
              )}
            </div>

            {/*  RIGHT SIDEBAR  */}
            <div className="eventRight">

              {/*  CTA Card  */}
              <div className="eventCtaCard">
                <p className="eventCtaTitle">Join this Event</p>

{(() => {
  const deadlinePassed = event.registrationDeadlineRaw
    ? new Date() > new Date(event.registrationDeadlineRaw)
    : false;

  if (deadlinePassed) {
    return (
      <>
        <button className="eventCtaPrimary" disabled style={{ opacity: 0.6, cursor: "not-allowed" }}>
          <Ticket size={14} strokeWidth={2} />
          Registration Closed
        </button>
        <button className="eventCtaSecondary" type="button" onClick={handleShare} style={{ marginTop: "8px" }}>
          <Share2 size={14} strokeWidth={1.75} />
          Share Event
        </button>
      </>
    );
  }

if (!user) {
  return (
    <>
      {event.registrationUrl ? (
        <button className="eventCtaPrimary" disabled style={{ opacity: 0.5, cursor: "not-allowed", pointerEvents: "none" }}>
          <ExternalLink size={14} strokeWidth={2} />
          Register via External Link
        </button>
      ) : (
        <button className="eventCtaPrimary" disabled style={{ opacity: 0.5, cursor: "not-allowed", pointerEvents: "none" }}>
          <Send size={13} strokeWidth={1.75} />
          Apply here
        </button>
      )}
      <a href="/login" className="eventCtaSecondary" style={{ marginTop: "8px", textAlign: "center", justifyContent: "center" }}>
        <User size={14} strokeWidth={2} />
        Login to Apply
      </a>
      <button className="eventCtaSecondary" type="button" onClick={handleShare} style={{ marginTop: "8px" }}>
        <Share2 size={14} strokeWidth={1.75} />
        Share Event
      </button>
    </>
  );
}

  return (
    <>
      {event.registrationUrl && (
        <>
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="eventCtaPrimary"
            onClick={() => TrackPublicAppyClick(event.id).catch(() => {})}
          >
            <ExternalLink size={14} strokeWidth={2} />
            Register via External Link
          </a>
          <div className="eventRegDivider" style={{ textAlign: "center" }}>
            <div className="eventRegDividerLine" />
            <span className="eventRegDividerText">or</span>
            <div className="eventRegDividerLine" />
          </div>
        </>
      )}
{!event.registrationUrl && (
  <>
    <button
      className="eventCtaPrimary"
      type="button"
      onClick={() => {
        setShowForm(true);
      }}
    >
      <Send size={13} strokeWidth={1.75} />
      Apply here
    </button>
    <ApplyModal
      isOpen={showForm}
      onClose={() => setShowForm(false)}
      jobTitle={event.title}
      companyName={event.publisherName}
      listingId={event.id}
      listingType="event"
    />
  </>
)}
      <button className="eventCtaSecondary" type="button" onClick={handleShare} style={{ marginTop: "8px" }}>
        <Share2 size={14} strokeWidth={1.75} />
        Share Event
      </button>
    </>
  );
})()}
              </div>

              {/* Organizer Card – with login blur on contact details (identical logic) */}
              <div className="eventInfoCard eventInfoCard--organizer">
                <div className="eventInfoBlock">
<div className="eventInfoBlockTitle eventInfoBlockTitle--center">
  <span className="eventInfoBlockIcon">
    <Building2 size={14} strokeWidth={2} />
  </span>
  Company Details
</div>

                  {/* Blurred contact content */}
                  <div className={`eventContactContent ${!user ? "eventBlurred" : ""}`}>
                    {event.organization && (
                      <div className="eventInfoLine">
                        <span className="eventRegIcon"><Building2 size={13} strokeWidth={1.75} /></span>
                        <div className="eventRegMeta">
                          <span className="eventRegLabel">Company Name</span>
                          <span className="eventRegValue">{event.organization}</span>
                        </div>
                      </div>
                    )}

                    {event.organizerContact && (
                      <div className="eventInfoLine">
                        <span className="eventRegIcon"><Users size={13} strokeWidth={1.75} /></span>
                        <div className="eventRegMeta">
                          <span className="eventRegLabel">Contact Person</span>
                          <span className="eventRegValue">{event.organizerContact}</span>
                        </div>
                      </div>
                    )}

                    {event.phoneNumber && (
                      <div className="eventInfoLine">
                        <span className="eventRegIcon"><Phone size={13} strokeWidth={1.75} /></span>
                        <div className="eventRegMeta">
                          <span className="eventRegLabel">Phone</span>
                          <a href={`tel:${event.phoneNumber}`} className="eventInfoLineLink eventRegValue">
                            {event.phoneNumber}
                          </a>
                        </div>
                      </div>
                    )}

                    {event.workEmail && (
                      <div className="eventInfoLine">
                        <span className="eventRegIcon"><Mail size={13} strokeWidth={1.75} /></span>
                        <div className="eventRegMeta">
                          <span className="eventRegLabel">Email</span>
                          <a href={`mailto:${event.workEmail}`} className="eventInfoLineLink eventRegValue">
                            {event.workEmail}
                          </a>
                        </div>
                      </div>
                    )}

                    {event.organizationWebsite && (
                      <div className="eventInfoLine">
                        <span className="eventRegIcon"><Globe size={13} strokeWidth={1.75} /></span>
                        <div className="eventRegMeta">
                          <span className="eventRegLabel">Website</span>
                          <a
                            href={event.organizationWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="eventInfoLineLink eventRegValue"
                          >
                            {event.organizationWebsite.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Blur overlay (only for non-logged-in users) */}
                  {!user && (
                    <div className="eventBlurOverlay">
                      <div className="eventBlurCard">
                        <User size={24} color="#7c3aed" />
                        <p>Login to view contact details</p>
                        <a href="/login" className="eventBlurLogin">
                          Login <ChevronRight size={14} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Registration Card */}
{/* Registration Card */}
{event.registrationType && (
  <div className="eventInfoCard eventInfoCard--register">
    <div className="eventInfoBlock">
      <div className="eventInfoBlockTitle eventInfoBlockTitle--center">
        <span className="eventInfoBlockIcon"><Ticket size={14} strokeWidth={2} /></span>
        Price
      </div>

      <div className="eventRegGrid">
        <div className="eventRegRow">
          <span className="eventRegIcon"><Tag size={13} strokeWidth={1.75} /></span>
          <div className="eventRegMeta">
            <span className="eventRegLabel">Type</span>
            <span className="eventRegValue">{event.registrationType}</span>
          </div>
        </div>

        {event.registrationDeadline && (
          <div className="eventRegRow">
            <span className="eventRegIcon"><CalendarClock size={13} strokeWidth={1.75} /></span>
            <div className="eventRegMeta">
              <span className="eventRegLabel">Deadline</span>
              <span className="eventRegValue">{event.registrationDeadline}</span>
            </div>
          </div>
        )}
      </div>

      {/* Pricing tiers span full width below the grid */}
      {event.ticketPricingTiers?.length > 0 ? (
        <div className="eventRegRow eventRegRow--full">
          <span className="eventRegIcon"><Layers size={13} strokeWidth={1.75} /></span>
          <div className="eventRegMeta" style={{ width: "100%" }}>
            <span className="eventRegLabel">Pricing Tiers</span>
            <div className="eventTierList">
              {event.ticketPricingTiers.map((tier) => (
                <div key={tier._id} className="eventTierRow">
                  <span className="eventTierLabel">{tier.label}</span>
                  <span className="eventTierPrice">₹{tier.price.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : event.registrationPrice !== null && event.registrationPrice > 0 ? (
        <div className="eventRegRow eventRegRow--full">
          <span className="eventRegIcon"><IndianRupee size={13} strokeWidth={1.75} /></span>
          <div className="eventRegMeta">
            <span className="eventRegLabel">Price</span>
            <span className="eventRegValue">₹{event.registrationPrice}</span>
          </div>
        </div>
      ) : null}
    </div>
  </div>
)}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}