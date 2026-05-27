"use client";

import { useEffect, useState, useMemo } from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import ProductLaunchCard from "@/components/uiElements/ProductLaunchCard";
import SidebarFilter from "@/components/uiElements/SidebarFilter";
import api from "@/app/api";

const PER_PAGE = 3;

const Page = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/publisher/innovation-products/sorted");
        setProducts(res.data?.products || []);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Reset to page 1 whenever filters or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters, sortBy]);

  const filtered = useMemo(() => {
    let list = [...products];
    const { search, innovationCategory, productStatus, patentStatus } = activeFilters;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.productName?.toLowerCase().includes(q) ||
          p.detailedDescription?.toLowerCase().includes(q)
      );
    }
    if (innovationCategory?.length)
      list = list.filter((p) => innovationCategory.includes(p.innovationCategory));
    if (productStatus?.length)
      list = list.filter((p) => productStatus.includes(p.productStatus));
    if (patentStatus?.length)
      list = list.filter((p) => patentStatus.includes(p.patentStatus));

    // Sort
    if (sortBy === "latest")
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return list;
  }, [products, activeFilters, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <main>
      <section className="product-page pt-100 lg-pt-80 pb-100 lg-pb-80">
        <div className="container mt-30">
          <Breadcrumb title="Products" />
          <div className="row g-4 mt-10">
            {/* Sidebar */}
            <div className="col-12 col-lg-3">
              <SidebarFilter
                pageType="products"
                onFilterChange={setActiveFilters}
                items={products}
                searchPlaceholder="Search products…"
              />
            </div>

            {/* Main content */}
            <div className="col-12 col-lg-9">

              {/* Top bar */}
              <div className="d-flex justify-content-between align-items-center mb-25">
                <span className="text-muted" style={{ fontSize: 13 }}>
                  {filtered.length} {filtered.length === 1 ? "product" : "products"} found
                </span>
                <div className="d-flex align-items-center gap-2">
                  <span className="text-dark fw-500" style={{ fontSize: 13 }}>Sort:</span>
                  <select
                    className="form-select form-select-sm"
                    style={{ width: "auto" }}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="latest">Latest</option>
                  </select>
                </div>
              </div>

              <div className="row g-3 g-lg-4">
                {loading ? (
                  <div className="col-12 text-center py-4 text-muted">Loading...</div>
                ) : filtered.length === 0 ? (
                  <div className="col-12 text-center py-4 text-muted">No products found.</div>
                ) : (
                  paginated.map((product, index) => (
                    <div key={product._id || index} className="col-12 col-md-6 col-xl-4">
                      <ProductLaunchCard product={product} index={index} />
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {!loading && filtered.length > PER_PAGE && (
                <nav className="mt-4 d-flex justify-content-center">
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <li
                        key={page}
                        className={`page-item ${currentPage === page ? "active" : ""}`}
                      >
                        <button className="page-link" onClick={() => goToPage(page)}>
                          {page}
                        </button>
                      </li>
                    ))}

                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}

              {/* Results count */}
              {!loading && filtered.length > 0 && (
                <div className="text-center text-muted small mt-2">
                  Showing {(currentPage - 1) * PER_PAGE + 1}–
                  {Math.min(currentPage * PER_PAGE, filtered.length)} of {filtered.length}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;