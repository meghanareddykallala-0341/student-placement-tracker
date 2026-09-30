import { useEffect, useState } from "react";
import api from "../axiosConfig";

function Companies({ setApplications, applications, cgpa }) {
  const companies = [
    {
      name: "TCS",
      role: "Software Developer",
      package: "7 LPA",
      eligibility: 7.0,
      location: "Hyderabad",
      workMode: "Hybrid",
      experience: "Fresher",
      deadline: "2026-09-15",
    },
    {
      name: "Infosys",
      role: "System Engineer",
      package: "6.5 LPA",
      eligibility: 6.5,
      location: "Hyderabad",
      workMode: "On-site",
      experience: "Fresher",
      deadline: "2026-09-20",
    },
    {
      name: "Accenture",
      role: "Associate Software Engineer",
      package: "6 LPA",
      eligibility: 6.5,
      location: "Hyderabad",
      workMode: "Hybrid",
      experience: "Fresher",
      deadline: "2026-09-25",
    },
    {
      name: "Cognizant",
      role: "Programmer Analyst",
      package: "6.75 LPA",
      eligibility: 6.5,
      location: "Hyderabad",
      workMode: "Hybrid",
      experience: "Fresher",
      deadline: "2026-09-28",
    },
    {
      name: "Wipro",
      role: "Project Engineer",
      package: "5.5 LPA",
      eligibility: 6.0,
      location: "Hyderabad",
      workMode: "On-site",
      experience: "Fresher",
      deadline: "2026-09-30",
    },
    {
      name: "Capgemini",
      role: "Software Engineer",
      package: "6 LPA",
      eligibility: 6.5,
      location: "Hyderabad",
      workMode: "Hybrid",
      experience: "Fresher",
      deadline: "2026-10-05",
    },
    {
      name: "HCLTech",
      role: "Graduate Engineer Trainee",
      package: "5.75 LPA",
      eligibility: 6.0,
      location: "Hyderabad",
      workMode: "On-site",
      experience: "Fresher",
      deadline: "2026-10-10",
    },
    {
      name: "Tech Mahindra",
      role: "Software Engineer",
      package: "5.5 LPA",
      eligibility: 6.0,
      location: "Hyderabad",
      workMode: "Hybrid",
      experience: "Fresher",
      deadline: "2026-10-15",
    },
  ];

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // CGPA from Django Profile
  const [profileCgpa, setProfileCgpa] = useState("");

  /* =========================
     LOAD CGPA FROM PROFILE API
     ========================= */

  useEffect(() => {
    api
      .get("/api/profile/")
      .then((response) => {
        const profiles = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];

        if (profiles.length > 0) {
          const savedCgpa = profiles[0].cgpa;

          if (
            savedCgpa !== null &&
            savedCgpa !== undefined &&
            savedCgpa !== ""
          ) {
            setProfileCgpa(String(savedCgpa));
          }
        }
      })
      .catch((error) => {
        console.log("PROFILE CGPA ERROR:", error);
      });
  }, []);

  /*
    Profile API is the main source.

    The cgpa prop is only used as a fallback
    if the profile has not been created yet.
  */
  const currentCgpa =
    profileCgpa !== ""
      ? profileCgpa
      : cgpa;

  /* =========================
     APPLY TO COMPANY
     ========================= */

  function applyToCompany(company) {
    const alreadyApplied = applications.some(
      (application) =>
        application.company?.trim().toLowerCase() ===
          company.name.trim().toLowerCase() &&
        application.role?.trim().toLowerCase() ===
          company.role.trim().toLowerCase()
    );

    if (alreadyApplied) {
      alert(
        "You have already applied to " +
          company.name
      );
      return;
    }

    const newApplication = {
      company: company.name,
      role: company.role,
      status: "Applied",
      applied_date: new Date()
        .toISOString()
        .split("T")[0],
      deadline: company.deadline,
    };

    api
      .post(
        "/api/applications/",
        newApplication
      )
      .then((response) => {
        setApplications(
          (prevApplications) => [
            ...prevApplications,
            response.data,
          ]
        );

        alert(
          "Applied to " +
            company.name
        );
      })
      .catch((error) => {
        console.log(
          "COMPANY APPLY ERROR:",
          error
        );

        if (
          error.response?.status === 401
        ) {
          alert(
            "Session expired. Please login again."
          );
        } else {
          alert(
            "Could not apply to " +
              company.name
          );
        }
      });
  }

  /* =========================
     FILTER COMPANIES
     ========================= */

  const filteredCompanies =
    companies.filter((company) => {
      const isEligible =
        Number(currentCgpa) >=
        company.eligibility;

      const matchesSearch =
        company.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        company.role
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesFilter =
        filter === "All" ||
        (filter === "Eligible" &&
          isEligible) ||
        (filter === "Not Eligible" &&
          !isEligible);

      return (
        matchesSearch &&
        matchesFilter
      );
    });

  return (
    <div className="companies-page">

      {/* PAGE HEADER */}

      <div className="page-header">
        <div>
          <h1>Companies</h1>

          <p className="page-subtitle">
            Explore companies and find
            opportunities that match your
            profile.
          </p>
        </div>
      </div>

      {/* CGPA INFO */}

      <div className="cgpa-banner">

        <div>
          <span className="cgpa-label">
            Your CGPA
          </span>

          <strong>
            {currentCgpa ||
              "Not added"}
          </strong>
        </div>

        <div className="cgpa-info">
          Companies are automatically
          filtered based on your eligibility.
        </div>

      </div>

      {/* SEARCH + FILTER */}

      <div className="search-filter">

        <input
          type="text"
          placeholder="Search company or role..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
        >
          <option value="All">
            All Companies
          </option>

          <option value="Eligible">
            Eligible
          </option>

          <option value="Not Eligible">
            Not Eligible
          </option>
        </select>

      </div>

      {/* COMPANY COUNT */}

      <div className="company-result-header">

        <h2>
          Available Companies
        </h2>

        <span>
          {filteredCompanies.length}{" "}
          companies
        </span>

      </div>

      {/* COMPANY GRID */}

      <div className="company-list">

        {filteredCompanies.map(
          (company) => {

            const isEligible =
              Number(currentCgpa) >=
              company.eligibility;

            const isApplied =
              applications.some(
                (application) =>
                  application.company
                    ?.trim()
                    .toLowerCase() ===
                    company.name
                      .trim()
                      .toLowerCase() &&
                  application.role
                    ?.trim()
                    .toLowerCase() ===
                    company.role
                      .trim()
                      .toLowerCase()
              );

            return (
              <div
                className="company-card"
                key={company.name}
              >

                {/* COMPANY HEADER */}

                <div className="company-card-header">

                  <div className="company-logo">
                    {company.name.charAt(0)}
                  </div>

                  <div>
                    <h2>
                      {company.name}
                    </h2>

                    <p>
                      {company.role}
                    </p>
                  </div>

                </div>

                {/* PACKAGE */}

                <div className="company-package">

                  <span>
                    Package
                  </span>

                  <strong>
                    {company.package}
                  </strong>

                </div>

                {/* COMPANY DETAILS */}

                <div className="company-details">

                  <div>
                    <span>
                      📍 Location
                    </span>

                    <strong>
                      {company.location}
                    </strong>
                  </div>

                  <div>
                    <span>
                      💼 Work Mode
                    </span>

                    <strong>
                      {company.workMode}
                    </strong>
                  </div>

                  <div>
                    <span>
                      👤 Experience
                    </span>

                    <strong>
                      {company.experience}
                    </strong>
                  </div>

                  <div>
                    <span>
                      🎓 Required CGPA
                    </span>

                    <strong>
                      {company.eligibility}
                    </strong>
                  </div>

                </div>

                {/* DEADLINE */}

                <div className="company-deadline">

                  <span>
                    Application Deadline
                  </span>

                  <strong>
                    {company.deadline}
                  </strong>

                </div>

                {/* ELIGIBILITY */}

                <div
                  className={
                    isEligible
                      ? "eligibility eligible"
                      : "eligibility not-eligible"
                  }
                >

                  {isEligible ? (
                    <>
                      <strong>
                        ✓ Eligible
                      </strong>

                      <span>
                        Your CGPA meets the
                        requirement.
                      </span>
                    </>
                  ) : (
                    <>
                      <strong>
                        ✕ Not Eligible
                      </strong>

                      <span>
                        You need at least{" "}
                        {company.eligibility}{" "}
                        CGPA.
                      </span>
                    </>
                  )}

                </div>

                {/* APPLY BUTTON */}

                <button
                  className={
                    isApplied
                      ? "apply-button applied"
                      : "apply-button"
                  }
                  onClick={() =>
                    applyToCompany(company)
                  }
                  disabled={
                    !isEligible ||
                    isApplied
                  }
                >
                  {!isEligible
                    ? "Not Eligible"
                    : isApplied
                    ? "Applied ✓"
                    : "Apply Now"}
                </button>

              </div>
            );
          }
        )}

      </div>

      {/* EMPTY STATE */}

      {filteredCompanies.length === 0 && (
        <div className="empty-message">

          <h3>
            No companies found
          </h3>

          <p>
            Try changing your search or
            eligibility filter.
          </p>

        </div>
      )}

    </div>
  );
}

export default Companies;