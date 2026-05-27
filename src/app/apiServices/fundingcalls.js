import publisherApi from "../publisherapi";

export const listFundingCalls = (params) =>
  publisherApi.get("/api/publisher/funding-calls", { params });

export const createFundingCall = (payload) =>
  publisherApi.post("/api/publisher/funding-calls", payload);

export const updateFundingCall = (id, payload) =>
  publisherApi.patch(`/api/publisher/funding-calls/${id}`, payload);

export const deleteFundingCall = (id) =>
  publisherApi.delete(`/api/publisher/funding-calls/${id}`);

export const toggleFundingCallActive = (id) =>
  publisherApi.post(`/api/publisher/funding-calls/${id}/toggle`);

