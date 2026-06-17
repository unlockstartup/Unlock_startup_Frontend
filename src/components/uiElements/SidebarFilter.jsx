"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import api from "@/app/api";
import "./filter.css";

const API_OPTION_MAP = {
  eventType:         { url: "/api/public/event-types",              dataKey: "eventTypes"       },
  category:          { url: "/api/public/event-categories",         dataKey: "categories"       },
  challengeType:     { url: "/api/public/competition-types",        dataKey: "competitionTypes" },
  challengeCategory: { url: "/api/public/competition-categories",   dataKey: "categories"       },
  startupStage:      { url: "/api/public/startup-stages",           dataKey: "stages"           },
  jobType:           { url: "/api/public/job-types/active",         dataKey: "data"             },
  jobCategory:       { url: "/api/public/job-categories",           dataKey: "categories"       },
  workMode:          { url: "/api/public/work-modes/active",        dataKey: "data"             },
  experienceLevel:   { url: "/api/public/work-experiences/active",  dataKey: "data"             },
  investorType:      { url: "/api/public/investor-types/active",    dataKey: "data"             },
  preferredStages:   { url: "/api/public/preferred-stages/active",  dataKey: "data"             },
  serviceType:       { url: "/api/public/service-types",            dataKey: "serviceTypes"     },
  serviceCategory:   { url: "/api/public/service-categories",       dataKey: "categories"       },
  patentStatus:      { url: "/api/public/patent-status/active",     dataKey: "statuses"         },
  productStatus:     { url: "/api/public/product-status/active",    dataKey: "statuses"         },
};

//  Cascade map: selecting a type re-fetches its child categories 
// typeKey         → which filter key triggers the cascade
// categoryKey     → which filter key receives the filtered results
// categoryParam   → query param name expected by the categories endpoint
const CASCADE_MAP = {
  eventType:     { categoryKey: "category",          categoryParam: "eventType"       },
  challengeType: { categoryKey: "challengeCategory", categoryParam: "competitionType" },
  jobType:       { categoryKey: "jobCategory",       categoryParam: "jobType"         },
  serviceType:   { categoryKey: "serviceCategory",   categoryParam: "serviceType"     },
};

const INDIA_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam",
  "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const FILTER_CONFIGS = {
  jobs: [
    { key: "jobType",         label: "Job Type",         type: "checkbox-group"      },
    { key: "jobCategory",     label: "Job Category",     type: "checkbox-group"      },
    { key: "workMode",        label: "Work Mode",        type: "checkbox-group"      },
    { key: "experienceLevel", label: "Experience Level", type: "select"              },
    { key: "location",        label: "Location",         type: "searchable-checkbox" },
  ],
  investors: [
    { key: "investorType",    label: "Investor Type",    type: "checkbox-group"      },
    { key: "preferredStages", label: "Preferred Stages", type: "checkbox-group"      },
    { key: "location",        label: "Location",         type: "searchable-checkbox" },
  ],
  events: [
    { key: "eventType",   label: "Event Type",     type: "checkbox-group"      },
    { key: "category",    label: "Event Category", type: "checkbox-group"      },
    { key: "eventFormat", label: "Event Format",   type: "checkbox-group"      },
    { key: "state",       label: "Location",       type: "searchable-checkbox" },
  ],
  competitions: [
    { key: "challengeType",     label: "Competition Type",     type: "checkbox-group"      },
    { key: "challengeCategory", label: "Competition Category", type: "checkbox-group"      },
    { key: "startupStage",      label: "Startup Stage",        type: "checkbox-group"      },
    { key: "location",          label: "Location",             type: "searchable-checkbox" },
  ],
  products: [
    { key: "innovationCategory", label: "Product Category", type: "checkbox-group" },
    { key: "productStatus",      label: "Product Status",   type: "checkbox-group" },
    { key: "patentStatus",      label: "Patent Status",   type: "checkbox-group" },
  ],
services: [
  { key: "serviceType",     label: "Service Type",     type: "checkbox-group"      },
  { key: "serviceCategory", label: "Service Plan", type: "checkbox-group"      },
  { key: "state",           label: "Location",         type: "searchable-checkbox" },
],
};

function getDynamicOptions(config, items = []) {
  if (config.key === "location" || config.key === "state") return INDIA_STATES;
  const unique = new Set();
  items.forEach((item) => {
    let value = item[config.key];
    if (Array.isArray(value)) value.forEach((v) => { if (v != null) unique.add(String(v).trim()); });
    else if (value != null) unique.add(String(value).trim());
  });
  let options = Array.from(unique).sort((a, b) => a.localeCompare(b));
  if (config.type === "select") options = ["All", ...options];
  return options;
}

//  Sub-components 
function CheckboxGroup({ config, values, onChange }) {
  return (
    <div className="sf-group">
      <div className="sf-checkbox-list">
        {config.options.map((opt) => {
          const checked = values.includes(opt);
          return (
            <label key={opt} className="sf-checkbox-row">
              <input type="checkbox" checked={checked} onChange={() => {
                onChange(config.key, checked ? values.filter((v) => v !== opt) : [...values, opt]);
              }} />
              <span className="sf-checkbox-box">
                {checked && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className="sf-checkbox-label">{opt}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function SearchableCheckboxGroup({ config, values, onChange }) {
  const [query, setQuery] = useState("");
  const filtered = config.options.filter((opt) => opt.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="sf-group">
      <div className="sf-search" style={{ marginBottom: 10 }}>
        <svg className="sf-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input type="text" placeholder="Search locations" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="sf-checkbox-list" style={{ maxHeight: 220, overflowY: "auto", paddingRight: 4 }}>
        {filtered.length === 0 ? (
          <span style={{ fontSize: 13, color: "#9ca3af" }}>No results</span>
        ) : filtered.map((opt) => {
          const checked = values.includes(opt);
          return (
            <label key={opt} className="sf-checkbox-row">
              <input type="checkbox" checked={checked} onChange={() => {
                onChange(config.key, checked ? values.filter((v) => v !== opt) : [...values, opt]);
              }} />
              <span className="sf-checkbox-box">
                {checked && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className="sf-checkbox-label">{opt}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function SelectGroup({ config, value, onChange }) {
  return (
    <div className="sf-group">
      <div className="sf-select-wrapper">
        <select className="sf-select" value={value || config.options[0]} onChange={(e) => onChange(config.key, e.target.value)}>
          {config.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <svg className="sf-select-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function ActivePills({ filters, configs, onRemove }) {
  const pills = [];
  configs.forEach((config) => {
    const val = filters[config.key];
    if (!val) return;
    if (Array.isArray(val)) val.forEach((v) => pills.push({ key: config.key, value: v, label: v }));
    else if (val !== "All") pills.push({ key: config.key, value: val, label: val });
  });
  if (!pills.length) return null;
  return (
    <div className="sf-pills">
      {pills.map((p, i) => (
        <span key={i} className="sf-pill">
          {p.label}
          <button className="sf-pill-remove" onClick={() => onRemove(p.key, p.value)}>×</button>
        </span>
      ))}
    </div>
  );
}

//  Main component 
export default function SidebarFilter({ pageType, onFilterChange, searchPlaceholder, items = [] }) {
  const configs = FILTER_CONFIGS[pageType] || [];

  // apiOptions: name strings shown in checkboxes  { [filterKey]: string[] }
  const [apiOptions,     setApiOptions]     = useState({});
  // rawTypeObjects: full objects { _id, name } for type keys only — needed for cascade ID lookup
  const [rawTypeObjects, setRawTypeObjects] = useState({});

  const [pendingSearch,  setPendingSearch]  = useState("");
  const [pendingFilters, setPendingFilters] = useState({});
  const [appliedSearch,  setAppliedSearch]  = useState("");
  const [appliedFilters, setAppliedFilters] = useState({});
  const [collapsed,      setCollapsed]      = useState({});
  const [mobileOpen,     setMobileOpen]     = useState(false);

  // Track previous type selections so we only re-fetch on actual change
  const prevTypeFilters = useRef({});

  //  Initial fetch: all types + all categories (unfiltered) 
  useEffect(() => {
    if (!configs.length) return;

    const fetchAll = async () => {
      const urlMap = {};
      configs.forEach((c) => {
        const mapping = API_OPTION_MAP[c.key];
        if (!mapping) return;
        if (!urlMap[mapping.url]) urlMap[mapping.url] = [];
        urlMap[mapping.url].push({ key: c.key, dataKey: mapping.dataKey });
      });

      const nameResults = {};
      const rawResults  = {};

      await Promise.all(
        Object.entries(urlMap).map(async ([url, keyMaps]) => {
          try {
            const res = await api.get(url);
            keyMaps.forEach(({ key, dataKey }) => {
              const raw = res.data?.[dataKey] ?? res.data ?? [];
              const arr = Array.isArray(raw) ? raw : [];
              // Store full objects for type keys (needed for cascade ID lookup)
              if (CASCADE_MAP[key]) rawResults[key] = arr;
              nameResults[key] = arr.map((i) => (typeof i === "string" ? i : i.name)).filter(Boolean);
            });
          } catch { /* silently ignore */ }
        })
      );

      setApiOptions(nameResults);
      setRawTypeObjects(rawResults);
    };

    fetchAll();
    prevTypeFilters.current = {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageType]);

  //  Cascade: re-fetch category options whenever a type filter changes 
  useEffect(() => {
    const cascadeEntries = Object.entries(CASCADE_MAP).filter(([typeKey]) =>
      configs.some((c) => c.key === typeKey)
    );
    if (!cascadeEntries.length) return;

    cascadeEntries.forEach(async ([typeKey, { categoryKey, categoryParam }]) => {
      const selectedNames = pendingFilters[typeKey] ?? [];
      const prevNames     = prevTypeFilters.current[typeKey] ?? [];

      // Skip if nothing changed for this type key
      if (JSON.stringify(selectedNames) === JSON.stringify(prevNames)) return;
      prevTypeFilters.current[typeKey] = selectedNames;

      const mapping = API_OPTION_MAP[categoryKey];
      if (!mapping) return;

      if (!selectedNames.length) {
        // No type selected → restore full unfiltered category list
        try {
          const res = await api.get(mapping.url);
          const raw = res.data?.[mapping.dataKey] ?? [];
          setApiOptions((prev) => ({
            ...prev,
            [categoryKey]: raw.map((i) => (typeof i === "string" ? i : i.name)).filter(Boolean),
          }));
        } catch { /* ignore */ }
        return;
      }

      // Resolve selected type names → _id values using stored raw objects
      const typeObjects  = rawTypeObjects[typeKey] ?? [];
      const selectedIds  = selectedNames
        .map((name) => typeObjects.find((t) => t.name === name)?._id)
        .filter(Boolean);

      if (!selectedIds.length) return;

      // Fetch categories for each selected type ID and merge results
      try {
        const results = await Promise.all(
          selectedIds.map((id) => api.get(`${mapping.url}?${categoryParam}=${id}`))
        );
        const merged  = new Map();
        results.forEach((res) => {
          const raw = res.data?.[mapping.dataKey] ?? [];
          raw.forEach((i) => {
            const name = typeof i === "string" ? i : i.name;
            if (name) merged.set(name, name);
          });
        });
        const names = Array.from(merged.keys()).sort((a, b) => a.localeCompare(b));

        setApiOptions((prev) => ({ ...prev, [categoryKey]: names }));

        // Clear any previously selected categories that no longer exist in the new list
        setPendingFilters((prev) => {
          const existing = prev[categoryKey] ?? [];
          const valid    = existing.filter((v) => names.includes(v));
          if (valid.length === existing.length) return prev;
          const next = { ...prev, [categoryKey]: valid };
          if (!next[categoryKey].length) delete next[categoryKey];
          return next;
        });
      } catch { /* ignore */ }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingFilters, rawTypeObjects]);

const configsWithOptions = useMemo(() => {
  return configs.map((config) => {
    let opts = apiOptions[config.key]?.length
      ? (config.type === "select" ? ["All", ...apiOptions[config.key]] : apiOptions[config.key])
      : getDynamicOptions(config, items);

    if (config.key === "challengeCategory") {
      opts = [...opts].reverse();
    }

    return { ...config, options: opts };
  });
}, [configs, items, apiOptions]);

  const hasPendingChanges = useMemo(() => {
    if (pendingSearch !== appliedSearch) return true;
    const allKeys = new Set([...Object.keys(pendingFilters), ...Object.keys(appliedFilters)]);
    for (const key of allKeys) {
      if (JSON.stringify(pendingFilters[key]) !== JSON.stringify(appliedFilters[key])) return true;
    }
    return false;
  }, [pendingSearch, pendingFilters, appliedSearch, appliedFilters]);

  const hasPendingActive =
    pendingSearch ||
    Object.values(pendingFilters).some((v) => (Array.isArray(v) ? v.length > 0 : Boolean(v)));

  //  Filter update helpers 
  const updatePendingFilter = (key, value) => {
    const next = { ...pendingFilters, [key]: value };
    const config = configs.find((c) => c.key === key);
    if (config?.type === "select" && value === "All") delete next[key];
    setPendingFilters(next);
  };

  const removePendingFilter = (key, value) => {
    const current = pendingFilters[key];
    let updated;
    if (Array.isArray(current)) {
      const filtered = current.filter((v) => v !== value);
      updated = { ...pendingFilters, [key]: filtered.length ? filtered : undefined };
    } else {
      updated = { ...pendingFilters, [key]: undefined };
    }
    if (!updated[key]) delete updated[key];
    setPendingFilters(updated);
  };

  const applyFilters = () => {
    setAppliedSearch(pendingSearch);
    setAppliedFilters(pendingFilters);
    onFilterChange?.({ search: pendingSearch, ...pendingFilters });
    setMobileOpen(false);
  };

  const clearAll = () => {
    setPendingSearch("");
    setPendingFilters({});
    setAppliedSearch("");
    setAppliedFilters({});
    prevTypeFilters.current = {};
    onFilterChange?.({ search: "" });
  };

  const toggleCollapse = (key) => setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  //  Inner render 
  const renderInnerContent = () => (
    <>
      <div className="sf-scroll-body">
        {/* Search */}
        <div className="sf-search">
          <svg className="sf-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder={searchPlaceholder || "Search…"}
            value={pendingSearch}
            onChange={(e) => setPendingSearch(e.target.value)}
          />
        </div>

        <ActivePills filters={pendingFilters} configs={configs} onRemove={removePendingFilter} />
        {hasPendingActive && <div className="sf-divider" />}

        {/* Filter groups */}
        {configsWithOptions.map((config) => {
          const isOpen = !collapsed[config.key];
          const value  = pendingFilters[config.key];

          // Show a hint on category filters when their parent type is active
          const parentTypeKey = Object.keys(CASCADE_MAP).find(
            (tk) => CASCADE_MAP[tk].categoryKey === config.key
          );
          const parentSelected = parentTypeKey
            ? (pendingFilters[parentTypeKey] ?? []).length > 0
            : false;

          return (
            <div key={config.key} className="sf-group">
              <div className="sf-group-header" onClick={() => toggleCollapse(config.key)} role="button" aria-expanded={isOpen}>
                <div className="sf-group-label">
                  {config.label}
                  {parentSelected && (
                    <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 400, marginLeft: 6 }}>
                      (filtered)
                    </span>
                  )}
                </div>
                <svg className={`sf-collapse-icon ${isOpen ? "open" : ""}`} width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {isOpen && (
                config.type === "checkbox-group" ? (
                  <CheckboxGroup
                    config={config}
                    values={Array.isArray(value) ? value : []}
                    onChange={updatePendingFilter}
                  />
                ) : config.type === "searchable-checkbox" ? (
                  <SearchableCheckboxGroup
                    config={config}
                    values={Array.isArray(value) ? value : []}
                    onChange={updatePendingFilter}
                  />
                ) : (
                  <SelectGroup config={config} value={value} onChange={updatePendingFilter} />
                )
              )}
            </div>
          );
        })}
      </div>

      <button className="sf-apply-btn" onClick={applyFilters} disabled={!hasPendingChanges}>
        Apply filters
      </button>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sf-sidebar">
        <div className="sf-header">
          <span className="sf-title">Filter</span>
          {hasPendingActive && <button className="sf-clear-btn" onClick={clearAll}>Clear all</button>}
        </div>
        {renderInnerContent()}
      </aside>

      {/* Mobile trigger */}
      <button className="sf-mobile-trigger" onClick={() => setMobileOpen(true)} aria-label="Open filters">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        Filters
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="sf-mobile-overlay" onClick={() => setMobileOpen(false)}>
          <div className="sf-mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="sf-mobile-drawer-header">
              <span className="sf-title">Filter</span>
              <div className="sf-mobile-actions">
                {hasPendingActive && <button className="sf-clear-btn" onClick={clearAll}>Clear all</button>}
                <button className="sf-close-drawer" onClick={() => setMobileOpen(false)} aria-label="Close filters">×</button>
              </div>
            </div>
            <div className="sf-mobile-content">{renderInnerContent()}</div>
          </div>
        </div>
      )}
    </>
  );
}