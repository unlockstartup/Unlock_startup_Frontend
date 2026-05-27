import blogsData from "@/data/blogsData";
import BlogCard from "@/components/uiElements/BlogCard";
import Link from "next/link";

const Blogs = () => {
  return (
    <section className="blog-section-two pt-80 xl-pt-150 lg-pt-100 pb-80 xl-pb-130 lg-pb-80">
      <div className="container">
        <div className="position-relative">
          <div className="title-one text-center mb-30 lg-mb-10">
            <h2 className="fw-600">Our Blog</h2>
          </div>

          <div className="row g-3 gx-xxl-5">
            {blogsData.slice(0, 3).map((blog, index) => (
              <BlogCard key={blog.id} blog={blog} index={index} />
            ))}
          </div>

          <div className="row">
            <div className="col-12">
              <div className="text-center mt-40 wow fadeInUp">
                <Link href="/blogs" className="btn-five">
                  Explore All
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blogs;
