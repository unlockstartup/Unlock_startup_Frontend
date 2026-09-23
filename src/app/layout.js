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
  metadataBase: new URL("https://www.unlockstartup.com"),
  title: "Unlock Startup | Jobs, Investors, Competitions & Events for Indian Startups",
  description:
    "Unlock Startup connects Indian startups and founders with jobs, investors, funding competitions, events, innovative products and professional services.",
  icons: {
    icon: "/unlock-startup.png",
  },
  verification: {
    google: "P8RkaI14F8mS7QsEHhZu_0SHRpF-u5OVeDkj-scX_kY",
  },
  openGraph: {
    type: "website",
    siteName: "Unlock Startup",
    url: "https://www.unlockstartup.com",
    title: "Unlock Startup",
    description:
      "Jobs, investors, funding competitions, events, products and services for Indian startups.",
    images: ["/unlock-startup.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unlock Startup",
    description:
      "Jobs, investors, funding competitions, events, products and services for Indian startups.",
    images: ["/unlock-startup.png"],
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
