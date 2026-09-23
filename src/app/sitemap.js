const SITE_URL = "https://www.unlockstartup.com";
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://unlock-startup-app-p497d.ondigitalocean.app";

export const revalidate = 3600;

const STATIC_PATHS = [
  "",
  "/jobs",
  "/events",
  "/competitions",
  "/investors",
  "/products",
  "/services",
  "/prices",
  "/about",
  "/ourservices",
  "/contact",
  "/faq",
  "/privacy",
  "/terms-conditions",
  "/refunds",
  "/disclamer",
];

// Detail pages built from your API.
// `pick` extracts the array from the API response (same shapes your pages use).
const DYNAMIC_SOURCES = [
  {
    basePath: "/jobs",
    endpoint: "/api/publisher/jobs/sorted",
    pick: (d) => d?.items || d?.jobs || [],
  },
  {
    basePath: "/events",
    endpoint: "/api/publisher/dashboard/getapprovedevents",
    pick: (d) => d?.items || [],
  },
  {
    basePath: "/competitions",
    endpoint: "/api/publisher/funding-calls/all",
    pick: (d) => d?.fundings || [],
  },
  {
    basePath: "/services",
    endpoint: "/api/publisher/service-listings/all",
    pick: (d) => d?.listings || [],
  },
  // /products/[id] and /investors/[id] are login-gated in the UI,
  // so they are not listed. Uncomment if you make them public:
  // { basePath: "/products",  endpoint: "/api/publisher/innovation-products/sorted", pick: (d) => d?.products || [] },
  // { basePath: "/investors", endpoint: "/api/publisher/investors/all", pick: (d) => d?.investors || d?.items || [] },
];

async function fetchDynamicUrls({ basePath, endpoint, pick }) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const items = pick(await res.json());
    return items
      .filter((item) => item?._id)
      .map((item) => {
        const modified = item.updatedAt || item.createdAt;
        return {
          url: `${SITE_URL}${basePath}/${item._id}`,
          lastModified: modified ? new Date(modified) : new Date(),
          changeFrequency: "weekly",
          priority: 0.6,
        };
      });
  } catch (err) {
    // If the API is down, the sitemap still works with the static pages
    console.error(`sitemap: failed to load ${endpoint}`, err);
    return [];
  }
}

export default async function sitemap() {
  const now = new Date();

  const staticEntries = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const dynamicEntries = (
    await Promise.all(DYNAMIC_SOURCES.map(fetchDynamicUrls))
  ).flat();

  return [...staticEntries, ...dynamicEntries];
}
