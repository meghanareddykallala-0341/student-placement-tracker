function Sidebar({ currentPage, setCurrentPage }) {
  return (
    <aside>
      <h3>Placement Tracker</h3>

      <ul>
        <li
          className={currentPage === "dashboard" ? "active" : ""}
          onClick={() => setCurrentPage("dashboard")}
        >
          Dashboard
        </li>

        <li
          className={currentPage === "companies" ? "active" : ""}
          onClick={() => setCurrentPage("companies")}
        >
          Companies
        </li>

        <li
          className={currentPage === "applications" ? "active" : ""}
          onClick={() => setCurrentPage("applications")}
        >
          Applications
        </li>

        <li
          className={currentPage === "interviews" ? "active" : ""}
          onClick={() => setCurrentPage("interviews")}
        >
          Interviews
        </li>

        <li
          className={currentPage === "skills" ? "active" : ""}
          onClick={() => setCurrentPage("skills")}
        >
          Skills
        </li>

        <li
          className={currentPage === "profile" ? "active" : ""}
          onClick={() => setCurrentPage("profile")}
        >
          Profile
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;