"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/app/api";
import { useAuth } from "@/context/AuthContext";
import "../services.css";
import {
  ArrowLeft,
  FileText,
  CheckSquare,
  Info,
  Users,
  MapPin,
  Building2,
  ClipboardList,
  Mail,
  Phone,
  Globe,
  Share2,
  ExternalLink,
  Tag,
  Clock,
  Send,
  Briefcase,
  User,
  ChevronRight
} from "lucide-react";
import ApplyModal from "@/components/uiElements/ApplyModal";
import ProductCarousel from "@/components/uiElements/ProductCarousel";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

const toList = (str) => {
  if (!str) return [];
  const delimiter = str.includes("\n") ? /\n/ : /,/;
  return str
    .split(delimiter)
    .map((s) => s.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
};

export default function ServicePage({ params }) {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [id, setId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchService = async () => {
      const { id } = await params;
      setId(id);
      try {
        const res = await api.get(`/api/publisher/service-listings/${id}`);
        const data = res.data?.listing || res.data || null;
        setCompany(data);
      } catch (err) {
        console.error("Failed to fetch listing:", err?.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [params]);

  useEffect(() => {
  sessionStorage.setItem("refreshHome", "true");
}, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: company?.serviceTitle, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <main>
        <div className="svd-page">
          <div className="svd-container" style={{ display: "flex", justifyContent: "center", paddingTop: "80px" }}>
            <p style={{ color: "var(--svd-text-muted)", fontSize: "14px" }}>Loading service…</p>
          </div>
        </div>
      </main>
    );
  }

  if (!company) {
    return (
      <main>
        <div className="svd-page">
          <div className="svd-container">
            <div className="svd-notfound">
              <h2>Service Not Found</h2>
              <p>The listing you&apos;re looking for doesn&apos;t exist or has been removed.</p>
              <Link href="/services" className="svd-btn">← Browse All Services</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const serviceImages = (company.serviceImages || []).filter((img) => img?.url);

  return (
    <main>
      <div className="svd-page">
        <div className="svd-container mt-30">
          <Breadcrumb title="Services" dynamicTitle={company?.serviceTitle} />
          {/*  Back Link  */}
          <Link href="/services" className="svd-back">
            <ArrowLeft size={14} strokeWidth={2} />
            All Services
          </Link>

          {serviceImages.length > 0 && (
            <div className="svd-hero-media">
              <ProductCarousel
                images={serviceImages}
                productName={company.serviceTitle}
              />
            </div>
          )}

          {/*  Hero Metadata  */}
          <div className="svd-hero-info">
            <div className="svd-hero-info__top">
              <div className="svd-hero-info__left">
                <h1>{company.serviceTitle}</h1>
                <div className="svd-org">
                  <div className="svd-org__avatar">
                    {(company.brandName || company.companyName || "S").charAt(0)}
                  </div>
                  <span className="svd-org__name">
                    by <strong>{company.companyName}</strong>
                    {company.establishedYear && (
                      <span style={{ fontWeight: 800, color: "#888", marginLeft: 6 }}>
                        · Established. {company.establishedYear}
                      </span>
                    )}
                  </span>
                </div>
              </div>
              <div className="svd-hero-info__right">
                {company.serviceType && (
                  <span className="svd-badge">{company.serviceType}</span>
                )}
              </div>
            </div>

            {/* Stats strip */}
            <div className="svd-stats">
              {company.brandName && (
                <div className="svd-stat">
                  <span className="svd-stat__icon svd-stat__icon--date">
                    <Tag size={15} strokeWidth={1.8} />
                  </span>
                  <div className="svd-stat__meta">
                    <span className="svd-stat__label">Brand Name</span>
                    <span className="svd-stat__value">{company.brandName}</span>
                  </div>
                </div>
              )}
              {company.serviceArea && (
                <div className="svd-stat">
                  <span className="svd-stat__icon svd-stat__icon--loc">
                    <MapPin size={15} strokeWidth={1.8} />
                  </span>
                  <div className="svd-stat__meta">
                    <span className="svd-stat__label">Service Area</span>
                    <span className="svd-stat__value">{company.serviceArea}</span>
                  </div>
                </div>
              )}
              {/* {company.teamSize && (
                <div className="svd-stat">
                  <span className="svd-stat__icon svd-stat__icon--reg">
                    <Users size={15} strokeWidth={1.8} />
                  </span>
                  <div className="svd-stat__meta">
                    <span className="svd-stat__label">Team Size</span>
                    <span className="svd-stat__value">{company.teamSize}</span>
                  </div>
                </div>
              )} */}
              {company.targetIndustry && (
                <div className="svd-stat">
                  <span className="svd-stat__icon svd-stat__icon--date">
                    <Briefcase size={15} strokeWidth={1.8} />
                  </span>
                  <div className="svd-stat__meta">
                    <span className="svd-stat__label">Target Industry</span>
                    <span className="svd-stat__value">{company.targetIndustry}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="svd-layout">

            {/*  LEFT COLUMN  */}
            <div className="svd-layout__main">
              {company.detailedDescription && (
                <div className="svd-card">
                  <div className="svd-section__head">
                    <div className="svd-section__icon"><FileText size={15} strokeWidth={1.8} /></div>
                    <h2 className="svd-section__title">Description</h2>
                  </div>
                  {company.detailedDescription
                    .split("\n")
                    .filter(Boolean)
                    .map((para, i, arr) => (
                      <p
                        key={i}
                        className="svd-body"
                        style={{ marginBottom: i < arr.length - 1 ? "12px" : 0 }}
                      >
                        {para}
                      </p>
                    ))}
                </div>
              )}
              {(company.serviceType || company.serviceArea || company.teamSize || company.certifications) && (
                <div className="svd-card">
                  <div className="svd-section__head">
                    <div className="svd-section__icon"><Info size={15} strokeWidth={1.8} /></div>
                    <h2 className="svd-section__title">Service Information</h2>
                  </div>
                  <div className="svd-meta-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
                    {company.serviceType && (
                      <div className="svd-meta">
                        <span className="svd-meta__label">Service Type</span>
                        <span className="svd-meta__value">{company.serviceType}</span>
                      </div>
                    )}
                    {company.serviceArea && (
                      <div className="svd-meta">
                        <span className="svd-meta__label">Service Area</span>
                        <span className="svd-meta__value">{company.serviceArea}</span>
                      </div>
                    )}
                   {company.establishedYear && (
                      <div className="svd-meta">
                        <span className="svd-meta__label">Established Year</span>
                        <span className="svd-meta__value">{company.establishedYear}</span>
                      </div>
                    )}
                    {company.teamSize && (
                      <div className="svd-meta">
                        <span className="svd-meta__label">Team Size</span>
                        <span className="svd-meta__value">{company.teamSize}</span>
                      </div>
                    )}
                    {company.certifications && (
                      <div className="svd-meta">
                        <span className="svd-meta__label">Certifications</span>
                        <span className="svd-meta__value">{company.certifications}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {company.benefits && (
                <div className="svd-card">
                  <div className="svd-section__head">
                    <div className="svd-section__icon"><CheckSquare size={15} strokeWidth={1.8} /></div>
                    <h2 className="svd-section__title">Benefits &amp; Key Features</h2>
                  </div>
                  <div className="svd-benefits">
                    {company.benefits
                      .split(/\n/)
                      .map((item) => item.replace(/^[-•*]\s*/, "").trim())
                      .filter(Boolean)
                      .map((item, i) => (
                        <div key={i} className="svd-benefit">
                          <span className="svd-benefit__dot" />
                          <span className="svd-benefit__text">{item}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}



              {(company.targetIndustry || company.serviceCategory) && (
                <div className="svd-card">
                  <div className="svd-section__head">
                    <div className="svd-section__icon"><Users size={15} strokeWidth={1.8} /></div>
                    <h2 className="svd-section__title">Industry &amp; Categories</h2>
                  </div>

                  {toList(company.targetIndustry).length > 0 && (
                    <div className="svd-audience">
                      <span className="svd-audience__label">Target Industry</span>
                      <div className="svd-tags">
                        {toList(company.targetIndustry).map((tag, i) => (
                          <span key={i} className="svd-tag--audience">
                            <Briefcase size={11} strokeWidth={2} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {toList(company.serviceCategory).length > 0 && (
                    <div className="svd-audience" style={{ marginBottom: 0 }}>
                      <span className="svd-audience__label">Categories</span>
                      <div className="svd-tags">
                        {toList(company.serviceCategory).map((tag, i) => (
                          <span key={i} className="svd-tag--topic">
                            <Tag size={11} strokeWidth={2} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/*  RIGHT SIDEBAR  */}
            <div className="svd-layout__side">
              {/* CTA Card */}
<div className="svd-cta">
  <p className="svd-cta__title">Ready to Connect?</p>
  <p className="svd-cta__sub">Get in touch with this service provider</p>
 
  {company.websiteUrl && (
    user ? (
      <a href={company.websiteUrl} target="_blank" rel="noopener noreferrer" className="svd-cta__btn-primary">
        <ExternalLink size={14} strokeWidth={2} />
        Visit Website
      </a>
    ) : (
      <button
        className="svd-cta__btn-primary"
        disabled
        style={{ opacity: 0.5, cursor: "not-allowed", pointerEvents: "none" }}
      >
        <ExternalLink size={14} strokeWidth={2} />
        Visit Website
      </button>
    )
  )}
 
  {/* Apply Here — disabled if not logged in */}
  {user ? (
    <>
      {company.websiteUrl && company.contactEmail && (
        <div className="svd-divider" style={{ textAlign: "center" }}>
          <div className="svd-divider__line" />
          <span className="svd-divider__text">or</span>
          <div className="svd-divider__line" />
        </div>
      )}
      <button className="svd-cta__btn-primary" type="button" onClick={() => setModalOpen(true)}>
        <Send size={13} strokeWidth={1.75} />
        Apply here
      </button>
    </>
  ) : (
    <>
      {company.websiteUrl && (
        <div className="svd-divider" style={{ textAlign: "center" }}>
          <div className="svd-divider__line" />
          <span className="svd-divider__text">or</span>
          <div className="svd-divider__line" />
        </div>
      )}
      <button
        className="svd-cta__btn-primary"
        disabled
        style={{ opacity: 0.5, cursor: "not-allowed", pointerEvents: "none" }}
      >
        <Send size={13} strokeWidth={1.75} />
        Apply here
      </button>
      <a
        href="/login"
        className="svd-cta__btn-secondary"
        style={{ marginTop: "8px", textAlign: "center", justifyContent: "center" }}
      >
        <User size={14} strokeWidth={2} />
        Login to Continue
      </a>
    </>
  )}
 
  <ApplyModal
    isOpen={modalOpen}
    onClose={() => setModalOpen(false)}
    jobTitle={company.serviceTitle}
    companyName={company.companyName}
    listingId={id}
    listingType="services"
  />
 
  <button className="svd-cta__btn-secondary" type="button" onClick={handleShare} style={{ marginTop: "8px" }}>
    <Share2 size={14} strokeWidth={1.75} />
    Share Listing
  </button>
</div>

              {/* Service Area */}
              {company.serviceArea && (
                <div className="svd-info">
                  <div className="svd-info__block">
                    <div className="svd-info__title">
                      <span className="svd-info__icon"><MapPin size={14} strokeWidth={2} /></span>
                      Service Area
                    </div>
                    <div className="svd-info__line">
                      <span className="svd-reg__icon"><MapPin size={13} strokeWidth={1.75} /></span>
                      <span className="svd-reg__value">{company.serviceArea}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Company Details – with login blur on contact details */}
              <div className="svd-info">
                <div className="svd-info__block">
                  <div className="svd-info__title">
                    <span className="svd-info__icon"><Building2 size={14} strokeWidth={2} /></span>
                    Company Details
                  </div>

                  <div className={`svd-contact ${!user ? "svd-contact--blurred" : ""}`}>
                    {company.companyName && (
                      <div className="svd-reg">
                        <span className="svd-reg__icon"><Building2 size={13} strokeWidth={1.75} /></span>
                        <div className="svd-reg__meta">
                          <span className="svd-reg__label">Company Name</span>
                          <span className="svd-reg__value">{company.companyName}</span>
                        </div>
                      </div>
                    )}

                    {company.brandName && (
                      <div className="svd-reg">
                        <span className="svd-reg__icon"><Tag size={13} strokeWidth={1.75} /></span>
                        <div className="svd-reg__meta">
                          <span className="svd-reg__label">Brand Name</span>
                          <span className="svd-reg__value">{company.brandName}</span>
                        </div>
                      </div>
                    )}

                    {company.establishedYear && (
                      <div className="svd-reg">
                        <span className="svd-reg__icon"><Clock size={13} strokeWidth={1.75} /></span>
                        <div className="svd-reg__meta">
                          <span className="svd-reg__label">Established</span>
                          <span className="svd-reg__value">{company.establishedYear}</span>
                        </div>
                      </div>
                    )}

                    {company.contactEmail && (
                      <div className="svd-reg">
                        <span className="svd-reg__icon"><Mail size={13} strokeWidth={1.75} /></span>
                        <div className="svd-reg__meta">
                          <span className="svd-reg__label">Email</span>
                          <a href={`mailto:${company.contactEmail}`} className="svd-link">
                            {company.contactEmail}
                          </a>
                        </div>
                      </div>
                    )}

                    {company.contactNumber && (
                      <div className="svd-reg">
                        <span className="svd-reg__icon"><Phone size={13} strokeWidth={1.75} /></span>
                        <div className="svd-reg__meta">
                          <span className="svd-reg__label">Phone</span>
                          <a href={`tel:${company.contactNumber}`} className="svd-link">
                            {company.contactNumber}
                          </a>
                        </div>
                      </div>
                    )}

                    {company.contactAddress && (
                      <div className="svd-reg">
                        <span className="svd-reg__icon"><MapPin size={13} strokeWidth={1.75} /></span>
                        <div className="svd-reg__meta">
                          <span className="svd-reg__label">Address</span>
                          <span className="svd-reg__value">{company.contactAddress}</span>
                        </div>
                      </div>
                    )}

                    {company.websiteUrl && (
                      <div className="svd-reg">
                        <span className="svd-reg__icon"><Globe size={13} strokeWidth={1.75} /></span>
                        <div className="svd-reg__meta">
                          <span className="svd-reg__label">Website</span>
                          <a
                            href={company.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="svd-link"
                          >
                            {company.websiteUrl.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {!user && (
                    <div className="svd-blur">
                      <div className="svd-blur__card">
                        <User size={24} color="#7c3aed" />
                        <p>Login to view contact details</p>
                        <a href="/login" className="svd-blur__login">
                          Login <ChevronRight size={14} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Type card */}
              <div className="svd-info">
                <div className="svd-info__block">
                  <div className="svd-info__title">
                    <span className="svd-info__icon"><ClipboardList size={14} strokeWidth={2} /></span>
                    Service Type
                  </div>
                  {company.serviceType && (
                    <div className="svd-reg">
                      <span className="svd-reg__icon"><Tag size={13} strokeWidth={1.75} /></span>
                      <div className="svd-reg__meta">
                        <span className="svd-reg__label">Type</span>
                        <span className="svd-reg__value">{company.serviceType}</span>
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