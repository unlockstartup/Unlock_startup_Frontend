"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb({ title, dynamicTitle }) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((item) => item);

  return (
    <div className="inner-banner-one" style={{ padding: "0px", backgroundColor: "transparent" }}>
      <div className="container">
        <div className="position-relative">
          <div className="row">
            <div className="col-12 m-auto text-center">
              <ul className="style-none d-flex justify-content-center page-pagination mt-15">
                <li style={{ color: "#0298df", fontWeight: "bold" }}>
                  <Link href="/">Home</Link>
                </li>

                {pathSegments.map((segment, index) => {
                  const href = "/" + pathSegments.slice(0, index + 1).join("/");
                  const isLast = index === pathSegments.length - 1;

                  // Use dynamicTitle for last segment if provided, else format the segment
                  const formattedName = isLast && dynamicTitle
                    ? dynamicTitle
                    : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

                  return (
                    <li key={href} className="d-flex">
                      <i className="bi bi-chevron-right mx-2 mt-1" style={{ color: "#0298df", fontWeight: "bold" }}></i>
                      {isLast ? (
                        <span style={{ color: "#0298df", fontWeight: "bold" }}>{formattedName}</span>
                      ) : (
                        <Link href={href} style={{ color: "#0298df", fontWeight: "bold" }}>{formattedName}</Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
