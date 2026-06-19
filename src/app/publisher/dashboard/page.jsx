"use client"

import { useEffect, useState } from "react";
import { LayoutList, CheckCircle2, Clock, MousePointerClick, CalendarClock } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import publisherApi from "@/app/publisherapi";
import "@/app/styles/publisher.css";
import "./publisher-dashboard.css"; 
import ServicePlans from "@/components/ServicePlans";
import { getPublisherPlanInfo } from "@/app/apiServices/subscriptions";
import { listFundingCalls } from "@/app/apiServices/fundingcalls";
import ListingsAnalytics from "@/components/ListingAnalystics";


export default function PublisherDashboard() {
  const [publisher, setPublisher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [planInfo, setPlanInfo] = useState(null);
  const [listingStats, setListingStats] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await publisherApi.get("/api/publisher/me");
        setPublisher(res.data?.publisher || null);
      } catch (err) {
        console.error("Failed to load publisher profile", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await getPublisherPlanInfo();
        if (res.data?.success) setPlanInfo(res.data);
      } catch (err) {
        console.error("Failed to load plan info", err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [statsRes, jobsRes, compsRes, eventsRes, productsRes, servicesRes] =
          await Promise.allSettled([
            publisherApi.get("/api/listings/apply-stats"),
            publisherApi.get("/api/publisher/jobs"),
            publisherApi.get("/api/publisher/funding-calls"),
            publisherApi.get("/api/publisher/dashboard/events"),
            publisherApi.get("/api/publisher/innovation-products/mine"),
            publisherApi.get("/api/publisher/service-listings/mine"),
          ]);

        const allListings = [
          ...(jobsRes.status === "fulfilled" ? (jobsRes.value.data?.jobs ?? jobsRes.value.data?.items ?? []) : []),
          ...(compsRes.status === "fulfilled" ? (compsRes.value.data?.items ?? compsRes.value.data?.fundings ?? []) : []),
          ...(eventsRes.status === "fulfilled" ? (eventsRes.value.data?.items ?? []) : []),
          ...(productsRes.status === "fulfilled" ? (productsRes.value.data?.products ?? []) : []),
          ...(servicesRes.status === "fulfilled" ? (servicesRes.value.data?.listings ?? []) : []),
        ];

        const activeCount = allListings.filter(l => (l.status || l.approvalStatus) === "approved").length;
        const pendingCount = allListings.filter(l => (l.status || l.approvalStatus) === "pending").length;
        const grandTotal = statsRes.status === "fulfilled" ? (statsRes.value.data?.grandTotal ?? 0) : 0;

        setListingStats({
          total: allListings.length,
          active: activeCount,
          pending: pendingCount,
          clicks: grandTotal,
        });
      } catch (err) {
        console.error("Failed to load listing stats", err);
      }
    })();
  }, []);

  const handlePaymentSuccess = async () => {
    try {
      const res = await getPublisherPlanInfo();
      if (res.data?.success) setPlanInfo(res.data);
    } catch (err) {
      console.error("Failed to refresh plan info", err);
    }
  };

  const computeDaysLeft = () => {
    if (!planInfo?.expiry) return 0;
    const expiry = new Date(planInfo.expiry);
    const diff = expiry - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = computeDaysLeft();

  const isActive =
    planInfo?.subscriptionStatus === "active" &&
    planInfo?.expiry &&
    new Date(planInfo.expiry) > new Date();

const computeServiceDaysLeft = () => {
  if (!planInfo?.serviceplan?.expiryDate) return 0;
  const expiry = new Date(planInfo.serviceplan.expiryDate);
  const diff = expiry - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const serviceDaysLeft = computeServiceDaysLeft();

const isServiceActive =
  planInfo?.servicePlanActive === true &&
  planInfo?.serviceplan?.expiryDate &&
  new Date(planInfo.serviceplan.expiryDate) > new Date();

  const isAnyLimitReached =
    planInfo?.usage && planInfo?.limits
      ? (planInfo.limits.jobLimit > 0 && planInfo.usage.jobs >= planInfo.limits.jobLimit) ||
        (planInfo.limits.eventLimit > 0 && planInfo.usage.events >= planInfo.limits.eventLimit) ||
        (planInfo.limits.fundingCallsLimit > 0 && planInfo.usage.fundingCalls >= planInfo.limits.fundingCallsLimit) ||
        (planInfo.limits.productsLimit > 0 && planInfo.usage.products >= planInfo.limits.productsLimit) ||
        (planInfo.limits.serviceListingLimit > 0 && planInfo.usage.serviceListings >= planInfo.limits.serviceListingLimit)
      : false;

  const usedPercent = (() => {
    if (!planInfo?.usage || !planInfo?.limits) return 0;
    const { usage, limits } = planInfo;
    const totalUsed =
      (usage.jobs || 0) + (usage.events || 0) + (usage.fundingCalls || 0) +
      (usage.products || 0) + (usage.serviceListings || 0);
    const totalLimit =
      (limits.jobLimit || 0) + (limits.eventLimit || 0) + (limits.fundingCallsLimit || 0) +
      (limits.productsLimit || 0) + (limits.serviceListingLimit || 0);
    if (totalLimit === 0) return null;
    return Math.min(100, Math.round((totalUsed / totalLimit) * 100));
  })();

  const statCards = [
    {
      label: "Total Listings",
      value: listingStats?.total ?? 0,
      icon: LayoutList,
      color: "#2d8cff",
      bg: "#eff6ff",
      sub: "all published listings",
    },
    {
      label: "Active Listings",
      value: listingStats?.active ?? 0,
      icon: CheckCircle2,
      color: "#059669",
      bg: "#f0fdf4",
      sub: "approved & live",
    },
    {
      label: "Pending Review",
      value: listingStats?.pending ?? 0,
      icon: Clock,
      color: "#d97706",
      bg: "#fffbeb",
      sub: "awaiting approval",
    },
    {
      label: "Total Apply Clicks",
      value: listingStats?.clicks ?? 0,
      icon: MousePointerClick,
      color: "#6d28d9",
      bg: "#f5f3ff",
      sub: "across all listings",
    },
    {
      label: "Startup Plans Days",
      value: isActive ? daysLeft : 0,
      icon: CalendarClock,
      color: isActive ? "#0284c7" : "#dc2626",
      bg: isActive ? "#f0f9ff" : "#fff1f2",
      sub: isActive ? "subscription active" : "subscription expired",
    },
    {
  label: "Service Plan Days",
  value: isServiceActive ? serviceDaysLeft : 0,
  icon: CalendarClock,
  color: isServiceActive ? "#0e7490" : "#dc2626",
  bg: isServiceActive ? "#ecfeff" : "#fff1f2",
  sub: isServiceActive ? "service plan active" : "service plan expired",
},
  ];

  return (
    <div className="publisher-container py-4 px-3 px-md-0">

      {/*  Overview Section Header  */}
      <div className="pd__section-header">
        <span className="pd__section-bar" />
        <span className="pd__section-label">Overview</span>
      </div>

      {/*  Stat Cards Grid  */}
      <div className="pd__overview-grid">
        {statCards.map(({ label, value, icon: Icon, color, bg, sub }) => (
          <div
            key={label}
            className="pd__stat-card"
            style={{
              border: `1px solid ${color}22`,
              boxShadow: `0 2px 10px ${color}18, 0 1px 4px rgba(0,0,0,0.05)`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = `0 8px 24px ${color}28, 0 2px 8px rgba(0,0,0,0.07)`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = `0 2px 10px ${color}18, 0 1px 4px rgba(0,0,0,0.05)`;
            }}
          >
            <div className="pd__stat-card-top">
              <span className="pd__stat-card-label">{label}</span>
              <div className="pd__stat-card-icon" style={{ background: bg }}>
                <Icon size={22} color={color} strokeWidth={2.2} />
              </div>
            </div>

            <div className="pd__stat-card-value" style={{ color }}>{value}</div>

            <div>
              <div className="pd__stat-card-sub">{sub}</div>
              <div
                className="pd__stat-card-bar"
                style={{ background: `linear-gradient(90deg, ${color}, ${color}33)` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/*  Listings Analytics  */}
      <ListingsAnalytics />

      {/*  Limit reached banner  */}
      {isAnyLimitReached && (
        <div className="pd__limit-banner">
          <span className="pd__limit-banner-icon">⚠</span>
          <span>
            One or more listing limits have been reached. Choose a plan below to
            upgrade and restore full publishing access.
          </span>
        </div>
      )}

      {/*  Divider  */}
      <hr className="pd__divider" />

      {/*  Subscription Plans Header  */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3 mt-2">
        <div className="pd__section-header" style={{ marginBottom: 0 }}>
          <span className="pd__section-bar" />
          <span className="pd__section-label">Startup Plans</span>
        </div>
        {!isActive && (
          <div className="pd__expired-badge">
            <span style={{ fontSize: "0.9rem" }}>⚠</span>
            <span>Subscription expired — choose a plan to restore access</span>
          </div>
        )}
      </div>

      <SubscriptionPlans planInfo={planInfo} onPaymentSuccess={handlePaymentSuccess} />

      {/*  Service Plans Header  */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3 mt-2">
        <div className="pd__section-header" style={{ marginBottom: 0 }}>
          <span className="pd__section-bar" />
          <span className="pd__section-label">Service Plans</span>
        </div>
        {!isActive && (
          <div className="pd__expired-badge">
            <span style={{ fontSize: "0.9rem" }}>⚠</span>
            <span>Subscription expired — choose a plan to restore access</span>
          </div>
        )}
      </div>

      <ServicePlans planInfo={planInfo} />
    </div>
  );
}