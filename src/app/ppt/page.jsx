"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import { getPptTemplates } from "@/app/apiServices/ppt";
import PptDownloadModal from "@/components/uiElements/PptDownloadModal";
import "./ppt.css";

const features = [
  { icon: "bi-lightning-charge", title: "Instant Access", text: "Download right after payment." },
  { icon: "bi-shield-check", title: "Secure Payments", text: "Safe checkout via Razorpay." },
  { icon: "bi-gem", title: "Investor-Ready", text: "Clear layouts built for pitching." },
  { icon: "bi-pencil-square", title: "Fully Editable", text: "PowerPoint, Google Slides & Keynote." },
  { icon: "bi-headset", title: "Need Help?", text: "Our team is a message away.", href: "/contact" },
];

const steps = [
  { icon: "bi-eye", title: "Preview the deck", text: "Scroll through every slide to check the layout, structure and content before you buy." },
  { icon: "bi-person-vcard", title: "Enter your details", text: "Share your name, email and mobile number so we can send your download link." },
  { icon: "bi-credit-card", title: "Pay securely", text: "Complete the payment via UPI, card, net banking or wallet through Razorpay." },
  { icon: "bi-download", title: "Download instantly", text: "Get the editable file right away, plus a download link in your inbox." },
];

const faqs = [
  { q: "What format are the files in?", a: "Templates are delivered as editable PowerPoint files (PPTX) that also open in Google Slides and Keynote, unless a different format is mentioned on the template." },
  { q: "Do I need an account to buy?", a: "No. Just enter your name, email and mobile number before payment. Your download link is sent to the email you provide." },
  { q: "What if I lose my download link?", a: "The link is emailed to you after payment and stays valid for a limited time with a limited number of downloads. If you face any issue, contact our support team with your payment details." },
  { q: "Is the payment secure?", a: "Yes. Payments are processed by Razorpay; we never see or store your card or banking details." },
];

const SORTS = {
  featured:   { label: "Featured", fn: null },
  priceLow:   { label: "Price: Low to High", fn: (a, b) => a.price - b.price },
  priceHigh:  { label: "Price: High to Low", fn: (a, b) => b.price - a.price },
  slides:     { label: "Most Slides", fn: (a, b) => (b.slideCount || 0) - (a.slideCount || 0) },
};

const CATEGORY_STYLES = [
  { tone: "blue", icon: "bi-easel2" },
  { tone: "orange", icon: "bi-clipboard-data" },
  { tone: "yellow", icon: "bi-graph-up-arrow" },
  { tone: "navy", icon: "bi-palette" },
  { tone: "green", icon: "bi-tools" },
  { tone: "pink", icon: "bi-person-badge" },
];

const CATEGORY_ICONS = [
  [/pitch|deck/i, "bi-easel2"],
  [/business|plan/i, "bi-clipboard-data"],
  [/financ|model|revenue/i, "bi-graph-up-arrow"],
  [/brand|market/i, "bi-palette"],
  [/tool|kit|startup/i, "bi-tools"],
  [/investor|fund/i, "bi-person-badge"],
];

const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const pad = (n) => String(n).padStart(2, "0");

// File-type badge colour: PPT orange, PDF red, XLS green, DOC blue, everything else slate
const formatTone = (fmt = "") => {
  const f = fmt.toLowerCase();
  if (f.startsWith("ppt") || f.startsWith("pot")) return "ppt";
  if (f.startsWith("pdf")) return "pdf";
  if (f.startsWith("xls") || f.startsWith("csv")) return "xls";
  if (f.startsWith("doc")) return "doc";
  return "other";
};

const slidesOf = (t) => (t.previewImages?.length ? t.previewImages : t.coverImage ? [t.coverImage] : []);

// Scroll without a "#hash" history entry — those confuse the App Router's Back button
const scrollToSection = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

function TemplateCard({ template, onDownload }) {
  const [index, setIndex] = useState(0);
  const slides = slidesOf(template);
  const href = `/ppt/${template.slug || template._id}`;
  const total = Math.max(template.slideCount || 0, slides.length);
  const tone = formatTone(template.fileFormat);
  const upNext = slides.slice(index + 1, index + 3);

  return (
    <article className="ppt-card">
      <div className="ppt-card__media">
        <Link href={href} className="ppt-card__main" aria-label={`Preview ${template.title}`}>
          {slides.length ? (
            <img src={slides[index]} alt={`${template.title} — slide ${index + 1}`} loading="lazy" />
          ) : (
            <i className="bi bi-file-earmark-slides"></i>
          )}
          <span className={`ppt-format ppt-format--${tone}`}>{template.fileFormat}</span>
        </Link>

        {slides.length > 1 && (
          <div className="ppt-card__side">
            <div className="ppt-card__pager">
              <span>{pad(index + 1)} / {pad(slides.length)}</span>
              <span className="ppt-card__arrows">
                <button type="button" aria-label="Previous slide" disabled={index === 0}
                  onClick={() => setIndex((i) => i - 1)}>
                  <i className="bi bi-chevron-left"></i>
                </button>
                <button type="button" aria-label="Next slide" disabled={index === slides.length - 1}
                  onClick={() => setIndex((i) => i + 1)}>
                  <i className="bi bi-chevron-right"></i>
                </button>
              </span>
            </div>
            {upNext.map((src, k) => (
              <button key={src + k} type="button" className="ppt-card__thumb" aria-label={`Show slide ${index + k + 2}`}
                onClick={() => setIndex(index + k + 1)}>
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="ppt-card__body">
        <h3><Link href={href}>{template.title}</Link></h3>
        {template.shortDescription && <p>{template.shortDescription}</p>}

        <div className="ppt-card__foot">
          <div className="ppt-card__meta">
            <span className={`ppt-card__type ppt-card__type--${tone}`}>
              <i className="bi bi-file-earmark-fill"></i> {template.fileFormat}
            </span>
            {total > 0 && <span>{total} Slides</span>}
          </div>
          <div className="ppt-price">
            <strong>{formatINR(template.price)}</strong>
            {template.mrp > template.price && <del>{formatINR(template.mrp)}</del>}
          </div>
        </div>

        <div className="ppt-card__actions">
          <Link href={href} className="ppt-btn ppt-btn--outline ppt-btn--sm">Preview</Link>
          <button type="button" className="ppt-btn ppt-btn--primary ppt-btn--sm" onClick={() => onDownload(template)}>
            <i className="bi bi-download"></i> Download
          </button>
        </div>
      </div>
    </article>
  );
}

function HeroVisual({ templates }) {
  // Built from real template covers; falls back to styled placeholders
  const covers = templates.map((t) => ({ title: t.title, src: t.coverImage || t.previewImages?.[0] })).slice(0, 3);
  while (covers.length < 3) covers.push({ title: ["Business Pitch Deck", "Market Opportunity", "Financial Projections"][covers.length] });

  return (
    <div className="ppt-hero__visual" aria-hidden="true">
      {covers.map((c, i) => (
        <div key={i} className={`ppt-hero__deck ppt-hero__deck--${i + 1}`}>
          {c.src ? <img src={c.src} alt="" /> : <span>{c.title}</span>}
        </div>
      ))}
    </div>
  );
}

export default function PptPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");

  const fetchTemplates = () =>
    getPptTemplates()
      .then((res) => setTemplates(res.data?.templates || []))
      .catch((err) => {
        console.error("Failed to fetch PPT templates:", err?.response?.data || err.message);
        setLoadError(true);
      })
      .finally(() => setLoading(false));

  useEffect(() => {
    fetchTemplates();
  }, []);

  const retryLoad = () => {
    setLoading(true);
    setLoadError(false);
    fetchTemplates();
  };

  // Categories come from the templates themselves, with live counts
  const categories = useMemo(() => {
    const counts = new Map();
    templates.forEach((t) => {
      const c = t.category?.trim() || "Other";
      counts.set(c, (counts.get(c) || 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name, count], i) => {
      const icon = CATEGORY_ICONS.find(([re]) => re.test(name))?.[1] || CATEGORY_STYLES[i % CATEGORY_STYLES.length].icon;
      return { name, count, icon, tone: CATEGORY_STYLES[i % CATEGORY_STYLES.length].tone };
    });
  }, [templates]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = templates.filter((t) => {
      if (category !== "All" && (t.category?.trim() || "Other") !== category) return false;
      if (!q) return true;
      return [t.title, t.shortDescription, t.description, t.category, t.fileFormat, ...(t.features || [])]
        .filter(Boolean).join(" ").toLowerCase().includes(q);
    });
    const fn = SORTS[sort].fn;
    return fn ? [...list].sort(fn) : list;
  }, [templates, query, category, sort]);

  const pickCategory = (name) => {
    setCategory(name);
    scrollToSection("templates");
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("All");
  };

  return (
    <main className="ppt-page">
      <ToastContainer position="top-center" />

      {/* Hero */}
      <section className="ppt-hero">
        <div className="ppt-container ppt-hero__grid">
          <div className="ppt-hero__content">
            <span className="ppt-hero__badge"><i className="bi bi-easel2"></i> For Founders &amp; Startups</span>
            <h1>
              Pitch Decks &amp; <span>Startup Templates</span>
            </h1>
            <p>
              Editable PowerPoint templates made for founders and startups: pitch decks, business plans,
              investor updates and more. Preview every slide, pay securely and download instantly.
            </p>

            <form className="ppt-search" role="search" onSubmit={(e) => { e.preventDefault(); scrollToSection("templates"); }}>
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pitch decks, templates, or keywords..." aria-label="Search templates" />
              <button type="submit" aria-label="Search"><i className="bi bi-search"></i></button>
            </form>

            {categories.length > 1 && (
              <div className="ppt-pills">
                {["All", ...categories.map((c) => c.name)].map((name) => (
                  <button key={name} type="button" className={`ppt-pill ${category === name ? "is-active" : ""}`}
                    onClick={() => setCategory(name)}>
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <HeroVisual templates={templates} />
        </div>
      </section>

      {/* Categories */}
      {categories.length > 1 && (
        <section className="ppt-section">
          <div className="ppt-container">
            <div className="ppt-section__head ppt-section__head--split">
              <div>
                <span className="ppt-kicker"><i className="bi bi-grid"></i> Browse by category</span>
                <h2>Explore Popular Categories</h2>
              </div>
              <button type="button" className="ppt-link" onClick={() => pickCategory("All")}>
                View all templates <i className="bi bi-arrow-right"></i>
              </button>
            </div>
            <div className="ppt-categories">
              {categories.slice(0, 6).map((c) => (
                <button key={c.name} type="button" className={`ppt-category ppt-category--${c.tone}`} onClick={() => pickCategory(c.name)}>
                  <span className="ppt-category__icon"><i className={`bi ${c.icon}`}></i></span>
                  <strong>{c.name}</strong>
                  <small>({c.count})</small>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Templates */}
      <section className="ppt-section ppt-section--tight" id="templates">
        <div className="ppt-container">
          <div className="ppt-section__head ppt-section__head--split">
            <div>
              <span className="ppt-kicker"><i className="bi bi-stars"></i> Featured resources</span>
              <h2>Popular Downloads</h2>
            </div>
            <label className="ppt-sort">
              <span>Sort by:</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort templates">
                {Object.entries(SORTS).map(([key, s]) => <option key={key} value={key}>{s.label}</option>)}
              </select>
            </label>
          </div>

          {(query || category !== "All") && !loading && !loadError && (
            <div className="ppt-filter-bar">
              <span>
                {visible.length} result{visible.length === 1 ? "" : "s"}
                {category !== "All" && <> in <strong>{category}</strong></>}
                {query && <> for “<strong>{query}</strong>”</>}
              </span>
              <button type="button" className="ppt-link" onClick={clearFilters}>Clear filters</button>
            </div>
          )}

          {loading ? (
            <div className="ppt-grid">
              {[0, 1, 2].map((i) => <div key={i} className="ppt-card ppt-card--skeleton" />)}
            </div>
          ) : loadError ? (
            <div className="ppt-empty">
              <i className="bi bi-wifi-off"></i>
              <h3>Couldn&apos;t load templates</h3>
              <p>Please check your connection and try again.</p>
              <button type="button" className="ppt-btn ppt-btn--primary" onClick={retryLoad}>Try again</button>
            </div>
          ) : templates.length === 0 ? (
            <div className="ppt-empty">
              <i className="bi bi-easel"></i>
              <h3>New templates coming soon</h3>
              <p>We&apos;re preparing fresh presentation templates. Please check back shortly.</p>
            </div>
          ) : visible.length === 0 ? (
            <div className="ppt-empty">
              <i className="bi bi-search"></i>
              <h3>No templates match your search</h3>
              <p>Try a different keyword or category.</p>
              <button type="button" className="ppt-btn ppt-btn--primary" onClick={clearFilters}>Clear filters</button>
            </div>
          ) : (
            <div className="ppt-grid">
              {visible.map((t) => <TemplateCard key={t._id} template={t} onDownload={setSelected} />)}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="ppt-section ppt-section--tint" id="how-it-works">
        <div className="ppt-container">
          <div className="ppt-section__head">
            <h2>How it works</h2>
            <p>From preview to download in under two minutes.</p>
          </div>
          <div className="ppt-steps">
            {steps.map((s, i) => (
              <div key={s.title} className="ppt-step">
                <div className="ppt-step__icon"><i className={`bi ${s.icon}`}></i></div>
                <span className="ppt-step__num">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="ppt-section">
        <div className="ppt-container ppt-container--narrow">
          <div className="ppt-section__head">
            <h2>Frequently asked questions</h2>
          </div>
          <div className="ppt-faq">
            {faqs.map((f, i) => (
              <div key={f.q} className={`ppt-faq__item ${openFaq === i ? "is-open" : ""}`}>
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i}>
                  <span>{f.q}</span>
                  <i className={`bi ${openFaq === i ? "bi-dash" : "bi-plus"}`}></i>
                </button>
                {openFaq === i && <p>{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="ppt-features-strip">
        <div className="ppt-container ppt-features-strip__grid">
          {features.map((f) => {
            const inner = (
              <>
                <span className="ppt-feature__icon"><i className={`bi ${f.icon}`}></i></span>
                <span>
                  <strong>{f.title}</strong>
                  <small>{f.text}</small>
                </span>
              </>
            );
            return f.href
              ? <Link key={f.title} href={f.href} className="ppt-feature">{inner}</Link>
              : <div key={f.title} className="ppt-feature">{inner}</div>;
          })}
        </div>
      </section>

      {selected && (
        <PptDownloadModal
          template={selected}
          onClose={() => setSelected(null)}
          allSlidesHref={`/ppt/${selected.slug || selected._id}`}
        />
      )}
    </main>
  );
}
