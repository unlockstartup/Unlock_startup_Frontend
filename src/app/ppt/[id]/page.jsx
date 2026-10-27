"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import {
  getPptTemplate,
  getPptPurchaseStatus,
  getSavedPptToken,
  pptDownloadUrl,
  downloadsLeftLabel,
} from "@/app/apiServices/ppt";
import PptDownloadModal from "@/components/uiElements/PptDownloadModal";
import "../ppt.css";

const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function PptDetailPage({ params }) {
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [purchase, setPurchase] = useState(null); // saved, still-valid purchase

  useEffect(() => {
    const fetchTemplate = async () => {
      const { id } = await params;
      try {
        const res = await getPptTemplate(id);
        setTemplate(res.data?.template || null);
      } catch (err) {
        console.error("Failed to fetch template:", err?.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [params]);

  const refreshPurchase = useCallback(async (templateId) => {
    const token = getSavedPptToken(templateId);
    if (!token) return setPurchase(null);
    try {
      const res = await getPptPurchaseStatus(token);
      setPurchase(res.data?.canDownload ? res.data : null);
    } catch {
      setPurchase(null);
    }
  }, []);

  useEffect(() => {
    if (template?._id) refreshPurchase(template._id);
  }, [template, refreshPurchase]);

  const handleDownloadAgain = async () => {
    // Re-check right before downloading so an expired link shows a message instead of a raw error page
    try {
      const res = await getPptPurchaseStatus(getSavedPptToken(template._id));
      if (!res.data?.canDownload) {
        setPurchase(null);
        return toast.error("This download link has expired or reached its limit.");
      }
      window.location.href = pptDownloadUrl(res.data.downloadPath);
      const left = res.data.downloadsLeft - 1;
      setPurchase(left > 0 ? { ...res.data, downloadsLeft: left } : null);
    } catch {
      setPurchase(null);
      toast.error("Download link not found. Please purchase again or contact support.");
    }
  };

  if (loading) {
    return (
      <main className="ppt-page">
        <div className="ppt-container ppt-detail" style={{ textAlign: "center" }}>
          <p className="ppt-muted">Loading template…</p>
        </div>
      </main>
    );
  }

  if (!template) {
    return (
      <main className="ppt-page">
        <div className="ppt-container ppt-detail">
          <div className="ppt-empty">
            <i className="bi bi-file-earmark-x"></i>
            <h3>Template not found</h3>
            <p>The template you&apos;re looking for doesn&apos;t exist or is no longer available.</p>
            <Link href="/ppt" className="ppt-btn ppt-btn--primary">← Browse all templates</Link>
          </div>
        </div>
      </main>
    );
  }

  const slides = template.previewImages?.length
    ? template.previewImages
    : template.coverImage ? [template.coverImage] : [];

  return (
    <main className="ppt-page">
      <ToastContainer position="top-center" />

      <div className="ppt-container ppt-detail">
        <Link href="/ppt" className="ppt-back"><i className="bi bi-arrow-left"></i> All templates</Link>

        <div className="ppt-detail__grid">
          {/* Slide preview — scroll through to review layout and content */}
          <div className="ppt-detail__preview">
            <div className="ppt-detail__preview-head">
              <h2>Slide preview</h2>
              {slides.length > 0 && <span className="ppt-muted">Scroll to view all {slides.length} slides</span>}
            </div>

            {slides.length === 0 ? (
              <div className="ppt-slide ppt-slide--empty">
                <i className="bi bi-file-earmark-slides"></i>
                <span>Preview not available</span>
              </div>
            ) : (
              <div className="ppt-slides">
                {slides.map((src, i) => (
                  <figure key={src + i} className="ppt-slide">
                    <img src={src} alt={`${template.title} — slide ${i + 1}`} loading={i < 2 ? "eager" : "lazy"} />
                    <figcaption>Slide {i + 1}</figcaption>
                  </figure>
                ))}
              </div>
            )}

            {template.description && (
              <div className="ppt-detail__desc">
                <h2>About this template</h2>
                {template.description.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}
              </div>
            )}
          </div>

          {/* Purchase card */}
          <aside className="ppt-detail__aside">
            <div className="ppt-buy">
              <span className="ppt-card__cat">{template.category} · {template.fileFormat}</span>
              <h1>{template.title}</h1>
              {template.shortDescription && <p className="ppt-muted">{template.shortDescription}</p>}

              <div className="ppt-price ppt-price--lg">
                <strong>{formatINR(template.price)}</strong>
                {template.mrp > template.price && (
                  <>
                    <del>{formatINR(template.mrp)}</del>
                    <span className="ppt-price__off">{Math.round((1 - template.price / template.mrp) * 100)}% off</span>
                  </>
                )}
              </div>

              <ul className="ppt-meta">
                {template.slideCount > 0 && <li><i className="bi bi-layers"></i> {template.slideCount} slides</li>}
                <li><i className="bi bi-file-earmark-ppt"></i> {template.fileFormat} · fully editable</li>
                <li><i className="bi bi-lightning-charge"></i> Instant download after payment</li>
              </ul>

              {template.features?.length > 0 && (
                <ul className="ppt-features">
                  {template.features.map((f) => <li key={f}><i className="bi bi-check2"></i> {f}</li>)}
                </ul>
              )}

              {purchase ? (
                <>
                  <button type="button" className="ppt-btn ppt-btn--primary ppt-btn--block" onClick={handleDownloadAgain}>
                    <i className="bi bi-download"></i> Download again
                  </button>
                  <p className="ppt-modal__note">You&apos;ve purchased this template · {downloadsLeftLabel(purchase.downloadsLeft)}</p>
                </>
              ) : (
                <button type="button" className="ppt-btn ppt-btn--primary ppt-btn--block" onClick={() => setModalOpen(true)}>
                  <i className="bi bi-download"></i> Download for {formatINR(template.price)}
                </button>
              )}

              <p className="ppt-modal__note">
                <i className="bi bi-shield-check"></i> Secure payment via Razorpay
              </p>
            </div>
          </aside>
        </div>
      </div>

      {modalOpen && (
        <PptDownloadModal
          template={template}
          onClose={() => setModalOpen(false)}
          onPurchased={() => refreshPurchase(template._id)}
        />
      )}
    </main>
  );
}
