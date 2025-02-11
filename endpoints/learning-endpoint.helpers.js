const {
  HTTP_OK,
  HTTP_NOT_FOUND,
  HTTP_BAD_REQUEST,
  HTTP_UNAUTHORIZED,
  HTTP_UNPROCESSABLE_ENTITY,
  HTTP_FORBIDDEN,
} = require("../helpers/response.helpers");
const { formatErrorResponse, generateUuid } = require("../helpers/helpers");
const { isAuthenticated, createToken } = require("../helpers/jwtauth");
const { logTrace, logDebug } = require("../helpers/logger-api");
const { verifyAccessToken } = require("../helpers/validation.helpers");
const { areIdsEqual, isUndefined, isInactive } = require("../helpers/compare.helpers");

const mockData = {
  // Users data
  users: [
    {
      id: 1,
      username: "user",
      email: "michael.scott@test.test.com",
      password: "demo",
      firstName: "Michael",
      lastName: "Scott",
      avatar: "..\\data\\users\\face_1713017873.9196286_m_1.jpg",
      joinDate: "2023-05-15",
      role: "student",
    },
    {
      id: 2,
      username: "john_doe",
      email: "john.doe@test.test.com",
      password: "demo",
      firstName: "John",
      lastName: "Doe",
      avatar: "..\\data\\users\\face_1713017346.0038195_m_1.jpg",
      joinDate: "2023-01-15",
      role: "instructor",
    },
    {
      id: 3,
      username: "jane_smith",
      email: "jane_smith@test.test.com",
      password: "demo",
      firstName: "Jane",
      lastName: "Smith",
      avatar: "..\\data\\users\\face_1714589705_f.jpg",
      joinDate: "2023-02-15",
      role: "student",
    },
    {
      id: 4,
      username: "bob_ross",
      email: "bob_ross@@test.test.com",
      password: "demo",
      firstName: "Bob",
      lastName: "Ross",
      avatar: "..\\data\\users\\face_1703527925.6898403_1_m.jpg",
      joinDate: "2023-03-15",
      role: "student",
    },
    {
      id: 5,
      username: "jane_doe",
      email: "jane_doe@@test.test.com",
      password: "demo",
      firstName: "Jane",
      lastName: "Doe",
      avatar: "..\\data\\users\\face_1714589623_f.jpg",
      joinDate: "2023-04-15",
      role: "student",
    },
    {
      id: 6,
      username: "jim_halpert",
      email: "jim_halpert@@test.test.com",
      password: "demo",
      firstName: "Jim",
      lastName: "Halpert",
      avatar: "..\\data\\users\\face_1703527930.631284_1_m.jpg",
      joinDate: "2023-04-15",
      role: "student",
    },
  ],

  // Course catalog
  courses: [
    {
      id: 1,
      title: "Introduction to Web Development",
      description:
        "Learn the fundamentals of web development including HTML, CSS, and JavaScript. Perfect for beginners wanting to start their web development journey.",
      thumbnail: "..\\data\\learning\\courses\\web-dev.jpg",
      instructor: "John Doe",
      duration: "8 weeks",
      totalHours: 24,
      level: "Beginner",
      students: 0,
      rating: 0,
      tags: ["HTML", "CSS", "JavaScript"],
      prerequisites: [],
      price: 49.99,
      learningObjectives: [
        "Build complete web applications from scratch",
        "Master HTML5, CSS3, and modern JavaScript",
        "Understand responsive design principles",
        "Create interactive user interfaces",
        "Learn web development best practices",
        "Implement modern web standards",
      ],
    },
    {
      id: 2,
      title: "Advanced JavaScript Programming",
      description:
        "Master modern JavaScript features, async programming, and advanced patterns. Take your JavaScript skills to the next level.",
      thumbnail: "..\\data\\learning\\courses\\js-advanced.jpg",
      instructor: "John Doe",
      duration: "10 weeks",
      totalHours: 30,
      level: "Advanced",
      students: 0,
      rating: 0,
      tags: ["JavaScript", "ES6+", "Async"],
      prerequisites: ["Basic JavaScript"],
      price: 79.99,
      learningObjectives: [
        "Master advanced JavaScript concepts",
        "Build complex applications using modern JS",
        "Implement async programming patterns",
        "Use modern ES6+ features effectively",
        "Create scalable application architectures",
        "Debug and optimize JavaScript code",
      ],
    },
    {
      id: 3,
      title: "React.js Fundamentals",
      description: "Build modern web applications with React. Learn components, state management, and best practices.",
      thumbnail: "..\\data\\learning\\courses\\react.jpg",
      instructor: "John Doe",
      duration: "12 weeks",
      totalHours: 36,
      level: "Intermediate",
      students: 0,
      rating: 0,
      tags: ["React", "JavaScript", "Web Development"],
      prerequisites: ["JavaScript"],
      price: 89.99,
      learningObjectives: [
        "Build modern React applications",
        "Master component-based architecture",
        "Implement state management patterns",
        "Create reusable React components",
        "Handle routing and navigation",
        "Optimize React application performance",
      ],
    },
    {
      id: 4,
      title: "Playwright Automation Testing",
      description:
        "Learn end-to-end testing with Playwright. Automate browser interactions, test web applications, and write reliable tests.",
      thumbnail: "..\\data\\learning\\courses\\playwright.jpg",
      instructor: "John Doe",
      duration: "6 weeks",
      totalHours: 18,
      level: "Intermediate",
      students: 0,
      rating: 0,
      tags: ["Playwright", "Testing", "Automation"],
      prerequisites: ["JavaScript", "Testing Basics"],
      price: 129.99,
      learningObjectives: [
        "Master Playwright automation testing",
        "Automate browser interactions",
        "Write reliable end-to-end tests",
        "Test web applications effectively",
        "Debug and optimize test scripts",
        "Implement testing best practices",
      ],
    },
    {
      id: 5,
      title: "Python Programming Basics",
      description:
        "Learn the basics of Python programming. Perfect for beginners wanting to start their coding journey with Python.",
      thumbnail: "..\\data\\learning\\courses\\python-basics.jpg",
      instructor: "John Doe",
      duration: "2 weeks",
      totalHours: 1,
      level: "Beginner",
      students: 0,
      rating: 0,
      tags: ["Python", "Programming", "Basics"],
      prerequisites: [],
      price: 0,
      learningObjectives: [
        "Master Python programming basics",
        "Understand Python syntax and semantics",
        "Learn data types and structures",
        "Implement Python control flow",
        "Create Python scripts and programs",
        "Debug and optimize Python code",
      ],
    },
    {
      id: 6,
      title: "Introduction to Java Programming",
      description:
        "Learn the fundamentals of Java programming. Perfect for beginners wanting to start their coding journey with Java.",
      thumbnail: "..\\data\\learning\\courses\\java-basics.jpg",
      instructor: "John Doe",
      duration: "4 weeks",
      totalHours: 12,
      level: "Beginner",
      students: 0,
      rating: 0,
      tags: ["Java", "Programming", "Basics"],
      prerequisites: [],
      price: 0,
      learningObjectives: [
        "Master Java programming basics",
        "Understand Java syntax and semantics",
        "Learn data types and structures",
        "Implement Java control flow",
        "Create Java scripts and programs",
        "Debug and optimize Java code",
      ],
    },
    {
      id: 7,
      title: "Manual Testing Fundamentals",
      description:
        "Learn the fundamentals of manual testing. Perfect for beginners wanting to start their testing journey with manual testing.",
      thumbnail: "..\\data\\learning\\courses\\manual-testing.jpg",
      instructor: "John Doe",
      duration: "2 weeks",
      totalHours: 1,
      level: "Beginner",
      students: 0,
      rating: 0,
      tags: ["Testing", "Manual", "Basics"],
      prerequisites: [],
      price: 0,
      learningObjectives: [
        "Master manual testing fundamentals",
        "Understand testing concepts and principles",
        "Learn testing techniques and strategies",
        "Implement manual testing best practices",
        "Create test cases and test plans",
        "Report and track software defects",
      ],
    },
  ],

  // User enrollments with progress
  userEnrollments: [
    {
      id: 1,
      userId: 1,
      courseId: 1,
      enrollmentDate: "2023-06-01",
      lastAccessed: "2023-07-25",
      progress: 100,
      completed: true,
      certificateIssued: true,
      completionDate: "2023-06-30",
    },
    {
      id: 2,
      userId: 1,
      courseId: 2,
      enrollmentDate: "2023-07-01",
      lastAccessed: "2023-07-24",
      progress: 60,
      completed: false,
    },
    {
      id: 3,
      userId: 3,
      courseId: 1,
      enrollmentDate: "2023-07-15",
      lastAccessed: "2023-07-25",
      progress: 25,
      completed: false,
    },
    {
      id: 4,
      userId: 3,
      courseId: 2,
      enrollmentDate: "2023-07-20",
      lastAccessed: "2023-07-25",
      progress: 0,
      completed: false,
    },
    {
      id: 5,
      userId: 3,
      courseId: 3,
      enrollmentDate: "2023-07-25",
      lastAccessed: "2023-07-25",
      progress: 0,
      completed: false,
    },
    {
      id: 6,
      userId: 3,
      courseId: 4,
      enrollmentDate: "2023-07-25",
      lastAccessed: "2023-07-25",
      progress: 0,
      completed: false,
    },
    {
      id: 7,
      userId: 4,
      courseId: 4,
      enrollmentDate: "2023-07-25",
      lastAccessed: "2023-07-25",
      progress: 0,
      completed: false,
    },
    {
      id: 8,
      userId: 5,
      courseId: 1,
      enrollmentDate: "2023-07-25",
      lastAccessed: "2023-07-25",
      progress: 0,
      completed: false,
    },
    {
      id: 9,
      userId: 5,
      courseId: 2,
      enrollmentDate: "2023-07-25",
      lastAccessed: "2023-07-25",
      progress: 0,
      completed: false,
    },
    {
      id: 10,
      userId: 6,
      courseId: 1,
      enrollmentDate: "2023-07-25",
      lastAccessed: "2023-07-25",
      progress: 0,
      completed: false,
    },
    {
      id: 11,
      userId: 6,
      courseId: 2,
      enrollmentDate: "2023-07-25",
      lastAccessed: "2023-07-25",
      progress: 0,
      completed: false,
    },
  ],

  // User progress tracking
  lessonProgress: [
    {
      userId: 1,
      courseId: 1,
      lessonId: 1,
      completed: true,
      completedAt: "2023-06-15T10:30:00Z",
      score: null,
    },
    {
      userId: 1,
      courseId: 1,
      lessonId: 2,
      completed: true,
      completedAt: "2023-06-16T14:20:00Z",
      score: null,
    },
    {
      userId: 1,
      courseId: 1,
      lessonId: 3,
      completed: true,
      completedAt: "2023-06-17T09:45:00Z",
      score: 90,
    },
  ],

  // Certificates with user reference
  certificates: [
    {
      id: 1,
      userId: 1,
      courseId: 1,
      issueDate: "2023-06-30",
      certificateNumber: "CERT-2023-001",
      uuid: "550e8400-e29b-41d4-a716-446655440000",
      courseTitle: "Introduction to Web Development",
      recipientName: "Michael Scott",
      issuedBy: "John Doe",
    },
  ],

  // Course content
  courseLessons: {
    1: [
      {
        id: 1,
        title: "Introduction to HTML",
        type: "video",
        duration: "12:50",
        completed: false,
        content: {
          videoUrl: "https://test.test.test/video1.mp4",
          transcript: "Introduction to HTML basics...",
        },
      },
      {
        id: 2,
        title: "HTML Structure and Elements",
        type: "reading",
        duration: "15:00",
        completed: false,
        content: {
          text: "The basic structure of an HTML document...",
          resources: ["HTML5 Specification", "MDN Documentation"],
        },
      },
      {
        id: 3,
        title: "HTML Fundamentals Quiz",
        type: "quiz",
        completed: true,
        content: {
          questions: [
            {
              question: "What does HTML stand for?",
              options: ["Hypertext Markup Language", "High-Level Text Language", "Hyperlink and Text Markup Language"],
              correct: 0,
            },
            {
              question: "Which tag is used for creating a paragraph?",
              options: ["p", "paragraph", "text"],
              correct: 0,
            },
          ],
        },
      },
      {
        id: 4,
        title: "Working with Forms",
        type: "video",
        duration: "12:00",
        completed: false,
        content: {
          videoUrl: "https://test.test.test/video2.mp4",
          transcript: "Learn how to create HTML forms...",
        },
      },
      {
        id: 5,
        title: "CSS Integration",
        type: "reading",
        duration: "21:00",
        completed: false,
        content: {
          text: "Learn how to style your HTML with CSS...",
          resources: ["CSS Guide", "Styling Best Practices"],
        },
      },
      {
        id: 6,
        title: "Module 1 Quiz",
        type: "quiz",
        completed: false,
        content: {
          questions: [
            {
              question: "What does HTML stand for?",
              options: ["Hypertext Markup Language", "High-Level Text Language", "Hyperlink and Text Markup Language"],
              correct: 0,
            },
            {
              question: "Which tag is used for creating a paragraph?",
              options: ["p", "paragraph", "text"],
              correct: 0,
            },
          ],
        },
      },
    ],
    2: [
      {
        id: 1,
        title: "Modern JavaScript Features",
        type: "video",
        duration: "12:00",
        completed: false,
        content: {
          videoUrl: "https://test.test.test/js-video1.mp4",
          transcript: "Let's explore modern JavaScript features...",
        },
      },
      {
        id: 2,
        title: "Async Programming",
        type: "reading",
        duration: "20:00",
        completed: false,
        content: {
          text: "Asynchronous programming in JavaScript allows you to execute code concurrently...",
          resources: ["MDN Documentation", "Async/Await Guide"],
        },
      },
      {
        id: 3,
        title: "ES6+ Features",
        type: "reading",
        duration: "18:00",
        completed: false,
        content: {
          text: "ES6 introduced many new features to JavaScript, such as arrow functions, classes, and modules...",
          resources: ["Babel Documentation", "ES6 Overview"],
        },
      },
      {
        id: 4,
        title: "JavaScript Basics",
        type: "video",
        duration: "15:00",
        completed: false,
        content: {
          videoUrl: "https://test.test.test/js-video1.mp4",
          transcript: "Introduction to JavaScript programming...",
        },
      },
      {
        id: 5,
        title: "Variables and Data Types",
        type: "reading",
        duration: "20:00",
        completed: false,
        content: {
          text: "Understanding JavaScript variables and data types...",
          resources: ["JavaScript Guide", "MDN Variables"],
        },
      },
      {
        id: 6,
        title: "Functions and Scope",
        type: "video",
        duration: "25:00",
        completed: false,
        content: {
          videoUrl: "https://test.test.test/js-video2.mp4",
          transcript: "Deep dive into JavaScript functions...",
        },
      },
      {
        id: 7,
        title: "Arrays and Objects",
        type: "reading",
        duration: "30:00",
        completed: false,
        content: {
          text: "Working with complex data structures...",
          resources: ["Array Methods", "Object Manipulation"],
        },
      },
      {
        id: 8,
        title: "JavaScript Fundamentals Quiz",
        type: "quiz",
        completed: false,
        content: {
          questions: [
            {
              question: "Which operator is used for strict equality?",
              options: ["===", "==", "="],
              correct: 0,
            },
            {
              question: "What is the result of typeof []?",
              options: ["object", "array", "undefined"],
              correct: 0,
            },
          ],
        },
      },
    ],
    3: [
      {
        id: 1,
        title: "React Components",
        type: "video",
        duration: "15:00",
        completed: false,
        content: {
          videoUrl: "https://test.test.test/react-video1.mp4",
          transcript: "Understanding React components...",
        },
      },
      {
        id: 2,
        title: "State Management",
        type: "reading",
        duration: "25:00",
        completed: false,
        content: {
          text: "State management is a crucial part of building React applications...",
          resources: ["Redux Documentation", "Context API Guide"],
        },
      },
    ],
    4: [
      {
        id: 1,
        title: "Introduction to Playwright",
        type: "video",
        duration: "10:00",
        completed: false,
        content: {
          videoUrl: "https://test.test.test/playwright-video1.mp4",
          transcript: "Getting started with Playwright automation...",
        },
      },
      {
        id: 2,
        title: "Automating Browser Interactions",
        type: "reading",
        duration: "18:00",
        completed: false,
        content: {
          text: "Learn how to automate browser interactions using Playwright...",
          resources: ["Playwright Documentation", "Automated Testing Guide"],
        },
      },
      {
        id: 3,
        title: "Writing Reliable Tests",
        type: "reading",
        duration: "20:00",
        completed: false,
        content: {
          text: "Best practices for writing reliable end-to-end tests...",
          resources: ["Testing Strategies", "Playwright Patterns"],
        },
      },
      {
        id: 4,
        title: "Playwright Automation Quiz",
        type: "quiz",
        completed: false,
        content: {
          questions: [
            {
              question: "What is Playwright used for?",
              options: ["Automation Testing", "Unit Testing", "Manual Testing"],
              correct: 0,
            },
            {
              question: "Which browser engines are supported by Playwright?",
              options: ["Chromium, WebKit, Firefox", "Chrome, Safari, Edge", "IE, Firefox, Opera"],
              correct: 0,
            },
          ],
        },
      },
      {
        id: 5,
        title: "Debugging and Optimization",
        type: "video",
        duration: "30:00",
        completed: false,
        content: {
          videoUrl: "https://test.test.test/playwright-video1.mp4",
          transcript: "Debugging and optimizing Playwright tests...",
        },
      },
      {
        id: 6,
        title: "Testing Best Practices",
        type: "video",
        duration: "55:00",
        completed: false,
        content: {
          videoUrl: "https://test.test.test/playwright-video1.mp4",
          transcript: "Best practices for automated testing are essential for successful test automation projects...",
          resources: ["Testing Standards", "Automation Testing Principles"],
        },
      },
    ],
    5: [
      {
        id: 1,
        title: "Python Basics",
        type: "video",
        duration: "10:00",
        completed: false,
        content: {
          videoUrl: "https://test.test.test/python-video1.mp4",
          transcript: "Introduction to Python programming...",
        },
      },
    ],
    6: [
      {
        id: 1,
        title: "Java Basics",
        type: "video",
        duration: "20:00",
        completed: false,
        content: {
          videoUrl: "https://test.test.test/java-video1.mp4",
          transcript: "Introduction to Java programming...",
        },
      },
      {
        id: 2,
        title: "Java Syntax and Semantics",
        type: "reading",
        duration: "35:00",
        completed: false,
        content: {
          text: "Understanding Java syntax and semantics...",
          resources: ["Java Documentation", "Java Basics Guide"],
        },
      },
      {
        id: 3,
        title: "Java Control Flow",
        type: "reading",
        duration: "44:00",
        completed: false,
        content: {
          text: "Learn how to control program flow in Java...",
          resources: ["Java Loops", "Decision Making"],
        },
      },
      {
        id: 4,
        title: "Java Basics Quiz",
        type: "quiz",
        completed: false,
        content: {
          questions: [
            {
              question: "What is Java?",
              options: ["Programming Language", "Coffee", "Tea"],
              correct: 0,
            },
            {
              question: "Which of the following is a Java keyword?",
              options: ["class", "method", "variable"],
              correct: 0,
            },
          ],
        },
      },
      {
        id: 5,
        title: "Java Methods",
        type: "video",
        duration: "53:00",
        completed: false,
        content: {
          videoUrl: "https://test.test.test/java-video1.mp4",
          transcript: "Methods in Java programming language...",
        },
      },
      {
        id: 6,
        title: "Java Classes and Objects",
        type: "reading",
        duration: "49:00",
        completed: false,
        content: {
          videoUrl: "https://test.test.test/java-video1.mp4",
          transcript:
            "Classes and objects are fundamental concepts in object-oriented programming (OOP) languages like Java...",
        },
      },
      {
        id: 7,
        title: "Java Inheritance",
        type: "video",
        duration: "35:00",
        completed: false,
        content: {
          videoUrl: "https://test.test.test/java-video1.mp4",
          transcript:
            "Inheritance is a key feature of object-oriented programming. Learn how to use it in Java programming language...",
        },
      },
      {
        id: 8,
        title: "Java Basics Quiz",
        type: "quiz",
        completed: false,
        content: {
          questions: [
            {
              question: "What is Java?",
              options: ["Programming Language", "Coffee", "Tea"],
              correct: 0,
            },
            {
              question: "Which of the following is a Java keyword?",
              options: ["class", "method", "variable"],
              correct: 0,
            },
            {
              question: "What is a class in Java?",
              options: ["A method", "A blueprint for objects", "A variable"],
              correct: 1,
            },
            {
              question: "What is an object in Java?",
              options: ["An instance of a class", "A method", "A variable"],
              correct: 0,
            },
            {
              question: "What is inheritance in Java?",
              options: ["Reusing code", "Creating new classes", "Both of the above"],
              correct: 2,
            },
          ],
        },
      },
    ],
    7: [
      {
        id: 1,
        title: "Manual Testing Fundamentals",
        type: "video",
        duration: "10:00",
        completed: false,
        content: {
          videoUrl: "https://test.test.test/manual-testing-video1.mp4",
          transcript: "Introduction to manual testing...",
        },
      },
      {
        id: 2,
        title: "Testing Techniques",
        type: "video",
        duration: "15:00",
        completed: false,
        content: {
          videoUrl: "https://test.test.test/manual-testing-video1.mp4",
          transcript: "Learn manual testing techniques and strategies...",
          resources: ["Testing Guide", "Manual Testing Best Practices"],
        },
      },
      {
        id: 3,
        title: "Creating Test Cases",
        type: "video",
        duration: "20:00",
        completed: false,
        content: {
          videoUrl: "https://test.test.test/manual-testing-video1.mp4",
          transcript: "How to create effective test cases...",
          resources: ["Test Case Examples", "Test Case Templates"],
        },
      },
      {
        id: 4,
        title: "Manual Testing Quiz",
        type: "quiz",
        completed: false,
        content: {
          questions: [
            {
              question: "What is manual testing?",
              options: ["Testing by humans", "Automated testing", "Unit testing"],
              correct: 0,
            },
            {
              question: "What is a test case?",
              options: ["A set of conditions", "A test script", "A test plan"],
              correct: 0,
            },
          ],
        },
      },
      {
        id: 5,
        title: "Reporting Defects",
        type: "video",
        duration: "25:00",
        completed: false,
        content: {
          videoUrl: "https://test.test.test/manual-testing-video1.mp4",
          transcript: "How to report and track software defects...",
          resources: ["Defect Tracking Tools", "Defect Reporting Guidelines"],
        },
      },
      {
        id: 6,
        title: "Manual Testing Best Practices",
        type: "video",
        duration: "30:00",
        completed: false,
        content: {
          videoUrl: "https://test.test.test/manual-testing-video1.mp4",
          transcript: "Best practices for manual testing...",
          resources: ["Testing Standards", "Manual Testing Principles"],
        },
      },
      {
        id: 7,
        title: "Manual Testing Techniques",
        type: "video",
        duration: "35:00",
        completed: false,
        content: {
          videoUrl: "https://test.test.test/manual-testing-video1.mp4",
          transcript: "Effective manual testing techniques...",
          resources: ["Testing Strategies", "Manual Testing Patterns"],
        },
      },
      {
        id: 8,
        title: "Manual Testing Fundamentals Quiz",
        type: "quiz",
        completed: false,
        content: {
          questions: [
            {
              question: "What are the benefits of manual testing?",
              options: ["Human judgment", "Flexibility", "All of the above"],
              correct: 2,
            },
            {
              question: "What is a test case?",
              options: ["A set of conditions", "A test script", "A test plan"],
              correct: 0,
            },
          ],
        },
      },
      {
        id: 9,
        title: "Manual Testing Patterns",
        type: "video",
        duration: "40:00",
        completed: false,
        content: {
          videoUrl: "https://test.test.test/manual-testing-video1.mp4",
          transcript: "Effective manual testing techniques and patterns...",
          resources: ["Testing Strategies", "Manual Testing Patterns"],
        },
      },
      {
        id: 10,
        title: "Manual Testing Strategies",
        type: "video",
        duration: "45:00",
        completed: false,
        content: {
          videoUrl: "https://test.test.test/manual-testing-video1.mp4",
          transcript: "Effective manual testing techniques...",
          resources: ["Testing Strategies", "Manual Testing Patterns"],
        },
      },
      {
        id: 11,
        title: "Manual Testing Principles",
        type: "video",
        duration: "50:00",
        completed: false,
        content: {
          videoUrl: "https://test.test.test/manual-testing-video1.mp4",
          transcript: "Effective manual testing techniques...",
          resources: ["Testing Strategies", "Manual Testing Patterns"],
        },
      },
    ],
  },

  // Quiz attempts tracking
  quizAttempts: [
    {
      id: 1,
      userId: 1,
      courseId: 1,
      lessonId: 3,
      attemptDate: "2023-06-17T09:45:00Z",
      score: 90,
      passed: true,
      answers: [0, 0], // User's selected answers
    },
  ],

  // User statistics cache
  userStats: [
    {
      userId: 1,
      coursesInProgress: 1,
      completedCourses: 1,
      totalHours: 28,
      totalCertificates: 1,
      lastUpdated: "2023-07-25T12:00:00Z",
    },
  ],

  // Add failed login attempts tracking
  failedLoginAttempts: {
    // Structure: { email: { count: number, lastAttempt: string } }
  },

  // Add userRatings array to mockData
  userRatings: [
    {
      userId: 3,
      courseId: 1,
      rating: 5,
      comment: "Great course, learned a lot!",
      createdAt: "2023-07-25T12:00:00Z",
    },
    {
      userId: 3,
      courseId: 2,
      rating: 4,
      comment: "Good content, could be more challenging.",
      createdAt: "2023-08-25T12:00:00Z",
    },
    {
      userId: 3,
      courseId: 3,
      rating: 3,
      comment: "Decent course, but could use more examples.",
      createdAt: "2023-09-25T12:00:00Z",
    },
    {
      userId: 3,
      courseId: 4,
      rating: 5,
      comment: "Excellent course, very informative!",
      createdAt: "2023-10-25T12:00:00Z",
    },
    {
      userId: 4,
      courseId: 4,
      rating: 5,
      comment: "Great course, learned a lot!",
      createdAt: "2023-07-25T12:00:00Z",
    },
    {
      userId: 5,
      courseId: 1,
      rating: 4,
      comment: "Good content, could be more challenging. Also, more examples would be helpful.",
      createdAt: "2023-08-25T12:00:00Z",
    },
    {
      userId: 5,
      courseId: 2,
      rating: 3,
      comment: "Well... it was okay.",
      createdAt: "2023-09-25T12:00:00Z",
    },
    {
      userId: 6,
      courseId: 1,
      rating: 4,
      comment: "Excellent course, very informative! I learned a lot from this course. Highly recommended.",
      createdAt: "2023-10-25T12:00:00Z",
    },
  ],
};

function checkIfUserRatedCourse(userId, courseId) {
  return mockData.userRatings.find((r) => areIdsEqual(r.userId, userId) && areIdsEqual(r.courseId, courseId));
}

function checkIfUserExists(email) {
  return mockData.users.find((u) => u.email === email);
}

function checkIfUserIsAuthenticated(req, res, endpoint = "endpoint", url = "") {
  const verifyTokenResult = verifyAccessToken(req, res, "learning", req.url);
  const userExists = checkIfUserExists(verifyTokenResult?.email);

  if (!verifyTokenResult || !userExists) {
    return false;
  }

  return true;
}

const checkIfUserIdMatchesEmail = (userId, email) => {
  const user = mockData.users.find((u) => areIdsEqual(u.id, userId));
  return user && user.email === email;
};

function recalculateStudentsCount() {
  mockData.courses.forEach((course) => {
    course.students = mockData.userEnrollments.filter((e) => areIdsEqual(e.courseId, course.id)).length || 0;
  });
}

function recalculateCoursesRating() {
  mockData.courses.forEach((course) => {
    const ratings = mockData.userRatings.filter((r) => areIdsEqual(r.courseId, course.id));
    const totalRating = ratings.reduce((total, rating) => total + rating.rating, 0);
    // round it to 1 decimal place
    course.rating = ratings.length > 0 ? Math.round((totalRating / ratings.length) * 10) / 10 : 0;
  });
}

function parseDurationToSeconds(duration) {
  if (!duration) {
    return 0;
  }

  const timeParts = duration.split(":");
  if (timeParts.length === 3) {
    return parseInt(timeParts[0]) * 3600 + parseInt(timeParts[1]) * 60 + parseInt(timeParts[2]);
  }
  return parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
}

function parseSecondsToDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsLeft = seconds % 60;

  return hours > 0
    ? `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secondsLeft
        .toString()
        .padStart(2, "0")}`
    : `${minutes.toString().padStart(2, "0")}:${secondsLeft.toString().padStart(2, "0")}`;
}

function roundSecondsToHours(seconds) {
  // round to one decimal place
  return Math.round((seconds / 3600) * 10) / 10;
}

function recalculateCoursesDuration() {
  mockData.courses.forEach((course) => {
    const lessons = mockData.courseLessons[course.id];
    const totalDurationInSeconds = lessons.reduce(
      (total, lesson) => total + parseDurationToSeconds(lesson?.duration),
      0
    );

    course.totalHours = roundSecondsToHours(totalDurationInSeconds);
    course.duration = `${roundSecondsToHours(totalDurationInSeconds)} hour(s)`;
  });
}

function checkIfUserIsEnrolled(userId, courseId) {
  return mockData.userEnrollments.some((e) => areIdsEqual(e.userId, userId) && areIdsEqual(e.courseId, courseId));
}

function findUserIdByEmail(email) {
  const user = mockData.users.find((u) => u.email === email);
  return user?.id;
}

recalculateStudentsCount();
recalculateCoursesRating();
recalculateCoursesDuration();

function handleLearning(req, res, isAdmin) {
  const urlEnds = req.url.replace(/\/\/+/g, "/");
  const urlParts = urlEnds.split("/").filter(Boolean);
  const verifyTokenResult = verifyAccessToken(req, res, "learning", req.url);

  // GET endpoints
  if (req.method === "GET") {
    // Add public certificate endpoint
    // /api/certificates/public/{certificateId}
    if (urlParts[2] === "certificates" && urlParts[3] === "public") {
      const certUuid = urlParts[4];
      const certificate = mockData.certificates.find((c) => c.uuid === certUuid);
      if (!certificate) {
        res.status(HTTP_NOT_FOUND).send(formatErrorResponse("Certificate not found"));
        return;
      }

      // Get additional data
      const course = mockData.courses.find((c) => areIdsEqual(c.id, certificate.courseId));
      const user = mockData.users.find((u) => areIdsEqual(u.id, certificate.userId));

      const publicCertData = {
        certificateNumber: certificate.certificateNumber,
        uuid: certificate.uuid,
        courseTitle: certificate.courseTitle,
        recipientName: `${user.firstName} ${user.lastName}`,
        issueDate: certificate.issueDate,
        issuedBy: certificate.issuedBy,
        courseDuration: course.duration,
        courseLevel: course.level,
        issuerTitle: "Course Instructor",
      };

      res.status(HTTP_OK).send(publicCertData);
      return;
    }

    // Add new auth status endpoint before other GET handlers
    // /learning/auth/status
    if (urlParts.length === 4 && urlParts[1] === "learning" && urlParts[2] === "auth" && urlParts[3] === "status") {
      const verifyTokenResult = verifyAccessToken(req, res, "learning", req.url);
      const userExists = verifyTokenResult ? checkIfUserExists(verifyTokenResult.email) : false;

      if (!verifyTokenResult || !userExists) {
        res.status(HTTP_OK).send({ authenticated: false });
        return;
      }

      const user = mockData.users.find((u) => u.email === verifyTokenResult.email);
      res.status(HTTP_OK).send({
        authenticated: true,
        // user: {
        //   id: user.id,
        //   email: user.email,
        //   firstName: user.firstName,
        //   lastName: user.lastName,
        //   avatar: user.avatar,
        // },
      });
      return;
    }

    // Specific endpoints should come before more general ones
    // Get lesson content (most specific)
    // /learning/users/{userId}/courses/{courseId}/lessons/{lessonId}
    if (
      urlParts.length === 7 &&
      urlParts[1] === "learning" &&
      urlParts[2] === "courses" &&
      urlParts[4] === "lessons" &&
      urlParts[6] === "content"
    ) {
      if (checkIfUserIsAuthenticated(req, res, "learning", urlEnds) === false) {
        res.status(HTTP_UNAUTHORIZED).send(formatErrorResponse("User not authenticated"));
        return;
      }

      const userId = findUserIdByEmail(verifyTokenResult.email);

      const courseId = parseInt(urlParts[3]);
      const isUserEnrolled = checkIfUserIsEnrolled(userId, courseId);

      if (!isUserEnrolled) {
        res.status(HTTP_FORBIDDEN).send(formatErrorResponse("User not enrolled in this course"));
        return;
      }

      const lessonId = parseInt(urlParts[5]);
      const lessons = mockData.courseLessons[courseId];
      const lesson = lessons?.find((l) => l.id === lessonId);

      if (lesson?.content) {
        res.status(HTTP_OK).send({ content: lesson.content });
      } else {
        res.status(HTTP_NOT_FOUND).send(formatErrorResponse("Lesson content not found"));
      }
      return;
    }

    // Get course lessons
    // /learning/courses/{courseId}/lessons
    if (urlParts.length === 5 && urlParts[1] === "learning" && urlParts[2] === "courses" && urlParts[4] === "lessons") {
      if (checkIfUserIsAuthenticated(req, res, "learning", urlEnds) === false) {
        res.status(HTTP_UNAUTHORIZED).send(formatErrorResponse("User not authenticated"));
        return;
      }

      const courseId = parseInt(urlParts[3]);
      const userId = findUserIdByEmail(verifyTokenResult?.email);
      const isEnrolled = checkIfUserIsEnrolled(userId, courseId);

      if (!isEnrolled) {
        res.status(HTTP_FORBIDDEN).send(formatErrorResponse("User not enrolled in this course"));
        return;
      }

      const lessons = mockData.courseLessons[courseId];
      if (lessons) {
        res.status(HTTP_OK).send(lessons);
      } else {
        res.status(HTTP_NOT_FOUND).send(formatErrorResponse("Lessons not found"));
      }
      return;
    }

    // Get course preview lessons
    // /learning/courses/{courseId}/lessons/preview
    if (
      urlParts.length === 6 &&
      urlParts[1] === "learning" &&
      urlParts[2] === "courses" &&
      urlParts[4] === "lessons" &&
      urlParts[5] === "preview"
    ) {
      const courseId = parseInt(urlParts[3]);
      const lessons = mockData.courseLessons[courseId];

      if (lessons) {
        const previewLessons = lessons.slice(0, 3);
        res.status(HTTP_OK).send({ previewLessons, totalLessons: lessons.length });
      } else {
        res.status(HTTP_NOT_FOUND).send(formatErrorResponse("Lessons not found"));
      }
      return;
    }

    // Get course lessons titles only
    // /learning/courses/{courseId}/lessons/titles
    if (
      urlParts.length === 6 &&
      urlParts[1] === "learning" &&
      urlParts[2] === "courses" &&
      urlParts[4] === "lessons" &&
      urlParts[5] === "titles"
    ) {
      const courseId = parseInt(urlParts[3]);
      const lessons = mockData.courseLessons[courseId];

      if (lessons) {
        const lessonTitles = lessons.map((l) => ({ id: l.id, title: l.title }));
        res.status(HTTP_OK).send(lessonTitles);
      } else {
        res.status(HTTP_NOT_FOUND).send(formatErrorResponse("Lessons not found"));
      }
      return;
    }

    // Get user stats
    // /learning/users/{userId}/stats
    if (urlParts.length === 5 && urlParts[1] === "learning" && urlParts[2] === "users" && urlParts[4] === "stats") {
      if (checkIfUserIsAuthenticated(req, res, "learning", urlEnds) === false) {
        res.status(HTTP_UNAUTHORIZED).send(formatErrorResponse("User not authenticated"));
        return;
      }

      const userId = parseInt(urlParts[3]);

      if (!checkIfUserIdMatchesEmail(userId, verifyTokenResult.email)) {
        res.status(HTTP_FORBIDDEN).send(formatErrorResponse("User not authorized"));
        return;
      }

      const stats = mockData.userStats.find((s) => areIdsEqual(s.userId, userId));
      if (stats) {
        res.status(HTTP_OK).send(stats);
      } else {
        res.status(HTTP_NOT_FOUND).send(formatErrorResponse("User stats not found"));
      }
      return;
    }

    // Get user enrollments
    // /learning/users/{userId}/enrollments
    if (
      urlParts.length === 5 &&
      urlParts[1] === "learning" &&
      urlParts[2] === "users" &&
      urlParts[4] === "enrollments"
    ) {
      if (checkIfUserIsAuthenticated(req, res, "learning", urlEnds) === false) {
        res.status(HTTP_UNAUTHORIZED).send(formatErrorResponse("User not authenticated"));
        return;
      }

      const userId = parseInt(urlParts[3]);

      if (!checkIfUserIdMatchesEmail(userId, verifyTokenResult.email)) {
        res.status(HTTP_FORBIDDEN).send(formatErrorResponse("User not authorized"));
        return;
      }

      const enrollments = mockData.userEnrollments.filter((e) => areIdsEqual(e.userId, userId));

      if (enrollments) {
        res.status(HTTP_OK).send(enrollments);
      } else {
        res.status(HTTP_NOT_FOUND).send(formatErrorResponse("Enrollments not found"));
      }
      return;
    }

    // Get user certificates
    // /learning/users/{userId}/certificates
    if (
      urlParts.length === 5 &&
      urlParts[1] === "learning" &&
      urlParts[2] === "users" &&
      urlParts[4] === "certificates"
    ) {
      if (checkIfUserIsAuthenticated(req, res, "learning", urlEnds) === false) {
        res.status(HTTP_UNAUTHORIZED).send(formatErrorResponse("User not authenticated"));
        return;
      }

      const userId = parseInt(urlParts[3]);

      if (!checkIfUserIdMatchesEmail(userId, verifyTokenResult.email)) {
        res.status(HTTP_FORBIDDEN).send(formatErrorResponse("User not authorized"));
        return;
      }

      const certificates = mockData.certificates.filter((c) => areIdsEqual(c.userId, userId)) || [];
      res.status(HTTP_OK).send({ certificates });
      return;
    }

    // Progress endpoints
    // Get lessons progress for a course and user
    // /learning/courses/:courseId/lessons/progress
    if (
      urlParts.length === 6 &&
      urlParts[1] === "learning" &&
      urlParts[2] === "courses" &&
      urlParts[4] === "lessons" &&
      urlParts[5] === "progress"
    ) {
      if (checkIfUserIsAuthenticated(req, res, "learning", urlEnds) === false) {
        res.status(HTTP_UNAUTHORIZED).send(formatErrorResponse("User not authenticated"));
        return;
      }

      const userId = findUserIdByEmail(verifyTokenResult?.email);
      const courseId = parseInt(urlParts[3]);

      if (checkIfUserIsEnrolled(userId, courseId) === false) {
        res.status(HTTP_FORBIDDEN).send(formatErrorResponse("User not enrolled in this course"));
        return;
      }

      const lessons = mockData.courseLessons[courseId];
      const progress = mockData.lessonProgress.filter(
        (p) => areIdsEqual(p.userId, userId) && areIdsEqual(p.courseId, courseId)
      );

      if (lessons && progress) {
        res.status(HTTP_OK).send(progress);
      } else {
        res.status(HTTP_NOT_FOUND).send(formatErrorResponse("Lesson progress not found"));
      }
      return;
    }

    // Get course progress
    // /learning/courses/:courseId/progress
    if (
      urlParts.length === 5 &&
      urlParts[1] === "learning" &&
      urlParts[2] === "courses" &&
      urlParts[4] === "progress"
    ) {
      if (checkIfUserIsAuthenticated(req, res, "learning", urlEnds) === false) {
        res.status(HTTP_UNAUTHORIZED).send(formatErrorResponse("User not authenticated"));
        return;
      }

      const userId = findUserIdByEmail(verifyTokenResult?.email);

      if (!checkIfUserIdMatchesEmail(userId, verifyTokenResult?.email)) {
        res.status(HTTP_FORBIDDEN).send(formatErrorResponse("User not authorized"));
        return;
      }

      const courseId = parseInt(urlParts[3]);
      const enrollment = mockData.userEnrollments.find(
        (e) => areIdsEqual(e.userId, userId) && areIdsEqual(e.courseId, courseId)
      );
      res.status(HTTP_OK).send({ progress: enrollment?.progress || 0 });
      return;
    }

    // Get course by ID
    // /learning/courses/:courseId
    if (urlParts.length === 4 && urlParts[1] === "learning" && urlParts[2] === "courses") {
      const courseId = parseInt(urlParts[3]);
      const course = mockData.courses.find((c) => areIdsEqual(c.id, courseId));

      if (course) {
        res.status(HTTP_OK).send(course);
      } else {
        res.status(HTTP_NOT_FOUND).send(formatErrorResponse("Course not found"));
      }
      return;
    }

    // Get user by ID
    // /learning/users/:userId
    if (urlParts.length === 4 && urlParts[1] === "learning" && urlParts[2] === "users") {
      if (checkIfUserIsAuthenticated(req, res, "learning", urlEnds) === false) {
        res.status(HTTP_UNAUTHORIZED).send(formatErrorResponse("User not authenticated"));
        return;
      }

      const userId = parseInt(urlParts[3]);

      if (!checkIfUserIdMatchesEmail(userId, verifyTokenResult.email)) {
        res.status(HTTP_FORBIDDEN).send(formatErrorResponse("User not authorized"));
        return;
      }

      const user = mockData.users.find((u) => areIdsEqual(u.id, userId));
      if (user) {
        res.status(HTTP_OK).send({ ...user, password: undefined });
      } else {
        res.status(HTTP_NOT_FOUND).send(formatErrorResponse("User not found"));
      }
      return;
    }

    // Get all entities
    // /learning/courses
    if (urlParts.length === 3 && urlParts[1] === "learning") {
      // TODO: access verification
      switch (urlParts[2]) {
        case "courses":
          res.status(HTTP_OK).send(mockData.courses);
          return;
      }
    }

    if (urlParts.length === 4 && urlParts[1] === "learning" && urlParts[2] === "quiz" && urlParts[3] === "attempts") {
      res.status(HTTP_OK).send(mockData.quizAttempts);
      return;
    }

    // Get course ratings
    // /learning/courses/{courseId}/ratings
    if (req.method === "GET" && urlParts.length === 5 && urlParts[4] === "ratings") {
      const courseId = parseInt(urlParts[3]);
      const ratings = mockData.userRatings.filter((r) => areIdsEqual(r.courseId, courseId));

      // Enhance ratings with user info
      const ratingsWithUserInfo = ratings.map((rating) => {
        const user = mockData.users.find((u) => areIdsEqual(u.id, rating.userId));
        return {
          ...rating,
          userInfo: {
            name: `${user.firstName} ${user.lastName}`,
            avatar: user.avatar,
          },
        };
      });

      res.status(HTTP_OK).send(ratingsWithUserInfo);
      return;
    }
  }

  // POST endpoints
  if (req.method === "POST") {
    // Authentication endpoints
    // /learning/auth/login
    if (urlParts.length === 4 && urlParts[1] === "learning" && urlParts[2] === "auth") {
      switch (urlParts[3]) {
        case "login": {
          const { username, password } = req.body;
          const user = mockData.users.find((u) => u.username === username && u.password === password);

          if (user) {
            if (mockData.failedLoginAttempts[user.email]) {
              delete mockData.failedLoginAttempts[user.email];
            }
            const access_token = createToken({ email: user.email, data: "TBD" }, false, true);
            logDebug("login: access token:", { email: user.email, password, access_token });
            res.status(HTTP_OK).send({
              success: true,
              access_token,
              username: user.username,
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              avatar: user.avatar,
            });
          } else {
            const foundUser = mockData.users.find((u) => u.username === username);
            if (foundUser) {
              const email = foundUser.email;
              if (!mockData.failedLoginAttempts[email]) {
                mockData.failedLoginAttempts[email] = { count: 0, lastAttempt: null };
              }
              mockData.failedLoginAttempts[email].count++;
              mockData.failedLoginAttempts[email].lastAttempt = new Date().toISOString();
            }
            res.status(HTTP_UNAUTHORIZED).send(formatErrorResponse("Invalid credentials"));
          }
          return;
        }
        // /learning/auth/register
        case "register": {
          const { username, password, email, avatar, firstName, lastName } = req.body;

          if (mockData.users.find((u) => u.username === username || u.email === email)) {
            res
              .status(HTTP_UNPROCESSABLE_ENTITY)
              .send(formatErrorResponse("User already exists with that username or email"));
            return;
          }

          const maxId = mockData.users.reduce((max, user) => (user.id > max ? user.id : max), 0);

          const newUser = {
            id: maxId + 1,
            username,
            email,
            password,
            firstName,
            lastName,
            avatar: avatar || "/data/icons/user.png", // Use selected avatar or default
            joinDate: new Date().toISOString(),
            role: "student",
          };
          mockData.users.push(newUser);
          res.status(HTTP_OK).send({ success: true });
          return;
        }
      }
    }

    // Course-related actions
    // /learning/courses/:courseId/:action
    if (urlParts.length >= 5 && urlParts[1] === "learning" && urlParts[2] === "courses") {
      const courseId = parseInt(urlParts[3]);

      switch (urlParts[4]) {
        // Enroll in a course
        // /learning/courses/:courseId/enroll
        case "enroll": {
          if (!checkIfUserIsAuthenticated(req, res)) {
            res.status(HTTP_UNAUTHORIZED).send(formatErrorResponse("User not authenticated"));
            return;
          }

          const { userId } = req.body;
          if (!checkIfUserIdMatchesEmail(userId, verifyTokenResult.email)) {
            res.status(HTTP_FORBIDDEN).send(formatErrorResponse("User not authorized"));
            return;
          }

          const course = mockData.courses.find((c) => areIdsEqual(c.id, courseId));
          if (!course) {
            res.status(HTTP_NOT_FOUND).send(formatErrorResponse("Course not found"));
            return;
          }

          // Check if already enrolled
          if (checkIfUserIsEnrolled(userId, courseId)) {
            res.status(HTTP_BAD_REQUEST).send(formatErrorResponse("Already enrolled in this course"));
            return;
          }

          // Create new enrollment
          const enrollment = {
            id: mockData.userEnrollments.length + 1,
            userId,
            courseId,
            enrollmentDate: new Date().toISOString(),
            lastAccessed: new Date().toISOString(),
            progress: 0,
            completed: false,
          };

          mockData.userEnrollments.push(enrollment);
          recalculateStudentsCount();

          res.status(HTTP_OK).send({ success: true, enrollment });
          return;
        }
        // /learning/courses/:courseId/certificate
        case "certificate":
          // Add certificate generation logic here
          res.status(HTTP_OK).send({ success: true });
          return;
        // /learning/courses/:courseId/complete
        case "progress": {
          if (checkIfUserIsAuthenticated(req, res, "learning", urlEnds) === false) {
            res.status(HTTP_UNAUTHORIZED).send(formatErrorResponse("User not authenticated"));
            return;
          }

          const { userId } = req.body;

          if (!checkIfUserIdMatchesEmail(userId, verifyTokenResult.email)) {
            res.status(HTTP_FORBIDDEN).send(formatErrorResponse("User not authorized"));
            return;
          }

          const { progress } = req.body;
          const enrollment = mockData.userEnrollments.find(
            (e) => areIdsEqual(e.courseId, courseId) && areIdsEqual(e.userId, userId)
          );

          if (enrollment) {
            enrollment.progress = progress;
            res.status(HTTP_OK).send({ success: true });
          } else {
            res.status(HTTP_NOT_FOUND).send(formatErrorResponse("Enrollment not found"));
          }
          return;
        }
      }

      // Lesson-related actions
      // /learning/courses/:courseId/lessons/:lessonId/:action
      if (urlParts.length === 7 && urlParts[4] === "lessons") {
        const lessonId = parseInt(urlParts[5]);

        switch (urlParts[6]) {
          // /learning/courses/:courseId/lessons/:lessonId/complete
          case "complete": {
            const { userId } = req.body;

            if (checkIfUserIsAuthenticated(req, res, "learning", urlEnds) === false) {
              res.status(HTTP_UNAUTHORIZED).send(formatErrorResponse("User not authenticated"));
              return;
            }

            if (!checkIfUserIdMatchesEmail(userId, verifyTokenResult.email)) {
              res.status(HTTP_FORBIDDEN).send(formatErrorResponse("User not authorized"));
              return;
            }

            const now = new Date().toISOString();
            mockData.lessonProgress.push({
              userId,
              courseId,
              lessonId,
              completed: true,
              completedAt: now,
            });

            // Check if all lessons are completed and update enrollment
            const lessons = mockData.courseLessons[courseId];
            const progress = mockData.lessonProgress.filter(
              (p) => areIdsEqual(p.userId, userId) && areIdsEqual(p.courseId, courseId)
            ).length;

            const enrollment = mockData.userEnrollments.find(
              (e) => areIdsEqual(e.userId, userId) && areIdsEqual(e.courseId, courseId)
            );

            if (enrollment) {
              enrollment.lastAccessed = now;
              enrollment.progress = Math.round((progress / lessons.length) * 100);

              logDebug("Lesson completed:", { progress: enrollment.progress, userId, courseId, lessonId });

              if (enrollment.progress === 100) {
                logDebug("All lessons completed:", { progress: enrollment.progress, userId, courseId, lessonId });
                enrollment.completed = true;
                enrollment.completionDate = now;

                const existingCertificate = mockData.certificates.find(
                  (cert) => areIdsEqual(cert.userId, userId) && areIdsEqual(cert.courseId, courseId)
                );

                if (!existingCertificate) {
                  const course = mockData.courses.find((c) => areIdsEqual(c.id, courseId));
                  const user = mockData.users.find((u) => areIdsEqual(u.id, userId));

                  const maxCertId = mockData.certificates.reduce((max, cert) => (cert.id > max ? cert.id : max), 0);
                  mockData.certificates.push({
                    id: maxCertId + 1,
                    userId,
                    courseId,
                    issueDate: now,
                    certificateNumber: `CERT-${new Date().getFullYear()}-${String(maxCertId + 1).padStart(3, "0")}`,
                    uuid: generateUuid(),
                    courseTitle: course.title,
                    recipientName: `${user.firstName} ${user.lastName}`,
                    issuedBy: course.instructor,
                  });
                }
              }
            }

            res.status(HTTP_OK).send({ success: true });
            return;
          }
          // /learning/courses/:courseId/lessons/:lessonId/quiz
          case "quiz": {
            const { userId, answers } = req.body;

            if (checkIfUserIsAuthenticated(req, res, "learning", urlEnds) === false) {
              res.status(HTTP_UNAUTHORIZED).send(formatErrorResponse("User not authenticated"));
              return;
            }

            if (!checkIfUserIdMatchesEmail(userId, verifyTokenResult.email)) {
              res.status(HTTP_FORBIDDEN).send(formatErrorResponse("User not authorized"));
              return;
            }

            mockData.quizAttempts.push({
              id: mockData.quizAttempts.length + 1,
              userId,
              courseId,
              lessonId,
              attemptDate: new Date().toISOString(),
              score: Math.floor(Math.random() * 100),
              passed: true,
              answers,
            });

            res.status(HTTP_OK).send({ success: true });
            return;
          }
        }
      }
    }

    // Add inside handleLearning function before the final else
    if (req.method === "POST" && urlParts.length === 5 && urlParts[4] === "rate") {
      if (checkIfUserIsAuthenticated(req, res, "learning", urlEnds) === false) {
        res.status(HTTP_UNAUTHORIZED).send(formatErrorResponse("User not authenticated"));
        return;
      }

      const courseId = parseInt(urlParts[3]);
      const { userId, rating, comment } = req.body;

      if (!checkIfUserIdMatchesEmail(userId, verifyTokenResult.email)) {
        res.status(HTTP_FORBIDDEN).send(formatErrorResponse("User not authorized"));
        return;
      }

      const course = mockData.courses.find((c) => areIdsEqual(c.id, courseId));
      if (!course) {
        res.status(HTTP_NOT_FOUND).send(formatErrorResponse("Course not found"));
        return;
      }

      // Check if user is enrolled in the course
      const isEnrolled = mockData.userEnrollments.find(
        (e) => areIdsEqual(e.userId, userId) && areIdsEqual(e.courseId, courseId)
      );

      if (!isEnrolled) {
        res.status(HTTP_FORBIDDEN).send(formatErrorResponse("User not enrolled in this course"));
        return;
      }

      // Remove any existing rating by this user for this course
      const existingRatingIndex = mockData.userRatings.findIndex(
        (r) => areIdsEqual(r.userId, userId) && areIdsEqual(r.courseId, courseId)
      );

      if (existingRatingIndex !== -1) {
        mockData.userRatings.splice(existingRatingIndex, 1);
      }

      // Add new rating
      mockData.userRatings.push({
        userId,
        courseId,
        rating,
        comment,
        createdAt: new Date().toISOString(),
      });

      // Update course average rating
      recalculateCoursesRating();

      res.status(HTTP_OK).send({ success: true });
      return;
    }
  }

  // PUT endpoints
  if (req.method === "PUT") {
    // Update user profile
    // /learning/users/{userId}/profile
    if (urlParts.length === 5 && urlParts[1] === "learning" && urlParts[2] === "users" && urlParts[4] === "profile") {
      if (checkIfUserIsAuthenticated(req, res, "learning", urlEnds) === false) {
        res.status(HTTP_UNAUTHORIZED).send(formatErrorResponse("User not authenticated"));
        return;
      }

      const userId = parseInt(urlParts[3]);
      if (!checkIfUserIdMatchesEmail(userId, verifyTokenResult.email)) {
        res.status(HTTP_FORBIDDEN).send(formatErrorResponse("User not authorized"));
        return;
      }

      const { firstName, lastName, email, currentPassword } = req.body;
      const user = mockData.users.find((u) => areIdsEqual(u.id, userId));

      if (!user) {
        res.status(HTTP_NOT_FOUND).send(formatErrorResponse("User not found"));
        return;
      }

      // Verify password
      if (!currentPassword || user.password !== currentPassword) {
        res.status(HTTP_UNAUTHORIZED).send(formatErrorResponse("Incorrect password"));
        return;
      }

      // Update user data
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;

      res.status(HTTP_OK).send({
        success: true,
        message: "Profile updated successfully",
      });
      return;
    }

    // Change password
    // /learning/users/{userId}/password
    if (urlParts.length === 5 && urlParts[1] === "learning" && urlParts[2] === "users" && urlParts[4] === "password") {
      if (checkIfUserIsAuthenticated(req, res, "learning", urlEnds) === false) {
        res.status(HTTP_UNAUTHORIZED).send(formatErrorResponse("User not authenticated"));
        return;
      }

      const userId = parseInt(urlParts[3]);
      if (!checkIfUserIdMatchesEmail(userId, verifyTokenResult.email)) {
        res.status(HTTP_FORBIDDEN).send(formatErrorResponse("User not authorized"));
        return;
      }

      const { currentPassword, newPassword } = req.body;
      const user = mockData.users.find((u) => areIdsEqual(u.id, userId));

      if (!user) {
        res.status(HTTP_NOT_FOUND).send(formatErrorResponse("User not found"));
        return;
      }

      if (user.password !== currentPassword) {
        res.status(HTTP_UNAUTHORIZED).send(formatErrorResponse("Current password is incorrect"));
        return;
      }

      // Update password
      user.password = newPassword;

      res.status(HTTP_OK).send({
        success: true,
        message: "Password changed successfully",
      });
      return;
    }
  }

  res.status(HTTP_NOT_FOUND).send(formatErrorResponse("Endpoint not found"));
}

module.exports = {
  handleLearning,
};
