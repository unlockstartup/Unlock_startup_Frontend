import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { EB_Garamond } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "../../public/assets/css/responsive.css";
import BootstrapClient from "../components/bootstrapjs/BootstrapClient";
import ConditionalShell from "@/components/ConditionalShell";
import { AuthProvider } from "@/context/AuthContext";

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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${gordita.variable} ${ebGaramond.variable}`}>
        <AuthProvider>
          <BootstrapClient />
          <ConditionalShell>
            {children}
          </ConditionalShell>
        </AuthProvider>
      </body>
    </html>
  );
}