import Link from "next/link";

const JobCta = () => {
  return (
    <section className="job-portal-intro">
      <div className="container">
        <div className="wrapper bottom-border top-border pt-60 lg-pt-40 pb-65 lg-pb-40">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="text-center text-lg-start">
                <h2>Everything your Startup Needs, all in one place.</h2>
                <p className="m0 md-pb-20">
                  Access competitions, events, jobs, investors, products, and business services through a single platform. 
                </p>
              </div>
            </div>
            <div className="col-lg-5">
              <ul className="btn-group style-none d-flex justify-content-center justify-content-lg-end">
                <li className="me-2">
                  <Link href="/jobs" className="btn-seven border6">
                    Looking for job?
                  </Link>
                </li>
                <li className="ms-2">
                  <Link href="/signup" className="btn-five border6">
                    Post a job
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobCta;
