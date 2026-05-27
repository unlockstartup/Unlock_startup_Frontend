export default function HowItWorks() {
  return (
    <section className="how-it-works-two position-relative pt-130 xl-pt-110">
      <div className="container">
        <div className="title-one d-flex align-items-center justify-content-between text-center mb-45 lg-mb-20">
          <span className="line"></span>
          <h2 className="fw-600 ps-3 pe-3">How it’s Work?</h2>
          <span className="line"></span>
        </div>

        <div className="border-bottom border-md0">
          <div className="row justify-content-center">
            {/* Step 1 */}
            <div className="col-lg-4 col-md-6">
              <div className="card-style-five text-center position-relative mt-25 pb-35 lg-pb-20 wow fadeInUp">
                <div className="numb fw-500 d-flex align-items-center justify-content-center m-auto">
                  <span>01</span>
                </div>

                <div className="title fw-500 text-lg text-dark mt-25 mb-10">
                  Create Account
                </div>

                <p>It’s very easy to open an account and start your journey.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="col-lg-4 col-md-6">
              <div
                className="card-style-five text-center position-relative mt-25 pb-35 lg-pb-20 wow fadeInUp"
                data-wow-delay="0.1s"
              >
                <div className="numb fw-500 d-flex align-items-center justify-content-center m-auto">
                  <span>02</span>
                </div>

                <div className="title fw-500 text-lg text-dark mt-25 mb-10">
                  Complete your profile
                </div>

                <p>
                  Complete your profile with all the info to get attention of
                  client.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="col-lg-4 col-md-6">
              <div
                className="card-style-five text-center position-relative mt-25 pb-35 lg-pb-20 wow fadeInUp"
                data-wow-delay="0.19s"
              >
                <div className="numb fw-500 d-flex align-items-center justify-content-center m-auto">
                  <span>03</span>
                </div>

                <div className="title fw-500 text-lg text-dark mt-25 mb-10">
                  Apply job or hire
                </div>

                <p>
                  Apply & get your preferable jobs with all the requirements and
                  get it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
