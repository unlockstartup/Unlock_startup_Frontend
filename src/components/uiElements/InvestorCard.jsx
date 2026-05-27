import Link from "next/link";
import Image from "next/image";

export default function InvestorCard({ investor }) {
  const displayName = investor.fundName || investor.name || "Unnamed Investor";
  const companyName = investor.publisherId?.organizationName || "N/A";
  const location = investor.officeLocation || investor.publisherId?.officeLocation || "N/A";
  const stages = investor.preferredStages?.join(", ") || "Not specified";
  const investorType = investor.investorType || "Not specified";

  const logoSrc =
    investor.logo && investor.logo.startsWith("http")
      ? investor.logo
      : `/assets/images/assets/default-investor-logo.png`;

  return (
    <div className="investor-block text-center">
      {/* Fixed-size image container — always same height */}
      <div className="img-parent mb-20">
        <Image
          src={logoSrc}
          alt={displayName}
          width={130}
          height={120}
          className="m-auto rounded-circle"
          unoptimized={!!investor.logo && investor.logo.startsWith("http")}
        />
      </div>

      {/* Title — fixed height, clamps overflow */}
      <div className="card-title-wrap">
        <h4>
          <Link href={`/investors/${investor._id}`} className="name fw-500 tran3s">
            {displayName}
          </Link>
        </h4>
      </div>

      {/* Body — grows to fill available space, pushing button to bottom */}
      <div className="card-body-wrap" style={{color: "black"}}>
        <p className="mb-0 company">Investor Type: {investorType}</p>
        <p className="mb-0 company">Company: {companyName}</p>
        <p className="mb-0 company">Stage: {stages}</p>
        <p className="mb-0 location">Location: {location}</p>
      </div>

      {/* Button always pinned to bottom */}
      <div className="btn-parent">
        <Link href={`/investors/${investor._id}`} className="know-more-btn mt-20 theme_button">
          View Profile
        </Link>
      </div>
    </div>
  );
}