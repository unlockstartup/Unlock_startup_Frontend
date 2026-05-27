"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

export default function ConditionalShell({ children }) {
  const pathname = usePathname();
  const isPublisher = pathname?.startsWith("/publisher");

  return (
    <>
      {!isPublisher && <Navbar />}
      {children}
      {!isPublisher && <Footer />}
    </>
  );
}