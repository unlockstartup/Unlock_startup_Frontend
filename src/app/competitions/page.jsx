"use client";

import { useEffect, useState, useMemo } from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import FundingCard from "@/components/uiElements/FundingCard";
import SidebarFilter from "@/components/uiElements/SidebarFilter";
import api from "@/app/api";

const Page = () => {
  const [fundings, setFundings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    const fetchFundings = async () => {
      try {
        const res = await api.get("/api/publisher/funding-calls/all");
        const mapped = res.data.fundings.map((item) => ({
          slug:                   item._id,
          title:                  item.title ?? "",
          description:            item.description ?? "",
          organizingCompany:      item.organizingCompany ?? "",
          organizerType:          item.organizerType ?? "",
          contactPersonName:      item.contactPersonName ?? "",
          officialEmail:          item.officialEmail ?? "",
          contactPhone:           item.contactPhone ?? "",
          publisherName:          item.publisherId?.organizationName ?? "",
          challengeType:          item.challengeType ?? "",
          challengeCategory:      item.challengeCategory ?? "",
          challengeObjective:     item.challengeObjective ?? "",
          startupStage:           item.startupStage ?? "",
          geographicRestrictions: item.geographicRestrictions ?? "",
          launchDate:             item.launchDate ?? null,
          submissionDeadline:     item.submissionDeadline ?? null,
          resultDate:             item.resultDate ?? null,
          keyFocusAreas:          item.keyFocusAreas ?? "",
          eligibleParticipants:   item.eligibleParticipants ?? "",
          eligibilityVerification: item.eligibilityVerification ?? [],
          additionalRewards:      item.additionalRewards ?? [],
          applicationFee:         item.applicationFee ?? 0,
          registrationLink:       item.registrationLink ?? "",
          attachments:            item.attachments ?? [],
          location:               item.location ?? "",
        }));
        setFundings(mapped);
      } catch (err) {
        setError(err?.response?.data?.message ?? "Failed to load competitions.");
      } finally {
        setLoading(false);
      }
    };
    fetchFundings();
  }, []);

  const filtered = useMemo(() => {
    let list = [...fundings];
    const { search, challengeType, challengeCategory, startupStage, geographicRestrictions, location } = activeFilters;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.title?.toLowerCase().includes(q) ||
          f.organizingCompany?.toLowerCase().includes(q) ||
          f.description?.toLowerCase().includes(q)
      );
    }
    if (challengeType?.length)
      list = list.filter((f) => challengeType.includes(f.challengeType));
    if (challengeCategory?.length)
      list = list.filter((f) => challengeCategory.includes(f.challengeCategory));
    if (startupStage?.length)
      list = list.filter((f) => startupStage.includes(f.startupStage));
    if (geographicRestrictions && geographicRestrictions !== "All")
      list = list.filter(
        (f) =>
          f.geographicRestrictions?.toLowerCase() === geographicRestrictions.toLowerCase()
      );
if (location && location !== "All") {
  list = list.filter((f) => f.location === location);
}
    list.sort((a, b) => {
      const dateA = a.submissionDeadline ? new Date(a.submissionDeadline).getTime() : 0;
      const dateB = b.submissionDeadline ? new Date(b.submissionDeadline).getTime() : 0;
      return dateB - dateA;
    });
    return list;
  }, [fundings, activeFilters]);

  return (
    <main>

      <section className="event-section pt-100 lg-pt-80 pb-100 lg-pb-80 mt-30">
        <div className="container">
          <Breadcrumb title="Competitions" />
          <div className="row g-4 mt-10">
            {/* Sidebar */}
            <div className="col-12 col-lg-3">
                      <SidebarFilter
                pageType="competitions"
                onFilterChange={setActiveFilters}
                items={fundings}
                searchPlaceholder="Search competitions…"
              />
            </div>

            {/* Main content */}
            <div className="col-12 col-lg-9">
              {loading && (
                <div className="text-center py-80">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-15">Loading Competitions...</p>
                </div>
              )}
              {!loading && error && (
                <div className="text-center py-80">
                  <p className="text-danger">{error}</p>
                </div>
              )}
              {!loading && !error && filtered.length === 0 && (
                <div className="text-center py-80">
                  <p>No competitions match your filters.</p>
                </div>
              )}
              {!loading && !error && filtered.length > 0 && (
                <div className="row g-4">
                  {filtered.map((funding, index) => (
                    <div key={funding.slug} className="col-12 col-md-6 col-xl-4">
                      <FundingCard funding={funding} index={index} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;