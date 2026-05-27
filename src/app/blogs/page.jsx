import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import blogsData from "@/data/blogsData";
import BlogCard from "@/components/uiElements/BlogCard";

const Page = () => {
  return (
    <main>
      <section className="blog-section pt-100 lg-pt-80 pb-100 lg-pb-80">
        <div className="container">
          <div className="row">
            {blogsData.map((blog, index) => (
              <BlogCard key={blog.id} blog={blog} index={index} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
