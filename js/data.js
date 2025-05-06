// Define the sections with their icons and components
const sectionsData = [
  { id: "general", name: "General Information", icon: "fa-user", component: "general-info-template", completion: 100 },
  { id: "skills", name: "Skills", icon: "fa-code", component: "skills-template", completion: 85 },
  {
    id: "work",
    name: "Work Experiences",
    icon: "fa-briefcase",
    component: "work-experiences-template",
    completion: 90,
  },
  {
    id: "education",
    name: "Academic Information",
    icon: "fa-graduation-cap",
    component: "education-template",
    completion: 100,
  },
  {
    id: "certifications",
    name: "Certifications",
    icon: "fa-award",
    component: "certifications-template",
    completion: 75,
  },
  { id: "specializations", 
    name: "Specializations", 
    icon: "fa-star", 
    component: "specializations-template", 
    completion: 90 },
  { id: "social", 
    name: "Social Links", 
    icon: "fa-share-nodes", 
    component: "social-links-template", 
    completion: 80 },
  { id: "research", 
    name: "Research Projects", 
    icon: "fa-book-open", 
    component: "research-projects-template", 
    completion: 70 },
  { id: "group", 
    name: "Group Projects", 
    icon: "fa-users", 
    component: "group-projects-template", 
    completion: 65 },
  { id: "extracurricular", 
    name: "Extracurricular Activities", 
    icon: "fa-chart-line", 
    component: "extracurricular-activities-template", 
    completion: 60 },
  {
    id: "personal",
    name: "Personal Statements",
    icon: "fa-file-lines",
    component: "personal-statements-template",
    completion: 100,
  },
  { id: "career-goals", // changed from "career"
    name: "Career Goals", 
    icon: "fa-rocket",   
    component: "career-goals-template", 
    completion: 80 },
  { id: "motivation",
    name: "Motivation Statements",
    icon: "fa-lightbulb",
    component: "motivation-statements-template",
    completion: 90 },
  { id: "scholarships",
    name: "Scholarships",
    icon: "fa-bookmark",
    component: "scholarships-template",
    completion: 70 },
  { id: "scholarship-preferences",
    name: "Scholarship Preferences",
    icon: "fa-heart",
    component: "scholarship-preferences-template",
    completion: 60 },
  { id: "financial", 
    name: "Financial Aid Status", 
    icon: "fa-dollar-sign", 
    component: "financial-aid-template", 
    completion: 50 },
  { id: "portfolios", 
    name: "Portfolios", 
    icon: "fa-folder-open", 
    component: "portfolios-template", 
    completion: 80 },
  { id: "video", 
    name: "Video Resumes", 
    icon: "fa-video", 
    component: "video-resumes-template", 
    completion: 40 },
  { id: "recommendations", 
    name: "Recommendation Letters", 
    icon: "fa-envelope", 
    component: "recommendation-letters-template", 
    completion: 50 },
  { id: "impact", 
    name: "Social Impacts", 
    icon: "fa-hand-holding-heart", 
    component: "social-impacts-template", 
    completion: 70 },
  { id: "availability", 
    name: "Availability Preferences", 
    icon: "fa-clock", 
    component: "availability-preferences-template", 
    completion: 60 },
  { id: "analytics",
    name: "Profile Analytics",
    icon: "fa-chart-bar", 
    component: "profile-analytics-template", 
    completion: 100 },
  { id: "languages",
    name: "Languages",
    icon: "fa-language", 
    component: "languages-template", 
    completion: 90 },
]

// User data for general information
const userData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  location: "New York, NY",
  website: "www.johndoe.com",
  bio: "Experienced web developer with a passion for creating responsive and user-friendly applications. Skilled in JavaScript, React, and Node.js with a strong background in front-end development.",
}

// Skills data
const skillsData = {
  categories: [
    {
      id: "1",
      name: "Programming Languages",
      skills: [
        { id: "1-1", name: "JavaScript", level: 90 },
        { id: "1-2", name: "TypeScript", level: 85 },
        { id: "1-3", name: "Python", level: 75 },
        { id: "1-4", name: "Java", level: 65 },
      ],
    },
    {
      id: "2",
      name: "Frameworks & Libraries",
      skills: [
        { id: "2-1", name: "React", level: 95 },
        { id: "2-2", name: "Next.js", level: 90 },
        { id: "2-3", name: "Node.js", level: 85 },
        { id: "2-4", name: "Express", level: 80 },
      ],
    },
    {
      id: "3",
      name: "Tools & Technologies",
      skills: [
        { id: "3-1", name: "Git", level: 90 },
        { id: "3-2", name: "Docker", level: 75 },
        { id: "3-3", name: "AWS", level: 70 },
        { id: "3-4", name: "CI/CD", level: 65 },
      ],
    },
  ],
  otherSkills: [
    "Communication",
    "Team Leadership",
    "Problem Solving",
    "Agile Methodology",
    "UI/UX Design",
    "Technical Writing",
  ],
}

// Work experience data
const workExperienceData = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "Tech Innovations Inc.",
    location: "San Francisco, CA",
    startDate: "2020-06",
    endDate: "Present",
    current: true,
    description:
      "Leading the frontend development team in building responsive and accessible web applications using React and Next.js.",
    achievements: [
      "Redesigned the company's main product interface, improving user engagement by 35%",
      "Implemented a component library that reduced development time by 40%",
      "Mentored junior developers and conducted code reviews to ensure code quality",
    ],
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux"],
  },
  {
    id: "2",
    title: "Full Stack Developer",
    company: "Digital Solutions LLC",
    location: "Boston, MA",
    startDate: "2018-03",
    endDate: "2020-05",
    current: false,
    description:
      "Developed and maintained web applications for clients in various industries, focusing on both frontend and backend development.",
    achievements: [
      "Built a custom CRM system that increased sales team efficiency by 25%",
      "Optimized database queries, reducing load times by 60%",
      "Integrated third-party APIs to enhance application functionality",
    ],
    skills: ["JavaScript", "Node.js", "Express", "MongoDB", "React"],
  },
]

// Education data
const educationData = [
  {
    id: "1",
    degree: "Master of Science in Computer Science",
    institution: "Stanford University",
    location: "Stanford, CA",
    startDate: "2018",
    endDate: "2020",
    gpa: "3.9",
    courses: ["Advanced Algorithms", "Machine Learning", "Distributed Systems", "Computer Vision"],
  },
  {
    id: "2",
    degree: "Bachelor of Science in Computer Engineering",
    institution: "Massachusetts Institute of Technology",
    location: "Cambridge, MA",
    startDate: "2014",
    endDate: "2018",
    gpa: "3.8",
    courses: ["Data Structures", "Computer Architecture", "Operating Systems", "Database Systems"],
  },
]

// Certification data
const certificationData = [
  {
    id: "1",
    name: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2022-05-15",
    expiryDate: "2025-05-15",
    credentialId: "AWS-123456",
    credentialURL: "https://aws.amazon.com/verification",
    skills: ["AWS", "Cloud Architecture", "Infrastructure as Code"],
  },
  {
    id: "2",
    name: "Professional Scrum Master I",
    issuer: "Scrum.org",
    date: "2021-10-20",
    expiryDate: null,
    credentialId: "PSM-987654",
    credentialURL: "https://www.scrum.org/certificates",
    skills: ["Agile", "Scrum", "Project Management"],
  },
]

// Scholarships data
const scholarshipsData = [
  {
    id: "1",
    name: "Merit Scholarship",
    institution: "MIT",
    duration: "2020 - 2024",
    description: "Awarded to students with exceptional academic achievements and leadership potential.",
    requirements: [
      "Maintain a GPA of 3.5 or higher",
      "Full-time enrollment",
      "Annual progress report",
    ],
    amount: 15000,
  },
  {
    id: "2",
    name: "Women in STEM Scholarship",
    institution: "Google",
    duration: "2022 - 2023",
    description: "Supports women pursuing degrees in science, technology, engineering, and mathematics fields.",
    requirements: [
      "Participation in mentorship program",
      "Attendance at annual conference",
      "Community outreach activities",
    ],
    amount: 10000,
  },
]

// Add portfoliosData for dynamic rendering if you want to manage portfolios programmatically
const portfoliosData = [
  {
    id: "1",
    title: "Personal Website",
    description: "A responsive portfolio website built with Next.js and Tailwind CSS. Features a clean design, dark mode support, and interactive elements.",
    tags: ["Next.js", "Tailwind CSS", "TypeScript", "Framer Motion"],
    liveDemo: "#",
    sourceCode: "#",
    image: "", // Optional: URL to image/thumbnail
  },
  {
    id: "2",
    title: "AI Image Generator",
    description: "A web application that uses machine learning to generate images from text descriptions. Built with React and integrated with OpenAI's DALL-E API.",
    tags: ["React", "Node.js", "OpenAI API", "CSS Modules"],
    liveDemo: "#",
    sourceCode: "#",
    image: "",
  },
  {
    id: "3",
    title: "Smart Task Manager",
    description: "A productivity application that uses AI to prioritize and categorize tasks. Features include natural language processing for task entry and smart reminders.",
    tags: ["Vue.js", "Express", "MongoDB", "NLP"],
    liveDemo: "#",
    sourceCode: "#",
    image: "",
  },
  // Add more portfolio projects as needed
]

// Financial aid data
const financialAidData = {
  aidSummary: {
    totalAid: "$45,000",
    tuitionFees: "$55,000",
    coverage: "82%",
    status: "Approved",
    lastUpdated: "August 15, 2023",
  },
  requiredDocuments: [
    { name: "FAFSA", status: "Submitted", date: "January 15, 2023" },
    { name: "CSS Profile", status: "Submitted", date: "January 20, 2023" },
    { name: "Tax Returns", status: "Submitted", date: "February 5, 2023" },
    { name: "Verification Worksheet", status: "Submitted", date: "February 10, 2023" },
  ],
  aidBreakdown: [
    { name: "Federal Grants", amount: "$5,500", status: "Disbursed" },
    { name: "University Scholarship", amount: "$15,000", status: "Disbursed" },
    { name: "Merit Scholarship", amount: "$10,000", status: "Disbursed" },
    { name: "Federal Loans", amount: "$12,500", status: "Accepted" },
    { name: "Work Study", amount: "$2,000", status: "Pending" },
  ],
}

// Motivation Statements data
const motivationStatementsData = [
  {
    title: 'Why Computer Science?',
    content: `I chose to pursue computer science because of its unique blend of creativity, problem-solving, and real-world impact. I've always been fascinated by how technology can transform ideas into solutions that improve people's lives. Computer science offers the tools to turn abstract concepts into tangible applications, whether it's developing algorithms to optimize healthcare delivery or creating user interfaces that make technology more accessible. The field's constant evolution also appeals to me—there's always something new to learn, a challenge to overcome, or an innovation to explore. This dynamic nature ensures that I'll never stop growing as a professional and as a thinker.`
  },
  {
    title: 'Why Artificial Intelligence?',
    content: `My interest in artificial intelligence stems from its potential to solve complex problems that were previously considered impossible. AI represents the frontier of computer science, where algorithms can learn, adapt, and make decisions in ways that mimic human intelligence. I'm particularly drawn to the interdisciplinary nature of AI, which combines elements of computer science, mathematics, psychology, and philosophy. This convergence of disciplines creates a rich intellectual landscape where technical expertise meets human understanding. I believe that AI will be instrumental in addressing some of our most pressing global challenges, from climate change to healthcare accessibility, and I want to be part of that transformative journey.`
  },
  {
    title: 'Why Research?',
    content: `Research appeals to me because it represents the pursuit of knowledge in its purest form. In research, we ask questions that don't yet have answers and develop methodologies to explore uncharted territories. This process of discovery is both intellectually stimulating and personally fulfilling. I'm particularly interested in research that bridges the gap between theoretical advancements and practical applications. By contributing to the academic community through publications and collaborations, I can help push the boundaries of what's possible in technology while also ensuring that these advancements benefit society. Research also provides a platform for mentorship and knowledge sharing, allowing me to inspire the next generation of computer scientists.`
  }
];

// Personal statement data
let personalStatementData = `I am a passionate computer science student with a deep interest in artificial intelligence and its applications in solving real-world problems. My journey in technology began when I was 12 years old, tinkering with HTML and CSS to build simple websites. This early exposure sparked my curiosity about how technology can transform the way we live and work.

Through my academic journey, I've developed a strong foundation in computer science principles, algorithms, and data structures. I've also gained practical experience through internships and research projects, where I've applied my knowledge to develop innovative solutions. My experience at Google as a software engineering intern taught me the importance of scalable and maintainable code, while my research work at MIT AI Lab has deepened my understanding of machine learning algorithms and their applications.

I believe that technology should be accessible to everyone and should be used to create positive social impact. This belief drives my involvement in volunteer teaching and mentorship programs, where I help underrepresented groups gain access to technology education. I'm committed to using my skills and knowledge to contribute to technological advancements that improve people's lives and address global challenges.`
