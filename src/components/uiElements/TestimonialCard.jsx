import Image from "next/image";

export default function TestimonialCard({ item }) {
  return (
    <div className="testimonial-item feedback-block-two">
      <div className="review fw-500">{item.review}</div>

      <ul className="style-none d-flex rating">
        {[...Array(5)].map((_, i) => (
          <li key={i}>
            <i className="bi bi-star-fill"></i>
          </li>
        ))}
      </ul>

      <blockquote className="mt-40 lg-mt-20 mb-50 lg-mb-30 text-dark text-italic">
        “{item.text}”
      </blockquote>

      <div className="block-footer d-flex align-items-center justify-content-between pt-35 lg-pt-20">
        <div className="d-flex align-items-center">
          <Image
            src={`/assets/images/testimonial/${item.image}`}
            alt={item.name}
            width={50}
            height={50}
            className="author-img rounded-circle"
          />

          <div className="ms-3">
            <div className="name fw-500 text-dark">{item.name}</div>
            <span className="opacity-50">{item.role}</span>
          </div>
        </div>

        <Image
          src="/assets/images/shape/shape_26.svg"
          alt="quote"
          width={50}
          height={50}
          className="quote-icon"
        />
      </div>
    </div>
  );
}
