const blogsData = [
  {
    id: 1,
    date: "23 Apr, 2026",
    title: "Print, publishing qui visual layout mockups.",
    author: "Martin Cooley",
    date: "26 APR, 2026",
    category: "Startup",
    image: "/assets/images/blogs/blog_img_04.jpg",
    content: `<p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</p>
<h3>Lorem ipsum dolor sit amet consectetur</h3>
<p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</p>`,
    tags: ["Startup", "Business", "Design"],
    comments: [
      {
        id: 1,
        author: "John Doe",
        date: "26 APR, 2026",
        authorImage: "avatar_01.jpg",
        comment:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, animi.",
      },
      {
        id: 2,
        author: "Martin Cooley",
        date: "26 APR, 2026",
        authorImage: "avatar_02.jpg",
        comment:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, animi.",
      },
    ],
    slug: "print-publishing-qui-visual-layout-mockups",
  },
  {
    id: 2,
    date: "14 March, 2026",
    title: "Designer’s checklist for every UX/UI project.",
    author: "Martin Cooley",
    date: "26 APR, 2026",
    category: "Startup",
    image: "/assets/images/blogs/blog_img_05.jpg",
    content: `<p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</p>
<h3>Lorem ipsum dolor sit amet consectetur</h3>
<p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</p>`,
    tags: ["Startup", "Business", "Design"],
    slug: "designers-checklist-for-every-ux-ui-project",
  },
  {
    id: 3,
    date: "07 Feb, 2026",
    title: "Make more productive work flow in few steps.",
    author: "Martin Cooley",
    date: "26 APR, 2026",
    category: "Startup",
    image: "/assets/images/blogs/blog_img_06.jpg",
    content: `<p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</p>
<h3>Lorem ipsum dolor sit amet consectetur</h3>
<p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</p>`,
    tags: ["Startup", "Business", "Design"],
    comments: [
      {
        id: 1,
        author: "John Doe",
        date: "26 APR, 2026",
        authorImage: "avatar_01.jpg",
        comment:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, animi.",
      },
      {
        id: 2,
        author: "Martin Cooley",
        date: "26 APR, 2026",
        authorImage: "avatar_02.jpg",
        comment:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, animi.",
      },
    ],
    slug: "make-more-productive-work-flow-in-few-steps",
  },
  {
    id: 4,
    date: "07 Feb, 2026",
    title: "Make more productive work flow in few steps.",
    author: "Martin Cooley",
    date: "26 APR, 2026",
    category: "Startup",
    image: "/assets/images/blogs/blog_img_06.jpg",
    content: `<p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</p>
<h3>Lorem ipsum dolor sit amet consectetur</h3>
<p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</p>`,
    tags: ["Startup", "Business", "Design"],
    slug: "make-more-productive-work-flow-in-few-steps",
  },
  {
    id: 5,
    date: "07 Feb, 2026",
    title: "Make more productive work flow in few steps.",
    author: "Martin Cooley",
    date: "26 APR, 2026",
    category: "Startup",
    image: "/assets/images/blogs/blog_img_06.jpg",
    content: `<p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</p>
<h3>Lorem ipsum dolor sit amet consectetur</h3>
<p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</p>`,
    tags: ["Startup", "Business", "Design"],
    slug: "make-more-productive-work-flow-in-few-steps",
  },
];

export default blogsData;
