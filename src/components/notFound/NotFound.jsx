import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="error-page d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-5 col-md-6 ms-auto order-md-last">
            <div className="error">404</div>

            <h2>Page Not Found</h2>

            <p className="text-md">
              Can not find what you need? Take a moment and do a search below or
              start from our Homepage.
            </p>

            <Link
              href="/"
              className="btn-one w-100 d-flex align-items-center justify-content-between mt-30"
            >
              <span>GO BACK</span>

              <Image
                src="/assets/images/icon/icon_61.svg"
                alt="arrow"
                width={20}
                height={20}
              />
            </Link>
          </div>

          <div className="col-md-6 order-md-first">
            <Image
              src="/assets/images/assets/404.svg"
              alt="404 illustration"
              width={500}
              height={400}
              className="sm-mt-60"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
