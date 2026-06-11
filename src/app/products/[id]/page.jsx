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
  const { user } = useAuth();
const router = useRouter(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

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

  if (loading || !user) {
    return (
      <main>
        <div className="productDetailPage">
          <div className="container">
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
        <div className="productDetailPage">
          <div className="container">
            <div className="notFoundWrap">
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
      navigator.share({ title: event?.title, url: window.location.href });
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
      <div className="productDetailPage">
        <div className="container mt-30">
          <Breadcrumb title="Products" dynamicTitle={product?.productName} />

          {/*  Back Link  */}
          <Link href="/products" className="backLink">
            <ArrowLeft size={14} strokeWidth={2} />
            All Products
          </Link>

          {/*  Hero Section  */}
          {hasImages && (
            <div className="pdHero">
              <div className="pdCarouselWrap">
                <ProductCarousel
                  images={product.productImages}
                  productName={product.productName}
                  fallbackLogo={hasLogo}
                />
              </div>
            </div>
          )}

          {/*  Hero Info  */}
          <div className="pdHeroInfo">
            <div className="pdHeroLogo">
              {hasLogo ? (
                <img
                  src={product.productLogo.url}
                  alt={`${product.productName} logo`}
                  className="pdHeroLogoImg"
                />
              ) : (
                <div className="pdHeroLogoFallback">
                  {product.productName?.charAt(0).toUpperCase() || "?"}
                </div>
              )}
            </div>

            <div className="pdHeroContent">
              <div className="pdHeroBrandRow">
                {product.companyName && (
                  <span className="pdHeroCompanyBadge">
                    <Building2 size={12} strokeWidth={2} />
                    {product.companyName}
                  </span>
                )}
                {product.innovationCategory && (
                  <>
                    <span className="pdHeroDivider" />
                    <span className="pdHeroCategory">{product.innovationCategory}</span>
                  </>
                )}
              </div>

              <h1 className="pdHeroName">{product.productName}</h1>

              {product.brandName && product.brandName !== product.companyName && (
                <p className="pdHeroSub">by {product.brandName}</p>
              )}
            </div>
          </div>

          {/*  Two-Column Layout  */}
          <div className="pdLayout">

            {/*  LEFT COLUMN  */}
            <div className="pdLeft">
              {/*  Product Overview (matches Event Information card)  */}
              <div className="sdpCard">
                <div className="sdpSectionHeader">
                  <div className="sdpSectionIcon"><Info size={15} strokeWidth={1.8} /></div>
                  <h2 className="sdpSectionTitle">Product Overview</h2>
                </div>
                <div className="sdpMetaGrid">
                  {product.brandName && (
                    <div className="sdpMetaItem">
                      <span className="sdpMetaLabel">Brand Name</span>
                      <span className="sdpMetaValue">{product.brandName}</span>
                    </div>
                  )}
                  {product.innovationCategory && (
                    <div className="sdpMetaItem">
                      <span className="sdpMetaLabel">Innovation Category</span>
                      <span className="sdpMetaValue sdpMetaValue--blue">{product.innovationCategory}</span>
                    </div>
                  )}
                  {product.technology && (
                    <div className="sdpMetaItem">
                      <span className="sdpMetaLabel">Technology</span>
                      <span className="sdpMetaValue">{product.technology}</span>
                    </div>
                  )}
                  {product.targetIndustry && (
                    <div className="sdpMetaItem">
                      <span className="sdpMetaLabel">Target Industry</span>
                      <span className="sdpMetaValue">{product.targetIndustry}</span>
                    </div>
                  )}
                  {postedDate && (
                    <div className="sdpMetaItem">
                      <span className="sdpMetaLabel">Listed On</span>
                      <span className="sdpMetaValue">{postedDate}</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Short Description */}
              {product.shortProductDescription && (
                <div className="sdpCard">
                  <div className="sdpSectionHeader">
                    <div className="sdpSectionIcon">
                      <Sparkles size={15} strokeWidth={1.8} />
                    </div>
                    <h2 className="sdpSectionTitle">Short Description</h2>
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
                <div className="sdpCard">
                  <div className="sdpSectionHeader">
                    <div className="sdpSectionIcon"><BookOpen size={15} strokeWidth={1.8} /></div>
                    <h2 className="sdpSectionTitle">Detailed Product Description</h2>
                  </div>
                  {product.detailedDescription.split("\n").filter(Boolean).map((para, i) => (
                    <p key={i} className={i === 0 ? "sdpBodyLead" : "sdpBodyText"} style={{ marginBottom: "12px" }}>
                      {para}
                    </p>
                  ))}
                </div>
              )}

              {/* Problem it solves */}
              {product.challengeSolved && (
                <div className="sdpCard">
                  <div className="sdpSectionHeader">
                    <div className="sdpSectionIcon"><Wrench size={15} strokeWidth={1.8} /></div>
                    <h2 className="sdpSectionTitle">Challenge Solved</h2>
                  </div>
                  <div className="sdpProblemCallout">
                    <div className="sdpProblemIcon">
                      <Info size={16} strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="sdpProblemText">{product.challengeSolved}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Features */}
              {product.keyFeatures && (
                <div className="sdpCard">
                  <div className="sdpSectionHeader">
                    <div className="sdpSectionIcon"><Lightbulb size={15} strokeWidth={1.8} /></div>
                    <h2 className="sdpSectionTitle">Key features</h2>
                  </div>
                  <ul className="sdpFeatureList">
                    {product.keyFeatures.split(/\n|•/).filter(s => s.trim()).map((feat, i) => (
                      <li key={i} className="sdpFeatureItem">
                        <span className="sdpFeatureCheck">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="var(--blue-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="1.5,5 4,7.5 8.5,2.5" />
                          </svg>
                        </span>
                        <span className="sdpFeatureText">{feat.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>

            {/*  RIGHT SIDEBAR  */}
            <div className="pdRight">

              {/* CTA Card */}
{/* CTA Card */}
<div className="sdpCtaCard">
  <p className="sdpCtaTitle">Explore this Product</p>

  {ctaHref ? (
    user ? (
      <a
        href={ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className="sdpCtaPrimary"
        onClick={() => TrackProductAppyClick(product._id).catch(() => {})}
      >
        <ExternalLink size={14} strokeWidth={2} />
        {ctaLabel}
      </a>
    ) : (
      <>
        <button
          className="sdpCtaPrimary"
          disabled
          style={{ opacity: 0.5, cursor: "not-allowed", pointerEvents: "none" }}
        >
          <ExternalLink size={14} strokeWidth={2} />
          {ctaLabel}
        </button>
        <a
          href="/login"
          className="sdpCtaSecondary"
          style={{ marginTop: "8px", textAlign: "center", justifyContent: "center" }}
        >
          <User size={14} strokeWidth={2} />
          Login to Explore
        </a>
      </>
    )
  ) : (
    <button
      className="sdpCtaPrimary"
      disabled
      style={{ opacity: 0.6, cursor: "not-allowed" }}
    >
      <ExternalLink size={14} strokeWidth={2} />
      No Link Available
    </button>
  )}

  <button
    className="sdpCtaSecondary"
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
                <div className="sdpInfoCard sdpInfoCard--status">
                  <div className="sdpInfoBlock">
                    <div className="sdpInfoBlockTitle">
                      <span className="sdpInfoBlockIcon"><PackageCheck size={14} strokeWidth={2} /></span>
                      Status
                    </div>
                    {product.innovationStatus && (
                      <div className="sdpRegRow">
                        <span className="sdpRegIcon"><FlaskConical size={13} strokeWidth={1.75} /></span>
                        <div className="sdpRegMeta">
                          <span className="sdpRegLabel">Innovation Status</span>
                          <span className="sdpRegValue">{product.innovationStatus}</span>
                        </div>
                      </div>
                    )}
                    {product.productStatus && (
                      <div className="sdpRegRow">
                        <span className="sdpRegIcon"><Layers size={13} strokeWidth={1.75} /></span>
                        <div className="sdpRegMeta">
                          <span className="sdpRegLabel">Product Status</span>
                          <span className="sdpRegValue">{product.productStatus}</span>
                        </div>
                      </div>
                    )}
                    {product.patentStatus && (
                      <div className="sdpRegRow">
                        <span className="sdpRegIcon"><ShieldCheck size={13} strokeWidth={1.75} /></span>
                        <div className="sdpRegMeta">
                          <span className="sdpRegLabel">Patent Status</span>
                          <span className="sdpRegValue">{product.patentStatus}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Company Card */}
              {(product.companyName || product.establishedYear || product.companyInstitution) && (
                <div className="sdpInfoCard sdpInfoCard--company">
                  <div className="sdpInfoBlock">
                    <div className="sdpInfoBlockTitle">
                      <span className="sdpInfoBlockIcon"><Building2 size={14} strokeWidth={2} /></span>
                      Company
                    </div>
                    {product.companyName && (
                      <div className="sdpRegRow">
                        <span className="sdpRegIcon"><Building2 size={13} strokeWidth={1.75} /></span>
                        <div className="sdpRegMeta">
                          <span className="sdpRegLabel">Name</span>
                          <span className="sdpRegValue">{product.companyName}</span>
                        </div>
                      </div>
                    )}
                    {product.companyInstitution && (
                      <div className="sdpRegRow">
                        <span className="sdpRegIcon"><Globe size={13} strokeWidth={1.75} /></span>
                        <div className="sdpRegMeta">
                          <span className="sdpRegLabel">Research Institution</span>
                          <span className="sdpRegValue">{product.companyInstitution}</span>
                        </div>
                      </div>
                    )}
                    {product.establishedYear && (
                      <div className="sdpRegRow">
                        <span className="sdpRegIcon"><Info size={13} strokeWidth={1.75} /></span>
                        <div className="sdpRegMeta">
                          <span className="sdpRegLabel">Established In</span>
                          <span className="sdpRegValue">{product.establishedYear}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* Company Card */}
{product.awardsRecognition && (
  <div className="sdpInfoCard sdpInfoCard--company">
    <div className="sdpInfoBlock">
      <div className="sdpInfoBlockTitle">
        <span className="sdpInfoBlockIcon"><Trophy size={14} strokeWidth={2} /></span>
        Awards & Recognition
      </div>
      <div className="sdpRegRow">
        <span className="sdpRegIcon"><Trophy size={13} strokeWidth={1.75} /></span>
        <div className="sdpRegMeta">
          {product.awardsRecognition
            .split("\n")
            .map(s => s.trim())
            .filter(Boolean)
            .map((award, i) => (
              <div key={i} className="sdpRegValue" style={{ marginBottom: "4px" }}>
                • {award}
              </div>
            ))}
        </div>
      </div>
    </div>
  </div>
)}
              {/* Contact Card – with login blur */}
              {(product.founderName || product.contactEmail || product.contactNumber) && (
                <div className="sdpInfoCard sdpInfoCard--contact">
                  <div className="sdpInfoBlock">
                    <div className="sdpInfoBlockTitle">
                      <span className="sdpInfoBlockIcon"><User size={14} strokeWidth={2} /></span>
                      Contact
                    </div>

                    <div className={`sdpContactContent ${!user ? "sdpBlurred" : ""}`}>
                      <div className="pdContactRow">
                        <div className="pdContactAvatar">
                          {product.founderName?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div>
                          {product.founderName && (
                            <p className="pdContactName">{product.founderName}</p>
                          )}
                          <div className="pdContactMeta">
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
                      <div className="sdpBlurOverlay">
                        <div className="sdpBlurCard">
                          <User size={24} color="#7c3aed" />
                          <p>Login to view contact details</p>
                          <a href="/login" className="sdpBlurLogin">
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