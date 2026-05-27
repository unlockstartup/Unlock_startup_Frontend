import publisherApi from "../publisherapi";

export const getPlans = () => publisherApi.get("/api/subscription/plans");

export const getPublisherPlanInfo = () => publisherApi.get("/api/publisher/dashboard/getmyplan");

export const createOrder = (durationInMonths) =>
  publisherApi.post("/api/subscription/create-order", { durationInMonths });

export const verifyPayment = (payload) => publisherApi.post("/api/subscription/verify", payload);

export default { getPlans, createOrder, verifyPayment };
