"use client";

import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Link from "next/link";
import Image from "next/image";
import api from "@/app/api";
import { useAuth } from "@/context/AuthContext";
import "./productdetail.css";
import { useState, useEffect } from "react";
import ProductCarousel from "@/components/uiElements/ProductCarousel";
import { TrackProductAppyClick } from "@/app/apiServices/publicapi";
import {
  ArrowLeft,
  Tag,
  Share2,
  ExternalLink,
  Building2,
  Globe,
  Cpu,
  Lightbulb,
  Info,
  BookOpen,
  Wrench,
  FlaskConical,
  User,
  Phone,
  Mail,
  ShieldCheck,
  PackageCheck,
  Layers,
  Sparkles,
  ChevronRight,
  Calendar,
  Target,
  Trophy
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page({ params }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchProduct = async () => {
      const { id } = await params;
      try {
        const response = await api.get(`/api/publisher/innovation-products/sorted`);
        const products = response.data?.products ?? [];
        const found = products.find((p) => p._id === id) ?? null;
        setProduct(found);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params]);

  if (loading || authLoading || !user) {
    return (
      <main>
        <div className="pdp-page">
          <div className="pdp-container mt-30">
            <div style={{ textAlign: "center", padding: "120px 0" }}>
              <p style={{ color: "var(--sdp-text-muted)", fontSize: "14px" }}>Loading product…</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main>
       <div className="pdp-page">
  <div className="pdp-container mt-30">
            <div className="pdp-notFoundWrap">
              <h2>Product Not Found</h2>
              <p>This listing may have been removed or is unavailable.</p>
              <Link href="/products" className="btn-five">
                ← Browse All Products
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product?.productName, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const postedDate = product.createdAt
    ? new Date(product.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const ctaHref = product.websiteUrl || product.productDemoUrl || null;
  const ctaLabel = product.websiteUrl
    ? "Visit Product"
    : product.productDemoUrl
    ? "View Demo"
    : null;

  const hasImages = product.productImages && product.productImages.length > 0;
  const hasLogo = product.productLogo?.url;

  return (
    <main>
      <div className="pdp-page">
        <div className="pdp-container mt-30">
          <Breadcrumb title="Products" dynamicTitle={product?.productName} />

          {/* Back Link */}
          <Link href="/products" className="pdp-backLink">
            <ArrowLeft size={14} strokeWidth={2} />
            All Products
          </Link>

          {/* Hero Section */}
          {hasImages && (
            <div className="pdp-hero">
              <div className="pdp-carouselWrap">
                <ProductCarousel
                  images={product.productImages}
                  productName={product.productName}
                  fallbackLogo={hasLogo}
                />
              </div>
            </div>
          )}

          {/* Hero Info */}
          <div className="pdp-heroInfo">
            <div className="pdp-heroLogo">
              {hasLogo ? (
                <img
                  src={product.productLogo.url}
                  alt={`${product.productName} logo`}
                  className="pdp-heroLogoImg"
                />
              ) : (
                <div className="pdp-heroLogoFallback">
                  {product.productName?.charAt(0).toUpperCase() || "?"}
                </div>
              )}
            </div>

            <div className="pdp-heroContent">
              <div className="pdp-heroBrandRow">
                {product.companyName && (
                  <span className="pdp-heroCompanyBadge">
                    <Building2 size={12} strokeWidth={2} />
                    {product.companyName}
                  </span>
                )}
                {product.innovationCategory && (
                  <>
                    <span className="pdp-heroDivider" />
                    <span className="pdp-heroCategory">{product.innovationCategory}</span>
                  </>
                )}
              </div>

              <h1 className="pdp-heroName">{product.productName}</h1>

              {product.brandName && product.brandName !== product.companyName && (
                <p className="pdp-heroSub">by {product.brandName}</p>
              )}
            </div>
          </div>

          {/* Two-Column Layout */}
          <div className="pdp-layout">

            {/* LEFT COLUMN */}
            <div className="pdp-left">

              {/* Product Overview */}
              <div className="pdp-card">
                <div className="pdp-sectionHeader">
                  <div className="pdp-sectionIcon"><Info size={15} strokeWidth={1.8} /></div>
                  <h2 className="pdp-sectionTitle">Product Overview</h2>
                </div>
                <div className="pdp-metaGrid">
                  {product.brandName && (
                    <div className="pdp-metaItem">
                      <span className="pdp-metaLabel">Brand Name</span>
                      <span className="pdp-metaValue">{product.brandName}</span>
                    </div>
                  )}
                  {product.innovationCategory && (
                    <div className="pdp-metaItem">
                      <span className="pdp-metaLabel">Product Category</span>
                      <span className="pdp-metaValue pdp-metaValue--blue">{product.innovationCategory}</span>
                    </div>
                  )}
                  {product.technology && (
                    <div className="pdp-metaItem">
                      <span className="pdp-metaLabel">Technology</span>
                      <span className="pdp-metaValue">{product.technology}</span>
                    </div>
                  )}
                  {product.targetIndustry && (
                    <div className="pdp-metaItem">
                      <span className="pdp-metaLabel">Target Industry</span>
                      <span className="pdp-metaValue">{product.targetIndustry}</span>
                    </div>
                  )}
                  {postedDate && (
                    <div className="pdp-metaItem">
                      <span className="pdp-metaLabel">Listed On</span>
                      <span className="pdp-metaValue">{postedDate}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Short Description */}
              {product.shortProductDescription && (
                <div className="pdp-card">
                  <div className="pdp-sectionHeader">
                    <div className="pdp-sectionIcon">
                      <Sparkles size={15} strokeWidth={1.8} />
                    </div>
                    <h2 className="pdp-sectionTitle">Short Description</h2>
                  </div>
                  <div>
                    {product.shortProductDescription
                      .split("\n")
                      .filter(Boolean)
                      .map((para, i) => (
                        <p key={i} style={{ marginBottom: i < 2 ? "16px" : "12px" }}>
                          {para}
                        </p>
                      ))}
                  </div>
                </div>
              )}

              {/* Detailed Description */}
              {product.detailedDescription && (
                <div className="pdp-card">
                  <div className="pdp-sectionHeader">
                    <div className="pdp-sectionIcon"><BookOpen size={15} strokeWidth={1.8} /></div>
                    <h2 className="pdp-sectionTitle">Detailed Product Description</h2>
                  </div>
                  {product.detailedDescription.split("\n").filter(Boolean).map((para, i) => (
                    <p
                      key={i}
                      className={i === 0 ? "pdp-bodyLead" : "pdp-bodyText"}
                      style={{ marginBottom: "12px" }}
                    >
                      {para}
                    </p>
                  ))}
                </div>
              )}

              {/* Challenge Solved */}
              {product.challengeSolved && (
                <div className="pdp-card">
                  <div className="pdp-sectionHeader">
                    <div className="pdp-sectionIcon"><Wrench size={15} strokeWidth={1.8} /></div>
                    <h2 className="pdp-sectionTitle">Challenge Solved</h2>
                  </div>
                  <div className="pdp-problemCallout">
                    <div className="pdp-problemIcon">
                      <Info size={16} strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="pdp-problemText">{product.challengeSolved}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Features */}
              {product.keyFeatures && (
                <div className="pdp-card">
                  <div className="pdp-sectionHeader">
                    <div className="pdp-sectionIcon"><Lightbulb size={15} strokeWidth={1.8} /></div>
                    <h2 className="pdp-sectionTitle">Key Features</h2>
                  </div>
                  <ul className="pdp-featureList">
                    {product.keyFeatures.split(/\n|•/).filter(s => s.trim()).map((feat, i) => (
                      <li key={i} className="pdp-featureItem">
                        <span className="pdp-featureCheck">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="var(--blue-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="1.5,5 4,7.5 8.5,2.5" />
                          </svg>
                        </span>
                        <span className="pdp-featureText">{feat.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>

            {/* RIGHT SIDEBAR */}
            <div className="pdp-right">

              {/* CTA Card */}
              <div className="pdp-ctaCard">
                <p className="pdp-ctaTitle">Explore this Product</p>

                {ctaHref ? (
                  user ? (
                    <a
                      href={ctaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pdp-ctaPrimary"
                      onClick={() => TrackProductAppyClick(product._id).catch(() => {})}
                    >
                      <ExternalLink size={14} strokeWidth={2} />
                      {ctaLabel}
                    </a>
                  ) : (
                    <>
                      <button
                        className="pdp-ctaPrimary"
                        disabled
                        style={{ opacity: 0.5, cursor: "not-allowed", pointerEvents: "none" }}
                      >
                        <ExternalLink size={14} strokeWidth={2} />
                        {ctaLabel}
                      </button>
                      <a
                        href="/login"
                        className="pdp-ctaSecondary"
                        style={{ marginTop: "8px", textAlign: "center", justifyContent: "center" }}
                      >
                        <User size={14} strokeWidth={2} />
                        Login to Explore
                      </a>
                    </>
                  )
                ) : (
                  <button
                    className="pdp-ctaPrimary"
                    disabled
                    style={{ opacity: 0.6, cursor: "not-allowed" }}
                  >
                    <ExternalLink size={14} strokeWidth={2} />
                    No Link Available
                  </button>
                )}

                <button
                  className="pdp-ctaSecondary"
                  type="button"
                  onClick={handleShare}
                  style={{ marginTop: "8px" }}
                >
                  <Share2 size={14} strokeWidth={1.75} />
                  Share Product
                </button>
              </div>

              {/* Status Card */}
              {(product.innovationStatus || product.productStatus || product.patentStatus) && (
                <div className="pdp-infoCard pdp-infoCard--status">
                  <div className="pdp-infoBlock">
                    <div className="pdp-infoBlockTitle">
                      <span className="pdp-infoBlockIcon"><PackageCheck size={14} strokeWidth={2} /></span>
                      Status
                    </div>
                    {product.innovationStatus && (
                      <div className="pdp-regRow">
                        <span className="pdp-regIcon"><FlaskConical size={13} strokeWidth={1.75} /></span>
                        <div className="pdp-regMeta">
                          <span className="pdp-regLabel">Innovation Status</span>
                          <span className="pdp-regValue">{product.innovationStatus}</span>
                        </div>
                      </div>
                    )}
                    {product.productStatus && (
                      <div className="pdp-regRow">
                        <span className="pdp-regIcon"><Layers size={13} strokeWidth={1.75} /></span>
                        <div className="pdp-regMeta">
                          <span className="pdp-regLabel">Product Status</span>
                          <span className="pdp-regValue">{product.productStatus}</span>
                        </div>
                      </div>
                    )}
                    {product.patentStatus && (
                      <div className="pdp-regRow">
                        <span className="pdp-regIcon"><ShieldCheck size={13} strokeWidth={1.75} /></span>
                        <div className="pdp-regMeta">
                          <span className="pdp-regLabel">Patent Status</span>
                          <span className="pdp-regValue">{product.patentStatus}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Company Card */}
              {(product.companyName || product.establishedYear) && (
                <div className="pdp-infoCard pdp-infoCard--company">
                  <div className="pdp-infoBlock">
                    <div className="pdp-infoBlockTitle">
                      <span className="pdp-infoBlockIcon"><Building2 size={14} strokeWidth={2} /></span>
                      Company
                    </div>
                    {product.companyName && (
                      <div className="pdp-regRow">
                        <span className="pdp-regIcon"><Building2 size={13} strokeWidth={1.75} /></span>
                        <div className="pdp-regMeta">
                          <span className="pdp-regLabel">Name</span>
                          <span className="pdp-regValue">{product.companyName}</span>
                        </div>
                      </div>
                    )}
                    {product.establishedYear && (
                      <div className="pdp-regRow">
                        <span className="pdp-regIcon"><Info size={13} strokeWidth={1.75} /></span>
                        <div className="pdp-regMeta">
                          <span className="pdp-regLabel">Established In</span>
                          <span className="pdp-regValue">{product.establishedYear}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Awards & Recognition Card */}
              {product.awardsRecognition && (
                <div className="pdp-infoCard pdp-infoCard--awards">
                  <div className="pdp-infoBlock">
                    <div className="pdp-infoBlockTitle">
                      <span className="pdp-infoBlockIcon"><Trophy size={14} strokeWidth={2} /></span>
                      Awards &amp; Recognition
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
                      {product.awardsRecognition
                        .split("\n")
                        .map(s => s.replace(/^[•*\-–]\s*/, "").trim())
                        .filter(Boolean)
                        .map((award, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "10px",
                              padding: "8px 10px",
                              borderRadius: "8px",
                              background: "rgba(252, 207, 2, 0.08)",
                              border: "1px solid rgba(252, 207, 2, 0.25)",
                            }}
                          >
                            <span style={{ flexShrink: 0, marginTop: "1px", color: "#ca8a04" }}>
                              <Trophy size={13} strokeWidth={2} />
                            </span>
                            <span style={{
                              fontSize: "0.8rem",
                              color: "var(--sdp-text, #1e293b)",
                              lineHeight: 1.5,
                              fontWeight: 500,
                            }}>
                              {award}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Card */}
              {(product.founderName || product.contactEmail || product.contactNumber) && (
                <div className="pdp-infoCard pdp-infoCard--contact">
                  <div className="pdp-infoBlock">
                    <div className="pdp-infoBlockTitle">
                      <span className="pdp-infoBlockIcon"><User size={14} strokeWidth={2} /></span>
                      Contact Details
                    </div>

                    <div className={`pdp-contactContent ${!user ? "pdp-blurred" : ""}`}>
                      <div className="pdp-contactRow">
                        <div className="pdp-contactAvatar">
                          {product.founderName?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div>
                          {product.founderName && (
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                              <User size={12} strokeWidth={1.75} />
                              <p className="pdp-contactName">{product.founderName}</p>
                            </div>
                          )}
                          <div className="pdp-contactMeta">
                            {product.contactEmail && (
                              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <Mail size={12} strokeWidth={1.75} />
                                {product.contactEmail}
                              </div>
                            )}
                            {product.contactNumber && (
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                                <Phone size={12} strokeWidth={1.75} />
                                {product.contactNumber}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {!user && (
                      <div className="pdp-blurOverlay">
                        <div className="pdp-blurCard">
                          <User size={24} color="#7c3aed" />
                          <p>Login to view contact details</p>
                          <a href="/login" className="pdp-blurLogin">
                            Login <ChevronRight size={14} />
                          </a>
                        </div>
                      </div>
                    )}
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