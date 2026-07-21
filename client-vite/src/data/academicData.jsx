// client/src/data/academicData.js

export const subjectsByProgramAndSemester = {
  "AI/ML": {
    I: [
      "English 1- Communication Skills in English",
      "Programming in C",
      "Introduction to Computer",
      "Database Management Systems",
      "Mathematics – I-Graph Theory and Operations Research",
      "Software Lab I"
    ],
    II: [
      "Second Language",
      "Object Oriented Programming Using C++",
      "Data Structures using C++",
      "Operating Systems",
      "Mathematics – II-Linear Algebra",
      "Software Lab II"
    ],
    III: [
      "Advanced Computation Techniques",
      "Programming in Python",
      "R Programming and Mathematics for Artificial Intelligence",
      "Computer Organization and Architecture",
      "Digital Electronics",
      "Software Lab III: Python and R Programming"
    ],
    IV: [
      "English II-English Language Skills for Academic Purposes",
      "Microprocessors",
      "Data Mining",
      "Software Engineering",
      "Basics of Artificial Intelligence",
      "Complemetary Lab: Digital Electronics Lab",
      "Software lab IV"
    ],
    V: [
      "Principles of Machine learning",
      "Web application Development Using PHP",
      "Programming in Java",
      "IT and Environment",
      "Project Minor - Phase I",
      "Software Lab V: Java and PHP"
    ],
    VI: [
      "Linux and Shell Programming",
      "Computer Networks",
      "Advanced Machine Learning Techniques",
      "Elective 1 [Bunch A]",
      "Project Minor Phase II",
      "Software Lab VI: Machine Learning Techniques"
    ],
    VII: [
      "Computational Mathematics",
      "Applied Statistics for Data Analytics",
      "Advanced Python Programming",
      "Data Science and Analytics",
      "Software Lab VII: Advanced Python Programming",
      "Software Lab VIII: Statistical Programming and Data Analytics using R"
    ],
    VIII: [
      "Elective 2 [Bunch B]",
      "Advanced Deep Learning Techniques",
      "Digital Image Processing",
      "Elective 3 [Bunch C]",
      "Software Lab IX: DIP using Python",
      "Software Lab X: Deep Learning Lab using R/Python"
    ],
    IX: [
      "Elective 4 [Bunch D]",
      "Advanced Concepts in AI",
      "Natural Language Processing",
      "Elective 5 [Bunch E]",
      "Software Lab XI: NLP Lab using R/Python",
      "Case study and Minor project"
    ],
    X: [
      "Major Project",
      "Comprehensive Viva Voce"
    ]
  },
  "Data Science": {
    I: [
      "English I – Communication skills in English",
      "Programming in C",
      "Introduction to Computer",
      "Database Management Systems",
      "Mathematics – I – Graph Theory and Operations Research",
      "Software Lab I"
    ],
    II: [
      "Second Language",
      "Object Oriented Programming Using C++",
      "Data Structures using C++",
      "Operating Systems",
      "Mathematics – II – Linear Algebra",
      "Software Lab II"
    ],
    III: [
      "Introduction to Data Science",
      "Programming in Python",
      "R Programming and Mathematics for Artificial Intelligence",
      "Computer Organization and Architecture",
      "Probability and Statistics",
      "Software Lab III: Python and R Programming"
    ],
    IV: [
      "English II – English Language Skills for Academic Purposes",
      "Probability Distributions and Statistical Inference",
      "Data Mining",
      "Software Engineering",
      "Basics of Artificial Intelligence",
      "Complementary Lab: R Programming For Statistical Tools",
      "Software lab IV"
    ],
    V: [
      "Principles of Machine learning",
      "Web application Development Using PHP",
      "Programming in Java",
      "IT and Environment",
      "Project Minor - Phase I",
      "Software Lab V: Java and PHP"
    ],
    VI: [
      "Linux and Shell Programming",
      "Computer Networks",
      "Mobile Application Development using Kotlin",
      "Elective 1 [Bunch A]",
      "Project Minor Phase II",
      "Software Lab VI: Mobile Application Development using Kotlin"
    ],
    VII: [
      "Computational Mathematics",
      "Applied Statistics for Data Science",
      "Advanced Python Programming for data Science",
      "Data Engineering in Data Science",
      "Software Lab VII: Python Programming Lab for data Science",
      "Software Lab VIII: Data Engineering Lab"
    ],
    VIII: [
      "Elective 2 [Bunch B]",
      "Advanced Deep Learning Techniques",
      "Data Visualization",
      "Elective 3 [Bunch C]",
      "Software Lab IX: Deep Learning Lab using R",
      "Software Lab X: Data Visualization Lab using Tableau"
    ],
    IX: [
      "Elective 4 [Bunch D]",
      "Elective 5 [Bunch E]",
    ],
    X: [
      "Major Project",
      "Comprehensive Viva Voce"
    ]
  }
};

export const programs = Object.keys(subjectsByProgramAndSemester);


export const electives = {
  "AI/ML": {
    "Elective 1 [Bunch A]": [
      "Cloud Computing",
      "Full stack programming Techniques",
      "Predictive Analytics"
    ],
    "Elective 2 [Bunch B]": [
      "Soft Computing Techniques",
      "Mobile Application Development"
    ],
    "Elective 3 [Bunch C]": [
      "Computer Vision",
      "Augmented and Virtual Reality"
    ],
    "Elective 4 [Bunch D]": [
      "Robotics",
      "IoT Analytics"
    ],
    "Elective 5 [Bunch E]": [
      "Block Chain Technology",
      "Big Data Analytics"
    ]
  },
  "Data Science": {
    "Elective 1 [Bunch A]": [
      "Cloud Computing",
      "Full stack programming Techniques",
      "Predictive Analytics"
    ],
    "Elective 2 [Bunch B]": [
      "Advanced DBMS",
      "Business Intelligence & Analytics"
    ],
    "Elective 3 [Bunch C]": [
      "Image and Video Analytics",
      "Genomic data science"
    ],
    "Elective 4 [Bunch D]": [
      "Healthcare data Analytics",
      "Social media Analytics"
    ],
    "Elective 5 [Bunch E]": [
      "Block Chain Technology",
      "Big Data Analytics"
    ]
  }
};

// Assuming you also have these constants in AddQuestions.jsx,
// if not, please get them from wherever they are defined and add them here with export.
export const semesterOptions = [
  'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'
];

export const moduleOptions = [
  'Module 1', 'Module 2', 'Module 3', 'Module 4', 'Module 5', 'Module 6'
];

export const bloomsTaxonomy = [ // <--- THIS LINE IS CRUCIAL
  'Remembering (L1)',
  'Understanding (L2)',
  'Applying (L3)',
  'Analyzing (L4)',
  'Evaluating (L5)',
  'Creating (L6)'
];

export const questionTypes = [
  'Short Answer',
  'Long Answer',
  'Problem',
  'True/False',
  'Multiple Choice',
  'Fill in the Blanks'
];

export const cosOptions = [
  'CO1', 'CO2', 'CO3', 'CO4', 'CO5'
];

export const bloomsLevelMapping = {
  'Remembering (L1)': 'R',
  'Understanding (L2)': 'U',
  'Applying (L3)': 'A',
  'Analyzing (L4)': 'An',
  'Evaluating (L5)': 'E',
  'Creating (L6)': 'C'
};