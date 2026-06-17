export interface ScrapedCollege {
  name: string;
  website_url: string;
  image_url: string;
  eligibility: string;
  location: string;
  fees: string;
  curriculum_summary: string;
  contact_info: string;
  degree_partner: string;
  brochureUrl?: string;
  tags: string[];
  year_1_curriculum: string;
  year_2_curriculum: string;
  year_3_curriculum: string;
  year_4_curriculum: string;
  // Card enrichment fields
  seats?: string;
  laptop_provided?: string | boolean;
  hiring_partners_count?: number;
  campus_tour_url?: string;
  scholarship_info?: string;
  apply_url?: string;
  is_trending?: boolean;
  is_new?: boolean;
  rating_breakdown?: { curriculum: number; placements: number; faculty: number; campus: number };
  founders: Array<{
    name: string;
    background_info: string;
    linkedin_url: string;
  }>;
  instructors: Array<{
    name: string;
    company_background: string;
  }>;
  reviews: Array<{
    rating: number;
    review_text: string;
    source_url?: string;
  }>;
  // Dynamic deep dive fields
  degreeType?: string;
  applicationFee?: string;
  examDates?: string;
  industryMentors?: string;
  fastTrack?: boolean;
  fastTrackDetails?: string;
  foundingYear?: number;
  batchSize?: number;
  degreeRecognition?: string;
  entranceExam?: {
    pattern?: string;
    level?: string;
    syllabus?: string;
  };
  studentClubs?: string[];
  financingOptions?: string;
}

export const MOCK_COLLEGES: Record<string, ScrapedCollege> = {
  "Zenith School of AI": {
    name: "Zenith School of AI",
    foundingYear: 2026,
    website_url: "https://zenithschool.ai",
    image_url: "https://media.licdn.com/dms/image/v2/D5622AQEYM1SBhaCZCQ/feedshare-shrink_800/B56ZwOmzL1JwAo-/0/1769771578389?e=2147483647&v=beta&t=i1Uhe9_D0Ehr5CWeki_Vv8Mf6DXdrU_gBVO8lqs9adM",
    eligibility: "Class 12th with minimum 60% + ZAPT (Zenith AI Proficiency Test) + Personal Interview.",
    location: "28-acre tech campus in Gurugram, Haryana (KR Mangalam University)",
    fees: "₹26 Lakhs (Total 4-Year B.Tech Tuition).",
    curriculum_summary: "B.Tech in Artificial Intelligence with an embedded Mini-MBA (Awarded by KR Mangalam University).",
    contact_info: "admissions@zenithschool.ai",
    degree_partner: "KR Mangalam University",
    tags: [
      "Embedded Mini-MBA",
      "₹100Cr Institutional Fund",
      "Global Immersion",
      "AI Product Focus"
    ],
    year_1_curriculum: "AI Mathematics & Core CS (Linear algebra, probability, Python/C++).",
    year_2_curriculum: "Machine Learning & Mini-MBA (Neural networks, product economics, growth).",
    year_3_curriculum: "Generative AI & Global Immersion (LLM creation, global tech hub trips to Dubai/Singapore).",
    year_4_curriculum: "AI Product Management & Capstone (CXO-level business scaling, enterprise AI launch).",
    founders: [
      {
        name: "Avinash Pandit",
        background_info: "Founder (IIM-C Alumnus, ex-BCG consulting leader, OYO, Hero MotoCorp scaling executive)",
        linkedin_url: "https://www.linkedin.com/in/avinash-pandit-07282017/",
      },
      {
        name: "Vivekanand Vivek",
        background_info: "Founder (IIT-BHU Alumnus, ex-Amazon SDE, Programming Pathshala co-founder)",
        linkedin_url: "https://www.linkedin.com/in/vivekanand-vivek-7a4ab388",
      },
      {
        name: "Anoop Garg",
        background_info: "Founder (IIT-BHU Alumnus, educator & Programming Pathshala co-founder)",
        linkedin_url: "https://www.linkedin.com/in/anoopgarg123/",
      }
    ],
    instructors: [
      {
        name: "Dr. Gaurav Sharma",
        company_background: "AI Researcher, ex-Meta FAIR"
      },
      {
        name: "Ankit Aggarwal",
        company_background: "Data Scientist, ex-Google"
      },
      {
        name: "Vivekanand Vivek",
        company_background: "co-founder, ex-Amazon SDE"
      }
    ],
    reviews: [
      {
        rating: 4.8,
        review_text: "Highly anticipated. Industry experts praise its blend of technical AI deployment with product growth and CXO-level business acumen."
      }
    ],
    seats: "120 Seats/Batch",
    laptop_provided: false,
    hiring_partners_count: 200,
    scholarship_info: "₹100 Crore institutional scholarship fund. ZAPT merit & need-based awards available.",
    apply_url: "https://zenithschool.ai",
    is_trending: true,
    is_new: true,
    rating_breakdown: {
      curriculum: 4.9,
      placements: 4.5,
      faculty: 4.8,
      campus: 4.7
    },
    degreeType: "B.Tech in Artificial Intelligence",
    applicationFee: "₹1,000 (ZAPT Registration Fee)",
    examDates: "Exam dates not mentioned on official website",
    industryMentors: "AI Leaders from Meta FAIR, Google DeepMind, and OpenAI",
    fastTrack: true,
    fastTrackDetails: "ZAPT bypass for JEE Main ≥ 92 percentile — direct interview",
    batchSize: 120,
    degreeRecognition: "NAAC 'A' Accredited B.Tech via KR Mangalam University",
    entranceExam: {
      pattern: "Online ZAPT (Zenith AI Proficiency Test) + Personal Interview",
      level: "Institute Level",
      syllabus: "Logical Reasoning, Basic Mathematics, Aptitude, and Critical Thinking"
    },
    studentClubs: [
      "Zenith AI Lab",
      "Neural Nets Society",
      "Product Scaling Hub",
      "Global Immersions Club",
      "E-Cell Startups",
      "Sports & Athletic Club"
    ],
    financingOptions: "Education loans via Eduvanz and Avanse."
  },
  "Mirai School of Technology": {
    name: "Mirai School of Technology",
    foundingYear: 2025,
    website_url: "https://msot.org",
    apply_url: "https://msot.org",
    image_url: "https://storage.firstindia.co.in/public/news/June2025/174886169287.webp",
    eligibility: "10+2 with PCM + M.A.I.N.S (Mirai National Screening Test) + Personal Interview.",
    location: "Ghaziabad (Hi-Tech Institute of Engineering & Technology) & Bengaluru (Rathinam Institute of Technology)",
    fees: "₹15 Lakhs to ₹16 Lakhs (Total 4-Year B.Tech Tuition).",
    curriculum_summary: "AICTE-approved B.Tech in AI & ML.",
    contact_info: "admissions@msot.org | +91-8860316031",
    degree_partner: "Hi-Tech Institute of Engineering & Technology & Rathinam Institute of Technology",
    tags: [
      "MiraiVerse Apple Lab",
      "Sentient Robotics Lab",
      "M.A.I.N.S Entrance",
      "AICTE Approved B.Tech"
    ],
    year_1_curriculum: "Coding with AI (Node.js, C++, using AI copilots in Apple Labs).",
    year_2_curriculum: "Advanced Systems (Advanced DSA, High-Level System Design, DB optimization).",
    year_3_curriculum: "LLMs & Mandatory Internship (LLM creation/fine-tuning, paid industry internship).",
    year_4_curriculum: "Robotics & Final Deployment (Applied AI in the Sentient Robotics Lab, capstone project).",
    founders: [
      {
        name: "Arpit Sarda",
        background_info: "Founder (BITS Pilani & IIM Kozhikode Alumnus, ex-JP Morgan engineer, Cars24 tech leader)",
        linkedin_url: "https://www.linkedin.com/in/arpitsarda/",
      },
      {
        name: "Varun Kohli",
        background_info: "Co-Founder (Coding Blocks co-founder, veteran tech educator)",
        linkedin_url: "https://www.linkedin.com/in/kohli12/",
      },
      {
        name: "Kartik Mathur",
        background_info: "Co-Founder (Coding Blocks co-founder, veteran software architect)",
        linkedin_url: "https://www.linkedin.com/in/kartik-mathur/",
      }
    ],
    instructors: [
      {
        name: "Arpit Sarda",
        company_background: "ex-JP Morgan engineer"
      },
      {
        name: "Varun Kohli",
        company_background: "veteran tech educator"
      },
      {
        name: "Agoda SDE Leaders",
        company_background: "Agoda Tech Leads"
      }
    ],
    reviews: [
      {
        rating: 4.5,
        review_text: "Praised for elite infrastructure like the Sentient Robotics Lab and MiraiVerse Apple Labs at an accessible price point."
      }
    ],
    seats: "120 Seats/Batch",
    laptop_provided: false,
    hiring_partners_count: 100,
    brochureUrl: "/brochures/mirai.pdf",
    is_trending: false,
    is_new: false,
    rating_breakdown: {
      curriculum: 4.5,
      placements: 4.3,
      faculty: 4.4,
      campus: 4.4
    },
    degreeType: "B.Tech in CSE",
    applicationFee: "₹1,000 (M.A.I.N.S Registration Fee)",
    examDates: "Admissions Open | Cycles ongoing through July 2026",
    industryMentors: "Mentors from leading tech startups and corporate scaling hubs",
    fastTrack: false,
    fastTrackDetails: "",
    batchSize: 120,
    degreeRecognition: "UGC Approved Degree via Hi-Tech Institute of Engineering & Technology & Rathinam Institute of Technology",
    entranceExam: {
      pattern: "Online Aptitude & Logical Evaluation (60 mins MCQ)",
      level: "Institute Level",
      syllabus: "Quantitative Aptitude, General Reasoning, and Computing Logic"
    },
    financingOptions: "Flexible EMI loan schemes via GrayQuest, Avanse, and Propelld",
      studentClubs: [
      "MiraiVerse Apple Labs Cohort",
      "Sentient Robotics Lab Club",
      "AI & ML Developers Chapter",
      "Tech Developers Club",
      "Cultural & Debate Club",
      "Sports & Wellness Association"
    ],
  },
  "Alta School of Technology": {
    name: "Alta School of Technology",
    foundingYear: 2023,
    website_url: "https://www.altaschool.tech",
    apply_url: "https://www.altaschool.tech",
    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9_a769jfhQ3K4KWU2vQ38E_3f1xq0sgkqUw&s",
    eligibility: "Class 12th + A-SAT (Alta Scholastic Aptitude Test) + Interview.",
    location: "Chennai, Tamil Nadu (also Pune and Indore campuses via partners)",
    fees: "₹14 Lakhs to ₹20 Lakhs (Total Tuition).",
    brochureUrl: "/brochures/alta.pdf",
    curriculum_summary: "AI-First B.Tech CSE program integrated with Sunstone's corporate network. (Formerly Sunstone Select).",
    contact_info: "connect@altaschool.tech | 7065-333-888",
    degree_partner: "Partnership with multiple Universities",
    tags: [
      "Sunstone Network",
      "A-SAT Scholarship",
      "Web3 & Deep Tech",
      "Portfolio Hiring Approach"
    ],
    year_1_curriculum: "AI-First Foundations (AI tools like GPT-4/Claude, web dev, math for computing).",
    year_2_curriculum: "Core Computer Science (DSA, OS, networks, building 10 portfolio projects).",
    year_3_curriculum: "Deep Tech & Apprenticeship (Web3, decentralized systems, start of 6-month apprenticeship).",
    year_4_curriculum: "Hackathons & Corporate Transition (Competitive coding, GSoC, MAANG mock interviews).",
    founders: [
      {
        name: "Ashish Munjal",
        background_info: "Founder of Alta School / Co-Founder of Sunstone (Times 40 Under 40, 2022 honoree, 7+ yrs in EdTech)",
        linkedin_url: "https://www.linkedin.com/in/ashishmunjal",
      },
      {
        name: "Harshit Agarwal",
        background_info: "Founding Director (IIT-BHU Alumnus, ex-Samsung, Spinny, OYO, 5+ yrs in education)",
        linkedin_url: "https://www.linkedin.com/in/harshit-agarwal-99312418/",
      },
      {
        name: "Navdeep Sandhu",
        background_info: "Director of Academics (ex-Pepcoding Co-Founder, ex-Scaler, ex-Coding Ninjas, ex-EY)",
        linkedin_url: "https://www.linkedin.com/in/navdeep-sandhu-0603ab92/",
      }
    ],
    instructors: [
      {
        name: "Navdeep Sandhu",
        company_background: "ex-Pepcoding, ex-Scaler"
      },
      {
        name: "Harshit Agarwal",
        company_background: "Founding Director, ex-Samsung"
      },
      {
        name: "SDE Mentors & Instructors",
        company_background: "Microsoft, Google & Amazon"
      }
    ],
    reviews: [
      {
        rating: 4,
        review_text: "Valued for its niche focus on decentralized tech, massive placement network (1000+ partners), and portfolio-driven hiring approach."
      }
    ],
    seats: "300 Seats/Batch (May vary depending on chosen partner university campus)",
    laptop_provided: false,
    hiring_partners_count: 1000,
    is_trending: false,
    is_new: false,
    rating_breakdown: {
      curriculum: 4.5,
      placements: 4.3,
      faculty: 4.4,
      campus: 4.4
    },
    degreeType: "B.Tech in CSE",
    applicationFee: "₹1,000 (A-SAT Registration Fee)",
    examDates: "Admissions Open | Cycles ongoing through July 2026",
    industryMentors: "Mentors from leading tech startups and corporate scaling hubs",
    fastTrack: false,
    fastTrackDetails: "",
    batchSize: 300,
    degreeRecognition: "UGC Approved Degree via Partnership with multiple Universities",
    entranceExam: {
      pattern: "Online Aptitude & Logical Evaluation (60 mins MCQ)",
      level: "Institute Level",
      syllabus: "Quantitative Aptitude, General Reasoning, and Computing Logic"
    },
    financingOptions: "Flexible EMI loan schemes via GrayQuest, Avanse, and Propelld",
      studentClubs: [
      "Web3 & Decentralized Systems Club",
      "Alta Developers Club",
      "AI Innovation Circle",
      "MAANG Interview Drill Association",
      "Sports & Cultural Association"
    ],
  },
  "Bosscoder School of Technology": {
    name: "Bosscoder School of Technology",
    foundingYear: 2026,
    website_url: "https://www.bosscoderacademy.com",
    image_url: "https://images.shiksha.com/mediadata/images/1769508783phpnggDGj.jpeg",
    eligibility: "Class 12 pass + BSAT (Bosscoder Scholastic Admission Test) + Personal Interview.",
    location: "Raja Rajeshwari Nagar, Bangalore, Karnataka",
    fees: "₹22 Lakhs to ₹24 Lakhs (Total 4-Year B.Tech Tuition & Program Fee).",
    curriculum_summary: "B.Tech in Computer Science and Artificial Intelligence.",
    contact_info: "admissions@bosscoderacademy.com",
    degree_partner: "S-VYASA University",
    tags: [
      "BSAT Entrance",
      "Logical & DSA Heavy",
      "FAANG Interview Drills",
      "24x7 Coding Facilities"
    ],
    year_1_curriculum: "Logic & Core Programming (C++/Java mastery, math foundations).",
    year_2_curriculum: "Full-Stack & Advanced DSA (Targeted FAANG prep, web dev, database architecture).",
    year_3_curriculum: "Backend Architecture & System Design (Microservices, highly scalable systems).",
    year_4_curriculum: "GenAI & Product Engineering (GenAI integration, open-source projects, 1:1 placement prep).",
    founders: [
      {
        name: "Rajat Garg",
        background_info: "Co-Founder (NIT Delhi Alumnus, ex-Microsoft Software Developer, multi-startup founder)",
        linkedin_url: "https://www.linkedin.com/in/mrrajatgarg/",
      },
      {
        name: "Manish Garg",
        background_info: "Co-Founder (IIT Dhanbad Alumnus, former ML Engineer at Samsung Bixby & Lead at Quoori)",
        linkedin_url: "https://www.linkedin.com/in/manish-kumar-garg/",
      }
    ],
    instructors: [
      {
        name: "Rajat Garg",
        company_background: "co-founder, ex-Microsoft SDE"
      },
      {
        name: "Manish Garg",
        company_background: "co-founder, ex-Samsung ML"
      },
      {
        name: "Senior SDE Mentors",
        company_background: "Microsoft, Google & Mastercard"
      },
      {
        name: "Tech Architects & Leads",
        company_background: "Amazon, Uber & Zomato"
      }
    ],
    reviews: [
      {
        rating: 4.5,
        review_text: "Students appreciate the rigorous mentor guidance and round-the-clock access to campus coding facilities, treating undergrads like junior developers."
      }
    ],
    seats: "300 Seats/Batch",
    laptop_provided: "MacBook Air",
    hiring_partners_count: 500,
    brochureUrl: "/brochures/bosscoder-school-technology-brochure.pdf",
    scholarship_info: "BSAT merit scholarships — up to 60% off total tuition fees for top performers.",
    apply_url: "https://www.bosscoderacademy.com/school-of-technology",
    is_trending: false,
    is_new: false,
    rating_breakdown: {
      curriculum: 4.6,
      placements: 4.4,
      faculty: 4.5,
      campus: 4.3
    },
    degreeType: "B.Tech in CS & AI",
    applicationFee: "₹500 (BSAT Registration Fee)",
    examDates: "Exam dates not mentioned on official website",
    industryMentors: "Mentors from Microsoft, Amazon, Zomato, and Swiggy",
    fastTrack: false,
    fastTrackDetails: "",
    batchSize: 300,
    degreeRecognition: "UGC Recognised via S-VYASA University",
    entranceExam: {
      pattern: "Online BSAT (75 mins: Analytical Ability, Math & Logic)",
      level: "National Level",
      syllabus: "Data Interpretation, Arithmetic, Basic Programming Logic"
    },
    studentClubs: [
      "Entrepreneurship & Startup Club",
      "Open Source & Tech Club",
      "Robotics & Coding Club",
      "Media & Creative Club",
      "Dance & Performing Arts Club",
      "Sports & Fitness Club"
    ],
    financingOptions: "Education loans via Propelld, GrayQuest, and Eduvanz"
  },
  "NxtWave Institute of Advanced Technology": {
    name: "NxtWave Institute of Advanced Technology",
    foundingYear: 2025,
    website_url: "https://www.niatindia.com",
    apply_url: "https://www.niatindia.com",
    brochureUrl: "https://www.niatindia.com/niat-download-brochure-2025v4",
    image_url: "https://media.collegedekho.com/media/img/institute/crawled_images/None/WhatsApp_Image_2024-07-26_at_8.19.31_PM.jpeg?width=1080",
    eligibility: "Class 12th + NAT (NxtWave Assessment Test, ₹1,200 registration fee). Admission via partner university criteria.",
    location: "Hyderabad, Bangalore, Pune, Noida/NCR, Chennai & 35+ other cities (multiple campuses across India via 40+ partner universities)",
    fees: "₹8 Lakhs to ₹18 Lakhs (Total 4-Year Tuition, varies by chosen partner university campus).",
    curriculum_summary: "Industry-aligned CS degree integrating the CCBP 4.0 curriculum.",
    contact_info: "support@ccbp.in",
    degree_partner: "Partnership with Universities",
    tags: [
      "CCBP 4.0 Syllabus",
      "NIAT Aptitude Test",
      "Daily Code Routines",
      "Startup Aggregated Placements"
    ],
    year_1_curriculum: "CCBP 4.0 Foundations (Intensive daily coding, Python, HTML/CSS).",
    year_2_curriculum: "Full-Stack Mastery (React.js, Node.js, Express, dynamic web apps).",
    year_3_curriculum: "Cloud & Continuous Deployment (CI/CD pipelines, cloud hosting, industry 4.0 tech).",
    year_4_curriculum: "Aggregated Placements (Live industry projects, massive aggregated startup placement drives).",
    founders: [
      {
        name: "Rahul Attuluri",
        background_info: "CEO & Co-Founder (IIIT Hyderabad Alumnus, ex-Amazon SDE, tech bootcamps creator)",
        linkedin_url: "https://www.linkedin.com/in/rahulattuluri",
      },
      {
        name: "Sashank Gujjula",
        background_info: "Co-Founder & Customer Experience Head (IIT Bombay Alumnus, Forbes 30u30)",
        linkedin_url: "https://www.linkedin.com/in/sashankreddy/",
      },
      {
        name: "Anupam Pedarla",
        background_info: "Co-Founder & COO (IIT Kharagpur Alumnus, Forbes 30u30)",
        linkedin_url: "https://www.linkedin.com/in/anupampedarla/",
      }
    ],
    instructors: [
      {
        name: "Rahul Attuluri",
        company_background: "ex-Amazon SDE"
      },
      {
        name: "SDE Mentors",
        company_background: "Nvidia, Microsoft & Amazon"
      },
      {
        name: "IIT Bombay Tech Team",
        company_background: "IIT Alumni Developers"
      }
    ],
    reviews: [
      {
        rating: 4.6,
        review_text: "Students value the intensive daily coding routines and massive placement drives connected to hundreds of tech startups."
      }
    ],
    seats: "200 Seats/Batch (May vary according to the chosen partner university campus)",
    laptop_provided: false,
    hiring_partners_count: 2500,
    is_trending: false,
    is_new: false,
    rating_breakdown: {
      curriculum: 4.5,
      placements: 4.3,
      faculty: 4.4,
      campus: 4.4
    },
    degreeType: "B.Tech in CSE",
    applicationFee: "₹1,200 (NAT Registration Fee)",
    examDates: "Admissions Open | Cycles ongoing through July 2026",
    industryMentors: "Mentors from leading tech startups and corporate scaling hubs",
    fastTrack: false,
    fastTrackDetails: "",
    batchSize: 200,
    degreeRecognition: "UGC Approved Degree via Partnership with Universities",
    entranceExam: {
      pattern: "Online Aptitude & Logical Evaluation (60 mins MCQ)",
      level: "Institute Level",
      syllabus: "Quantitative Aptitude, General Reasoning, and Computing Logic"
    },
    financingOptions: "Flexible EMI loan schemes via GrayQuest, Avanse, and Propelld",
      studentClubs: [
      "CCBP 4.0 Developers Chapter",
      "Daily Coding Challenge Club",
      "NxtWave Startup Placements Group",
      "Tech Innovation Circle",
      "Sports & Wellness Club"
    ],
  },
  "Intellipaat School of Technology (IST)": {
    name: "Intellipaat School of Technology (IST)",
    foundingYear: 2025,
    website_url: "https://intellipaat.com/school-of-technology/",
    apply_url: "https://intellipaat.com/school-of-technology/",
    brochureUrl: "/brochures/intellipaat.pdf",
    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0AgFcdU-_xXvxP9z8q963dOyN3TuII4eCkQ&s",
    eligibility: "Class 12th + IST Entrance Exam.",
    location: "Pune, Maharashtra (DY Patil University) & Bangalore",
    fees: "₹13 Lakhs to ₹20 Lakhs (Total 4-Year Tuition, varies by chosen partner university campus). Hostel & mess charges extra.",
    curriculum_summary: "B.Tech / B.Sc heavily focused on Cloud Architecture, DevOps, and Big Data.",
    contact_info: "admissions@intellipaat.com",
    degree_partner: "Partnership with Universities",
    tags: [
      "DevOps & Cloud Heavy",
      "DY Patil Partner",
      "IST Entrance Exam",
      "Global Cloud Certifications"
    ],
    year_1_curriculum: "Computing & Cloud Basics (Programming, networking, cloud fundamentals).",
    year_2_curriculum: "DevOps & Data Engineering (CI/CD, Docker/Kubernetes, big data pipelines).",
    year_3_curriculum: "Official Certifications (AWS Solutions Architect, Google Cloud Engineer prep).",
    year_4_curriculum: "Corporate Capstone (Finalizing certs and industry-sponsored capstone).",
    founders: [
      {
        name: "Diwakar Chittora",
        background_info: "Founder & CEO (Tech upskilling veteran, platform architect)",
        linkedin_url: "https://www.linkedin.com/in/diwakarchittora",
      },
      {
        name: "Shilpi Jain",
        background_info: "Co-Founder (Operations director, tech education executive)",
        linkedin_url: "https://www.linkedin.com/in/shilpi-jain-intellipaat",
      }
    ],
    instructors: [
      {
        name: "Diwakar Chittora",
        company_background: "Founder, tech upskilling veteran"
      },
      {
        name: "Cloud & DevOps Architects",
        company_background: "Google Cloud, AWS & Microsoft Azure"
      }
    ],
    reviews: [
      {
        rating: 4.2,
        review_text: "Strong reviews for embedding official industry-recognized certifications directly into the degree program."
      }
    ],
    seats: "300 Seats/Batch (May vary depending on the chosen partner university campus)",
    laptop_provided: false,
    hiring_partners_count: 3100,
    is_trending: false,
    is_new: false,
    rating_breakdown: {
      curriculum: 4.5,
      placements: 4.3,
      faculty: 4.4,
      campus: 4.4
    },
    degreeType: "B.Tech in CSE",
    applicationFee: "₹1,000 (IST Entrance Exam Fee)",
    examDates: "Admissions Open | Cycles ongoing through July 2026",
    industryMentors: "Mentors from leading tech startups and corporate scaling hubs",
    fastTrack: false,
    fastTrackDetails: "",
    batchSize: 300,
    degreeRecognition: "UGC Approved Degree via Partnership with Universities",
    entranceExam: {
      pattern: "Online Aptitude & Logical Evaluation (60 mins MCQ)",
      level: "Institute Level",
      syllabus: "Quantitative Aptitude, General Reasoning, and Computing Logic"
    },
    financingOptions: "Flexible EMI loan schemes via GrayQuest, Avanse, and Propelld",
      studentClubs: [
      "IST Cloud & DevOps Guild",
      "AWS Solutions Architects Club",
      "Google Cloud Engineers Prep Circle",
      "Technical Certifications League",
      "Sports & Wellness Club"
    ],
  },
  "Stellar School of Technology": {
    name: "Stellar School of Technology",
    foundingYear: 2026,
    website_url: "https://stellarcampus.com",
    apply_url: "https://stellarcampus.com",
    brochureUrl: "/brochures/stellar.pdf",
    image_url: "https://media.licdn.com/dms/image/v2/D4D0BAQHkkugLxQrWQQ/company-logo_200_200/B4DZvHDWkpKYAI-/0/1768571104107/stellar_institute_of_technlogy_logo?e=2147483647&v=beta&t=oR991HUvpeI71Aj0i1PxxaPGq5fLIa8kxz6nfVuojSo",
    eligibility: "Class 12th (PCM preferred) + SAT (Stellar Aptitude Test) + 1:1 Evaluation.",
    location: "Pune, Maharashtra",
    fees: "₹19 Lakhs to ₹20 Lakhs (Total B.Tech Tuition).",
    curriculum_summary: "B.Tech in Computer Science utilizing a continuous software shipping model.",
    contact_info: "admissions@stellarcampus.com | support@stellarcampus.com",
    degree_partner: "Medhavi Skills University",
    tags: [
      "GitHub Graded System",
      "Stellar SAT Entrance",
      "Venture Seed Capital",
      "Startup Incubation Wing"
    ],
    year_1_curriculum: "Git & Open Source (Version control, open-source contributions, basic SWE).",
    year_2_curriculum: "Continuous Shipping (Portfolio-based grading, shipping live software monthly instead of written exams).",
    year_3_curriculum: "Startup Incubation (Forming teams, building MVPs, entering the incubator).",
    year_4_curriculum: "Seed Funding & Launch (Pitching to founder consortium for seed funding/launching startups).",
    founders: [
      {
        name: "Pune Founder Consortium",
        background_info: "Built by a consortium of Pune-based startup founders and venture capitalists",
        linkedin_url: "https://www.linkedin.com/search/results/all/?keywords=Pune%20Founder%20Consortium%20Stellar%20School%20of%20Technology",
      }
    ],
    instructors: [
      {
        name: "Pune Startup CTOs",
        company_background: "Consortium Technologists"
      },
      {
        name: "Lead SWE Mentors",
        company_background: "ex-Microsoft, ex-Google & ex-Adobe"
      }
    ],
    reviews: [
      {
        rating: 4.2,
        review_text: "Noted for its strong startup incubation support and early seed-funding opportunities for student projects."
      }
    ],
    seats: "200 Seats/Batch",
    laptop_provided: false,
    hiring_partners_count: 500,
    is_trending: false,
    is_new: false,
    rating_breakdown: {
      curriculum: 4.5,
      placements: 4.3,
      faculty: 4.4,
      campus: 4.4
    },
    degreeType: "B.Tech in CSE",
    applicationFee: "₹1,000 (SAT — Stellar Aptitude Test Fee)",
    examDates: "Admissions Open | Cycles ongoing through July 2026",
    industryMentors: "Mentors from leading tech startups and corporate scaling hubs",
    fastTrack: false,
    fastTrackDetails: "",
    batchSize: 200,
    degreeRecognition: "UGC Approved Degree via Medhavi Skills University",
    entranceExam: {
      pattern: "Online Aptitude & Logical Evaluation (60 mins MCQ)",
      level: "Institute Level",
      syllabus: "Quantitative Aptitude, General Reasoning, and Computing Logic"
    },
    financingOptions: "Flexible EMI loan schemes via GrayQuest, Avanse, and Propelld",
      studentClubs: [
      "Stellar GitHub Graders Club",
      "Continuous Shipping Society",
      "Stellar Venture Seed Incubator",
      "Tech Developers Club",
      "Sports & Cultural Association"
    ],
  },
  "Coding Blocks School of Technology (CBSOT)": {
    name: "Coding Blocks School of Technology (CBSOT)",
    foundingYear: 2026,
    website_url: "https://cbsot.com",
    apply_url: "https://cbsot.com",
    brochureUrl: "/brochures/cbsot.pdf",
    image_url: "https://pbs.twimg.com/media/EVkyIf_UUAAcxXc.jpg",
    eligibility: "Class 12th + CBNEST (Coding Blocks National Entrance and Scholarship Test).",
    location: "Delhi NCR (Residential)",
    fees: "₹22 Lakhs to ₹25 Lakhs (Estimated Total 4-year cost including B.Tech tuition at GLA/Geeta University + Coding Blocks program fee + hostel & mess for 4 years). CBNEST scholarships can significantly reduce tuition. Verify exact split at cbsot.com.",
    curriculum_summary: "4-year AI-First B.Tech with a rigid technical roadmap.",
    contact_info: "admissions@cbsot.com | +91-9999579222",
    degree_partner: "GEETA University and GLA noida",
    tags: [
      "Competitive Coding",
      "AI-First B.Tech",
      "Residential Bootcamp",
      "Strong Alumni network"
    ],
    year_1_curriculum: "Programming Foundations (C++, Python), Mathematics for Data Science, Linux, Git, and Operating Systems.",
    year_2_curriculum: "Web Development (MERN), Databases (DBMS, SQL), Introduction to Data Science (GenAI, Agentic AI), and Advanced DSA.",
    year_3_curriculum: "Applied ML/DL, Generative AI & LLMs, Computer Vision, MLOps, Blockchain, and System Design.",
    year_4_curriculum: "Cloud Computing, with a choice between an Industry Track (Internship) or a Research Track (Thesis).",
    founders: [
      {
        name: "Kartik Mathur",
        background_info: "Academics Head & Co-founder Coding Blocks",
        linkedin_url: "https://www.linkedin.com/in/kartik-mathur/",
      },
      {
        name: "Varun Kohli",
        background_info: "CEO Coding Blocks",
        linkedin_url: "https://www.linkedin.com/in/kohli12/",
      }
    ],
    instructors: [
      {
        name: "Kartik Mathur",
        company_background: "Academics Head, ex-Salesforce"
      },
      {
        name: "Manmohan Gupta",
        company_background: "Nagarro co-founder, IIT Delhi"
      },
      {
        name: "Arnav Gupta",
        company_background: "ex-Zomato Tech Lead"
      }
    ],
    reviews: [
      {
        rating: 4.7,
        review_text: "Highly rated for its technical foundation, preparation for global open-source programs like GSoC, and intensive hackathon culture."
      }
    ],
    seats: "120 Seats/Batch",
    laptop_provided: false,
    hiring_partners_count: 400,
    is_trending: false,
    is_new: false,
    rating_breakdown: {
      curriculum: 4.5,
      placements: 4.3,
      faculty: 4.4,
      campus: 4.4
    },
    degreeType: "B.Tech in CSE",
    applicationFee: "₹1,000 (CBNEST Registration Fee)",
    examDates: "Admissions Open | Cycles ongoing through July 2026",
    industryMentors: "Mentors from leading tech startups and corporate scaling hubs",
    fastTrack: false,
    fastTrackDetails: "",
    batchSize: 120,
    degreeRecognition: "UGC Approved Degree via GEETA University and GLA noida",
    entranceExam: {
      pattern: "Online CBNEST (90 mins: Logic, Aptitude, Coding basics) + Counseling Interview",
      level: "National Level",
      syllabus: "Quantitative Aptitude, General Reasoning, and Computing Logic"
    },
    financingOptions: "Education loans via Propelld and GrayQuest",
    studentClubs: [
      "Coding Blocks Student Chapters",
      "Campus Superheroes Network",
      "Competitive Coding Club",
      "Open Source Contributors",
      "Cultural & Drama Club",
      "Sports Club"
    ]
  },
  "UpGrad School of Technology": {
    name: "UpGrad School of Technology",
    foundingYear: 2026,
    website_url: "https://sot.upgrad.com",
    apply_url: "https://sot.upgrad.com/?utm_source=google&utm_medium=cpc&utm_campaign=Leads_Search_4thApril&utm_id=23717194710&utm_term=engineering%20universities&utm_content=198142740394-home&gad_source=1&gad_campaignid=23717194710&gbraid=0AAAABCggrOIyamAGuMvxYUdKznvOEAcDI&gclid=Cj0KCQjwornRBhCrARIsAON5exFT30hR3P7WRSWW01hBRixJDkgU9SHrruUrqVMtyiV0UBfYZU59LgsaAolUEALw_wcB",
    brochureUrl: "/brochures/upgrad.pdf",
    image_url: "https://i.ytimg.com/vi/uqroWMvX3fc/maxresdefault.jpg",
    eligibility: "10+2 graduation + UpGrad Entrance Test + Video SOP.",
    location: "Mumbai, Maharashtra",
    fees: "₹24 Lakhs to ₹30 Lakhs (Total Tuition, varies by partner university campus).",
    curriculum_summary: "Tech degree intertwined with corporate bootcamps.",
    contact_info: "admissions.sot@upgrad.com",
    degree_partner: "Ajeenkya DY Patil University & Sri Siddhartha Academy",
    tags: [
      "Corporate Bootcamps",
      "Video SOP Entry",
      "upGrad Placement Network",
      "Cybersecurity Tracks"
    ],
    year_1_curriculum: "IT Fundamentals (Core CS logic, programming basics, math).",
    year_2_curriculum: "Specialized Tech Tracks (Cloud Computing, Cybersecurity, Data Analytics).",
    year_3_curriculum: "Corporate Bootcamps (UpGrad's B2B case studies and training modules).",
    year_4_curriculum: "Corporate Transition (Seamless transition to full-time roles via UpGrad's network).",
    founders: [
      {
        name: "Ronnie Screwvala",
        background_info: "Co-Founder (Prominent Indian industrialist, media pioneer & philanthropist)",
        linkedin_url: "https://www.linkedin.com/in/ronniescrewvala",
      },
      {
        name: "Mayank Kumar",
        background_info: "Co-Founder (IIT Delhi Alumnus, education business builder)",
        linkedin_url: "https://www.linkedin.com/in/mayank-kumar-5573243/",
      },
      {
        name: "Phalgun Kompalli",
        background_info: "Co-Founder (IIT Kharagpur Alumnus, education strategy expert)",
        linkedin_url: "https://www.linkedin.com/in/phalgun-kompalli-2a37083a/",
      }
    ],
    instructors: [
      {
        name: "Mayank Kumar",
        company_background: "co-founder, IIT Delhi"
      },
      {
        name: "Enterprise Tech Architects",
        company_background: "Microsoft, Amazon & Salesforce"
      }
    ],
    reviews: [
      {
        rating: 4.3,
        review_text: "Praised for its massive alumni network, corporate tie-ups, and immediate connection to enterprise placements."
      }
    ],
    seats: "120 Seats/Batch",
    laptop_provided: false,
    hiring_partners_count: 3000,
    is_trending: false,
    is_new: false,
    rating_breakdown: {
      curriculum: 4.5,
      placements: 4.3,
      faculty: 4.4,
      campus: 4.4
    },
    degreeType: "B.Tech in CSE",
    applicationFee: "₹1,000 (UpGrad Entrance Test Fee)",
    examDates: "Admissions Open | Cycles ongoing through July 2026",
    industryMentors: "Mentors from leading tech startups and corporate scaling hubs",
    fastTrack: false,
    fastTrackDetails: "",
    batchSize: 120,
    degreeRecognition: "UGC Approved Degree via Ajeenkya DY Patil University & Sri Siddhartha Academy",
    entranceExam: {
      pattern: "Online Aptitude & Logical Evaluation (60 mins MCQ)",
      level: "Institute Level",
      syllabus: "Quantitative Aptitude, General Reasoning, and Computing Logic"
    },
    financingOptions: "Flexible EMI loan schemes via GrayQuest, Avanse, and Propelld",
      studentClubs: [
      "UpGrad Enterprise Networking Guild",
      "Cybersecurity & Cloud Security Club",
      "Data Analytics & Big Data Group",
      "Corporate Bootcamps Cohort",
      "Sports & Wellness Association"
    ],
  },
  "Scaler School of Technology (SST)": {
    name: "Scaler School of Technology (SST)",
    foundingYear: 2023,
    website_url: "https://www.scaler.com/school-of-technology/cs-ai",
    image_url: "https://assets-v2.scaler.com/assets/programs/undergrad/png/sst-meta-image-0a5d93081c1cabadde4b31ac291bb30a511e7d0d512dfbd35e5b47c69506e9f6.png.gz",
    eligibility: "10+2 with min. 60% in Mathematics (age ≤ 20 as of July 1, 2026) + NSET or JEE/BITSAT scores + Personal Interview.",
    location: "Electronic City, Bangalore, Karnataka",
    fees: "₹27 Lakhs to ₹30 Lakhs (Total B.Tech Program Fee).",
    curriculum_summary: "B.Sc / B.Tech in Computer Science and Data Science with industry-aligned curriculum.",
    contact_info: "admissions@scaler.com",
    degree_partner: "BITS Pilani & IIT Madras",
    tags: [
      "Hacker-House Campus",
      "NSET Scholarship",
      "1-Year Paid Internship",
      "Electronic City Hub"
    ],
    year_1_curriculum: "Fundamentals of CS, Mathematics (Linear Algebra, Calculus), Python programming, Git, and Unix.",
    year_2_curriculum: "Data Structures & Algorithms, Backend engineering (Java, Spring Boot), System Design (LLD/HLD), and Frontend development.",
    year_3_curriculum: "Mandatory One-Year Paid Industry Internship.",
    year_4_curriculum: "Specializations (AI/ML, Web3, or Cloud) and Capstone Project.",
    founders: [
      {
        name: "Anshuman Singh",
        background_info: "Co-Founder (ex-Facebook Tech Lead, Co-founder of InterviewBit & Scaler Academy)",
        linkedin_url: "https://www.linkedin.com/in/anshumansingh26/",
      },
      {
        name: "Abhimanyu Saxena",
        background_info: "Co-Founder (ex-Fab.com SDE Director, Co-founder of InterviewBit & Scaler Academy)",
        linkedin_url: "https://www.linkedin.com/in/abhimanyusaxena/",
      }
    ],
    instructors: [
      {
        name: "Anshuman Singh",
        company_background: "ex-Facebook SDE Tech Lead"
      },
      {
        name: "Abhimanyu Saxena",
        company_background: "ex-Fab.com SDE Director"
      },
      {
        name: "Srikanth Verma",
        company_background: "ex-Amazon Applied Scientist"
      },
      {
        name: "Senior SDE Mentors",
        company_background: "Google, Microsoft, Adobe & Amazon"
      }
    ],
    reviews: [
      {
        rating: 4.8,
        review_text: "Renowned for its Silicon Valley-style residential model, MacBook provision, and extremely high average stipends during the 1-year internship."
      }
    ],
    seats: "600+ Students/Batch (~3% Acceptance Rate)",
    laptop_provided: false,
    hiring_partners_count: 1200,
    brochureUrl: "/brochures/scaler.pdf",
    scholarship_info: "NSET merit scholarships up to 100% tuition waiver. JEE / BITSAT scores bypass NSET entirely.",
    apply_url: "https://www.scaler.com/school-of-technology/cs-ai",
    is_trending: false,
    is_new: false,
    rating_breakdown: {
      curriculum: 4.9,
      placements: 4.8,
      faculty: 4.9,
      campus: 4.7
    },
    degreeType: "B.Sc & B.Tech (Integrated)",
    applicationFee: "₹1,000 (NSET Registration Fee)",
    examDates: "NSET Exam: June 28, 2026 | Apply by June 26, 2026",
    industryMentors: "SDE Leads from ex-Facebook, ex-Google, Microsoft, and Uber",
    fastTrack: true,
    fastTrackDetails: "NSET bypass for JEE Main ≥ 92 percentile (or Math/Physics 95%+), or SAT ≥ 1430 — direct to interview",
    batchSize: 600,
    degreeRecognition: "BITS Pilani & IIT Madras Parallel Degrees",
    entranceExam: {
      pattern: "Online NSET (120 mins: Maths & Logic) + 2-round Interviews (JEE 92+ %ile / SAT 1430+ can skip NSET)",
      level: "National Level",
      syllabus: "Mathematics (discrete math, calculus, algebra), logical reasoning, and cognitive ability"
    },
    studentClubs: [
      "Competitive Programming Club",
      "AI/ML Club",
      "Open Source Club",
      "Drone Club",
      "E-Cell (Entrepreneurship)",
      "Media & Orators Club",
      "Sports Club"
    ],
    financingOptions: "Education loans via Propelld and HDFC Credila"
  },
  "Tensor School of CS and AI": {
    name: "Tensor School of CS and AI",
    foundingYear: 2026,
    brochureUrl: "/brochures/tensor.pdf",
    website_url: "https://tensorschool.com",
    apply_url: "https://tensorschool.com",
    image_url: "https://tensorschool.com/images/campus-tour-thumb.webp",
    eligibility: "Class 12th + T-SAT (Tensor Scholastic Aptitude Test, tests math aptitude & logical reasoning — no prior coding needed).",
    location: "Bangalore, Karnataka (Residential Campus)",
    fees: "₹24 Lakhs to ₹25 Lakhs (Total 4-Year B.Tech Tuition).",
    curriculum_summary: "BCA / B.Sc in Computer Science via Partner University.",
    contact_info: "admissions@tensorschool.com",
    degree_partner: "s-vyasa university",
    tags: [
      "ISA Fee Option",
      "T-SAT Entrance Exam",
      "18-Month Paid Internship",
      "AI-Native Focus"
    ],
    year_1_curriculum: "AI Native Foundations (Python for AI, statistics, linear algebra).",
    year_2_curriculum: "Generative Models (Deep learning, NLP, training generative AI models).",
    year_3_curriculum: "18-Month Paid Internship - Part 1 (Classroom learning stops; full-time enterprise internship begins).",
    year_4_curriculum: "18-Month Paid Internship - Part 2 & Thesis (Conclusion of internship, AI deployment thesis).",
    founders: [
      {
        name: "Manas Kumar Verma",
        background_info: "Founder & CEO (IIIT Hyderabad Alumnus, ex-Quant Trader at AlphaGrep, founder & CEO of AlgoUniversity, Y-Combinator backed)",
        linkedin_url: "https://www.linkedin.com/in/thenextmkv/",
      }
    ],
    instructors: [
      {
        name: "Manas Kumar Verma",
        company_background: "ex-AlphaGrep Quant Trader"
      },
      {
        name: "Nitin Mittal",
        company_background: "ML Practitioner, ex-Adobe"
      }
    ],
    reviews: [
      {
        rating: 4.4,
        review_text: "Highly rated for making elite tech education accessible via deferred fee structures and generative AI coursework."
      }
    ],
    seats: "300 Seats/Batch",
    laptop_provided: false,
    hiring_partners_count: 1300,
    is_trending: false,
    is_new: false,
    rating_breakdown: {
      curriculum: 4.5,
      placements: 4.3,
      faculty: 4.4,
      campus: 4.4
    },
    degreeType: "B.Tech in CSE",
    applicationFee: "₹1,000 (T-SAT Registration Fee, early bird ₹500)",
    examDates: "Admissions Open | Cycles ongoing through July 2026",
    industryMentors: "Mentors from leading tech startups and corporate scaling hubs",
    fastTrack: false,
    fastTrackDetails: "",
    batchSize: 300,
    degreeRecognition: "UGC Approved Degree via s-vyasa university",
    entranceExam: {
      pattern: "Online Aptitude & Logical Evaluation (60 mins MCQ)",
      level: "Institute Level",
      syllabus: "Quantitative Aptitude, General Reasoning, and Computing Logic"
    },
    financingOptions: "Flexible EMI loan schemes via GrayQuest, Avanse, and Propelld",
      studentClubs: [
      "Tensor Quantitative Trading Circle",
      "ML & Deep Learning Guild",
      "Algorithmic Problem Solving Club",
      "TechTalk Tribe",
      "Sports & Recreation Club"
    ],
  },
  "Polaris School of Technology (PST)": {
    name: "Polaris School of Technology (PST)",
    foundingYear: 2023,
    website_url: "https://www.polariscampus.com",
    image_url: "https://media.collegedekho.com/media/img/institute/crawled_images/None/Copy_of_DSC00378.JPG",
    eligibility: "Grade XII (2024-2026) + PAT (Polaris Admission Test). Students with 90+ percentile in JEE or 1200+ in SAT bypass the PAT.",
    location: "Electronic City, Bangalore, Karnataka (Fully Residential)",
    fees: "₹34 Lakhs to ₹36 Lakhs (Total 4-Year Tuition & Program Fee).",
    curriculum_summary: "B.Tech in CSE (AI/ML) in association with Medhavi Skills University. Mandates 5,000 hours of live coding.",
    contact_info: "admissions@polariscampus.com",
    degree_partner: "Medhavi Skills University",
    tags: [
      "5000 Hrs Coding",
      "Tech Combinator",
      "PAT Entrance Exam",
      "MacBook Provided"
    ],
    year_1_curriculum: "Code from Day 1, Programming (Python, C++), Data Structures, and Applied AI Engineering basics.",
    year_2_curriculum: "Web Engineering, Database Systems, Software Architecture, and AI agents/LLM integrations.",
    year_3_curriculum: "Advanced ML/DL, Cloud & Big Data, product management, and hands-on hackathons.",
    year_4_curriculum: "Living Syllabus Capstone, Incubator/Startup Track, and Industry Internships.",
    founders: [
      {
        name: "Mukul Rustagi",
        background_info: "Co-Founder (Co-founder of EdTech unicorn Classplus, backed by Kunal Shah and Sriharsha Majety)",
        linkedin_url: "https://www.linkedin.com/in/mukul-rustagi-45462316",
      },
      {
        name: "Bhaswat Agarwal",
        background_info: "Co-Founder (Co-founder of EdTech unicorn Classplus, backed by Kunal Shah and Sriharsha Majety)",
        linkedin_url: "https://www.linkedin.com/in/bhaswat-agarwal-24a03715",
      }
    ],
    instructors: [
      {
        name: "Mukul Rustagi",
        company_background: "co-founder, Classplus Founder"
      },
      {
        name: "Sudhanshu Shekhar",
        company_background: "ex-Director SDE Ola, ex-Amazon"
      },
      {
        name: "Saurabh Hooda",
        company_background: "ex-Oracle SDE"
      },
      {
        name: "SDE Mentors & Tech Leads",
        company_background: "Google, Microsoft, Uber & JP Morgan"
      }
    ],
    reviews: [
      {
        rating: 4.8,
        review_text: "Highly praised for its 'Polaris Tech Combinator,' MacBook provision, and high-paying internships (up to ₹2.5 Lakhs stipend)."
      }
    ],
    seats: "300 Seats/Batch (100 per Specialization)",
    laptop_provided: "MacBook Pro",
    hiring_partners_count: 1000,
    brochureUrl: "/brochures/polaris.pdf",
    scholarship_info: "Women in Tech, Entrepreneur & need-based scholarships. 90+ JEE percentile → direct admission offer.",
    apply_url: "https://www.polariscampus.com",
    is_trending: true,
    is_new: false,
    rating_breakdown: {
      curriculum: 4.9,
      placements: 4.7,
      faculty: 4.8,
      campus: 4.9
    },
    degreeType: "B.Tech & B.Sc",
    applicationFee: "₹1,500 (PAT — Polaris Admission Test Fee)",
    examDates: "Next PAT: June 17, 2026 | Apply by June 16, 2026",
    industryMentors: "Mentors from Google, Amazon, Microsoft, and Classplus",
    fastTrack: true,
    fastTrackDetails: "PAT bypass for JEE Main ≥ 90 percentile OR SAT ≥ 1200 (last 3 years) — direct to interview",
    batchSize: 300,
    degreeRecognition: "UGC Recognised via Medhavi Skills University",
    entranceExam: {
      pattern: "Online PAT (120 mins: Maths & Logic) + Interview (JEE 90+ %ile / SAT 1200+ can skip PAT)",
      level: "National Level",
      syllabus: "Logical Reasoning, Quantitative Aptitude, and Mathematics"
    },
    studentClubs: [
      "Women in Tech Community",
      "AI-ML Innovation Cohort",
      "Drone & Droid Club",
      "Media & Creators Club",
      "Vibeathon Committee",
      "Sports & Wellness Club"
    ],
    financingOptions: "Education loans via Propelld, Eduvanz, and GrayQuest"
  },
  "Newton School of Technology (NST)": {
    name: "Newton School of Technology (NST)",
    foundingYear: 2023,
    website_url: "https://www.newtonschool.co",
    image_url: "https://cdn.prod.website-files.com/62e8d2ea218fb7676b6892a6/69de4046643bcc1a7cf65f51_05ae5a3256043b9f40e71fd8341ab9fc_OG%20Image%20%282%29.png",
    eligibility: "Class 12 (PCM) with at least 50% + NSAT (Newton Scholastic Aptitude Test) + Personal Interview.",
    location: "Sonepat, Haryana (Rishihood University - Delhi NCR) & Pune (ADYPU) & Bangalore (S-VYASA) & St. Mary's University",
    fees: "₹25 Lakhs to ₹28 Lakhs (Total 4-Year All-Inclusive Fee, varies by partner university campus).",
    curriculum_summary: "UGC-approved B.Tech in Computer Science and AI in collaboration with Rishihood/ADYPU.",
    contact_info: "admissions@newtonschool.co",
    degree_partner: "Rishihood University, ADYPU & S-VYASA",
    tags: [
      "6-Month Internship",
      "Rishihood Partner",
      "DY Patil Partner",
      "MacBook Pro Provided"
    ],
    year_1_curriculum: "Coding Foundations (Python, Java), Computational Math, UI/UX design, and AI Prompt Engineering.",
    year_2_curriculum: "Advanced DSA, Database Systems (SQL/NoSQL), Web Dev (React/Node), and Machine Learning foundations.",
    year_3_curriculum: "Deep Learning, Generative AI & Agentic AI, Cloud (AWS/Azure), and Interview Prep.",
    year_4_curriculum: "Specialized Capstone, Electives, and Industry Placement/Internship.",
    founders: [
      {
        name: "Nishant Chandra",
        background_info: "Co-Founder (IIT Roorkee & IIM Calcutta Alumnus, Forbes 30u30, ex-Unacademy PM)",
        linkedin_url: "https://www.linkedin.com/in/nishant-chandra-1b459446/",
      },
      {
        name: "Siddharth Maheshwari",
        background_info: "Co-Founder (IIT Roorkee Alumnus, Forbes 30u30, ex-InMobi SDE)",
        linkedin_url: "https://www.linkedin.com/in/maheshwarisiddharth/",
      }
    ],
    instructors: [
      {
        name: "Siddharth Garg",
        company_background: "Software Architect, ex-Microsoft"
      },
      {
        name: "Kshitij Sharma",
        company_background: "ML Engineer, ex-Google"
      },
      {
        name: "Rohit Verma",
        company_background: "Senior Backend, ex-Amazon"
      }
    ],
    reviews: [
      {
        rating: 4.6,
        review_text: "Recognized globally for its mandatory 6-month internship, MacBook provision, and global immersion programs (Silicon Valley trips)."
      }
    ],
    seats: "200 Seats/Batch (Selective Admissions - May vary by partner university campus)",
    laptop_provided: "MacBook Air",
    hiring_partners_count: 800,
    brochureUrl: "/brochures/newton.pdf",
    scholarship_info: "NSAT Merit & Need-based scholarships up to 100% off tuition and hostel fees.",
    apply_url: "https://www.newtonschool.co/newton-school-of-technology-nst/home",
    is_trending: true,
    is_new: false,
    rating_breakdown: {
      curriculum: 4.8,
      placements: 4.6,
      faculty: 4.7,
      campus: 4.9
    },
    degreeType: "B.Tech in CS & AI",
    applicationFee: "₹1,200 (NSAT Registration Fee)",
    examDates: "Next NSAT: June 20, 2026 (3:00 PM) | Apply by June 19, 2026",
    industryMentors: "SDE Mentors and Product Managers from global tech giants",
    fastTrack: true,
    fastTrackDetails: "NSAT bypass for strong JEE Main score or competitive programming ratings — direct to personal interview",
    batchSize: 200,
    degreeRecognition: "UGC Approved Degrees via Rishihood, ADYPU & S-VYASA Universities",
    entranceExam: {
      pattern: "Online NSAT (120 mins: Math, Aptitude, English) + Personal Interview",
      level: "National Level",
      syllabus: "Logical reasoning, verbal ability, high school math, and critical thinking"
    },
    studentClubs: [
      "NST Student Developer Club (SDC)",
      "Competitive Coding Club",
      "Robotics Club",
      "Software Development Club",
      "Neutron Cultural Club",
      "Sports & Fitness Club"
    ],
    financingOptions: "Education loans via GrayQuest, Propelld, and Avanse Financial"
  },
  "Sunstone School of Technology": {
    name: "Sunstone School of Technology",
    foundingYear: 2019,
    website_url: "https://sunstone.in/",
    apply_url: "https://sunstone.in/",
    brochureUrl: "/brochures/sunstone.pdf",
    image_url: "https://s3.eu-west-1.amazonaws.com/latest.images.pinkerala.com/news/full/2023/05/sunstones-advantages-now-available-at-the-jai-bharath-school-of-management-studies.jpg",
    eligibility: "10+2 with PCM (50% aggregate) or relevant graduation for PG tracks. Direct admission based on counseling.",
    location: "Bangalore, Pune, Jaipur, Gurugram/NCR & 30+ other cities (35+ Partner Campuses Nationwide)",
    fees: "₹3 Lakhs to ₹8 Lakhs (Total tuition, varies by university partner campus. Offers structured career-assurance plans).",
    curriculum_summary: "B.Tech/MCA/MBA with Sunstone's industry overlay curriculum providing 6+ months of live project training and professional soft skills.",
    contact_info: "connect@sunstone.in | +91-7065-333-888",
    degree_partner: "GD Goenka, JECRC, ADYPU, and other UGC-recognized universities",
    tags: [
      "35+ Partner Campuses",
      "Career Assurance Plan",
      "6-Month Apprenticeship",
      "Sunstone Edge Hubs"
    ],
    year_1_curriculum: "Core Fundamentals (Core engineering math, basic programming, professional communication, and digital literacy).",
    year_2_curriculum: "Specialization Core (Advanced DSA, web development, cloud computing basics, and mock business operations).",
    year_3_curriculum: "Deep Tech & Projects (Cybersecurity, applied ML, decentralized systems, and first corporate live projects).",
    year_4_curriculum: "Apprenticeship & Placements (Mandatory 6-month paid corporate apprenticeship, intense mock interviews, placement sprints).",
    founders: [
      {
        name: "Ashish Munjal",
        background_info: "Co-Founder & CEO of Sunstone (Times 40 Under 40, pioneer in structured outcome-based higher education)",
        linkedin_url: "https://www.linkedin.com/in/ashishmunjal",
      },
      {
        name: "Piyush Nangru",
        background_info: "Co-Founder & COO of Sunstone (IIT Roorkee Alumnus, ex-Consultant, EdTech strategist)",
        linkedin_url: "https://www.linkedin.com/in/piyushnangru/",
      }
    ],
    instructors: [
      {
        name: "Ashish Munjal",
        company_background: "co-founder, EdTech pioneer"
      },
      {
        name: "SDE Mentors & Instructors",
        company_background: "Amazon, Microsoft & Google"
      }
    ],
    reviews: [
      {
        rating: 4.1,
        review_text: "Highly appreciated for bringing uniform, high-quality, practical placements and soft-skill bootcamps to tier-2 and tier-3 colleges across India."
      }
    ],
    seats: "300 Seats/Batch",
    laptop_provided: false,
    hiring_partners_count: 1200,
    is_trending: false,
    is_new: false,
    rating_breakdown: {
      curriculum: 4.5,
      placements: 4.3,
      faculty: 4.4,
      campus: 4.4
    },
    degreeType: "B.Tech in CSE",
    applicationFee: "₹1,000 (ASAT — Sunstone Aptitude Test)",
    examDates: "Admissions Open | Cycles ongoing through July 2026",
    industryMentors: "Mentors from leading tech startups and corporate scaling hubs",
    fastTrack: false,
    fastTrackDetails: "",
    batchSize: 300,
    degreeRecognition: "UGC Approved Degree via GD Goenka, JECRC, ADYPU, and other UGC-recognized universities",
    entranceExam: {
      pattern: "Online Aptitude & Logical Evaluation (60 mins MCQ)",
      level: "Institute Level",
      syllabus: "Quantitative Aptitude, General Reasoning, and Computing Logic"
    },
    financingOptions: "Flexible EMI loan schemes via GrayQuest, Avanse, and Propelld"
  },
  "Masters' Union (MU)": {
    name: "Masters' Union (MU)",
    foundingYear: 2020,
    brochureUrl: "/brochures/DSAI_Brochure.pdf",
    website_url: "https://mastersunion.org",
    apply_url: "https://mastersunion.org",
    image_url: "https://images.mastersunion.link/uploads/10112025/v1/event2.webp",
    eligibility: "10+2 (any stream) + MUSAT (Masters' Union Scholarship Aptitude Test) or JEE/SAT/ACT/CUET scores + Personal Interview.",
    location: "DLF Cyberpark, Gurugram, Haryana (Cyber City Campus)",
    fees: "₹52,50,000 (Academic Fee) + ₹1,80,000 (Admission Fee) | Total ₹54,30,000. Optional hostel: ₹24,500–₹43,500/month.",
    curriculum_summary: "Undergraduate/PGP Programme in Technology & Business Management blending coding, data, and startups.",
    contact_info: "admissions@mastersunion.org | +91-124-455-0800",
    degree_partner: "Delhi University / Illinois Institute of Technology (USA) / O.P. Jindal",
    tags: [
      "Experiential Startup Lab",
      "DLF Cyber City Hub",
      "MUSAT Entrance Test",
      "1-Year CXO Internship"
    ],
    year_1_curriculum: "Coding Foundations, Business Economics, Product UX Design, and Communication.",
    year_2_curriculum: "Full-Stack Dev, Data Science, Venture Initiation (build a real startup), and Corporate Shadow program.",
    year_3_curriculum: "Advanced Machine Learning, Financial Modeling, System Design, and Founders' Fellowship.",
    year_4_curriculum: "Industry Internships, Consulting Projects, and final graduation.",
    founders: [
      {
        name: "Pratham Mittal",
        background_info: "Founder of Masters' Union & Tetr (Wharton School Alumnus, prominent higher education reformer, Shark Tank judge)",
        linkedin_url: "https://www.linkedin.com/in/prathammittal",
      }
    ],
    instructors: [
      {
        name: "Manoj Kohli",
        company_background: "former CEO of Bharti Airtel"
      },
      {
        name: "Mukund Rajan",
        company_background: "ex-Brand Custodian Tata Group"
      },
      {
        name: "Rajeev Vasudeva",
        company_background: "ex-CEO Egon Zehnder"
      }
    ],
    reviews: [
      {
        rating: 4.9,
        review_text: "Highly immersive program. Students build real businesses, handle lakhs of revenue, and learn directly from top-tier corporate CEOs."
      }
    ],
    seats: "150 Seats/Batch",
    laptop_provided: false,
    hiring_partners_count: 100,
    is_trending: false,
    is_new: false,
    rating_breakdown: {
      curriculum: 4.5,
      placements: 4.3,
      faculty: 4.4,
      campus: 4.4
    },
    degreeType: "B.Tech in CSE",
    applicationFee: "₹3,000 (MUSAT Application Fee, Round 1)",
    examDates: "Admissions Open | Cycles ongoing through July 2026",
    industryMentors: "Mentors from leading tech startups and corporate scaling hubs",
    fastTrack: false,
    fastTrackDetails: "",
    batchSize: 150,
    degreeRecognition: "UGC Approved Degree via Delhi University / Illinois Institute of Technology (USA) / O.P. Jindal",
    entranceExam: {
      pattern: "Online MU-BAAT (90 mins MCQ) + Personal Interview (CAT/GMAT/GRE accepted)",
      level: "Institute Level",
      syllabus: "Quantitative aptitude, logical reasoning, verbal ability, and case analysis"
    },
    studentClubs: [
      "Management Consulting Club",
      "Venture Capital & Private Equity Club",
      "Product Management Club",
      "Debating Society",
      "Investment Club",
      "Sports & Performing Arts Club"
    ],
    financingOptions: "Up to 100% education loans from partner banks and financial institutions."
  },
  "Leapstart School of Technology": {
    name: "Leapstart School of Technology",
    foundingYear: 2025,
    brochureUrl: "/brochures/leapstart.pdf",
    website_url: "https://leapstart.in",
    apply_url: "https://leapstart.in",
    image_url: "https://i.ytimg.com/vi/FugHzkkF3oc/maxresdefault.jpg",
    eligibility: "Class 12th with 70%+ in Mathematics, age 17-20 + LeapStart Assessment Test (LAT) or JEE Mains + Founder's Interview.",
    location: "Financial District, Hyderabad, Telangana (My Scape Weave Building)",
    fees: "Fee not mentioned on official website",
    curriculum_summary: "B.Tech in CS specializing in AI and Data Science. Experiential structure with 40+ real-world projects and a mandatory 6-month paid internship.",
    contact_info: "admissions@leapstart.in | +91-99599-99599",
    degree_partner: "UGC-recognized university partners",
    tags: [
      "LAT Entrance Test",
      "Financial District Hub",
      "6-Month Paid Internship",
      "40+ Real Projects"
    ],
    year_1_curriculum: "Foundations & Bootcamp (Typescript, logic development, web prototyping, basic algebra, and data structures).",
    year_2_curriculum: "Advanced Software Engineering (System architecture, DBMS, API development with Node.js, advanced frontend frameworks).",
    year_3_curriculum: "Applied AI & Data Science (ML pipelines, cloud deployments with AWS/GCP, data warehousing, start of 6-month internship).",
    year_4_curriculum: "Product Scaling & Placement (Enterprise system scaling, capstone project delivery, mock portfolio reviews, placement matching).",
    founders: [
      {
        name: "SAIKRISHNA J.",
        background_info: "Founder (Tech entrepreneur, pioneer in outcomes-based higher education)",
        linkedin_url: "https://www.linkedin.com/in/saikrishnajavvaji/",
      }
    ],
    instructors: [
      {
        name: "Amar Chaitanya",
        company_background: "Founder, ex-Tech Lead"
      },
      {
        name: "SDE Mentors & Experts",
        company_background: "Microsoft, Google & Amazon"
      }
    ],
    reviews: [
      {
        rating: 4.5,
        review_text: "Highly acclaimed for its hands-on project count (40+) and prime location in Hyderabad financial district, keeping students close to major recruiters."
      }
    ],
    seats: "120 Seats/Batch",
    laptop_provided: false,
    hiring_partners_count: 100,
    is_trending: false,
    is_new: false,
    rating_breakdown: {
      curriculum: 4.5,
      placements: 4.3,
      faculty: 4.4,
      campus: 4.4
    },
    degreeType: "B.Tech in CSE",
    applicationFee: "₹1,000 (LAT — LeapStart Assessment Test Fee)",
    examDates: "Admissions Open | Cycles ongoing through July 2026",
    industryMentors: "Mentors from leading tech startups and corporate scaling hubs",
    fastTrack: false,
    fastTrackDetails: "",
    batchSize: 120,
    degreeRecognition: "UGC Approved Degree via UGC-recognized university partners",
    entranceExam: {
      pattern: "Online Aptitude & Logical Evaluation (60 mins MCQ)",
      level: "Institute Level",
      syllabus: "Quantitative Aptitude, General Reasoning, and Computing Logic"
    },
    financingOptions: "Flexible EMI loan schemes via GrayQuest, Avanse, and Propelld",
      studentClubs: [
      "Leapstart AI & Data Science Cohort",
      "Software Engineering Club",
      "Industry Mentorship Group",
      "Tech Innovations Club",
      "Sports & Wellness Club"
    ],
  },
  "Futurense School of AI": {
    name: "Futurense School of AI",
    foundingYear: 2026,
    website_url: "https://www.futurense.com/",
    apply_url: "https://www.futurense.com/",
    image_url: "https://cdn.prod.website-files.com/687e11ae076e4c47d227af38/68d263d4fc641068b6bbb294_homepage%20glph%20image.png",
    eligibility: "10+2 with PCM (60% aggregate) + Futurense Aptitude Test + Personal Interview.",
    location: "Bangalore, Karnataka & Jalandhar, Punjab (Residential campuses)",
    fees: "₹15 Lakhs to ₹19 Lakhs (Total 4-Year B.Tech Tuition).",
    curriculum_summary: "AI-native 4-year B.Tech in CSE specializing in AI and Data Engineering.",
    contact_info: "admissions@futurense.com | +91-80500-80500",
    degree_partner: "Lovely Professional University (LPU) & S-VYASA University",
    tags: [
      "AI-Native B.Tech",
      "LPU & S-VYASA Partner",
      "IIT/IIM PG Pathways",
      "Raghav Gupta Founded"
    ],
    year_1_curriculum: "Foundations of CS, Python Programming, Math for AI (Linear Algebra, Calculus), and AI Tools.",
    year_2_curriculum: "Machine Learning, Web Dev (React/Node), Database Management Systems, and Cloud foundations.",
    year_3_curriculum: "Generative AI, Large Language Models, MLOps, AIOps, and Security.",
    year_4_curriculum: "Industry Internships (6-month paid roles) and Capstone Project.",
    founders: [
      {
        name: "Raghav Gupta",
        background_info: "Founder & CEO of Futurense (Experienced technology entrepreneur, pioneer in talent transformation and enterprise upskilling, Emory alumnus)",
        linkedin_url: "https://www.linkedin.com/in/raghavgupta01",
      }
    ],
    instructors: [
      {
        name: "Prince Dubey",
        company_background: "co-founder, IIT Alumnus"
      },
      {
        name: "IIT Madras Faculty",
        company_background: "IIT Guest Professors"
      },
      {
        name: "Data & AI Architects",
        company_background: "Microsoft, Google, Meta & Walmart"
      }
    ],
    reviews: [
      {
        rating: 4.7,
        review_text: "Highly acclaimed for bridging the gap between standard engineering degrees and advanced, high-paying AI and Data Engineering jobs."
      }
    ],
    seats: "120 Seats/Batch",
    laptop_provided: false,
    hiring_partners_count: 540,
    is_trending: false,
    is_new: false,
    rating_breakdown: {
      curriculum: 4.5,
      placements: 4.3,
      faculty: 4.4,
      campus: 4.4
    },
    degreeType: "B.Tech in CSE",
    applicationFee: "Fee not mentioned by Futurense",
    examDates: "Admissions Open | Cycles ongoing through July 2026",
    industryMentors: "Mentors from leading tech startups and corporate scaling hubs",
    fastTrack: false,
    fastTrackDetails: "",
    batchSize: 120,
    degreeRecognition: "UGC Approved Degree via Lovely Professional University (LPU) & S-VYASA University",
    entranceExam: {
      pattern: "Futurense Aptitude Test (FAT) + Multi-stage Personal Interviews",
      level: "Institute Level",
      syllabus: "Quantitative Aptitude, Logic, General Knowledge, and Programming Mindset"
    },
    financingOptions: "Flexible EMI loan schemes via GrayQuest, Avanse, and Propelld.",
    studentClubs: [
      "Generative AI Lab",
      "Data Analytics Society",
      "Futurense Connect Club",
      "IIT Madras Guest Cohort",
      "AI Product Management Club"
    ]
  },
  Kalvium: {
    name: "Kalvium",
    foundingYear: 2021,
    brochureUrl: "/brochures/kalvium.pdf",
    website_url: "https://kalvium.com",
    apply_url: "https://kalvium.com",
    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbQ-dXpPbi-sUqAScmIfx8le5Fpa16ANgQiA&s",
    eligibility: "Grade XII (PCM preferred) + KNET (Kalvium National Entrance Test). Direct entrance pathway bypasses JEE.",
    location: "Bangalore, Karnataka (and partner residential campuses across LPU Punjab, JECRC Jaipur, RVU Bangalore, KARE Tamil Nadu)",
    fees: "₹8 Lakhs to ₹18.4 Lakhs (Total 4-Year Tuition, varies depending on chosen partner university). Hostel extra.",
    curriculum_summary: "Work-Integrated B.Tech in Computer Science and Engineering with a 21-month paid internship.",
    contact_info: "admissions@kalvium.com | +91-9900024991",
    degree_partner: "LPU, JECRC, RVU, KARE & others",
    tags: [
      "KNET Entrance Test",
      "21-Month Paid Internship",
      "Work-Integrated B.Tech",
      "BYOD Laptop Policy"
    ],
    year_1_curriculum: "Work-integrated Essentials, Web Development (HTML/CSS/JS), Git, and Software Product Engineering foundations.",
    year_2_curriculum: "Advanced Software Engineering, Frontend & Backend Mastery (React, Node, SQL/NoSQL), and early internship.",
    year_3_curriculum: "Paid industry internships (21 months starting from Year 2), Advanced CS modules (Distributed Systems).",
    year_4_curriculum: "Paid internships (contd.), Product Design, Leadership, and Open Source contributions.",
    founders: [
      {
        name: "Rajesh Kumar B",
        background_info: "Co-Founder & CEO (ex-Director of Engineering at Freshworks)",
        linkedin_url: "https://www.linkedin.com/in/rajeshkumarb",
      },
      {
        name: "Venkataraghulan V",
        background_info: "Co-Founder (EdTech veteran and higher education strategist)",
        linkedin_url: "https://www.linkedin.com/in/venkataraghulan",
      },
      {
        name: "Anil Gulecha",
        background_info: "Co-Founder & CTO (ex-Principal Engineer, technology evangelist)",
        linkedin_url: "https://www.linkedin.com/in/anilgulecha",
      }
    ],
    instructors: [
      {
        name: "Rajesh Kumar B",
        company_background: "ex-Director of Engineering at Freshworks"
      },
      {
        name: "Anil Gulecha",
        company_background: "ex-Principal Engineer at Freshworks"
      }
    ],
    reviews: [
      {
        rating: 4.7,
        review_text: "Outstanding work-integrated model where students earn substantial real-world experience and stipends before even graduating."
      }
    ],
    seats: "120 Seats/Batch",
    laptop_provided: false,
    hiring_partners_count: 400,
    is_trending: false,
    is_new: false,
    rating_breakdown: {
      curriculum: 4.5,
      placements: 4.3,
      faculty: 4.4,
      campus: 4.4
    },
    degreeType: "B.Tech in CSE",
    applicationFee: "₹1,200 (KNET Registration Fee)",
    examDates: "Admissions Open | Cycles ongoing through July 2026",
    industryMentors: "Mentors from leading tech startups and corporate scaling hubs",
    fastTrack: false,
    fastTrackDetails: "",
    batchSize: 120,
    degreeRecognition: "UGC Approved Degree via LPU, JECRC, RVU, KARE & others",
    entranceExam: {
      pattern: "Online KNET (Kalvium National Entrance Test) + Psychometric + Interview",
      level: "Institute Level",
      syllabus: "Problem-solving, communication skills, learnability, and logical aptitude"
    },
    financingOptions: "Education loans and EMI options directly through partner universities.",
    studentClubs: [
      "Competitive Programming Club",
      "Hackathons & Challenges Cohort",
      "Kalvium Konnect Group",
      "SRM/LPU Host Partner Club",
      "Technical Projects Society"
    ]
  },
  "100x School": {
    name: "100x School",
    brochureUrl: "/brochures/100x.pdf",
    website_url: "https://100xschool.in",
    apply_url: "https://100xschool.in/under-grad",
    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg2RfMDy-Q0GZd_EHvRGX5wQ-QdOTsjCj1ug&s",
    eligibility: "12th Standard / Undergrads / Professionals + portfolio review & intensive coding interview.",
    location: "Delhi NCR (Residential & Hybrid models)",
    fees: "₹22 Lakhs to ₹24 Lakhs (Total 4-Year UG Tuition & Program Fee).",
    curriculum_summary: "4-Year full-time program focused on deep engineering, DevOps, advanced System Design, and Web3.",
    contact_info: "support@100xdevs.com",
    degree_partner: "Alternative skilling program with optional partner university degrees",
    tags: [
      "Harkirat Cohorts",
      "Super30 Bootcamp",
      "DevOps & Web3 Focus",
      "Open Source Prep"
    ],
    year_1_curriculum: "Advanced Full-Stack Foundations (Javascript/Typescript, React, Next.js, SQL, CLI, discrete math, building first 5 SaaS projects).",
    year_2_curriculum: "DevOps & System Scaling (Docker, Kubernetes, AWS, Redis, queues, system design HLD/LLD, blockchain).",
    year_3_curriculum: "Advanced Specializations & Competition Sprint (Rust, Solana, fine-tuning LLMs, competitive coding prep).",
    year_4_curriculum: "Industry Immersion & 1-Year Paid Tech Internship.",
    founders: [
      {
        name: "Harkirat Singh",
        background_info: "Founder of 100xDevs & 100xSchool (IIT Roorkee Alumnus, prominent software developer, content creator and open-source advocate)",
        linkedin_url: "https://www.linkedin.com/in/kirat-li",
      }
    ],
    instructors: [
      {
        name: "Harkirat Singh",
        company_background: "Founder, ex-Microsoft, ex-Goldman Sachs"
      },
      {
        name: "Senior SDE Mentors",
        company_background: "Google, Amazon, Microsoft & Swiggy"
      }
    ],
    reviews: [
      {
        rating: 4.8,
        review_text: "Widely regarded as one of the best technical training academies in India for practical, hands-on full-stack development, DevOps, and scaling."
      }
    ],
    seats: "120 Seats/Batch",
    laptop_provided: false,
    hiring_partners_count: 300,
    is_trending: false,
    is_new: false,
    rating_breakdown: {
      curriculum: 4.5,
      placements: 4.3,
      faculty: 4.4,
      campus: 4.4
    },
    degreeType: "B.Tech in CSE",
    applicationFee: "₹999 (Application Fee)",
    examDates: "Admissions Open | Cycles ongoing through July 2026",
    industryMentors: "Mentors from leading tech startups and corporate scaling hubs",
    fastTrack: false,
    fastTrackDetails: "",
    foundingYear: 2025,
    batchSize: 120,
    degreeRecognition: "UGC Approved Degree via Alternative skilling program with optional partner university degrees",
    entranceExam: {
      pattern: "Online Aptitude & Logical Reasoning Round + Dreams & Aspirations Interview",
      level: "Institute Level",
      syllabus: "Logical reasoning, basic programming aptitude, and career aspirations"
    },
    financingOptions: "Flexible EMI loan schemes via GrayQuest, Avanse, and Propelld. Installment payment plans available.",
    studentClubs: [
      "100xDevs Open Source Guild",
      "Competitive Programming Circle",
      "Web3 & Blockchain Cohort",
      "Startup Incubator Club",
      "Orators & Communicators Club"
    ]
  },
  "Vedam School of Technology": {
    name: "Vedam School of Technology",
    foundingYear: 2025,
    brochureUrl: "https://www.vedam.org",
    website_url: "https://www.vedam.org",
    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLaxOhcp_kNr_bG92LBCeUmlsWhC0luTSE-g&s",
    eligibility: "Class 12th with PCM (min. 50% overall & in each PCM subject) + VSAT (Vedam Scholastic Aptitude Test) + Online Personal Interview. Strong coding/Olympiad profiles may fast-track to interview.",
    location: "Ajeenkya DY Patil University (ADYPU) campus, Lohegaon, Pune, Maharashtra & Sushant University, Gurugram",
    fees: "₹26 Lakhs to ₹28 Lakhs (Total 4-Year B.Tech Tuition).",
    curriculum_summary: "4-year B.Tech in CS & AI with a mandate to write over 100,000 lines of code.",
    contact_info: "admissions@vedam.edu.in",
    degree_partner: "Sushant University & Ajeenkya DY Patil University",
    tags: [
      "100K Lines of Code",
      "24x7 Campus Labs",
      "VSAT Scholarship",
      "ADYPU Pune Campus"
    ],
    year_1_curriculum: "Rigorous Coding (Python, C++), computational math, logic, and early projects.",
    year_2_curriculum: "Advanced DSA, full-stack systems, computer networks, and cloud databases.",
    year_3_curriculum: "6-Month Paid Industry Internship and machine learning engineering.",
    year_4_curriculum: "AI-First Capstone, specialized electives (GenAI/MLOps), and career placement sprint.",
    founders: [
      {
        name: "Ashish Munjal",
        background_info: "Co-Founder (Experienced EdTech entrepreneur, series-C education co-founder)",
        linkedin_url: "https://www.linkedin.com/in/ashishmunjal",
      },
      {
        name: "Piyush Nangru",
        background_info: "Co-Founder (Experienced EdTech entrepreneur, series-C education co-founder)",
        linkedin_url: "https://www.linkedin.com/in/piyushnangru/",
      }
    ],
    instructors: [
      {
        name: "Nishant Chahar",
        company_background: "co-founder AlgoPrep, ex-Microsoft"
      },
      {
        name: "Subhesh Kumar",
        company_background: "co-founder AlgoPrep, ex-Google"
      }
    ],
    reviews: [
      {
        rating: 4.7,
        review_text: "Valued for its 100% placement assistance, 24x7 labs, and a strict emphasis on practical execution over theory."
      }
    ],
    seats: "200 Seats/Batch",
    laptop_provided: "Lenovo ThinkPad",
    hiring_partners_count: 1000,
    scholarship_info: "Up to 100% merit scholarship based on VSAT/JEE scores. Specialized awards for Haryana domicile students.",
    apply_url: "https://www.vedam.org/?utm_source=Google&utm_medium=Paid&utm_campaign=SOTKeyword&https://vedam.org/?utm_source=Google&utm_medium=Paid&utm_campaign=SOTKeyword&gad_source=1&gad_campaignid=23834897710&gbraid=0AAAAA_CuBmEcYnFirNchwN0xiikTZUsBT&gclid=Cj0KCQjwornRBhCrARIsAON5exEVmXiwRsNTN2Gl2EpwQDn7RJ7alXiV-J9wsdvrvfQp8Fo91y3QvWMaAva2EALw_wcB",
    is_trending: false,
    is_new: true,
    rating_breakdown: {
      curriculum: 4.7,
      placements: 4.5,
      faculty: 4.6,
      campus: 4.8
    },
    degreeType: "B.Tech in CS & AI",
    applicationFee: "₹1,000 (VSAT — Vedam Scholastic Aptitude Test)",
    examDates: "Next VSAT: June 23, 2026",
    industryMentors: "SDE Leaders from Meta, Apple, Google, Netflix, and Amazon",
    fastTrack: true,
    fastTrackDetails: "VSAT bypass for JEE Math >= 85 percentile or Olympiad state-ranks",
    batchSize: 200,
    degreeRecognition: "UGC Approved B.Tech via ADYPU Pune & Sushant University",
    entranceExam: {
      pattern: "Online VSAT (Vedam Scholastic Aptitude Test) + Personal Interview (JEE/Coding bypass available)",
      level: "National Level",
      syllabus: "Mathematics, Logical Reasoning, and Learnability"
    },
    studentClubs: [
      "AlgoPrep Coding Circle",
      "Software Development Cohort",
      "Vedam Open Source Club",
      "Tech Discussions Group",
      "Sports & Recreation Club"
    ],
    financingOptions: "Education loans via GrayQuest and Propelld"
  },
  "Physics Wallah Institute of Innovation (PW IOI)": {
    name: "Physics Wallah Institute of Innovation (PW IOI)",
    foundingYear: 2023,
    brochureUrl: "/brochures/pwioi.pdf",
    website_url: "https://pwioi.com/",
    apply_url: "https://www.pwioi.com/technology/btech-computer-science-program?courseId=67fec08608f981d74c2e6197&_gl=1*v7qmp*_gcl_aw*R0NMLjE3ODE0MTAwMDIuQ2owS0NRandfN1BSQmhEY0FSSXNBTWpWN2prZkJUcGd1aG5YVEJhSlRCMWxZd0RfNXhYY3Y0SXA0Ny1JMzJfOGozUWhwZy0xRm1leFhJWWFBamVnRUFMd193Y0I.*_gcl_au*MTM3NzI0NzA4Ni4xNzgxNDEwMDAy&download=true",
    image_url: "https://rangde.in/blog-admin/uploads/Physics_Wallah_IOI_10ce51ab89.png",
    eligibility: "Class 10th & 12th with 50%+ marks + qualifying in PW Common Entrance Exam (CEE) or JEE / CUET scores.",
    location: "Noida, Delhi NCR (and partners/campuses in Bangalore, Pune)",
    fees: "₹14 Lakhs to ₹18 Lakhs (Total 4-Year B.Tech Tuition).",
    curriculum_summary: "School of Technology (SOT) 4-Year B.Tech in Computer Science & AI integrating daily coding sprints.",
    contact_info: "admissions@pwioi.com | +91-95133-95133",
    degree_partner: "Medhavi Skills University (MSU)",
    tags: [
      "Medhavi Skills MSU Partner",
      "PW CEE Entrance",
      "School of Technology",
      "Earn While You Learn"
    ],
    year_1_curriculum: "Programming Fundamentals (C++, Python), Mathematics for Computer Science, and Daily Coding Sprints.",
    year_2_curriculum: "Full-Stack Web Development, Data Structures & Algorithms, and Database Management.",
    year_3_curriculum: "Artificial Intelligence, Machine Learning, Cloud Computing, and Product Building.",
    year_4_curriculum: "Mandatory Industry Internship and Capstone Project.",
    founders: [
      {
        name: "Alakh Pandey",
        background_info: "Founder & CEO of Physics Wallah (One of India's most prominent EdTech entrepreneurs and educators)",
        linkedin_url: "https://www.linkedin.com/in/alakh-pandey-4baaa8227/",
      },
      {
        name: "Prateek Maheshwari",
        background_info: "Co-Founder of Physics Wallah (IIT BHU alumnus, former technology consultant and operations leader)",
        linkedin_url: "https://www.linkedin.com/in/prateek-maheshwari-615962a7/",
      }
    ],
    instructors: [
      {
        name: "Alakh Pandey",
        company_background: "Founder & CEO Physics Wallah"
      },
      {
        name: "PW Skills Senior SDEs",
        company_background: "ex-Google, ex-Microsoft & ex-Amazon"
      }
    ],
    reviews: [
      {
        rating: 4.6,
        review_text: "Students praise the intensive, job-ready daily schedules, the affordable price points, and the direct career alignments powered by the MSU degree."
      }
    ],
    seats: "200 Seats/Batch",
    laptop_provided: false,
    hiring_partners_count: 500,
    is_trending: false,
    is_new: false,
    rating_breakdown: {
      curriculum: 4.5,
      placements: 4.3,
      faculty: 4.4,
      campus: 4.4
    },
    degreeType: "B.Tech in CSE",
    applicationFee: "₹2,500 (PW CEE Registration Fee)",
    examDates: "Admissions Open | Cycles ongoing through July 2026",
    industryMentors: "Mentors from leading tech startups and corporate scaling hubs",
    fastTrack: false,
    fastTrackDetails: "",
    batchSize: 200,
    degreeRecognition: "UGC Approved Degree via Medhavi Skills University (MSU)",
    entranceExam: {
      pattern: "Online PW CEE (Common Entrance Exam) + Interview (JEE/CUET/NEET accepted for bypass)",
      level: "National Level",
      syllabus: "Aptitude, logical reasoning, class 12 math and science basics"
    },
    financingOptions: "Education loans via GrayQuest, Avanse, and Propelld",
    studentClubs: [
      "PW Skills Developers Club",
      "Competitive Programming Chapter",
      "Media & Content Creators Guild",
      "Cultural & Arts Club",
      "Sports & Fitness Society"
    ]
  },
  "CodeQuotient School of Technology (CQST)": {
    name: "CodeQuotient School of Technology (CQST)",
    foundingYear: 2022,
    website_url: "https://cqst.in/",
    apply_url: "https://cqst.in/",
    image_url: "https://cqst.in/images/meta-preview.png",
    eligibility: "10+2 with minimum 60% aggregate + CQST Assessment Test + Personal Interview.",
    location: "Panipat, Haryana (NH-44 Simla Molana Road)",
    fees: "₹8 Lakhs to ₹9 Lakhs (Total 4-Year B.Tech Tuition).",
    curriculum_summary: "UGC-recognized degree program with integrated UGP-SE (Software Engineering) credential and up to 1.5 years of paid co-op internships.",
    contact_info: "admissions@cqst.in | +91-93500-93500",
    degree_partner: "Kurukshetra University",
    tags: [
      "1.5 Years Paid Internships",
      "Kurukshetra Uni Partner",
      "Company-Sponsored Fees",
      "Medical-Style Software Lab"
    ],
    year_1_curriculum: "Software Lab Foundations (C/C++, Git, basic DSA, algorithmic thinking, and core scripting languages).",
    year_2_curriculum: "Advanced Development (Full-stack web applications, databases, server systems, and first 6-month industry co-op).",
    year_3_curriculum: "Enterprise Engineering (System design, microservices, cloud operations with AWS, and second 6-month co-op internship).",
    year_4_curriculum: "Hyper-Specialization & Capstone (AI/ML engineering tracks, complex architecture design, final placements, and professional transition).",
    founders: [
      {
        name: "Arun Goyat",
        background_info: "Founder & CEO of CodeQuotient (Pioneer in structured tech mentorship, enterprise placement strategist)",
        linkedin_url: "https://www.linkedin.com/in/arun-goyat/",
      }
    ],
    instructors: [
      {
        name: "Arun Goyat",
        company_background: "Founder, Tech Mentor Lead"
      },
      {
        name: "SDE Mentors & Coaches",
        company_background: "Samsung, Amazon & Microsoft"
      }
    ],
    reviews: [
      {
        rating: 4.5,
        review_text: "Highly values the long-term co-op model (1.5 years total) and the medical-style coding labs where work mimics developer jobs."
      }
    ],
    seats: "120 Seats/Batch",
    laptop_provided: false,
    hiring_partners_count: 150,
    is_trending: false,
    is_new: false,
    rating_breakdown: {
      curriculum: 4.5,
      placements: 4.3,
      faculty: 4.4,
      campus: 4.4
    },
    degreeType: "B.Tech in CSE",
    applicationFee: "₹1,000 (CodeQuotient Screening Test Fee)",
    examDates: "Admissions Open | Cycles ongoing through July 2026",
    industryMentors: "Mentors from leading tech startups and corporate scaling hubs",
    fastTrack: false,
    fastTrackDetails: "",
    batchSize: 120,
    degreeRecognition: "UGC Approved Degree via Kurukshetra University",
    entranceExam: {
      pattern: "Online Aptitude & Logical Evaluation (60 mins MCQ)",
      level: "Institute Level",
      syllabus: "Quantitative Aptitude, General Reasoning, and Computing Logic"
    },
    financingOptions: "Flexible EMI loan schemes via GrayQuest, Avanse, and Propelld",
      studentClubs: [
      "CodeQuotient Software Engineers Club",
      "Algorithms & DSA Guild",
      "Technical Projects Cohort",
      "Industry Placement Group",
      "Sports & Cultural Association"
    ],
  },
  "Quad AI School of Technology": {
    name: "Quad AI School of Technology",
    foundingYear: 2024,
    brochureUrl: "/brochures/quadai.pdf",
    website_url: "https://www.quadcse.com",
    apply_url: "https://www.quadcse.com",
    image_url: "https://image-static.collegedunia.com/public/college_data/images/logos/1775298159logo1234rt.png",
    eligibility: "Class 12 PCM (50%+) + Quad Aptitude Test (QAT) + Online Personal Interview.",
    location: "Patna, Bihar (Main Innovation Campus) & Bengaluru, Karnataka",
    fees: "₹12 Lakhs to ₹20 Lakhs (Total 4-Year B.Tech Tuition).",
    curriculum_summary: "AI-First 4-Year B.Tech in CSE with Hyper-Specialization in Applied AI & Machine Learning, co-curated with Medhavi Skills University.",
    contact_info: "admissions@quadcse.com | +91-99059-90600",
    degree_partner: "Medhavi Skills University (MSU)",
    tags: [
      "IIT & IIM Alumni Built",
      "QAT Entrance Test",
      "Medhavi Skills MSU",
      "AI-Integrated Pedagogy"
    ],
    year_1_curriculum: "Foundations of Coding (Python, Web), Math for AI, and introduction to computer systems.",
    year_2_curriculum: "Machine Learning models, Deep Learning algorithms, database systems, and advanced DSA.",
    year_3_curriculum: "Generative AI, Large Language Models, MLOps, AIOps, and professional internships.",
    year_4_curriculum: "AI Product Capstone, advanced research or startup launching, and placement cycles.",
    founders: [
      {
        name: "Sourav Kumar",
        background_info: "Co-Founder (FMS Delhi Alumnus, startup enthusiast, ex-Corporate Manager)",
        linkedin_url: "https://www.linkedin.com/in/sourav-kumar-9a7087a8/",
      }
    ],
    instructors: [
      {
        name: "Sourav Kumar",
        company_background: "co-founder, FMS Delhi"
      },
      {
        name: "SDE Mentors & Tech Leads",
        company_background: "Amazon, Google & Microsoft"
      }
    ],
    reviews: [
      {
        rating: 4.4,
        review_text: "Highly praised in the eastern region for making world-class AI and deep-tech computer science training highly accessible and affordable."
      }
    ],
    seats: "120 Seats/Batch",
    laptop_provided: false,
    hiring_partners_count: 100,
    is_trending: false,
    is_new: false,
    rating_breakdown: {
      curriculum: 4.5,
      placements: 4.3,
      faculty: 4.4,
      campus: 4.4
    },
    degreeType: "B.Tech in CSE",
    applicationFee: "₹5,000 (QAT — Quad AI Application Fee)",
    examDates: "Admissions Open | Cycles ongoing through July 2026",
    industryMentors: "Mentors from leading tech startups and corporate scaling hubs",
    fastTrack: false,
    fastTrackDetails: "",
    batchSize: 120,
    degreeRecognition: "UGC Approved Degree via Medhavi Skills University (MSU)",
    entranceExam: {
      pattern: "Online QAT (Quad Aptitude Test) + Personal Interview",
      level: "Institute Level",
      syllabus: "Quantitative Aptitude, Logical Reasoning, and Mathematics"
    },
    financingOptions: "Education loans via HDFC Credila, Axis Bank, SBI, and Propelld",
    studentClubs: [
      "Quad AI Tech Developers Club",
      "AI Innovation Circle",
      "IIT Alumni Networking Group",
      "Entrepreneurship & Business Club",
      "Sports & Wellness Club"
    ]
  },
  CodingGita: {
    name: "CodingGita",
    brochureUrl: "/brochures/Codinggita-Demo-Agreement-2026.pdf",
    foundingYear: 2023,
    website_url: "https://codinggita.com",
    apply_url: "https://codinggita.com",
    image_url: "https://avatars.githubusercontent.com/u/145510625?s=280&v=4",
    eligibility: "Class 12th pass (PCM preferred) + Direct logical evaluation & Personal Interview.",
    location: "Gandhinagar, Gujarat (Partner Campus: Swaminarayan University & Swarrnim University)",
    fees: "₹14 Lakhs to ₹15 Lakhs (Total 4-Year B.Tech Tuition).",
    curriculum_summary: "4-Year full-time B.Tech in CSE with a 100% placement-based refund guarantee if placement is below ₹6 LPA.",
    contact_info: "contact@codinggita.com",
    degree_partner: "Swaminarayan University & Swarrnim University",
    tags: [
      "100% Refund Guarantee",
      "1000+ Coding Problems",
      "Swaminarayan Partner",
      "Practical Portfolio Focus"
    ],
    year_1_curriculum: "Programming & Foundations (HTML/CSS, JavaScript, logic building, basic Python).",
    year_2_curriculum: "Full-Stack Development (React, Node, SQL/NoSQL databases), and core DSA.",
    year_3_curriculum: "Advanced ML/DL, Generative AI, DevOps (Docker/CI-CD), and paid tech internships.",
    year_4_curriculum: "Mandatory Paid Internship (up to 18 months starting in Year 3), mock placements, and job conversion sprint.",
    founders: [
      {
        name: "Patel Neel Maheshkumar",
        background_info: "Co-Founder & Chief Instructor (Veteran software engineer and tech curriculum architect)",
        linkedin_url: "https://www.linkedin.com/in/patel-neel-mahesh",
      }
    ],
    instructors: [
      {
        name: "Patel Neel Maheshkumar",
        company_background: "co-founder & chief instructor"
      },
      {
        name: "Hitesh Choudhary",
        company_background: "Guest Mentor, tech educator"
      }
    ],
    reviews: [
      {
        rating: 4.5,
        review_text: "Highly acclaimed for its outcome-based refund model, forcing academic delivery to align perfectly with industry hiring standards."
      }
    ],
    seats: "120 Seats/Batch",
    laptop_provided: false,
    hiring_partners_count: 50,
    is_trending: false,
    is_new: false,
    rating_breakdown: {
      curriculum: 4.5,
      placements: 4.3,
      faculty: 4.4,
      campus: 4.4
    },
    degreeType: "B.Tech in CSE",
    applicationFee: "Free (CodingGita Entrance Test)",
    examDates: "Admissions Open | Cycles ongoing through July 2026",
    industryMentors: "Mentors from leading tech startups and corporate scaling hubs",
    fastTrack: false,
    fastTrackDetails: "",
    batchSize: 120,
    degreeRecognition: "UGC Approved Degree via Swaminarayan University & Swarrnim University",
    entranceExam: {
      pattern: "Introduction Video (2-5 mins) + Online Entrance Test + 1:1 Interview",
      level: "Institute Level",
      syllabus: "Basic Python programming, logic, communication, and mindset"
    },
    financingOptions: "Pay-after-placement features, module-wise opt-out flexibility, and education loan assistance.",
    studentClubs: [
      "CodingGita Developers Association",
      "Full-Stack Web Developers Club",
      "Open Source Contributor Guild",
      "Tech Startup Hub",
      "Sports & Cultural Society"
    ]
  },
  "Veloces Campus": {
    name: "Veloces Campus",
    foundingYear: 2015,
    brochureUrl: "/brochures/veloces.pdf",
    website_url: "https://velocescampus.com",
    apply_url: "https://velocescampus.com",
    image_url: "https://velocescampus.com/wp-content/uploads/2025/02/veloces_logo@0.1x@0.75x-1.png",
    eligibility: "10+2 with PCM/PCB + VSAT (Veloces Scholarship and Aptitude Test) + Interview & Counseling.",
    location: "Ajeenkya DY Patil University (ADYPU) Campus, Lohegaon, Pune, Maharashtra",
    fees: "₹10.5 Lakhs to ₹14 Lakhs (Total 4-Year B.Tech Tuition at ADYPU campus, Pune). Hostel: ₹90K–₹1.8L/year extra. VSAT scholarship eligible.",
    curriculum_summary: "Industry-aligned B.Tech/B.Sc cohorts powered by ADYPU and Microsoft Cloud Labs, focusing on Virtual/Augmented Reality (XR), Cyber Forensics, and AI/ML.",
    contact_info: "admissions@velocescampus.com",
    degree_partner: "Ajeenkya DY Patil University (ADYPU), Pune — B.Tech in XR & Cyber Forensics with Microsoft",
    tags: [
      "Microsoft Cloud Labs",
      "VSAT Entrance Test",
      "XR & Cyber Forensics",
      "Pune ADYPU Campus"
    ],
    year_1_curriculum: "Core Foundations & Scripting (Programming logic, cloud virtualization, basic algebra, professional communication).",
    year_2_curriculum: "Cloud & Cyber Security (Microsoft Cloud architecture, network forensics, data visualization, intermediate DSA).",
    year_3_curriculum: "Advanced XR & AI (Unity game engine, virtual reality design, augmented reality interaction, applied neural networks).",
    year_4_curriculum: "Industry Projects & Certifications (Embedded global certifications prep - Cisco, Unity, Red Hat; live capstone execution and corporate drives).",
    founders: [
      {
        name: "Shankaran Chettur",
        background_info: "Founder, MD & CEO (Experienced professional in international certification services and IT consulting)",
        linkedin_url: "https://www.linkedin.com/in/shankaran-chettur-34342514/",
      }
    ],
    instructors: [
      {
        name: "Shankaran Chettur",
        company_background: "Founder & CEO, Certifications Expert"
      },
      {
        name: "SDE Guest Lecturers",
        company_background: "ex-Microsoft, ex-Google & ex-Amazon"
      }
    ],
    reviews: [
      {
        rating: 4.6,
        review_text: "Highly rated for embedding elite global IT credentials (Cisco, Unity, Red Hat, Rocheston) directly into their university-degree program."
      }
    ],
    seats: "120 Seats/Batch",
    laptop_provided: false,
    hiring_partners_count: 100,
    is_trending: false,
    is_new: false,
    rating_breakdown: {
      curriculum: 4.5,
      placements: 4.3,
      faculty: 4.4,
      campus: 4.4
    },
    degreeType: "B.Tech in CSE",
    applicationFee: "₹1,200 (VSAT — Veloces Aptitude Test Fee)",
    examDates: "Admissions Open | Cycles ongoing through July 2026",
    industryMentors: "Mentors from leading tech startups and corporate scaling hubs",
    fastTrack: false,
    fastTrackDetails: "",
    batchSize: 120,
    degreeRecognition: "UGC Approved Degree via Ajeenkya DY Patil University (ADYPU)",
    entranceExam: {
      pattern: "Online Aptitude & Logical Evaluation (60 mins MCQ)",
      level: "Institute Level",
      syllabus: "Quantitative Aptitude, General Reasoning, and Computing Logic"
    },
    financingOptions: "Flexible EMI loan schemes via GrayQuest, Avanse, and Propelld",
      studentClubs: [
      "Veloces Microsoft Cloud Chapter",
      "Azure Cloud Security Guild",
      "XR & Virtual Reality Lab",
      "Technical Consultations Group",
      "Sports & Wellness Club"
    ],
  },
  CodeAnantam: {
    name: "CodeAnantam",
    foundingYear: 2026,
    brochureUrl: "/brochures/CodeAnantam_Student_Agreement-B7rZO6r3.pdf",
    website_url: "https://codeanantam.com",
    apply_url: "https://codeanantam.com",
    image_url: "https://codeanantam.com/favicon.png",
    eligibility: "Class 12th pass (PCM preferred) + Selection Test (Python/Math learning path) + 1:1 Mindset Interview.",
    location: "Newai, Jaipur, Rajasthan (Partner Campus: Dr. K.N. Modi University)",
    fees: "₹11 Lakhs to ₹13 Lakhs (Total 4-Year B.Tech Tuition).",
    curriculum_summary: "4-Year full-time B.Tech in CSE (AI) with a written placement agreement on stamp paper promising at least ₹6 LPA, paid internships, and industry-focused curriculum.",
    contact_info: "contact@codeanantam.com",
    degree_partner: "Dr. K.N. Modi University, Newai",
    tags: [
      "No Placement No Fees",
      "Rajasthan Campus",
      "6 LPA Written Guarantee",
      "Paid Internships"
    ],
    year_1_curriculum: "Programming Foundations (Python, Unix/Linux commands, HTML/CSS, Git/GitHub, and basic problem solving).",
    year_2_curriculum: "Full-Stack Engineering (React.js, Node.js, databases - MongoDB/SQL), Intermediate DSA, and launch of paid internships.",
    year_3_curriculum: "Advanced Machine Learning & DL, cloud deployments, Generative AI engineering, and full-time project building.",
    year_4_curriculum: "System Design, Capstone projects, intensive placement prep, interview drills, and transition to full-time engineering roles.",
    founders: [
      {
        name: "Rishirajsinh Pushpendrasinh Rathod",
        background_info: "Founder & Director (EdTech entrepreneur and co-founder of outcomes-driven engineering schools)",
        linkedin_url: "none",
      }
    ],
    instructors: [
      {
        name: "Rishirajsinh Rathod",
        company_background: "Founder, CodeAnantam"
      },
      {
        name: "Ritik Meghwani",
        company_background: "Admissions Advisor & Tech Educator"
      }
    ],
    reviews: [
      {
        rating: 4.6,
        review_text: "Highly recognized for its stamp-paper placement agreement guaranteeing 6 LPA, ensuring zero financial risk for qualifying students."
      }
    ],
    seats: "60 Seats/Batch",
    laptop_provided: false,
    hiring_partners_count: 200,
    is_trending: true,
    is_new: true,
    rating_breakdown: {
      curriculum: 4.6,
      placements: 4.5,
      faculty: 4.4,
      campus: 4.2
    },
    degreeType: "B.Tech in CSE (AI)",
    applicationFee: "₹1,000 (Refundable Admission Registration)",
    examDates: "Admissions Open | Selection cycles ongoing through July 2026",
    industryMentors: "Mentors from leading tech startups, unicorns, and global engineering hubs",
    fastTrack: false,
    fastTrackDetails: "",
    batchSize: 60,
    degreeRecognition: "UGC Approved B.Tech via Dr. K.N. Modi University, Rajasthan",
    entranceExam: {
      pattern: "Learning Path Assignment (Python/Math) + Online Evaluation + 1:1 Mindset Interview",
      level: "Institute Level",
      syllabus: "Problem solving logic, Python programming, basic mathematics, and learning mindset"
    },
    financingOptions: "Education loans via partner financial institutions",
    studentClubs: [
      "CodeAnantam AI Developers Club",
      "Full-Stack Web Engineering Guild",
      "Open Source & Git Contributors",
      "Startup & E-Cell Incubator",
      "Sports & Fitness Club"
    ]
  }
};
