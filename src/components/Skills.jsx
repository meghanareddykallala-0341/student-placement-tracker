import { useState, useEffect } from "react";
import api from "../axiosConfig";

function Skills() {
  const [skills, setSkills] = useState([]);

  const [skillName, setSkillName] = useState("");
  const [category, setCategory] = useState("Programming");
  const [level, setLevel] = useState("Beginner");

  const [targetRole, setTargetRole] = useState(
    "Python Full Stack Developer"
  );

  const [editingSkillId, setEditingSkillId] = useState(null);

  const allowedCategories = [
    "Programming",
    "Web Development",
    "Database",
    "CS Fundamentals",
    "Tools",
  ];

  const allowedLevels = [
    "Beginner",
    "Intermediate",
    "Advanced",
  ];

  /* =========================================================
     LOAD SKILLS
  ========================================================= */

  useEffect(() => {
    api
      .get("/api/skills/")
      .then((response) => {
        setSkills(response.data);
      })
      .catch((error) => {
        console.log("GET SKILLS ERROR:", error);
        alert("Could not load skills.");
      });
  }, []);

  /* =========================================================
     VALIDATE SKILL
  ========================================================= */

  function validateSkill() {
    const trimmedSkillName = skillName.trim();

    if (!trimmedSkillName) {
      alert("Please enter a skill.");
      return false;
    }

    if (trimmedSkillName.length < 2) {
      alert("Skill name must contain at least 2 characters.");
      return false;
    }

    if (trimmedSkillName.length > 50) {
      alert("Skill name cannot exceed 50 characters.");
      return false;
    }

    if (!/^[A-Za-z0-9+#.\- ]+$/.test(trimmedSkillName)) {
      alert("Skill name contains invalid characters.");
      return false;
    }

    if (!allowedCategories.includes(category)) {
      alert("Please select a valid skill category.");
      return false;
    }

    if (!allowedLevels.includes(level)) {
      alert("Please select a valid skill level.");
      return false;
    }

    const duplicateSkill = skills.some(
      (skill) =>
        skill.id !== editingSkillId &&
        skill.name.trim().toLowerCase() ===
          trimmedSkillName.toLowerCase()
    );

    if (duplicateSkill) {
      alert("This skill has already been added.");
      return false;
    }

    return true;
  }

  /* =========================================================
     ADD SKILL
  ========================================================= */

  function addSkill() {
    if (!validateSkill()) {
      return;
    }

    const newSkill = {
      name: skillName.trim(),
      category: category,
      level: level,
    };

    api
      .post("/api/skills/", newSkill)
      .then((response) => {
        setSkills((prevSkills) => [
          ...prevSkills,
          response.data,
        ]);

        clearForm();

        alert("Skill added successfully.");
      })
      .catch((error) => {
        console.log("ADD SKILL ERROR:", error);
        console.log(
          "ADD SKILL ERROR DATA:",
          error.response?.data
        );

        alert("Could not add skill.");
      });
  }

  /* =========================================================
     EDIT SKILL
  ========================================================= */

  function startEdit(skill) {
    setEditingSkillId(skill.id);
    setSkillName(skill.name || "");
    setCategory(skill.category || "Programming");
    setLevel(skill.level || "Beginner");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* =========================================================
     UPDATE SKILL
  ========================================================= */

  function updateSkill() {
    if (editingSkillId === null) {
      alert("No skill selected for editing.");
      return;
    }

    if (!validateSkill()) {
      return;
    }

    const updatedSkill = {
      name: skillName.trim(),
      category: category,
      level: level,
    };

    api
      .put(
        "/api/skills/" + editingSkillId + "/",
        updatedSkill
      )
      .then((response) => {
        setSkills((prevSkills) =>
          prevSkills.map((skill) =>
            skill.id === editingSkillId
              ? response.data
              : skill
          )
        );

        clearForm();

        alert("Skill updated successfully.");
      })
      .catch((error) => {
        console.log("UPDATE SKILL ERROR:", error);
        console.log(
          "UPDATE SKILL ERROR DATA:",
          error.response?.data
        );

        alert("Could not update skill.");
      });
  }

  /* =========================================================
     DELETE SKILL
  ========================================================= */

  function deleteSkill(id) {
    if (
      !window.confirm(
        "Are you sure you want to delete this skill?"
      )
    ) {
      return;
    }

    api
      .delete("/api/skills/" + id + "/")
      .then(() => {
        setSkills((prevSkills) =>
          prevSkills.filter(
            (skill) => skill.id !== id
          )
        );

        if (editingSkillId === id) {
          clearForm();
        }

        alert("Skill deleted successfully.");
      })
      .catch((error) => {
        console.log("DELETE SKILL ERROR:", error);
        console.log(
          "DELETE SKILL ERROR DATA:",
          error.response?.data
        );

        alert("Could not delete skill.");
      });
  }

  /* =========================================================
     CLEAR FORM
  ========================================================= */

  function cancelEdit() {
    clearForm();
  }

  function clearForm() {
    setSkillName("");
    setCategory("Programming");
    setLevel("Beginner");
    setEditingSkillId(null);
  }

  /* =========================================================
     PLACEMENT READINESS
  ========================================================= */

  const beginnerSkills = skills.filter(
    (skill) => skill.level === "Beginner"
  ).length;

  const intermediateSkills = skills.filter(
    (skill) => skill.level === "Intermediate"
  ).length;

  const advancedSkills = skills.filter(
    (skill) => skill.level === "Advanced"
  ).length;

  const totalSkills = skills.length;

  const readinessScore =
    totalSkills === 0
      ? 0
      : Math.round(
          ((beginnerSkills * 1 +
            intermediateSkills * 2 +
            advancedSkills * 3) /
            (totalSkills * 3)) *
            100
        );

  /* =========================================================
     ROLE SKILLS
  ========================================================= */

  const roleSkills = {
    "Python Full Stack Developer": [
      "Python",
      "Django",
      "JavaScript",
      "React",
      "HTML",
      "CSS",
      "SQL",
      "Git",
    ],

    "Java Full Stack Developer": [
      "Java",
      "Spring Boot",
      "JavaScript",
      "React",
      "HTML",
      "CSS",
      "SQL",
      "Git",
    ],

    "Software Developer": [
      "Python",
      "Java",
      "SQL",
      "DSA",
      "OOP",
      "Git",
    ],

    "Cybersecurity Analyst": [
      "Networking",
      "Linux",
      "Python",
      "Cybersecurity",
      "Cryptography",
      "Firewalls",
      "SIEM",
      "Git",
    ],

    "Data Analyst": [
      "Python",
      "SQL",
      "Excel",
      "Power BI",
      "Statistics",
      "Pandas",
      "Data Visualization",
      "Git",
    ],

    "Frontend Developer": [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Git",
      "Bootstrap",
      "Responsive Design",
      "REST API",
    ],

    "Backend Developer": [
      "Python",
      "Django",
      "REST API",
      "SQL",
      "Git",
      "APIs",
      "Authentication",
      "Database",
    ],

    "Java Developer": [
      "Java",
      "OOP",
      "SQL",
      "Spring Boot",
      "REST API",
      "Git",
      "DSA",
      "JDBC",
    ],

    "Python Developer": [
      "Python",
      "OOP",
      "SQL",
      "Django",
      "REST API",
      "Git",
      "DSA",
      "Testing",
    ],

    "React Developer": [
      "JavaScript",
      "React",
      "HTML",
      "CSS",
      "Git",
      "REST API",
      "JSX",
      "Responsive Design",
    ],

    "Database Developer": [
      "SQL",
      "MySQL",
      "PostgreSQL",
      "Database",
      "DBMS",
      "Python",
      "Git",
      "Data Modeling",
    ],

    "Cloud Engineer": [
      "Cloud Computing",
      "AWS",
      "Linux",
      "Networking",
      "Python",
      "Docker",
      "Git",
      "Security",
    ],

    "DevOps Engineer": [
      "Linux",
      "Git",
      "Docker",
      "CI/CD",
      "Cloud Computing",
      "AWS",
      "Networking",
      "Python",
    ],
  };

  /* =========================================================
     SKILL PRIORITY
  ========================================================= */

  const skillPriority = {
    Python: "High",
    Java: "High",
    JavaScript: "High",
    SQL: "High",
    DSA: "High",
    Networking: "High",
    Cybersecurity: "High",

    Django: "Medium",
    "Spring Boot": "Medium",
    React: "Medium",
    HTML: "Medium",
    CSS: "Medium",
    Linux: "Medium",
    Excel: "Medium",
    "Power BI": "Medium",
    Pandas: "Medium",
    Statistics: "Medium",

    Git: "Low",
    Bootstrap: "Low",
    "REST API": "Low",
    "Data Visualization": "Low",
    OOP: "Low",
  };

  /* =========================================================
     LEARNING PATHS
  ========================================================= */

  const learningPaths = {
    "Python Full Stack Developer": [
      "Python",
      "HTML",
      "CSS",
      "JavaScript",
      "SQL",
      "Django",
      "React",
      "Git",
    ],

    "Java Full Stack Developer": [
      "Java",
      "OOP",
      "HTML",
      "CSS",
      "JavaScript",
      "SQL",
      "Spring Boot",
      "React",
      "Git",
    ],

    "Software Developer": [
      "Programming",
      "OOP",
      "DSA",
      "SQL",
      "Git",
    ],

    "Cybersecurity Analyst": [
      "Networking",
      "Linux",
      "Python",
      "Cybersecurity",
      "Cryptography",
      "Firewalls",
      "SIEM",
      "Git",
    ],

    "Data Analyst": [
      "Excel",
      "SQL",
      "Statistics",
      "Python",
      "Pandas",
      "Power BI",
      "Data Visualization",
      "Git",
    ],

    "Frontend Developer": [
      "HTML",
      "CSS",
      "JavaScript",
      "Responsive Design",
      "Bootstrap",
      "React",
      "REST API",
      "Git",
    ],

    "Backend Developer": [
      "Python",
      "SQL",
      "Database",
      "Django",
      "REST API",
      "Authentication",
      "APIs",
      "Git",
    ],

    "Java Developer": [
      "Java",
      "OOP",
      "DSA",
      "SQL",
      "JDBC",
      "Spring Boot",
      "REST API",
      "Git",
    ],

    "Python Developer": [
      "Python",
      "OOP",
      "DSA",
      "SQL",
      "Django",
      "REST API",
      "Testing",
      "Git",
    ],

    "React Developer": [
      "HTML",
      "CSS",
      "JavaScript",
      "JSX",
      "React",
      "REST API",
      "Responsive Design",
      "Git",
    ],

    "Database Developer": [
      "SQL",
      "DBMS",
      "Database",
      "Data Modeling",
      "MySQL",
      "PostgreSQL",
      "Python",
      "Git",
    ],

    "Cloud Engineer": [
      "Networking",
      "Linux",
      "Python",
      "Cloud Computing",
      "AWS",
      "Docker",
      "Security",
      "Git",
    ],

    "DevOps Engineer": [
      "Linux",
      "Networking",
      "Git",
      "Python",
      "Docker",
      "CI/CD",
      "AWS",
      "Cloud Computing",
    ],
  };

  /* =========================================================
     SKILL GAP CALCULATIONS
  ========================================================= */

  const requiredSkills = roleSkills[targetRole] || [];

  const userSkillNames = skills.map((skill) =>
    skill.name.trim().toLowerCase()
  );

  const matchedSkills = requiredSkills.filter(
    (skill) =>
      userSkillNames.includes(
        skill.toLowerCase()
      )
  );

  const missingSkills = requiredSkills.filter(
    (skill) =>
      !userSkillNames.includes(
        skill.toLowerCase()
      )
  );

  const skillMatchPercentage =
    requiredSkills.length === 0
      ? 0
      : Math.round(
          (matchedSkills.length /
            requiredSkills.length) *
            100
        );

  const recommendedSkills = (
    learningPaths[targetRole] || []
  ).filter(
    (skill) =>
      !userSkillNames.includes(
        skill.toLowerCase()
      )
  );

  /* =========================================================
     SKILL STATUS
  ========================================================= */

  const getSkillStatus = (skillName) => {
    const userSkill = skills.find(
      (skill) =>
        skill.name.trim().toLowerCase() ===
        skillName.trim().toLowerCase()
    );

    if (!userSkill) {
      return {
        status: "Missing",
        className: "missing",
        symbol: "🔴",
      };
    }

    if (userSkill.level === "Advanced") {
      return {
        status: "Strong",
        className: "strong",
        symbol: "🟢",
      };
    }

    if (userSkill.level === "Intermediate") {
      return {
        status: "In Progress",
        className: "progress",
        symbol: "🔵",
      };
    }

    return {
      status: "Beginner",
      className: "beginner",
      symbol: "🟠",
    };
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="skills-page">

      <h1>Skills</h1>

      {/* PLACEMENT READINESS */}

      <div className="skill-summary">
        <h2>Placement Readiness</h2>

        <p className="readiness-score">
          {readinessScore}%
        </p>

        <p className="readiness-breakdown">
          Beginner: {beginnerSkills} | Intermediate:{" "}
          {intermediateSkills} | Advanced:{" "}
          {advancedSkills}
        </p>
      </div>

      {/* ADD / EDIT SKILL */}

      <div className="skill-form">

        <h2>
          {editingSkillId !== null
            ? "Edit Skill"
            : "Add Skill"}
        </h2>

        <input
          type="text"
          placeholder="Enter skill"
          value={skillName}
          maxLength="50"
          onChange={(e) =>
            setSkillName(e.target.value)
          }
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          {allowedCategories.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>

        <select
          value={level}
          onChange={(e) =>
            setLevel(e.target.value)
          }
        >
          {allowedLevels.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>

        {editingSkillId !== null ? (
          <>
            <button onClick={updateSkill}>
              Update Skill
            </button>

            <button
              type="button"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          </>
        ) : (
          <button onClick={addSkill}>
            Add Skill
          </button>
        )}

      </div>

      {/* SKILL GAP ANALYSIS */}

      <div className="skill-gap">

        <h2>Skill Gap Analysis</h2>

        <p>
          Select your target role:
        </p>

        <select
          value={targetRole}
          onChange={(e) =>
            setTargetRole(e.target.value)
          }
        >
          {Object.keys(roleSkills).map((role) => (
            <option
              key={role}
              value={role}
            >
              {role}
            </option>
          ))}
        </select>

        {/* SKILL MATCH */}

        <h3>Skill Match</h3>

        <div className="skill-match-box">

          <div className="skill-match-header">

            <span>
              {matchedSkills.length} /{" "}
              {requiredSkills.length} skills matched
            </span>

            <strong>
              {skillMatchPercentage}%
            </strong>

          </div>

          <div className="skill-progress-track">

            <div
              className="skill-progress-fill"
              style={{
                width: `${skillMatchPercentage}%`,
              }}
            ></div>

          </div>

        </div>

        {/* REQUIRED SKILLS */}

        <h3>Required Skills</h3>

        <div className="required-skills">

          {requiredSkills.map((skill) => (
            <span
              key={skill}
              className="required-skill-pill"
            >
              {skill}
            </span>
          ))}

        </div>

        {/* SKILL STATUS */}

        <h3>Skill Status</h3>

        <div className="skill-status-list">

          {requiredSkills.map((skill) => {

            const skillStatus =
              getSkillStatus(skill);

            return (
              <div
                key={skill}
                className={`skill-status-card ${skillStatus.className}`}
              >

                <div className="skill-status-name">
                  <span>
                    {skillStatus.symbol}
                  </span>

                  <strong>
                    {skill}
                  </strong>
                </div>

                <span className="skill-status-badge">
                  {skillStatus.status}
                </span>

              </div>
            );
          })}

        </div>

        {/* SKILLS YOU HAVE */}

        <h3>Skills You Have</h3>

        {matchedSkills.length === 0 ? (
          <p>
            No required skills matched yet.
          </p>
        ) : (
          <ul>

            {matchedSkills.map((skill) => (
              <li key={skill}>
                ✅ {skill}
              </li>
            ))}

          </ul>
        )}

        {/* MISSING SKILLS */}

        <h3>Missing Skills</h3>

        {missingSkills.length === 0 ? (
          <p>
            🎉 You have all the required skills
            for this role!
          </p>
        ) : (
          <div className="missing-skills-list">

            {missingSkills.map((skill) => {

              const priority =
                skillPriority[skill] || "Medium";

              return (
                <div
                  key={skill}
                  className={`missing-skill-card ${priority.toLowerCase()}`}
                >

                  <div className="missing-skill-name">
                    ⚠️ {skill}
                  </div>

                  <span className="priority-badge">
                    {priority} Priority
                  </span>

                </div>
              );
            })}

          </div>
        )}

        {/* RECOMMENDED LEARNING PATH */}

        <h3>
          Recommended Learning Path
        </h3>

        {recommendedSkills.length === 0 ? (
          <p>
            🎉 You have completed the
            recommended learning path
            for this role!
          </p>
        ) : (
          <div className="learning-path">

            {recommendedSkills.map(
              (skill, index) => (
                <div
                  className="learning-step"
                  key={skill}
                >

                  <span className="learning-number">
                    {index + 1}
                  </span>

                  <span className="learning-skill">
                    {skill}
                  </span>

                  {index <
                    recommendedSkills.length - 1 && (
                    <span className="learning-arrow">
                      →
                    </span>
                  )}

                </div>
              )
            )}

          </div>
        )}

      </div>

      {/* SKILLS LIST */}

      <div className="skills-list">

        {skills.length === 0 ? (
          <p>
            No skills added yet.
          </p>
        ) : (
          skills.map((skill) => (

            <div
              className="skill-card"
              key={skill.id}
            >

              <h3>
                {skill.name}
              </h3>

              <p>
                Category: {skill.category}
              </p>

              <p>
                Level: {skill.level}
              </p>

              <div>

                <button
                  onClick={() =>
                    startEdit(skill)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteSkill(skill.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))
        )}

      </div>

    </div>
  );
}

export default Skills;