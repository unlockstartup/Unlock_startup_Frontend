import api from "@/app/api";

export const getServicePlans = () => api.get("/api/service-plans");

export const createServiceOrder = (servicePlanId, durationType) =>
  api.post("/api/service-plans/create-order", { servicePlanId, durationType });

export const verifyServicePayment = (payload) =>
  api.post("/api/service-plans/verify", payload);

export default { getServicePlans, createServiceOrder, verifyServicePayment };