import { useState } from "react";
import axios from "axios";
import Layout from "./Layout";
// --- Subjects by Program and Semester (expand as needed) ---
const subjectsByProgramAndSemester = {
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

const electives = {
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

const difficulties = ["Easy", "Medium", "Hard"];
const semesterOptions = [
  "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
];
const bloomsTaxonomy = [
  "Remember",
  "Understand",
  "Apply",
  "Analyze",
  "Evaluate",
  "Create",
];
const moduleOptions = [
  "Module 1",
  "Module 2",
  "Module 3",
  "Module 4",
  "Module 5"
];

export default function QuestionCriteriaForm() {
  const [form, setForm] = useState({
    program: "",
    semester: "",
    subject: "",
    topic: "",
    difficulty: "",
    totalMarks: "",
    bloomsLevels: [],
    modules: [],
  });
  const [selectedElective, setSelectedElective] = useState("");

  // Subjects for the selected program and semester
  const semesterSubjects =
    form.program && form.semester
      ? subjectsByProgramAndSemester[form.program][form.semester] || []
      : [];

  // Is the current subject an elective placeholder?
  const isElective =
    form.subject &&
    electives[form.program] &&
    electives[form.program][form.subject];

  // Elective options for the selected elective placeholder
  const electiveOptions =
    isElective && electives[form.program][form.subject]
      ? electives[form.program][form.subject]
      : [];

  // Handle all changes except elective selection
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      // Reset subject, elective, and modules if program or semester changes
      ...(name === "program" || name === "semester"
        ? { subject: "", topic: "", modules: [] }
        : {}),
      ...(name === "subject" ? { modules: [] } : {}),
    }));
    if (name === "subject") {
      setSelectedElective(""); // Reset elective when subject changes
    }
  };

  // Handle elective selection
  const handleElectiveChange = (e) => {
    setSelectedElective(e.target.value);
    setForm((prev) => ({
      ...prev,
      subject: e.target.value, // Use elective as subject for submission
      modules: [],
    }));
  };

  const handleBloomChange = (level) => {
    setForm((prevForm) => {
      const isChecked = prevForm.bloomsLevels.includes(level);
      return {
        ...prevForm,
        bloomsLevels: isChecked
          ? prevForm.bloomsLevels.filter((l) => l !== level)
          : [...prevForm.bloomsLevels, level],
      };
    });
  };

  // Handle module checkbox changes
  const handleModuleChange = (module) => {
    setForm((prevForm) => {
      const isChecked = prevForm.modules.includes(module);
      return {
        ...prevForm,
        modules: isChecked
          ? prevForm.modules.filter((m) => m !== module)
          : [...prevForm.modules, module],
      };
    });
  };

  // Handle Total Marks radio button
  const handleTotalMarksChange = (e) => {
    setForm((prev) => ({
      ...prev,
      totalMarks: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send all form data except weightage (which is not needed)
      const response = await axios.post("/api/generate-questions", form);
      console.log("Server response:", response.data);
    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message);
    }
  };

  return (
    <Layout>
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Select Question Criteria</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Program Selection */}
        <select
          name="program"
          value={form.program}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Program</option>
          <option value="AI/ML">Integrated MSc Computer Science (AI & ML)</option>
          <option value="Data Science">Integrated MSc Computer Science (Data Science)</option>
        </select>

        {/* Semester Selection */}
        <select
          name="semester"
          value={form.semester}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          disabled={!form.program}
        >
          <option value="">Select Semester</option>
          {semesterOptions.map((sem) => (
            <option key={sem} value={sem}>Semester {sem}</option>
          ))}
        </select>

        {/* Subject Selection */}
        <select
          name="subject"
          value={isElective ? form.subject : form.subject}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          disabled={!form.semester}
        >
          <option value="">Select Subject</option>
          {semesterSubjects.map((sub) => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>

        {/* Elective Dropdown (if needed) */}
        {isElective && (
          <select
            name="elective"
            value={selectedElective}
            onChange={handleElectiveChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Elective</option>
            {electiveOptions.map((elec) => (
              <option key={elec} value={elec}>{elec}</option>
            ))}
          </select>
        )}

        {/* Module Selection (only show after subject is selected) */}
        {form.subject && (
          <div>
            <label className="block font-medium mb-1">Select Module(s):</label>
            <div className="grid grid-cols-2 gap-2">
              {moduleOptions.map((module) => (
                <label key={module} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={form.modules.includes(module)}
                    onChange={() => handleModuleChange(module)}
                    className="accent-blue-600"
                  />
                  <span>{module}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <input
          type="text"
          name="topic"
          placeholder="Enter Topic (optional)"
          value={form.topic}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <select
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Difficulty</option>
          {difficulties.map((lvl) => (
            <option key={lvl} value={lvl}>{lvl}</option>
          ))}
        </select>

        {/* Total Marks Radio Buttons */}
        <div>
          <label className="block font-medium mb-1">Total Weighatge:</label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="totalMarks"
                value="15"
                checked={form.totalMarks === "15"}
                onChange={handleTotalMarksChange}
                className="accent-blue-600"
              />
              <span>15</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="totalMarks"
                value="30"
                checked={form.totalMarks === "30"}
                onChange={handleTotalMarksChange}
                className="accent-blue-600"
              />
              <span>30</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">
            Bloom’s Taxonomy Levels:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {bloomsTaxonomy.map((level) => (
              <label key={level} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={form.bloomsLevels.includes(level)}
                  onChange={() => handleBloomChange(level)}
                  className="accent-blue-600"
                />
                <span>{level}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
        >
          Generate Questions
        </button>
      </form>
    </div>
    </Layout>
  );
}
