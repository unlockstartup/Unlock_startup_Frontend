"use client";

import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { useEffect } from "react";
import Link from "next/link";

const VideoPost = ({ thumb, src }) => {
  useEffect(() => {
    Fancybox.bind("[data-fancybox]", {
    });
  }, []);

  return (
    <div
      className="video-post d-flex align-items-center justify-content-center"
      style={thumb ? { backgroundImage: `url(${thumb})` } : {}}
    >
      <Link
        className="fancybox rounded-circle video-icon tran3s text-center"
        data-fancybox
        href={src}
      >
        <i className="bi bi-play"></i>
      </Link>
    </div>
  );
};

export default VideoPost;
