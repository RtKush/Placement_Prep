import {
  CodingProfile,
  PDFResource,
  InterviewExperience,
  Project,
  HRQuestion,
  CompanyPrep
} from '@/types/workspace';

/* =======================
   CODING PROFILES (3)
   ======================= */

export const sampleCodingProfiles: CodingProfile[] = [
  {
    id: '1',
    name: 'LeetCode Profile',
    platform: 'LeetCode',
    url: 'https://leetcode.com/accounts/login/?next=%2Fu%2Flogin%2F',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'GeeksforGeeks Profile',
    platform: 'GeeksforGeeks',
    url: 'https://auth.geeksforgeeks.org/',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'GitHub Profile',
    platform: 'GitHub',
    url: 'https://github.com/login',
    createdAt: new Date().toISOString()
  }
];

/* =======================
   PDF / RESOURCES (10)
   Allowed categories:
   dsa | notes | resume | company | other
   ======================= */

export const samplePDFResources: PDFResource[] = [
  
  {
    id: '3',
    name: 'DBMS Notes',
    category: 'notes',
    subject: 'Database Management',
    url: 'https://drive.google.com/file/d/171K_LbrOrUyGmduHEh3YM-JUdiOtw_Nk/view?usp=drive_link',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Operating System Notes',
    category: 'notes',
    subject: 'Operating Systems',
    url: 'https://drive.google.com/file/d/1olCSvkTzRq56b6r5lZgBnGpH48z1PClW/view?usp=drive_link',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Computer Networks Notes',
    category: 'notes',
    subject: 'Computer Networks',
    url: 'https://drive.google.com/file/d/1tQcFGefBsau-EZh1hq33EcGquOjf7PM6/view?usp=sharing',
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'OOPs Notes',
    category: 'notes',
    subject: 'Object Oriented Programming',
    url: 'https://drive.google.com/file/d/19mDEnKZE7rsEhXSj8RYMzCeEWv526WPa/view?usp=sharing',
    createdAt: new Date().toISOString()
  },
  {
    id: '7',
    name: 'System Design Basics',
    category: 'notes',
    subject: 'System Design',
    url: 'https://drive.google.com/file/d/1VhkpG2SutW6RIpMYwpHymR3v8N2SY6ZP/view?usp=sharing',
    createdAt: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Java Interview Questions',
    category: 'notes',
    subject: 'Java',
    url: 'https://drive.google.com/file/d/1GHQ4pPoeplM2L5qvrWr5rKkroI-Jaoxz/view?usp=drive_link',
    createdAt: new Date().toISOString()
  },
  {
    id: '9',
    name: 'SQL Interview Cheat Sheet',
    category: 'notes',
    subject: 'SQL',
    url: 'https://drive.google.com/file/d/1ImsXtcYwFAwMImt87l7HUdD3u_hM9H2S/view?usp=drive_link',
    createdAt: new Date().toISOString()
  },
];

/* =======================
   INTERVIEW EXPERIENCES
   ======================= */

export const sampleInterviewExperiences: InterviewExperience[] = [

{
id:'1',
company:'Quantiphi Analytics',
role:'Software Engineer',
// date:'2025-10-04',
rounds:'R1 MCQ + 3 DSA, R2 2 DSA, HR',
result:'selected',
experience:`
TEST PATTERN
R1 - MCQ + 3 DSA
R2 - 2 DSA
HR

TEST DURATION
R1 90
R2 45

QUESTION TOPICS
Core Subjects
Aptitude
Reasoning
Binary Search
DP
Graph
Greedy
Tree

INTERVIEW DURATION
R1 30
R2 30
HR 20

TOPICS ASKED
R1 Internship based and Project based, SQL Query
R2 Count Sort Variation, AWS, RAG

CODING QUESTIONS
Q1 Find Unique Element
Q2 House Robber
Q3 Variation of Count Sort
Q4 Find Second Highest Salary
Q5 Job Scheduling

PROJECT DISCUSSION
Explain Project and features
Purpose of project
Tech stack used and why
React Hooks
Promises
AWS deployment
Explain RAG
`,
tips:'Strong DSA + SQL + project depth.',
createdAt:new Date().toISOString()
},

{
id:'2',
company:'Texas Instruments',
role:'Software Engineer',
// date:'2025-10-04',
rounds:'MCQ + Technical',
result:'selected',
experience:`
TEST PATTERN
2 parts MCQ
10 reasoning
50 coding

TEST DURATION
70

QUESTION TOPICS
Java
Python
Linux
DBMS

INTERVIEW DURATION
120

TOPICS ASKED
Arrays
Trees
Monotonic Stack

CODING QUESTIONS
Top View of Tree
Next Greater Element
Minimum Length Subarray of all 1s
Group Anagrams

CORE SUBJECT QUESTIONS
Normalization
Load Balancer
Read Replicas
Logging
Networking

PROJECT DISCUSSION
GSOC work
Freelance work
Docker
Linux Commands
`,
tips:'Linux + networking + debugging asked.',
createdAt:new Date().toISOString()
},

{
id:'3',
company:'Quantiphi Analytics',
role:'Software Engineer',
// date:'2025-10-04',
rounds:'OA + 2 Tech + HR',
result:'selected',
experience:`
TEST PATTERN
Round1 Virtual
Round2 CCC

QUESTION TOPICS
Aptitude
Computer Fundamentals
Verbal
Binary Search
DP
Graph
Array

INTERVIEW
Round1 Technical
Round2 Technical
Round3 HR

TOPICS ASKED
DBMS
SQL
Python
Machine Learning

CODING QUESTIONS
Second Largest (3 approaches)
Second Highest Salary SQL

CORE SUBJECT QUESTIONS
ACID
Joins
Having vs Where
Delete vs Drop
List vs Tuple
Mutable vs Immutable

PROJECT DISCUSSION
Project Objective
Workflow
Challenges
Manual Similarity Search
Difference from existing apps
`,
tips:'Project-heavy round.',
createdAt:new Date().toISOString()
},

{
id:'4',
company:'EPAM Systems',
role:'Software Engineer',
// date:'2025-10-04',
rounds:'25 MCQ + Coding',
result:'selected',
experience:`
QUESTION TOPICS
DBMS
Dynamic Programming
Tree
OS

CODING QUESTIONS
Longest Palindromic Substring
House Robber 2
Check BST
Consumer Producer

CORE SUBJECT QUESTIONS
Indexing
Joins
Normalization
SQL queries

PROJECT DISCUSSION
Razorpay Integration
LangChain
GenAI
`,
tips:'DP + DBMS repeated.',
createdAt:new Date().toISOString()
},

{
id:'5',
company:'Texas Instruments',
role:'Software Engineer',
// date:'2025-10-05',
rounds:'55 MCQ + Technical',
result:'selected',
experience:`
CODING QUESTIONS
Kadane

CORE SUBJECT QUESTIONS
TCP vs UDP
ARP vs RARP
MAC vs IP
Polymorphism
Virtual vs Pure Virtual
Kernel
Linux Commands
chmod vs chown
Git branching

PROJECT DISCUSSION
Redis
Kafka
RabbitMQ
Socket
Broadcasting vs Unicasting
Microservices
Security
MVC
REST APIs
`,
tips:'Very deep project architecture grilling.',
createdAt:new Date().toISOString()
},

{
id:'6',
company:'Optum',
role:'Software Engineer',
// date:'2025-10-08',
rounds:'Full Stack Assessment + Interview',
result:'selected',
experience:`
TEST PATTERN
Backend to frontend modules
API creation
DB involvement

TECH STACKS
Spring Angular MyBatis
MERN
DotNet
Django

CODING QUESTIONS
Balanced Parenthesis
Web Crawler

CORE SUBJECT QUESTIONS
SOLID Principles
REST APIs
PUT vs POST

HR
Strength
Weakness
`,
tips:'Prepare backend APIs + OOP design.',
createdAt:new Date().toISOString()
},

{
id:'7',
company:'KANERIKA',
role:'Software Engineer',
// date:'2025-11-09',
rounds:'4 Interviews',
result:'selected',
experience:`
QUESTION TOPICS
Array
Binary Search
Linked List
Tree

CODING QUESTIONS
Infinite Array Search
Swap Alternate Node
Two Sum
Zig Zag Traversal

CORE SUBJECT QUESTIONS
Abstract Class
Interface
SQL Joins
CDN
URL flow
Data Modeling

PROJECT DISCUSSION
Gemini model
JWT
Cookies
Session
OAuth
Business value
Scalability

HR
Situational questions
Family
Teamwork
Strengths
`,
tips:'Very broad interview.',
createdAt:new Date().toISOString()
},

{
id:'8',
company:'Qolaris Data',
role:'Software Engineer',
// date:'2025-11-17',
rounds:'MCQ + Build App',
result:'selected',
experience:`
QUESTION TOPICS
Nodejs
React

CORE SUBJECT QUESTIONS
Microservices
Circuit Breaker

PROJECT DISCUSSION
Scaling questions
System design questions
`,
tips:'System design basics useful.',
createdAt:new Date().toISOString()
},

{
id:'9',
company:'Intellect Design Arena',
role:'Software Engineer',
// date:'2025-11-17',
rounds:'10 MCQ + Coding + SQL',
result:'selected',
experience:`
CODING QUESTIONS
Sliding Window
Maximum Average Subarray
Can Place Flowers

CORE SUBJECT QUESTIONS
Encryption vs Hashing
IOC
Dependency Injection
String object creation
DDOS

HR
Family questions
`,
tips:'Java + OOP + arrays.',
createdAt:new Date().toISOString()
},

{
id:'10',
company:'Intellect Design Arena',
role:'Software Engineer',
// date:'2025-11-17',
rounds:'10 MCQ + 2 Coding + 2 SQL',
result:'selected',
experience:`
CODING QUESTIONS
Second Largest
Kth Largest
String to Integer

CORE SUBJECT QUESTIONS
Java
OOP
SQL

HR
Family background
`,
tips:'Time complexity asked.',
createdAt:new Date().toISOString()
},

{
id:'11',
company:'Qolaris Data',
role:'Software Engineer',
// date:'2025-11-19',
rounds:'MCQ + Development',
result:'selected',
experience:`
QUESTION TOPICS
Math
Reasoning
English

DEVELOPMENT
React
Node
MySQL
Development follow-up question
`,
tips:'Practice implementation tasks.',
createdAt:new Date().toISOString()
},

{
id:'12',
company:'Intellect Design Arena',
role:'Software Engineer',
// date:'2025-11-19',
rounds:'2 Coding + HR',
result:'selected',
experience:`
CODING QUESTIONS
Second Largest
Kth Largest
String to Integer

TOPICS
Priority Queue
Array

HR
Family background
Why masters
`,
tips:'Multiple approaches asked.',
createdAt:new Date().toISOString()
},

{
id:'13',
company:'Infosys',
role:'Software Engineer',
// date:'2026-03-13',
rounds:'4 Coding + L1',
result:'selected',
experience:`
QUESTION TOPICS
DP
Recursion
Greedy

CODING QUESTIONS
BFS
DFS
Cycle Detection
Topological Sort
Second Highest Salary

CORE SUBJECT QUESTIONS
Event Loop
Promises
require()
Bankers Algorithm
Deadlock
LLM
ChatGPT

PROJECT DISCUSSION
Basic functionality
`,
tips:'Graphs + OS + Node.js.',
createdAt:new Date().toISOString()
},

{
id:'14',
company:'Infosys',
role:'Software Engineer',
// date:'2026-03-13',
rounds:'4 Coding + L1',
result:'selected',
experience:`
QUESTION TOPICS
Dynamic Programming
Greedy

CORE SUBJECT QUESTIONS
Generator
Namespace
DFS
BFS
Kahn Algorithm
Overfitting
CNN
SVM
One Hot Encoding

PROJECT DISCUSSION
Future improvements
Technologies used
`,
tips:'Resume skills targeted.',
createdAt:new Date().toISOString()
},

{
id:'15',
company:'Accenture',
role:'Software Engineer',
// date:'2026-03-14',
rounds:'Behavioral + Technical + Coding + Communication',
result:'selected',
experience:`
ASSESSMENTS
Psychometric
Cognitive
Technical MCQ
Coding
Communication

QUESTION TOPICS
Network Security
Cloud
DSA
SQL
Java
JavaScript
HTML
CSS
DotNet

PROJECT DISCUSSION
Event Ticketing Platform
LangChain Chatbot
OpenAI LLM

HR QUESTIONS
Tell me about yourself
Why Accenture
Strengths
Weaknesses
5 years
Teamwork
Why hire you
`,
tips:'Communication mattered.',
createdAt:new Date().toISOString()
}

];

/* =======================
   PROJECTS
   ======================= */



export const sampleProjects: Project[] = [
  {
  "id": "1",
  "name": "Placement Prep Workplace",
  "techStack": [
    "React.js", 
    "TypeScript", 
    "Tailwind CSS", 
    "Shadcn UI", 
    "Framer Motion", 
    "Vite"
  ],
  "overview": 
    "A comprehensive, centralized preparation ecosystem designed to streamline the technical recruitment journey. It serves as a high-performance dashboard for managing DSA roadmaps, company-specific resources, and interview intelligence in one unified interface.",
  "flow": 
    "Open the web application, which immediately initializes a smooth experience by allowing a toggle to Dark Mode. From the dashboard, navigate to the 'Coding Profiles' section to manage platform links. You can add extra profiles or custom data points here; the application ensures all important data is persisted in LocalStorage, preventing data loss even after page refreshes (as long as browser storage is not cleared).",
  "features": 
    "Interactive DSA Progress Tracker, Company-Specific Interview Modules, Built-in PDF Resource Hub, Real-world Interview Experience Archives, HR Interview Q&A Library, Command-Center Search (K-Command), and Persistent Dark/Light Mode.",
  "githubUrl": "https://github.com",
  "liveUrl": "https://placement-prep-workplace.vercel.app",
  "createdAt": "2026-04-20T12:31:00Z"
},

];


   /* =======================
   HR QUESTIONS
   ======================= */

export const sampleHRQuestions: HRQuestion[] = [
  {
    id: 'hr-1',
    question: 'Tell me about yourself',
    answer:
      'Click on Edit and Add your Introduction here...',
    category: 'hr',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'hr-2',
    question: 'What are your strengths?',
    answer:
      'One of my biggest strengths is problem-solving. I enjoy breaking down complex problems and finding efficient solutions.',
    category: 'hr',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'hr-5',
    question: 'What is your weakness?',
    answer:
      'Earlier, I used to spend too much time trying to perfect every solution before considering it complete. Over time, I learned that in real projects, balancing quality with deadlines is equally important.',
    category: 'hr',
    createdAt: new Date().toISOString(),
  },
   {
    id: 'hr-3',
    question: 'Why should we hire you?',
    answer:
      'Earlier, I used to spend too much time trying to perfect every solution before considering it complete. Over time, I learned that in real projects, balancing quality with deadlines is equally importantYou should hire me because I bring a combination of technical skills, problem-solving ability, and a strong willingness to learn.',
    category: 'hr',
    createdAt: new Date().toISOString(),
  },
   {
    id: 'hr-4',
    question: 'Why do you want to work for our company?',
    answer:
      'I want to work for your company because of its strong engineering culture, focus on innovation, and the opportunity to solve real-world problems at scale.',
    category: 'hr',
    createdAt: new Date().toISOString(),
  }
   
];

/* =======================
   TECHNICAL QnA (FULL)
   ======================= */

export const sampleTechnicalQnA = [
 
/* =======================
   PROJECT-BASED QUESTIONS (5)
   ======================= */
{
  tech: 'Project Discussion',
  questions: [
    {
      id: 'project-1',
      question: 'Tell me about your project.',
      answer: 'I worked on a full-stack project called Real-Time Chat Application. It allows users to authenticate, send real-time messages, and manage profiles. I worked on backend APIs, database integration, authentication, and implementing real-time communication. This project helped me understand application flow, debugging, and scalability concepts.'
    },
    {
      id: 'project-2',
      question: 'What tech stack did you use in your project and why?',
      answer: 'I used Java, Spring Boot, MySQL, and MongoDB. Spring Boot for backend APIs, MySQL/MongoDB for data storage, and Git for version control. I chose this stack because it supports scalability, clean architecture, and efficient data handling.'
    },
    {
      id: 'project-3',
      question: 'What challenges did you face in your project?',
      answer: 'One challenge was handling authentication and data consistency. Initially I faced issues in managing secure login and proper data flow, but I resolved it by improving API structure, validation, and debugging the application flow.'
    },
    {
      id: 'project-4',
      question: 'What was your role in the project?',
      answer: 'I worked mainly on backend logic, database integration, API development, and debugging. I was involved in designing features, implementing functionality, and testing the application.'
    },
    {
      id: 'project-5',
      question: 'If we ask you to improve your project, what would you add?',
      answer: 'I would improve scalability, optimize performance, strengthen security, and add features like caching, better monitoring, and enhanced user experience.'
    }
  ]
},
];


/* =======================
   COMPANY PREP
   ======================= */

export const sampleCompanyPrep: CompanyPrep[] = [
  {
    id: '1',
    company: 'Optum',
    notes:
      'Focus on DSA, Java, DBMS, SQL, OS basics, and strong project discussion.',
    resources: [
      'https://leetcode.com/discuss/post/6596203/optum-sde-1-java-full-stack-hyderabad-ma-8bab/',
      'https://www.geeksforgeeks.org/interview-experiences/optum-interview-experience-on-campus/',
      'https://www.geeksforgeeks.org/interview-experiences/optum-interview-experience-software-engineer-1-on-campus-3-rounds/',
      'https://www.geeksforgeeks.org/java/oops-interview-questions-java-programming/'
    ],
    createdAt: new Date().toISOString()
  },

  {
    id: '2',
    company: 'Infosys',
    notes:
      'Focus on DSA, DBMS, OOP, aptitude, project explanation, and HR preparation.',
    resources: [
      'https://www.geeksforgeeks.org/dsa/infosys-sde-sheet-interview-questions-and-answers/',
      'https://www.geeksforgeeks.org/interview-experiences/infosys-interview-experience-specialist-programmer-full-time-on-campus-2025-batch/',
      'https://www.geeksforgeeks.org/interview-experiences/infosys-interview-experience-for-specialist-programmer/',
      'https://prepinsta.com/infosys-sp-and-dse/coding-questions/',
      'https://www.geeksforgeeks.org/interview-experiences/infosys-specialist-programmer-l2-interview-experience-off-campus/'
    ],
    createdAt: new Date().toISOString()
  }
];