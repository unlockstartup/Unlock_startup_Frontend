import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import blogsData from "@/data/blogsData";
import Link from "next/link";
import Image from "next/image";
import CommentItem from "@/components/uiElements/commentItem";

const Page = async ({ params }) => {
  const { id } = await params;
  const blog = blogsData.find((blog) => blog.slug === id);
  return (
    <main>
      <section className="blog-section pt-100 lg-pt-80">
        <div className="container">
          <div className="border-bottom pb-160 xl-pb-130 lg-pb-80">
            <div className="row">
              <div className="col-lg-8">
                <div className="blog-details-page pe-xxl-5 me-xxl-3">
                  <article className="blog-post-content">
                    <h2 className="blog-heading">{blog.title}</h2>
                    <div className="blog-pubish-date">
                      <p>
                        {blog.category} . {blog.date} . By {blog.author}
                      </p>
                    </div>
                    <div className="blog-feat-img mb-15 rounded-4 overflow-hidden">
                      <Image
                        src={blog.image}
                        width={1000}
                        height={1000}
                        className="w-100 h-auto"
                        alt={blog.title}
                      />
                    </div>
                    <div
                      className="blog-post-content"
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                    <div className="bottom-widget border-bottom d-sm-flex align-items-center justify-content-between">
                      {/* Tags */}
                      <ul className="d-flex tags style-none pb-20">
                        <li className="fw-500">Tags: </li>

                        {blog.tags.map((tag, index) => (
                          <li key={index}>
                            &nbsp;
                            <Link href={`/blog?tag=${tag.toLowerCase()}`}>
                              {tag}
                              {index < blog.tags.length - 1 && ","}
                            </Link>
                          </li>
                        ))}
                      </ul>

                      {/* Share Icons */}
                      <ul className="d-flex share-icon align-items-center style-none pb-20">
                        <li>Share:</li>

                        <li>
                          <a href="#">
                            <i className="bi bi-google"></i>
                          </a>
                        </li>

                        <li>
                          <a href="#">
                            <i className="bi bi-twitter"></i>
                          </a>
                        </li>

                        <li>
                          <a href="#">
                            <i className="bi bi-instagram"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                    {/* Comments */}
                    {blog.comments?.length > 0 ? (
                      <div className="blog-comment-area">
                        <h3 className="blog-inner-title pb-15">Comments</h3>

                        {blog.comments.map((comment) => (
                          <CommentItem key={comment.id} comment={comment} />
                        ))}
                      </div>
                    ) : (
                      <p className="mt-20 fw-500 text-md">No comments yet.</p>
                    )}
                    {/* Comment Form */}
                    <div className="blog-comment-form">
                      <h3 className="blog-inner-title">Leave A Comment</h3>

                      <p>
                        <Link
                          href="/signin"
                          className="text-decoration-underline"
                        >
                          Sign
                        </Link>{" "}
                        in to post your comment or signup if you don&apos;t have
                        any account.
                      </p>

                      <form className="mt-30">
                        <div className="input-wrapper mb-35">
                          <label>Name*</label>
                          <input type="text" placeholder="Rashed Kabir" />
                        </div>

                        <div className="input-wrapper mb-40">
                          <label>Email*</label>
                          <input type="email" placeholder="Email id" />
                        </div>

                        <div className="input-wrapper mb-30">
                          <textarea placeholder="Your Comment"></textarea>
                        </div>

                        <button
                          type="submit"
                          className="btn-ten fw-500 text-white text-center pe-5 ps-5 tran3s"
                        >
                          Post Comment
                        </button>
                      </form>
                    </div>
                  </article>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="blog-sidebar ps-xl-4 md-mt-60">
                  {/* Search */}
                  <form className="search-form position-relative mb-50 lg-mb-40">
                    <input type="text" placeholder="Search..." />
                    <button type="submit">
                      <i className="bi bi-search"></i>
                    </button>
                  </form>
                  {/* Categories */}
                  <div className="category-list mb-60 lg-mb-40">
                    <h3 className="sidebar-title">Category</h3>

                    <ul className="style-none">
                      <li>
                        <Link href="#">Education (3)</Link>
                      </li>
                      <li>
                        <Link href="#">Information (4)</Link>
                      </li>
                      <li>
                        <Link href="#">Interview (2)</Link>
                      </li>
                      <li>
                        <Link href="#">Speaking (8)</Link>
                      </li>
                      <li>
                        <Link href="#">Skill (5)</Link>
                      </li>
                      <li>
                        <Link href="#">Developer (3)</Link>
                      </li>
                      <li>
                        <Link href="#">Account (7)</Link>
                      </li>
                    </ul>
                  </div>

                  {/* Recent News */}
                  <div className="sidebar-recent-news mb-60 lg-mb-40">
                    <h4 className="sidebar-title">Recent News</h4>

                    {/* Item 1 */}
                    <div className="news-block d-flex align-items-center pt-20 pb-20 border-top">
                      <div>
                        <Image
                          src="/assets/images/blogs/blog_img_15.jpg"
                          alt="news"
                          width={80}
                          height={80}
                          className="w-auto h-auto"
                        />
                      </div>

                      <div className="post ps-4">
                        <h4 className="mb-5">
                          <Link
                            href="/blogs/sample-slug"
                            className="title tran3s"
                          >
                            10 days quick challenge for boost visitors.
                          </Link>
                        </h4>
                        <div className="date">23 July, 2022</div>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="news-block d-flex align-items-center pt-20 pb-20 border-top">
                      <div>
                        <Image
                          src="/assets/images/blogs/blog_img_16.jpg"
                          alt="news"
                          width={80}
                          height={80}
                          className="w-auto h-auto"
                        />
                      </div>

                      <div className="post ps-4">
                        <h4 className="mb-5">
                          <Link
                            href="/blogs/sample-slug"
                            className="title tran3s"
                          >
                            Easy way to boost your business.
                          </Link>
                        </h4>
                        <div className="date">23 July, 2022</div>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="news-block d-flex align-items-center pt-20 pb-20 border-top border-bottom">
                      <div>
                        <Image
                          src="/assets/images/blogs/blog_img_17.jpg"
                          alt="news"
                          width={80}
                          height={80}
                          className="w-auto h-auto"
                        />
                      </div>

                      <div className="post ps-4">
                        <h4 className="mb-5">
                          <Link
                            href="/blogs/sample-slug"
                            className="title tran3s"
                          >
                            Introducing new tools for your design.
                          </Link>
                        </h4>
                        <div className="date">23 July, 2022</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
