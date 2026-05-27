import Link from "next/link";
import Image from "next/image";

const companyServiceCard = ({ service }) => {
  return (
    <div className="col-lg-4 col-md-6">
      <div className="service-block h-100">
        <div className="service-block-top text-center">
          <Link
            href={`/services/${service.slug}`}
            className="company-logo d-block"
          >
            <Image
              src={`/assets/images/services/${service.companyImage}`}
              alt="company-logo"
              width={100}
              height={100}
              className="lazy-img mx-auto"
            />
          </Link>
          <h5 className="text-center service-title">{service.company}</h5>

          <div className="services-wrapper d-flex flex-wrap justify-content-center gap-3 mt-20">
            {service.servicesDetails.map((item) => (
              <span className="block-service-item border" key={item.id}>
                {item.title}
              </span>
            ))}
          </div>
          <p className="mt-20">Experience: {service.experience}</p>
          <p className="mb-0">Availability: {service.availability}</p>
        </div>
        <div className="bottom-line d-flex">
          <Link href={`tel:${service.phone}`}>Call Now</Link>
          <Link href={`/services/${service.slug}`}>View More</Link>
        </div>
      </div>
    </div>
  );
};

export default companyServiceCard;
