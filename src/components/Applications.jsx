import { useState } from "react";
import ApplicationCard from "./ApplicationCard";
import api from "../axiosConfig";

function Applications({ applications, setApplications }) {
  const [showForm, setShowForm] = useState(false);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [appliedDate, setAppliedDate] = useState("");
  const [deadline, setDeadline] = useState("");

  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const allowedStatuses = [
    "Applied",
    "Shortlisted",
    "Interview",
    "Selected",
    "Rejected",
  ];

  function validateApplication() {
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

    if (!appliedDate) {
      alert("Please select the applied date.");
      return false;
    }

    if (!allowedStatuses.includes(status)) {
      alert("Please select a valid application status.");
      return false;
    }

    if (deadline && deadline < appliedDate) {
      alert("Application deadline cannot be before the applied date.");
      return false;
    }

    return true;
  }

  function addApplication() {
    if (!validateApplication()) {
      return;
    }

    const newApplication = {
      company: company.trim(),
      role: role.trim(),
      status,
      applied_date: appliedDate,
      deadline: deadline || null,
    };

    api
      .post("/api/applications/", newApplication)
      .then((response) => {
        setApplications((currentApplications) => [
          ...currentApplications,
          response.data,
        ]);

        clearForm();
      })
      .catch((error) => {
        console.log("ADD APPLICATION ERROR:", error);
        alert("Could not add application.");
      });
  }

  function startEdit(application) {
    setCompany(application.company || "");
    setRole(application.role || "");
    setStatus(application.status || "Applied");
    setAppliedDate(application.applied_date || "");
    setDeadline(application.deadline || "");

    setEditId(application.id);
    setShowForm(true);
  }

  function saveEdit() {
    if (!validateApplication()) {
      return;
    }

    const application = applications.find(
      (item) => item.id === editId
    );

    if (!application) {
      alert("Application not found.");
      return;
    }

    const updatedApplication = {
      company: company.trim(),
      role: role.trim(),
      status,
      applied_date: appliedDate,
      deadline: deadline || null,
    };

    api
      .put(
        `/api/applications/${application.id}/`,
        updatedApplication
      )
      .then((response) => {
        setApplications((currentApplications) =>
          currentApplications.map((item) =>
            item.id === application.id
              ? response.data
              : item
          )
        );

        clearForm();
      })
      .catch((error) => {
        console.log(
          "EDIT APPLICATION ERROR:",
          error.response?.data || error
        );

        alert("Could not update application.");
      });
  }

  function deleteApplication(application) {
    const confirmed = window.confirm(
      `Are you sure you want to delete the ${application.company} application?`
    );

    if (!confirmed) {
      return;
    }

    api
      .delete(`/api/applications/${application.id}/`)
      .then(() => {
        setApplications((currentApplications) =>
          currentApplications.filter(
            (item) => item.id !== application.id
          )
        );
      })
      .catch((error) => {
        console.log(
          "DELETE APPLICATION ERROR:",
          error.response?.data || error
        );

        alert("Could not delete application.");
      });
  }

  function clearForm() {
    setCompany("");
    setRole("");
    setStatus("Applied");
    setAppliedDate("");
    setDeadline("");
    setEditId(null);
    setShowForm(false);
  }

  function openAddForm() {
    setCompany("");
    setRole("");
    setStatus("Applied");
    setAppliedDate("");
    setDeadline("");
    setEditId(null);
    setShowForm(true);
  }

  const filteredApplications = applications.filter(
    (application) => {
      const companyName =
        application.company?.toLowerCase() || "";

      const roleName =
        application.role?.toLowerCase() || "";

      const searchText = search.toLowerCase();

      const matchesSearch =
        companyName.includes(searchText) ||
        roleName.includes(searchText);

      const matchesStatus =
        filterStatus === "All" ||
        application.status === filterStatus;

      return matchesSearch && matchesStatus;
    }
  );

  return (
    <div>
      <div className="page-header">
        <h1>Applications</h1>

        <button onClick={openAddForm}>
          Add Application
        </button>
      </div>

      <div className="search-filter">
        <input
          type="text"
          placeholder="Search company or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value)
          }
        >
          <option value="All">All</option>
          <option value="Applied">Applied</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Interview">Interview</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {showForm && (
        <div className="application-form">
          <h2>
            {editId === null
              ? "Add New Application"
              : "Edit Application"}
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

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option>Applied</option>
            <option>Shortlisted</option>
            <option>Interview</option>
            <option>Selected</option>
            <option>Rejected</option>
          </select>

          <label>Applied Date</label>

          <input
            type="date"
            value={appliedDate}
            onChange={(e) =>
              setAppliedDate(e.target.value)
            }
          />

          <label>Application Deadline</label>

          <input
            type="date"
            value={deadline}
            onChange={(e) =>
              setDeadline(e.target.value)
            }
          />

          <div className="application-form-actions">
            <button onClick={clearForm}>
              Cancel
            </button>

            {editId === null ? (
              <button onClick={addApplication}>
                Add
              </button>
            ) : (
              <button onClick={saveEdit}>
                Save Changes
              </button>
            )}
          </div>
        </div>
      )}

      <div className="application-list">
        {filteredApplications.map(
          (application) => (
            <ApplicationCard
              key={application.id}
              company={application.company}
              role={application.role}
              status={application.status}
              appliedDate={application.applied_date}
              deadline={application.deadline}
              onEdit={() =>
                startEdit(application)
              }
              onDelete={() =>
                deleteApplication(application)
              }
            />
          )
        )}
      </div>

      {filteredApplications.length === 0 && (
        <p>No applications found.</p>
      )}
    </div>
  );
}

export default Applications;