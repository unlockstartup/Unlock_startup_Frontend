import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Monitor,
  Layers,
  ArrowRight,
  Building2,
} from "lucide-react";

export default function JobListingCard({ job }) {
  const logoUrl = job.companyLogo?.url;
  const jobHref = `/jobs/${job._id}?title=${encodeURIComponent(job.title ?? "")}&company=${encodeURIComponent(job.companyName ?? "")}`;
  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

  const location = [job.jobLocationCity, job.jobLocationCountry]
    .filter(Boolean)
    .join(", ");
  const salary =
    job.salaryMin && job.salaryMax
      ? `₹${job.salaryMin.toLocaleString("en-IN")} – ₹${job.salaryMax.toLocaleString("en-IN")}`
      : job.salaryMin
        ? `From ₹${job.salaryMin.toLocaleString("en-IN")}`
        : "Salary not listed";

  // use companyId if available, otherwise fall back to slugified name
  const companySlug = job.companyId || encodeURIComponent(job.companyName || "");

  return (
    <div className="jlcWrap">
      {/* Logo */}
      <Link href={jobHref} className="jlcLogo">
        {logoUrl ? (
          <img src={logoUrl} alt={job.companyName || job.title} />
        ) : (
          (job.companyName?.[0] ?? "?").toUpperCase()
        )}
      </Link>

      {/* Main info */}
      <div className="jlcMain">
        <Link href={jobHref} className="jlcTitle">
          {capitalize(job.title)}
        </Link>
        <p className="jlcCompany">
          {capitalize(job.companyName)}
          {job.companyName && location && (
            <span className="jlcDot">·</span>
          )}
          {location}
        </p>

        {/* Badges row + "See all jobs" link side by side */}
        <div className="jlcMetaRow">
          <div className="jlcMeta">
            {job.jobType && (
              <span className="jlcChip jlcChip--type">
                <Briefcase size={12} strokeWidth={2} />
                {capitalize(job.jobType)}
              </span>
            )}
            {location && (
              <span className="jlcChip jlcChip--loc">
                <MapPin size={12} strokeWidth={2} />
                {location}
              </span>
            )}
           {job.workMode?.length > 0 && (
  <span className="jlcChip jlcChip--mode">
    <Monitor size={12} strokeWidth={2} />
    {capitalize(
      Array.isArray(job.workMode)
        ? job.workMode.join(", ")
        : job.workMode
    )}
  </span>
)}
            {job.jobCategory && (
              <span className="jlcChip jlcChip--cat">
                <Layers size={12} strokeWidth={2} />
                {capitalize(job.jobCategory)}
              </span>
            )}
          </div>

          {companySlug && (
            <Link
              href={`/jobs/company/${companySlug}`}
              className="jlcSeeAll"
              title={`All jobs at ${job.companyName}`}
            >
              <Building2 size={12} strokeWidth={2} />
              See all jobs from this company
            </Link>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="jlcRight">
        
        <Link href={jobHref} className="jlcApply theme_button">
          <ArrowRight size={13} strokeWidth={2.5} />
          Apply
        </Link>
      </div>
    </div>
  );
}