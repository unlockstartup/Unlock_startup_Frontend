const servicesData = [
  {
    id: 1,
    title: "Startup Website & App Development",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    company: "Company A",
    contactPerson: "John Doe",
    email: "ZP9tZ@example.com",
    phone: "123-456-7890",
    website: "https://www.example.com",
    gst: "1234567890",
    businessRegistration: "1234567890",
    address: "123 Main Street, City, State, Country",
    servicesDetails: [
      {
        id: 1,
        title: "Web Development",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        id: 2,
        title: "Mobile App Development",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        id: 3,
        title: "Custom Software Development",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
    ],
    experience: "5 years",
    targetAudience: "Startups",
    availability: "Full-time",
    rateRange: "$50,000 - $100,000",
    paymentModel: "Monthly",
    paymentMethod: "Bank transfer ",
    paymentTerms: "50% Upfront",
    serviceImage: "1.jpg",
    companyImage: "1.svg",
    slug: "company-a",
  },
  {
    id: 2,
    title: "Branding, Logo & Creative Design",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    company: "Company B",
    contactPerson: "Jane Smith",
    email: "x7t2o@example.com",
    phone: "987-654-3210",
    website: "https://www.example.com",
    gst: "9876543210",
    businessRegistration: "9876543210",
    address: "456 Elm Street, City, State, Country",
    servicesDetails: [
      {
        id: 1,
        title: "Brand Identity",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        id: 2,
        title: "Logo Design",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        id: 3,
        title: "Graphic Design",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
    ],
    experience: "10 years",
    targetAudience: "Businesses",
    availability: "Part-time",
    rateRange: "$25,000 - $50,000",
    paymentModel: "Hourly",
    paymentMethod: "Bank transfer ",
    paymentTerms: "50% Upfront",
    serviceImage: "2.jpg",
    companyImage: "1.svg",
    slug: "company-b",
  },
  {
    id: 3,
    title: "Digital Marketing & Growth Services",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    company: "Company C",
    contactPerson: "Bob Johnson",
    email: "wXx4o@example.com",
    phone: "555-555-5555",
    website: "https://www.example.com",
    gst: "5555555555",
    businessRegistration: "5555555555",
    address: "789 Oak Street, City, State, Country",
    servicesDetails: [
      {
        id: 1,
        title: "Search Engine Optimization",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        id: 2,
        title: "Social Media Marketing",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        id: 3,
        title: "Content Marketing",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
    ],
    experience: "8 years",
    targetAudience: "Businesses",
    availability: "Full-time",
    rateRange: "$40,000 - $80,000",
    paymentModel: "Monthly",
    paymentMethod: "Bank transfer ",
    paymentTerms: "50% Upfront",
    serviceImage: "3.jpg",
    companyImage: "1.svg",
    slug: "company-c",
  },
  {
    id: 4,
    title: "Legal & Compliance Services",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    company: "Company D",
    contactPerson: "Jane Smith",
    email: "x7t2o@example.com",
    phone: "987-654-3210",
    website: "https://www.example.com",
    gst: "9876543210",
    businessRegistration: "9876543210",
    address: "456 Elm Street, City, State, Country",
    servicesDetails: [
      {
        id: 1,
        title: "Legal Consulting",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        id: 2,
        title: "Compliance Audit",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        id: 3,
        title: "Contract Negotiation",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
    ],
    experience: "10 years",
    targetAudience: "Businesses",
    availability: "Part-time",
    rateRange: "$25,000 - $50,000",
    paymentModel: "Hourly",
    paymentMethod: "Bank transfer ",
    paymentTerms: "50% Upfront",
    serviceImage: "4.jpg",
    companyImage: "1.svg",
    slug: "company-d",
  },
  {
    id: 5,
    title: "Cloud Hosting & DevOps Support",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    company: "Company E",
    contactPerson: "John Doe",
    email: "ZP9tZ@example.com",
    phone: "123-456-7890",
    website: "https://www.example.com",
    gst: "1234567890",
    businessRegistration: "1234567890",
    address: "123 Main Street, City, State, Country",
    servicesDetails: [
      {
        id: 1,
        title: "Cloud Hosting",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        id: 2,
        title: "DevOps Support",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        id: 3,
        title: "Infrastructure Management",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
    ],
    experience: "8 years",
    targetAudience: "Businesses",
    availability: "Full-time",
    rateRange: "$40,000 - $80,000",
    paymentModel: "Monthly",
    paymentMethod: "Bank transfer ",
    paymentTerms: "50% Upfront",
    serviceImage: "5.jpg",
    companyImage: "1.svg",
    slug: "company-e",
  },
];

export default servicesData;
