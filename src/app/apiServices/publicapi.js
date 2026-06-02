import publisherApi from "../publisherapi";

export const getPublicChallengeCategories = (competitionTypeId = "") =>
  publisherApi.get(`/api/public/competition-categories${competitionTypeId ? `?competitionType=${competitionTypeId}` : ""}`);

export const getPublicCompetitionTypes = () => publisherApi.get("/api/public/competition-types");

export const getPublicOrganizerTypes = () =>
  publisherApi.get("/api/public/organizer-types");

export const getPublicStartupStages = () =>
  publisherApi.get("/api/public/startup-stages");

export const getPublicEventCategories = (eventTypeId = "") =>
  publisherApi.get(`/api/public/event-categories${eventTypeId ? `?eventType=${eventTypeId}` : ""}`);

export const getPublicEventTypes = () =>
  publisherApi.get("/api/public/event-types");

//  Service 
export const getPublicServiceTypes = () =>
  publisherApi.get("/api/public/service-types");

export const getPublicServiceCategories = () =>
  publisherApi.get("/api/public/service-categories");

//  Jobs 
export const getPublicJobTypes = () =>
  publisherApi.get("/api/public/job-types/active");

export const getPublicJobCategories = (jobTypeId = "") =>
  publisherApi.get(`/api/public/job-categories${jobTypeId ? `?jobType=${jobTypeId}` : ""}`);

export const getPublicWorkModes = () =>
  publisherApi.get("/api/public/work-modes/active");

export const getPublicWorkExperiences = () =>
  publisherApi.get("/api/public/work-experiences/active");

//  Investors 
export const getPublicInvestorTypes = () =>
  publisherApi.get("/api/public/investor-types/active");

export const getPublicPreferredStages = () =>
  publisherApi.get("/api/public/preferred-stages/active");

//  Products Status 
export const getPublicPatentStatuses = () =>
  publisherApi.get("/api/public/patent-status/active");

export const getPublicProductStatuses = () =>
  publisherApi.get("/api/public/product-status/active");

export const getPublicInnovationStatuses = () =>
  publisherApi.get("/api/public/innovation-status/active");

export const TrackPublicAppyClick = (listingId) =>
  publisherApi.post(`/api/public/listings/${listingId}/track-apply`);

export const TrackProductAppyClick = (productId) =>
  publisherApi.post(`/api/public/products/${productId}/track-apply`);