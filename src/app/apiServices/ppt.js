import api from "../api";

export const getPptTemplates = () => api.get("/api/ppt");

export const getPptTemplate = (idOrSlug) => api.get(`/api/ppt/${idOrSlug}`);

export const createPptOrder = (payload) => api.post("/api/ppt/create-order", payload);

export const verifyPptPayment = (payload) => api.post("/api/ppt/verify", payload);

export const getPptPurchaseStatus = (token) => api.get(`/api/ppt/purchase/${token}`);

// Full backend URL — the browser navigates here directly so the file downloads as an attachment
export const pptDownloadUrl = (downloadPath) => `${api.defaults.baseURL}${downloadPath}`;

export const downloadsLeftLabel = (n) => `${n} download${n === 1 ? "" : "s"} left`;

// Download tokens are remembered per template so returning buyers can re-download
const STORAGE_KEY = "ppt_downloads";

export const getSavedPptToken = (templateId) => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")[templateId] || null;
  } catch {
    return null;
  }
};

export const savePptToken = (templateId, token) => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    saved[templateId] = token;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch {
    /* storage unavailable — the emailed link still works */
  }
};

export default {
  getPptTemplates,
  getPptTemplate,
  createPptOrder,
  verifyPptPayment,
  getPptPurchaseStatus,
};
