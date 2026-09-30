import { useState } from "react";
import api from "../axiosConfig";

function Interviews({
  interviews,
  setInterviews,
  applications,
  setApplications,
}) {
  const [showForm, setShowForm] = useState(false);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("Upcoming");

  const [editId, setEditId] = useState(null);

  const allowedStatuses = [
    "Upcoming",
    "Completed",
    "Selected",
    "Rejected",
    "Cancelled",
  ];

  function validateInterview() {
    const trimmedCompany = company.trim();
    const trimmedRole = role.trim();

    if (!trimmedCompany) {
      alert("Please enter the company name.");
      return false;
    }

    if (trimmedCompany.length < 2) {
      alert("Company name must contain at least 2 characters.");
      return false;
    }

    if (trimmedCompany.length > 100) {
      alert("Company name cannot exceed 100 characters.");
      return false;
    }

    if (!trimmedRole) {
      alert("Please enter the job role.");
      return false;
    }

    if (trimmedRole.length < 2) {
      alert("Job role must contain at least 2 characters.");
      return false;
    }

    if (trimmedRole.length > 100) {
      alert("Job role cannot exceed 100 characters.");
      return false;
    }

    if (!date) {
      alert("Please select the interview date.");
      return false;
    }

    if (!time) {
      alert("Please select the interview time.");
      return false;
    }

    if (!allowedStatuses.includes(status)) {
      alert("Please select a valid interview status.");
      return false;
    }

    const today = new Date();
    const selectedDate = new Date(
      date + "T00:00:00"
    );

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (status === "Upcoming" && selectedDate < today) {
      alert(
        "An Upcoming interview cannot have a past date."
      );
      return false;
    }

    if (
      status === "Completed" ||
      status === "Selected" ||
      status === "Rejected" ||
      status === "Cancelled"
    ) {
      if (selectedDate > today) {
        alert(
          status +
            " interviews cannot have a future date."
        );
        return false;
      }
    }

    return true;
  }

  function getApplicationStatus(interviewStatus) {
    if (interviewStatus === "Selected") {
      return "Selected";
    }

    if (interviewStatus === "Rejected") {
      return "Rejected";
    }

    return "Interview";
  }

  function updateApplicationStatus(
    companyName,
    roleName,
    interviewStatus
  ) {
    if (!applications || !setApplications) {
      return Promise.resolve();
    }

    const matchingApplication =
      applications.find(
        (application) =>
          application.company
            ?.trim()
            .toLowerCase() ===
            companyName.trim().toLowerCase() &&
          application.role
            ?.trim()
            .toLowerCase() ===
            roleName.trim().toLowerCase()
      );

    if (!matchingApplication) {
      return Promise.resolve();
    }

    const updatedApplication = {
      company: matchingApplication.company,
      role: matchingApplication.role,
      status: getApplicationStatus(
        interviewStatus
      ),
      applied_date:
        matchingApplication.applied_date,
      deadline: matchingApplication.deadline,
    };

    return api
      .put(
        `/api/applications/${matchingApplication.id}/`,
        updatedApplication
      )
      .then((response) => {
        setApplications(
          (currentApplications) =>
            currentApplications.map(
              (application) =>
                application.id ===
                matchingApplication.id
                  ? response.data
                  : application
            )
        );
      })
      .catch((error) => {
        console.log(
          "APPLICATION STATUS UPDATE ERROR:",
          error.response?.data || error
        );
      });
  }

  function addInterview() {
    if (!validateInterview()) {
      return;
    }

    const newInterview = {
      company: company.trim(),
      role: role.trim(),
      date,
      time,
      status,
    };

    api
      .post("/api/interviews/", newInterview)
      .then((response) => {
        setInterviews(
          (currentInterviews) => [
            ...currentInterviews,
            response.data,
          ]
        );

        return updateApplicationStatus(
          company,
          role,
          status
        );
      })
      .then(() => {
        clearForm();
      })
      .catch((error) => {
        console.log(
          "ADD INTERVIEW ERROR:",
          error.response?.data || error
        );

        alert("Could not add interview.");
      });
  }

  function startEdit(interview) {
    setCompany(interview.company || "");
    setRole(interview.role || "");
    setDate(interview.date || "");
    setTime(interview.time || "");
    setStatus(interview.status || "Upcoming");

    setEditId(interview.id);
    setShowForm(true);
  }

  function saveEdit() {
    if (!validateInterview()) {
      return;
    }

    const interview = interviews.find(
      (item) => item.id === editId
    );

    if (!interview) {
      alert("Interview not found.");
      return;
    }

    const updatedInterview = {
      company: company.trim(),
      role: role.trim(),
      date,
      time,
      status,
    };

    api
      .put(
        `/api/interviews/${interview.id}/`,
        updatedInterview
      )
      .then((response) => {
        setInterviews(
          (currentInterviews) =>
            currentInterviews.map(
              (item) =>
                item.id === interview.id
                  ? response.data
                  : item
            )
        );

        return updateApplicationStatus(
          company,
          role,
          status
        );
      })
      .then(() => {
        clearForm();
      })
      .catch((error) => {
        console.log(
          "EDIT INTERVIEW ERROR:",
          error.response?.data || error
        );

        alert("Could not update interview.");
      });
  }

  function deleteInterview(interview) {
    const confirmed = window.confirm(
      `Are you sure you want to delete the ${interview.company} interview?`
    );

    if (!confirmed) {
      return;
    }

    api
      .delete(`/api/interviews/${interview.id}/`)
      .then(() => {
        setInterviews(
          (currentInterviews) =>
            currentInterviews.filter(
              (item) => item.id !== interview.id
            )
        );
      })
      .catch((error) => {
        console.log(
          "DELETE INTERVIEW ERROR:",
          error.response?.data || error
        );

        alert("Could not delete interview.");
      });
  }

  function clearForm() {
    setCompany("");
    setRole("");
    setDate("");
    setTime("");
    setStatus("Upcoming");
    setEditId(null);
    setShowForm(false);
  }

  function openAddForm() {
    setCompany("");
    setRole("");
    setDate("");
    setTime("");
    setStatus("Upcoming");
    setEditId(null);
    setShowForm(true);
  }

  function getInterviewTiming(interviewDate) {
    const today = new Date();
    const dateObject = new Date(interviewDate);

    today.setHours(0, 0, 0, 0);
    dateObject.setHours(0, 0, 0, 0);

    const difference =
      dateObject.getTime() - today.getTime();

    const days = Math.round(
      difference / (1000 * 60 * 60 * 24)
    );

    if (days === 0) {
      return "🔴 Today";
    }

    if (days === 1) {
      return "🟠 Tomorrow";
    }

    if (days > 1) {
      return "🟡 Upcoming";
    }

    return "⚪ Past";
  }

  function getStatusIcon(interviewStatus) {
    if (interviewStatus === "Upcoming") {
      return "🟡";
    }

    if (interviewStatus === "Completed") {
      return "🔵";
    }

    if (interviewStatus === "Selected") {
      return "🟢";
    }

    if (interviewStatus === "Rejected") {
      return "🔴";
    }

    if (interviewStatus === "Cancelled") {
      return "⚪";
    }

    return "⚫";
  }

  return (
    <div>
      <div className="page-header">
        <h1>Interviews</h1>

        <button onClick={openAddForm}>
          Add Interview
        </button>
      </div>

      {showForm && (
        <div className="application-form">
          <h2>
            {editId === null
              ? "Add New Interview"
              : "Edit Interview"}
          </h2>

          <input
            type="text"
            placeholder="Company name"
            value={company}
            maxLength="100"
            onChange={(e) =>
              setCompany(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Job role"
            value={role}
            maxLength="100"
            onChange={(e) =>
              setRole(e.target.value)
            }
          />

          <label>Interview Date</label>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
          />

          <label>Interview Time</label>

          <input
            type="time"
            value={time}
            onChange={(e) =>
              setTime(e.target.value)
            }
          />

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option>Upcoming</option>
            <option>Completed</option>
            <option>Selected</option>
            <option>Rejected</option>
            <option>Cancelled</option>
          </select>

          <div className="application-form-actions">
            <button onClick={clearForm}>
              Cancel
            </button>

            {editId === null ? (
              <button onClick={addInterview}>
                Add Interview
              </button>
            ) : (
              <button onClick={saveEdit}>
                Save Changes
              </button>
            )}
          </div>
        </div>
      )}

      {interviews.length === 0 ? (
        <p>No interviews scheduled yet.</p>
      ) : (
        <div className="application-list">
          {interviews.map((interview) => (
            <div
              className="application-card"
              key={interview.id}
            >
              <div className="application-info">
                <h3>{interview.company}</h3>

                <p>
                  Role: {interview.role}
                </p>

                <p>
                  Date: {interview.date}
                </p>

                <p>
                  Time: {interview.time}
                </p>

                <p>
                  Status:{" "}
                  {getStatusIcon(
                    interview.status
                  )}{" "}
                  {interview.status}
                </p>

                <p>
                  Interview:{" "}
                  {getInterviewTiming(
                    interview.date
                  )}
                </p>
              </div>

              <div className="application-actions">
                <button
                  onClick={() =>
                    startEdit(interview)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteInterview(interview)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Interviews;