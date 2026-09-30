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

  function deleteSkill(id) {
    if (!window.confirm("Are you sure you want to delete this skill?")) {
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

  function cancelEdit() {
    clearForm();
  }

  function clearForm() {
    setSkillName("");
    setCategory("Programming");
    setLevel("Beginner");
    setEditingSkillId(null);
  }

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
  };

  const requiredSkills = roleSkills[targetRole];

  const userSkillNames = skills.map(
    (skill) =>
      skill.name.trim().toLowerCase()
  );

  const missingSkills = requiredSkills.filter(
    (skill) =>
      !userSkillNames.includes(
        skill.toLowerCase()
      )
  );

  const matchedSkills = requiredSkills.filter(
    (skill) =>
      userSkillNames.includes(
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

  return (
    <div>
      <h1>Skills</h1>

      {/* PLACEMENT READINESS */}
      <div className="skill-summary">
        <h2>Placement Readiness</h2>

        <p>{readinessScore}%</p>

        <p>
          Beginner: {beginnerSkills} | Intermediate:{" "}
          {intermediateSkills} | Advanced:{" "}
          {advancedSkills}
        </p>
      </div>

      {/* ADD / EDIT SKILL FORM */}
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
          <option>Programming</option>
          <option>Web Development</option>
          <option>Database</option>
          <option>CS Fundamentals</option>
          <option>Tools</option>
        </select>

        <select
          value={level}
          onChange={(e) =>
            setLevel(e.target.value)
          }
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        {editingSkillId !== null ? (
          <>
            <button onClick={updateSkill}>
              Update Skill
            </button>

            <button onClick={cancelEdit}>
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

        <p>Select your target role:</p>

        <select
          value={targetRole}
          onChange={(e) =>
            setTargetRole(e.target.value)
          }
        >
          <option>
            Python Full Stack Developer
          </option>

          <option>
            Java Full Stack Developer
          </option>

          <option>
            Software Developer
          </option>
        </select>

        <h3>Skill Match</h3>

        <p>
          {matchedSkills.length} /{" "}
          {requiredSkills.length} skills matched (
          {skillMatchPercentage}%)
        </p>

        <h3>Required Skills</h3>

        <p>
          {requiredSkills.join(" • ")}
        </p>

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

        <h3>Missing Skills</h3>

        {missingSkills.length === 0 ? (
          <p>
            🎉 You have all the required skills
            for this role!
          </p>
        ) : (
          <ul>
            {missingSkills.map((skill) => (
              <li key={skill}>
                ⚠️ {skill}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* SKILLS LIST */}
      <div className="skills-list">
        {skills.length === 0 ? (
          <p>No skills added yet.</p>
        ) : (
          skills.map((skill) => (
            <div
              className="skill-card"
              key={skill.id}
            >
              <h3>{skill.name}</h3>

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