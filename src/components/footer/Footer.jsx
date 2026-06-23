import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <div className="footer-one">
      <div className="container">
        <div className="inner-wrapper">
          <div className="row justify-content-between text-center text-lg-start footer-row">

            <div className="col-xl-4 col-lg-3 col-sm-6 footer-intro mb-15 footer-intro-col" style={{display: "flex" , flexDirection: "column", alignItems: "center"}}>
              <div className="logo mb-25">
                <Link href="/" className="footer-logo">
                  <Image
                    src="/assets/images/logo/logo_04.png"
                    alt="logo"
                    width={150}
                    height={60}
                    style={{ height: "auto" }}
                  />
                </Link>
              </div>
              <p className="mb-20" style={{ fontSize: "14px", lineHeight: "1.7", color: "#6b7280", maxWidth: "300px", margin: "0 auto 20px" }}>
                Empowering startups to scale faster — connecting founders with the right investors, opportunities, and resources to build what matters.
              </p>
              {/* <Link href="mailto:contact@unlockstartup.com" className="email fw-500">
                contact@unlockstartup.com
              </Link> */}
            </div>

            {/* Nav columns — wrap into 3×3 grid on tablet */}
            <div className="footer-nav-grid">

              {/* Company */}
              <div className="footer-nav-col">
                <h5 className="footer-title">Company</h5>
                <ul className="footer-nav-link style-none">
                  <li><Link href="/about">About us</Link></li>
                  <li><Link href="https://blog.unlockstartup.com/" target="_blank" rel="noopener noreferrer">Blogs</Link></li>
                </ul>
              </div>

              {/* Services */}
              <div className="footer-nav-col">
                <h5 className="footer-title">Services</h5>
                <ul className="footer-nav-link style-none">
                  <li><Link href="/ourservices">Our Services</Link></li>
                  <li><Link href="/competitions">Competitions</Link></li>
                  <li><Link href="/events">Events</Link></li>
                  <li><Link href="/prices">Pricing</Link></li>
                  <li><Link href="/jobs">Jobs</Link></li>
                  <li><Link href="/investors">Investor</Link></li>
                  <li><Link href="/products">Products</Link></li>
                </ul>
              </div>

              {/* Legal */}
              <div className="footer-nav-col">
                <h5 className="footer-title">Legal</h5>
                <ul className="footer-nav-link style-none">
                  <li><Link href="/privacy">Privacy</Link></li>
                  <li><Link href="/terms-conditions">Terms & conditions</Link></li>
                  <li><Link href="/refunds">Refund / Cancellation Policy</Link></li>
                  <li><Link href="/cookie-policy">Cookie policy</Link></li>
                </ul>
              </div>

              {/* Support */}
              <div className="footer-nav-col">
                <h5 className="footer-title">Support</h5>
                <ul className="footer-nav-link style-none">
                  <li><Link href="/contact">Contact Us</Link></li>
                  <li><Link href="/faq">FAQs</Link></li>
                </ul>
              </div>

              {/* Socials */}
              <div className="footer-nav-col footer-social-col">
                <h5 className="footer-title">Follow Us</h5>
<ul className="style-none d-flex social-icon gap-3 footer-social-list">
  <li>
    <a href="https://wa.me/919266733959" target="_blank" rel="noopener noreferrer">
      <i className="bi bi-whatsapp"></i>
    </a>
  </li>

  <li>
    <a href="https://www.facebook.com/unlockstartup" target="_blank" rel="noopener noreferrer">
      <i className="bi bi-facebook"></i>
    </a>
  </li>

  <li>
    <a href="https://www.linkedin.com/company/unlock-startup" target="_blank" rel="noopener noreferrer">
      <i className="bi bi-linkedin"></i>
    </a>
  </li>
</ul>
              </div>

            </div>{/* end footer-nav-grid */}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
{/* Bottom Footer */}
<div className="bottom-footer">
  <div className="container">
    <div className="row align-items-center" style={{ position: "relative" }}>
      <div className="col-12">
        <p className="text-center mb-15">
          Copyright © {new Date().getFullYear()} Unlock Startup. All rights reserved.
        </p>
      </div>
      <p style={{
        position: "absolute",
        right: "16px",
        bottom: "0",
        fontSize: "12px",
        color: "#9ca3af",
        margin: 0,
        whiteSpace: "nowrap"
      }}>
        🇮🇳 Services available for India only
      </p>
    </div>
  </div>
</div>
    </div>
  );
}
