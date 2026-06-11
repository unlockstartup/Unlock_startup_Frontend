"use client"

import { useEffect, useMemo, useState , useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import publisherApi from "@/app/publisherapi";
import {
  getPublicPatentStatuses,
  getPublicProductStatuses,
  getPublicInnovationStatuses,
} from "@/app/apiServices/publicapi";
import { getPublisherPlanInfo } from "@/app/apiServices/subscriptions";
import ConfirmationModal from "@/components/ConfirmationModal";

import "../styles/publishercretepages.css";

/*  Field helper  */
function Field({ label, note, children }) {
  return (
    <div className="field">
      <label className="label">
        {label}
        {note && <span className="labelNote">{note}</span>}
      </label>
      {children}
    </div>
  );
}

function StatusBadge({ status = "pending", reason }) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);

  const cls = status === "approved" ? "badgeSuccess"
    : status === "rejected" ? "badgeDanger"
    : "badgeWarning";

  const showTooltip = (hovered || pinned) && !!reason;

  useEffect(() => {
    if (!pinned) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setPinned(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [pinned]);

  return (
    <span className="statusBadgeWrapper">
      <span className={`badge ${cls}`}>
        {status}
        {reason && (
          <span ref={ref} className="statusBadgeInfo">
            <span
              className={`statusInfoBtn statusInfoBtn--${status} ${pinned ? "statusInfoBtn--pinned" : ""}`}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={(e) => { e.stopPropagation(); setPinned((p) => !p); }}
            >
              i
            </span>

            {showTooltip && (
              <span className={`statusTooltip statusTooltip--${status}`}>
                <span className={`statusTooltipLabel statusTooltipLabel--${status}`}>
                  {status === "approved" ? "Approval Note" : "Rejection Reason"}
                </span>
                <span className="statusTooltipDivider" />
                <span className="statusTooltipText">{reason}</span>
                <span className={`statusTooltipCaret statusTooltipCaret--${status}`} />
              </span>
            )}
          </span>
        )}
      </span>
    </span>
  );
}

/*  Main component  */
export default function InnovationProducts() {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [status, setStatus]       = useState("all");
  const [planInfo, setPlanInfo]   = useState(null);
  const [q, setQ]                 = useState("");

  const [open, setOpen]           = useState(false);
  const [mode, setMode]           = useState("create");
  const [editing, setEditing]     = useState(null);
  const [saving, setSaving]       = useState(false);

  const [uploadingImage, setUploadingImage]               = useState(false);
  const [uploadingProductImages, setUploadingProductImages] = useState(false);
  const [productLogo, setProductLogo]                     = useState(null);
  const [productImages, setProductImages]                 = useState([]);

  const [categories, setCategories]               = useState([]);
  const [patentStatuses, setPatentStatuses]       = useState([]);
  const [productStatuses, setProductStatuses]     = useState([]);
  const [innovationStatuses, setInnovationStatuses] = useState([]);

  const [showConfirm, setShowConfirm]   = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: "", message: "",
    confirmText: "Confirm", cancelText: "Cancel",
    confirmVariant: "danger", onConfirm: () => {},
  });

  const initialForm = useMemo(() => ({
    companyName: "",
    establishedYear: "",
    brandName: "",
    productName: "",
    innovationCategory: "",
    technology: "",
    shortProductDescription: "",
    detailedDescription: "",
    keyFeatures: "",
    productDemoUrl: "",
    patentStatus: "",
    targetIndustry: "",
    challengeSolved: "",
    companyInstitution: "",
    contactEmail: "",
    contactNumber: "",
    websiteUrl: "",
    innovationStatus: "",
    productStatus: "",
    founderName: "",
    awardsRecognition: "",
    disclosureConsent: false,
  }), []);

  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  /*  Data fetching  */
  const fetchProducts = async (overrides = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      const s      = overrides.status !== undefined ? overrides.status : status;
      const search = overrides.q      !== undefined ? overrides.q      : q;
      if (s !== "all")   params.append("status", s);
      if (search.trim()) params.append("q", search.trim());
      const res = await publisherApi.get(`/api/publisher/innovation-products/mine?${params.toString()}`);
      setProducts(res.data?.products || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [status]);

  useEffect(() => {
    (async () => { try { const res = await getPublisherPlanInfo(); setPlanInfo(res.data); } catch {} })();

    (async () => {
      try {
        const res = await publisherApi.get("/api/innovation-categories/all?status=active");
        setCategories(res.data?.categories || []);
      } catch (err) { toast.error(err?.response?.data?.message || "Failed to load categories"); }
    })();

    (async () => {
      try { const res = await getPublicPatentStatuses();    setPatentStatuses(res.data?.statuses    || []); }
      catch { toast.error("Failed to load patent statuses"); }
    })();
    (async () => {
      try { const res = await getPublicInnovationStatuses(); setInnovationStatuses(res.data?.statuses || []); }
      catch { toast.error("Failed to load innovation statuses"); }
    })();
    (async () => {
      try { const res = await getPublicProductStatuses();   setProductStatuses(res.data?.statuses   || []); }
      catch { toast.error("Failed to load product statuses"); }
    })();
  }, []);

  /*  Plan limits  */
  const subscriptionExpired  = planInfo && planInfo.subscriptionStatus !== "active";
  const productLimitReached  = planInfo && !subscriptionExpired && planInfo.limits?.productsLimit > 0 && planInfo.usage?.products >= planInfo.limits?.productsLimit;
  const productButtonDisabled = subscriptionExpired || productLimitReached;

  const addBtnLabel = subscriptionExpired ? "Subscription Expired"
    : productLimitReached ? `Limit Reached (${planInfo.usage.products}/${planInfo.limits.productsLimit})`
    : "+ Add Product";

  /*  Modal helpers  */
  const openCreate = () => {
    setMode("create"); setEditing(null); setForm(initialForm);
    setProductLogo(null); setProductImages([]); setOpen(true);
  };
const openEdit = (prod) => {
  const alreadyEdited = (prod.editCount ?? 0) >= 1;
  setConfirmConfig({
    title: alreadyEdited ? "Edit Not Allowed" : "Edit Product",
    message: alreadyEdited
      ? "This product has already been edited once and can no longer be modified."
      : "You can only update this listing once. Please review all details carefully before submitting, as no further edits will be allowed after this.",
    confirmText: alreadyEdited ? "OK" : "I Understand, Proceed",
    cancelText: alreadyEdited ? "" : "Cancel",
    confirmVariant: alreadyEdited ? "danger" : "primary",
    onConfirm: () => {
      if (alreadyEdited) return;
      setMode("edit"); setEditing(prod);
      setForm({ ...initialForm, ...prod, shortProductDescription: prod.shortProductDescription || "", awardsRecognition: prod.awardsRecognition || "" });
      setProductLogo(prod.productLogo || null);
      setProductImages(prod.productImages || []);
      setOpen(true);
    },
  });
  setShowConfirm(true);
};


  const closeModal = () => { if (saving || uploadingImage || uploadingProductImages) return; setOpen(false); };

  /*  Image uploads  */
  const uploadLogo = async (file) => {
    if (!file) return;
    const fd = new FormData();
    fd.append("files", file);
    try {
      setUploadingImage(true);
      const res = await publisherApi.post("/api/uploads", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const uploaded = res.data?.files?.[0];
      if (uploaded) { setProductLogo({ url: uploaded.url, publicId: uploaded.publicId, resourceType: uploaded.resourceType || "image" }); toast.success("Logo uploaded"); }
      else toast.error("Upload failed");
    } catch (err) { toast.error(err?.response?.data?.message || "Upload failed"); }
    finally { setUploadingImage(false); }
  };

  const handleProductImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    try {
      setUploadingProductImages(true);
      const res = await publisherApi.post("/api/uploads", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const uploaded = res.data?.files || [];
      setProductImages((prev) => [...prev, ...uploaded.map((f) => ({ url: f.url, publicId: f.publicId, resourceType: f.resourceType || "image" }))]);
      toast.success(`${uploaded.length} image(s) uploaded`);
    } catch (err) { toast.error(err?.response?.data?.message || "Image upload failed"); }
    finally { setUploadingProductImages(false); e.target.value = ""; }
  };

  const removeProductImage = (publicId) =>
    setProductImages((prev) => prev.filter((img) => img.publicId !== publicId));

  /*  Validate & save  */
  const validate = () => {
    if (!form.companyName.trim())              { toast.warn("Company name is required");              return false; }
    if (!form.productName.trim())              { toast.warn("Product name is required");              return false; }
    if (!form.contactEmail.trim())             { toast.warn("Contact email is required");             return false; }
    if (productImages.length === 0)            { toast.warn("At least one product image is required"); return false; }
    if (!form.disclosureConsent)               { toast.warn("You must provide consent to submit");    return false; }
    if (!form.shortProductDescription.trim())  { toast.warn("Short Product Description is required"); return false; }
    return true;
  };

  const save = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      const payload = { ...form, productLogo, productImages };
      if (mode === "create") {
        await publisherApi.post("/api/publisher/innovation-products", payload);
        toast.success("Product submitted successfully! It will be reviewed by our team.");
      } else {
        await publisherApi.patch(`/api/publisher/innovation-products/${editing._id}`, payload);
        toast.success("Product updated (pending re-approval)");
      }
      setOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Submission failed");
    } finally {
      setSaving(false);
    }
  };

  const toggleProduct = async (prod) => {
    try {
      await publisherApi.patch(`/api/publisher/innovation-products/${prod._id}/toggle`);
      toast.success(`Product ${prod.isActive ? "deactivated" : "activated"}`);
      fetchProducts();
    } catch (err) { toast.error(err?.response?.data?.message || "Toggle failed"); }
  };

  const deleteProduct = (id) => {
    if (!id) { toast.error("Invalid Product ID"); return; }
    setConfirmConfig({
      title: "Delete Product",
      message: "Are you sure you want to permanently delete this product? This action cannot be undone.",
      confirmText: "Yes, Delete this Product", cancelText: "Cancel", confirmVariant: "danger",
      onConfirm: async () => {
        try {
          await publisherApi.delete(`/api/publisher/innovation-products/${id}`);
          toast.success("Product deleted");
          fetchProducts();
        } catch (err) { toast.error(err?.response?.data?.message || "Delete failed"); }
      },
    });
    setShowConfirm(true);
  };

const confirmToggleProduct = (prod) => {
  if (!prod?._id) { toast.error("Invalid Product ID"); return; }
  const toggleCount = prod.toggleCount ?? 0;
  if (toggleCount >= 2) {
    setConfirmConfig({
      title: "Toggle Not Allowed",
      message: "This product has already been deactivated and reactivated once. No further activation or deactivation is allowed.",
      confirmText: "OK",
      cancelText: "",
      confirmVariant: "danger",
      onConfirm: () => {},
    });
    setShowConfirm(true);
    return;
  }
  const isDeactivating = prod.isActive;
  setConfirmConfig({
    title: isDeactivating ? "Deactivate Product" : "Activate Product",
    message: isDeactivating
      ? "You may reactivate this product once after deactivating, but after that no further toggling will be allowed. Are you sure you want to deactivate?"
      : "You can activate this listing once more. After reactivating, no further deactivation or activation will be permitted. Proceed?",
    confirmText: isDeactivating ? "Yes, Deactivate" : "Yes, Activate",
    cancelText: "Cancel",
    confirmVariant: isDeactivating ? "warning" : "success",
    onConfirm: async () => {
      try {
        await publisherApi.patch(`/api/publisher/innovation-products/${prod._id}/toggle`);
        toast.success(`Product ${isDeactivating ? "deactivated" : "activated"}`);
        fetchProducts();
      } catch (err) {
        toast.error(err?.response?.data?.message || "Toggle failed");
      }
    },
  });
  setShowConfirm(true);
};
  /*  Render  */
  return (
    <div className="page">

      {/*  Topbar  */}
      <header className="topbar">
        <div>
          <h1 className="topbarTitle">Innovation Products</h1>
          <p className="topbarSub tdNoWrap">Submit and manage your innovation products</p>
        </div>
        <div className="topbarActions">
          <button
            className={`btn ${productButtonDisabled ? "btnSecondary" : "btnPrimary"}`}
            onClick={productButtonDisabled ? undefined : openCreate}
            disabled={productButtonDisabled}
            title={
              subscriptionExpired ? "Your subscription has expired. Please renew to submit products."
              : productLimitReached ? `Products limit of ${planInfo.limits.productsLimit} reached for your current plan`
              : ""
            }
          >
            {addBtnLabel}
          </button>
        </div>
      </header>

      {/*  Filters  */}
      <div className="tableShell">
        <div className="tableHead">
          <h2 className="tableHeadTitle">Filter &amp; Search</h2>
        </div>
        <div className="tableBody">
          <div className="row3" style={{ alignItems: "flex-end" }}>
            <div className="field">
              <label className="label">Approval Status</label>
              <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="field">
              <label className="label">Search</label>
              <input
                className="input"
                placeholder="Search by product, company, or brand…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchProducts()}
              />
            </div>
            <div className="field" style={{ justifyContent: "flex-end" }}>
              <label className="label" style={{ visibility: "hidden" }}>_</label>
              <div style={{ display: "flex", gap: "0.6rem" }}>
                <button className="btn btnPrimary btnSm" onClick={() => fetchProducts()} disabled={loading}>Search</button>
                <button className="btn btnSecondary btnSm" onClick={() => { setStatus("all"); setQ(""); fetchProducts({ status: "all", q: "" }); }} disabled={loading}>Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  Table  */}
      <div className="tableShell">
        <div className="tableHead">
          <h2 className="tableHeadTitle">All Innovation Products</h2>
        </div>
        <div className="tableBody">
          {loading ? (
            <p className="loadingState">Loading…</p>
          ) : products.length === 0 ? (
            <div className="emptyState">
              <p>No innovation products yet.</p>
              <button
                className={`btn ${productButtonDisabled ? "btnSecondary" : "btnPrimary"}`}
                onClick={productButtonDisabled ? undefined : openCreate}
                disabled={productButtonDisabled}
                style={{ marginTop: "0.75rem" }}
              >
                {subscriptionExpired ? "Subscription Expired" : productLimitReached ? "Limit Reached" : "+ Submit First Product"}
              </button>
            </div>
          ) : (
            <table className="table">
<thead>
  <tr>
    <th>#</th>
    <th>Product Name</th>
    <th>Logo</th>
    <th>Company</th>
    <th>Category</th>
    <th>Status</th>
    <th>Active</th>
    <th className="tdRight" style={{ textAlign: "center" }}>Actions</th>
  </tr>
</thead>
<tbody>
  {products.map((prod, idx) => {
    const editLocked = (prod.editCount ?? 0) >= 1;
    return (
      <tr key={prod._id}>
        <td className="tdMuted" data-label="#">{idx + 1}</td>

        <td className="tdSemibold" data-label="Product Name">
          {prod.productName}
          {prod.brandName && <div className="tdMuted">{prod.brandName}</div>}
        </td>

        <td data-label="Logo">
          {prod.productLogo?.url ? (
            <img src={prod.productLogo.url} alt="logo" className="thumb" />
          ) : (
            <span className="tdMuted">No logo</span>
          )}
        </td>

        <td className="tdMuted tdNoWrap" data-label="Company">
          {prod.companyName || "—"}
        </td>

        <td className="tdMuted tdNoWrap" data-label="Category">
          {prod.innovationCategory || "—"}
        </td>

<td data-label="Status">
  <StatusBadge
    status={prod.status}
    reason={prod.status === "approved" ? prod.approvalReason : prod.rejectionReason}
  />
</td>

        <td data-label="Active">
          <span className={`badge ${prod.isActive ? "badgeSuccess" : "badgeNeutral"}`}>
            {prod.isActive ? "Active" : "Inactive"}
          </span>
        </td>

        <td data-label="Actions">
          <div className="actionGroup">
            <button
              className={`btn btnSm ${editLocked ? "btnSecondary" : "btnPrimary"}`}
              onClick={() => openEdit(prod)}
              title={editLocked ? "Already edited once" : "Edit product"}
            >
              Edit
            </button>
            <button
              className={`btn btnSm ${prod.isActive ? "btnWarning" : "btnSuccess"}`}
              onClick={() => confirmToggleProduct(prod)}
              title={(prod.toggleCount ?? 0) >= 2 ? "Toggle limit reached" : prod.isActive ? "Deactivate" : "Activate"}
            >
              {prod.isActive ? "Deactivate" : "Activate"}
            </button>
            <button className="btn btnSm btnDanger" onClick={() => deleteProduct(prod._id)}>Delete</button>
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

      {/*  Create / Edit modal  */}
      {open && (
        <div className="modalOverlay">
          <div className="modalDialog">

            {/* Header */}
            <div className="modalHeader">
              <h2 className="modalTitle">
                {mode === "create" ? "Submit Innovation Product" : "Edit Innovation Product"}
              </h2>
              <button className="modalClose" onClick={closeModal} aria-label="Close">✕</button>
            </div>

            {/* Body */}
            <div className="modalBody">

              {/*  Company information  */}
              <section className="section">
                <h3 className="sectionTitle">Company information</h3>
                <div className="row3">
                  <Field label="Company Name *">
                    <input className="input" name="companyName" value={form.companyName} onChange={handleChange} placeholder="Enter company name" />
                  </Field>
                  <Field label="Established Year">
                    <input className="input" name="establishedYear" value={form.establishedYear} onChange={handleChange} placeholder="e.g. 2018" />
                  </Field>
                  <Field label="Brand Name">
                    <input className="input" name="brandName" value={form.brandName} onChange={handleChange} placeholder="Enter brand name" />
                  </Field>
                </div>
              </section>

              {/*  Product details  */}
              <section className="section">
                <h3 className="sectionTitle">Product details</h3>

                <div className="row2">
                  <Field label="Product Name *">
                    <input className="input" name="productName" value={form.productName} onChange={handleChange} placeholder="Enter product name" />
                  </Field>
                  <Field label="Innovation Category *">
                    <select className="select" name="innovationCategory" value={form.innovationCategory} onChange={handleChange}>
                      <option value="">Select</option>
                      {categories.map((c) => <option key={c._id || c.name} value={c.name}>{c.name}</option>)}
                    </select>
                  </Field>
                </div>

                {/* Product Logo */}
                <Field label="Product Logo / Icon" note="Recommended: 270 × 180 px">
                  <div className="imageRow">
                    <input
                      type="file" accept="image/*" className="input" style={{ flex: 1 }}
                      onChange={(e) => uploadLogo(e.target.files?.[0])}
                      disabled={uploadingImage}
                    />
                    {productLogo?.url && <img src={productLogo.url} alt="logo" className="imagePreview" />}
                  </div>
                </Field>

                {/* Product Images */}
                <Field label="Product Images *" note="Recommended: 1300 × 580 px — at least one required">
                  <div>
                    <input
                      type="file" id="modalProductImagesInput" accept="image/*"
                      multiple className="input" style={{ display: "none" }}
                      onChange={handleProductImagesUpload}
                      disabled={uploadingProductImages}
                    />
                    <button
                      type="button"
                      className={`btn btnSm ${uploadingProductImages ? "btnSecondary" : "btnPrimary"}`}
                      onClick={() => document.getElementById("modalProductImagesInput").click()}
                      disabled={uploadingProductImages}
                    >
                      {uploadingProductImages ? "Uploading…" : "Upload Images"}
                    </button>
                    <span className="labelNote" style={{ marginLeft: "0.75rem" }}>
                      {productImages.length} image(s) uploaded
                    </span>
                  </div>
                  {productImages.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginTop: "0.75rem" }}>
                      {productImages.map((img) => (
                        <div key={img.publicId} style={{ position: "relative" }}>
                          <img src={img.url} alt="product" className="imagePreview" />
                          <button
                            type="button"
                            onClick={() => removeProductImage(img.publicId)}
                            style={{
                              position: "absolute", top: "-6px", right: "-6px",
                              width: "20px", height: "20px", borderRadius: "50%",
                              border: "none", background: "var(--orange)", color: "#fff",
                              cursor: "pointer", fontSize: "0.65rem", display: "flex",
                              alignItems: "center", justifyContent: "center", padding: 0,
                            }}
                          >✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </Field>

                <div className="row2">
                  <Field label="Technology *">
                    <input className="input" name="technology" value={form.technology} onChange={handleChange} placeholder="e.g. Machine Learning, TensorFlow" />
                  </Field>
                  <Field label="Patent / IP Status *">
                    <select className="select" name="patentStatus" value={form.patentStatus} onChange={handleChange}>
                      <option value="">— Select patent status —</option>
                      {patentStatuses.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
                    </select>
                  </Field>
                </div>

                <Field label="Short Product Description *" note="2–3 sentence overview, max 200 words">
                  <textarea className="textarea" rows={3} name="shortProductDescription" value={form.shortProductDescription} onChange={handleChange} placeholder="Brief overview of the product" />
                </Field>

                <Field label="Detailed Description *">
                  <textarea className="textarea" rows={4} name="detailedDescription" value={form.detailedDescription} onChange={handleChange} placeholder="Comprehensive innovation details" />
                </Field>

                <Field label="Key Features / Innovations *">
                  <textarea className="textarea" rows={4} name="keyFeatures" value={form.keyFeatures} onChange={handleChange} placeholder="Breakthrough features (bullet points)" />
                </Field>

                <Field label="Product Demo / Video URL">
                  <input type="url" className="input" name="productDemoUrl" value={form.productDemoUrl} onChange={handleChange} placeholder="https://" />
                </Field>
              </section>

              {/*  Target market  */}
              <section className="section">
                <h3 className="sectionTitle">Target market</h3>

                <Field label="Target Industry / Market *">
                  <textarea className="textarea" rows={2} name="targetIndustry" value={form.targetIndustry} onChange={handleChange} placeholder="Primary industry / customer segments" />
                </Field>

                <Field label="Challenge Solved *">
                  <textarea className="textarea" rows={3} name="challengeSolved" value={form.challengeSolved} onChange={handleChange} placeholder="Critical pain points addressed" />
                </Field>
              </section>

              {/*  Organization & contact  */}
              <section className="section">
                <h3 className="sectionTitle">Company Details</h3>

                <div className="row2">
                  <Field label="Company / Research Institution *">
                    <input className="input" name="companyInstitution" value={form.companyInstitution} onChange={handleChange} placeholder="Enter institution name" />
                  </Field>
                  <Field label="Contact Email *">
                    <input type="email" className="input" name="contactEmail" value={form.contactEmail} onChange={handleChange} placeholder="Enter email" />
                  </Field>
                </div>

                <div className="row2">
                  <Field label="Contact Number">
                    <input className="input" name="contactNumber" value={form.contactNumber} onChange={handleChange} placeholder="Enter phone number" />
                  </Field>
                  <Field label="Website URL">
                    <input type="url" className="input" name="websiteUrl" value={form.websiteUrl} onChange={handleChange} placeholder="https://" />
                  </Field>
                </div>
              </section>

              {/*  Product status  */}
              <section className="section">
                <h3 className="sectionTitle">Product status</h3>

                <div className="row3">
                  <Field label="Innovation Status *">
                    <select className="select" name="innovationStatus" value={form.innovationStatus} onChange={handleChange}>
                      <option value="">— Select —</option>
                      {innovationStatuses.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
                    </select>
                  </Field>
                  <Field label="Product Status *">
                    <select className="select" name="productStatus" value={form.productStatus} onChange={handleChange}>
                      <option value="">— Select —</option>
                      {productStatuses.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
                    </select>
                  </Field>
                  <Field label="Founder / Lead Innovator *">
                    <input className="input" name="founderName" value={form.founderName} onChange={handleChange} placeholder="Enter founder name" />
                  </Field>
                </div>

                <Field label="Awards / Recognition">
                  <textarea className="textarea" rows={2} name="awardsRecognition" value={form.awardsRecognition} onChange={handleChange} placeholder="Any awards, recognitions, or notable achievements (optional)" />
                </Field>

                
              </section>

              {/*  Consent  */}
              <section className="section">
                <h3 className="sectionTitle">Use &amp; disclosure consent</h3>

                {/* Consent checkbox */}
                <div style={{
                  padding: "1rem", borderRadius: "var(--radius-lg)",
                  background: "var(--blue-soft)", border: "1px solid rgba(1,148,223,0.25)",
                }}>
                  <label style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      name="disclosureConsent"
                      checked={form.disclosureConsent}
                      onChange={handleChange}
                      style={{ width: "18px", height: "18px", accentColor: "var(--blue)", flexShrink: 0, marginTop: "2px" }}
                    />
                    <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text)", lineHeight: 1.6 }}>
                      I / We confirm that all information submitted in this application is non-confidential and may be reviewed, shared, or published for evaluation and listing purposes.{" "}
                      <strong style={{ color: "var(--orange)" }}>*</strong>
                    </span>
                  </label>
                </div>

                {/* Notice */}
                <div style={{
                  padding: "0.9rem 1rem", borderRadius: "var(--radius-lg)",
                  background: "var(--yellow-soft)", border: "1px solid rgba(252,207,2,0.4)",
                  color: "var(--yellow-hover)", fontSize: "var(--text-sm)",
                }}>
                  <strong>Note:</strong> Submitting an application does not guarantee product listing. Our team will review all company and product information, and only approved applications will be updated and published.
                </div>
              </section>
              <div style={{ display: "flex", justifyContent: "center", gap: "1rem", paddingTop: "3.75rem" }}>
              <button className="btn btnSecondary btcancel" onClick={closeModal} disabled={saving || uploadingImage || uploadingProductImages}>Cancel</button>
              <button className="btn btnPrimary btsubmit" onClick={save} disabled={saving || uploadingImage || uploadingProductImages}>
                {saving ? "Submitting…" : mode === "create" ? "Submit" : "Update"}
              </button>
              </div>
            </div>{/* /modalBody */}
          </div>
        </div>
      )}

      <ConfirmationModal show={showConfirm} config={confirmConfig} onClose={() => setShowConfirm(false)} />
      <ToastContainer position="top-center" />
    </div>
  );
}