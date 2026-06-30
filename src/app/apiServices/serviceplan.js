import publisherApi from "../publisherapi";

export const getServicePlans = () => publisherApi.get("/api/service-plans");

export const createServiceOrder = (servicePlanId, durationType) =>
  publisherApi.post("/api/service-plans/create-order", { servicePlanId, durationType });

export const verifyServicePayment = (payload) =>
  publisherApi.post("/api/service-plans/verify", payload);

export const cancelServicePlan = (payload) =>
  publisherApi.post("/api/service-plans/cancel", payload);


export default { getServicePlans, createServiceOrder, verifyServicePayment };