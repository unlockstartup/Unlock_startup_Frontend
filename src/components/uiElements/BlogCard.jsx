import Image from "next/image";
import Link from "next/link";

export default function BlogCard({ blog, index }) {
  return (
    <div
      className={`col-lg-4 col-md-6 ${index === 2 ? "d-none d-lg-block" : ""}`}
    >
      <article
        className="blog-meta-two mb-60 lg-mb-40 wow fadeInUp"
        data-wow-delay={`${index * 0.1}s`}
      >
        <figure className="post-img m0">
          <Link href={`/blogs/${blog.slug}`} className="w-100 d-block">
            <Image
              src={blog.image}
              alt={blog.title}
              width={500}
              height={350}
              className="w-100 h-auto tran4s"
              style={{ borderRadius: "10px" }}
            />
          </Link>

          <Link href={`/blogs/${blog.slug}`} className="tags color-two fw-500">
            {blog.category}
          </Link>
        </figure>

        <div className="post-data mt-35 lg-mt-20">
          <div className="date">
            <Link href={`/blogs/${blog.slug}`}>{blog.date}</Link>
          </div>

          <Link href={`/blogs/${blog.slug}`}>
            <h4 className="tran3s blog-title">{blog.title}</h4>
          </Link>

          <Link
            href={`/blogs/${blog.slug}`}
            className="continue-btn tran3s d-flex align-items-center"
          >
            <span className="fw-500 me-2">Continue Reading</span>
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </article>
    </div>
  );
}
