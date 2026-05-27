import Link from "next/link";
import Image from "next/image";

const CommentItem = ({ comment }) => {
  return (
    <div className="comment d-flex">
      <div className="img-parent">
        <Image
          src={`/assets/images/blogs/${comment.authorImage}`}
          alt="author"
          width={1000}
          height={1000}
          className="lazy-img user-avatar rounded-circle"
        />
      </div>
      <div className="comment-text">
        <div className="name fw-500 tx-dark">{comment.author}</div>
        <div className="date">{comment.date}</div>
        <p>{comment.comment}</p>
      </div>
    </div>
  );
};

export default CommentItem;
