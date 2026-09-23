import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { EB_Garamond } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "../../public/assets/css/responsive.css";
import BootstrapClient from "../components/bootstrapjs/BootstrapClient";
import ConditionalShell from "@/components/ConditionalShell";
import { AuthProvider } from "@/context/AuthContext";
import CookieBanner from "@/components/Cookie-Policy";
import Script from "next/script";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const gordita = localFont({
  src: [
    {
      path: "../../public/assets/fonts/gordita/gordita_regular-webfont.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/gordita/gordita_medium-webfont.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-gordita",
});

export const metadata = {
  title: "Unlock Startup",
  description: "Unlock Startup",
  icons: {
    icon: '/unlock-startup.png'
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${gordita.variable} ${ebGaramond.variable}`}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-SMHZ7VMP37"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SMHZ7VMP37');
          `}
        </Script>
<meta name="google-site-verification" content="P8RkaI14F8mS7QsEHhZu_0SHRpF-u5OVeDkj-scX_kY" />
          <title>Startup Competitions in India | Apply Online And  Upcoming Contests</title>

<meta name="description" content="Discover upcoming startup competitions in India, startup idea competitions, online contests, innovation challenges and hardware technology competitions. Find competitions for idea-stage startups, founders and innovators, check last dates and apply online. Call +91-9266733959 for more information.">

<meta name="keywords" content="startup showcase competitions in India, startup idea competitions in India, apply for startup competitions online in India, upcoming startup competitions in India, startup competitions with last date in India, idea stage startup competitions in India, online startup competitions for innovators in India, hardware technology startup competition in India, startup competitions for founders in Delhi, platform to discover startup competitions in India, +91-9266733959">
          
        <AuthProvider>
          <BootstrapClient />
          <ConditionalShell>
            {children}
          </ConditionalShell>
          <CookieBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
