import { useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function Dashboard({ applications, interviews }) {
  const totalApplications = applications.length;

  // FIX:
  // Dashboard Interviews should come from the actual interviews list
  const interviewsCount = interviews.length;

  const shortlistedCount = applications.filter(
    (application) => application.status === "Shortlisted"
  ).length;

  const selectedCount = applications.filter(
    (application) => application.status === "Selected"
  ).length;

  const rejectedCount = applications.filter(
    (application) => application.status === "Rejected"
  ).length;

  /* =========================
     PERFORMANCE
  ========================= */

  const successRate =
    totalApplications > 0
      ? Math.round((selectedCount / totalApplications) * 100)
      : 0;

  const interviewRate =
    totalApplications > 0
      ? Math.round((interviewsCount / totalApplications) * 100)
      : 0;

  const rejectionRate =
    totalApplications > 0
      ? Math.round((rejectedCount / totalApplications) * 100)
      : 0;

  /* =========================
     PLACEMENT READINESS
  ========================= */

  const applicationScore =
    Math.min(totalApplications, 5) * 5;

  const interviewScore =
    Math.min(interviewsCount, 3) * 8.33;

  const shortlistedScore =
    Math.min(shortlistedCount, 3) * 6.67;

  const selectedScore =
    selectedCount > 0 ? 20 : 0;

  const performanceScore =
    rejectedCount === 0
      ? 10
      : Math.max(0, 10 - rejectedCount * 2);

  const readinessScore = Math.min(
    100,
    Math.round(
      applicationScore +
        interviewScore +
        shortlistedScore +
        selectedScore +
        performanceScore
    )
  );

  /* =========================
     APPLICATION STATUS
  ========================= */

  const statusData = [
    {
      name: "Applied",
      value: applications.filter(
        (application) =>
          application.status === "Applied"
      ).length,
    },
    {
      name: "Shortlisted",
      value: shortlistedCount,
    },
    {
      name: "Interview",
      value: interviewsCount,
    },
    {
      name: "Selected",
      value: selectedCount,
    },
    {
      name: "Rejected",
      value: rejectedCount,
    },
  ].filter((item) => item.value > 0);

  /* =========================
     PIE CHART COLORS
  ========================= */

  const COLORS = {
    Applied: "#6366f1",
    Shortlisted: "#8b5cf6",
    Interview: "#0ea5e9",
    Selected: "#22c55e",
    Rejected: "#ef4444",
  };

  /* =========================
     APPLICATION DEADLINES
  ========================= */

  const sortedApplications = [...applications]
    .filter((application) => application.deadline)
    .sort(
      (a, b) =>
        new Date(a.deadline) -
        new Date(b.deadline)
    );

  const upcomingDeadlines =
    sortedApplications.slice(0, 5);

  function getDeadlineStatus(deadline) {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const deadlineDate = new Date(deadline);

    deadlineDate.setHours(0, 0, 0, 0);

    const difference =
      deadlineDate.getTime() -
      today.getTime();

    const days = Math.round(
      difference /
        (1000 * 60 * 60 * 24)
    );

    if (days < 0) return "Overdue";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";

    return "Upcoming";
  }

  function formatDate(date) {
    if (!date) return "";

    const [year, month, day] =
      date.split("-");

    return `${Number(day)}/${Number(month)}/${year}`;
  }

  /* =========================
     UPCOMING INTERVIEWS
  ========================= */

  const upcomingInterviews = [...interviews]
    .filter(
      (interview) =>
        interview.status === "Upcoming"
    )
    .sort(
      (a, b) =>
        new Date(a.date) -
        new Date(b.date)
    )
    .slice(0, 5);

  function getInterviewTiming(date) {
    const today = new Date();

    const interviewDate = new Date(date);

    today.setHours(0, 0, 0, 0);

    interviewDate.setHours(0, 0, 0, 0);

    const difference =
      interviewDate.getTime() -
      today.getTime();

    const days = Math.round(
      difference /
        (1000 * 60 * 60 * 24)
    );

    if (days < 0) return "Past";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";

    return "Upcoming";
  }

  /* =========================
     NOTIFICATION PERMISSION
  ========================= */

  useEffect(() => {
    if (
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }
  }, []);

  /* =========================
     NOTIFICATIONS
  ========================= */

  useEffect(() => {
    if (
      !("Notification" in window) ||
      Notification.permission !== "granted"
    ) {
      return;
    }

    const notificationKey =
      "placementNotifications";

    const alreadyShown = JSON.parse(
      localStorage.getItem(
        notificationKey
      ) || "[]"
    );

    upcomingDeadlines.forEach(
      (application) => {
        const status =
          getDeadlineStatus(
            application.deadline
          );

        if (
          status === "Today" ||
          status === "Tomorrow"
        ) {
          const notificationId =
            `deadline-${application.company}-${application.deadline}`;

          if (
            !alreadyShown.includes(
              notificationId
            )
          ) {
            new Notification(
              `${application.company} deadline`,
              {
                body: `${application.role} application deadline is ${status.toLowerCase()}.`,
              }
            );

            alreadyShown.push(
              notificationId
            );
          }
        }
      }
    );

    upcomingInterviews.forEach(
      (interview) => {
        const timing =
          getInterviewTiming(
            interview.date
          );

        if (
          timing === "Today" ||
          timing === "Tomorrow"
        ) {
          const notificationId =
            `interview-${interview.company}-${interview.date}`;

          if (
            !alreadyShown.includes(
              notificationId
            )
          ) {
            new Notification(
              `${interview.company} interview`,
              {
                body: `${interview.role} interview is ${timing.toLowerCase()}.`,
              }
            );

            alreadyShown.push(
              notificationId
            );
          }
        }
      }
    );

    localStorage.setItem(
      notificationKey,
      JSON.stringify(
        alreadyShown
      )
    );
  }, [applications, interviews]);

  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <div className="page-header">
        <div>
          <p className="section-label">
            PLACEMENT OVERVIEW
          </p>

          <h1>Dashboard</h1>

          <p className="dashboard-subtitle">
            Track your placement journey and
            stay prepared.
          </p>
        </div>
      </div>

      {/* STAT CARDS */}

      <div className="dashboard-grid">

        <div className="dashboard-card">
          <h3>Total Applications</h3>
          <p>{totalApplications}</p>
        </div>

        <div className="dashboard-card">
          <h3>Interviews</h3>
          <p>{interviewsCount}</p>
        </div>

        <div className="dashboard-card">
          <h3>Selected</h3>
          <p>{selectedCount}</p>
        </div>

        <div className="dashboard-card">
          <h3>Rejected</h3>
          <p>{rejectedCount}</p>
        </div>

      </div>

      {/* PLACEMENT FUNNEL */}

      <div className="dashboard-section placement-funnel">

        <div className="funnel-header">
          <div>
            <h2>Placement Funnel</h2>

            <p>
              Track your progress through each stage
            </p>
          </div>
        </div>

        <div className="funnel-container">

          <div className="funnel-step">
            <div className="funnel-number">
              {totalApplications}
            </div>

            <strong>Applications</strong>

            <span>
              Jobs applied for
            </span>
          </div>

          <div className="funnel-arrow">
            →
          </div>

          <div className="funnel-step">
            <div className="funnel-number">
              {shortlistedCount}
            </div>

            <strong>Shortlisted</strong>

            <span>
              Applications shortlisted
            </span>
          </div>

          <div className="funnel-arrow">
            →
          </div>

          <div className="funnel-step">
            <div className="funnel-number">
              {interviewsCount}
            </div>

            <strong>Interviews</strong>

            <span>
              Interview opportunities
            </span>
          </div>

          <div className="funnel-arrow">
            →
          </div>

          <div className="funnel-step">
            <div className="funnel-number">
              {selectedCount}
            </div>

            <strong>Selected</strong>

            <span>
              Successful applications
            </span>
          </div>

        </div>
      </div>

      {/* APPLICATION DEADLINES */}

      <div className="dashboard-section">

        <div className="section-title-block">

          <h2>
            Application Deadlines
          </h2>

          <p>
            Never miss an application deadline
          </p>

        </div>

        {upcomingDeadlines.length === 0 ? (

          <div className="empty-message">
            No application deadlines available.
          </div>

        ) : (

          <div className="deadline-list">

            {upcomingDeadlines.map(
              (application) => {

                const deadlineStatus =
                  getDeadlineStatus(
                    application.deadline
                  );

                return (
                  <div
                    className="deadline-item"
                    key={application.id}
                  >

                    <div className="deadline-main">

                      <strong>
                        {application.company}
                      </strong>

                      <p>
                        {application.role}
                      </p>

                    </div>

                    <div className="deadline-right">

                      <span className="deadline-date">
                        Deadline:{" "}
                        {formatDate(
                          application.deadline
                        )}
                      </span>

                      <span
                        className={`deadline-status ${deadlineStatus
                          .toLowerCase()
                          .replace(
                            " ",
                            "-"
                          )}`}
                      >
                        {deadlineStatus}
                      </span>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        )}

      </div>

      {/* UPCOMING INTERVIEWS */}

      <div className="dashboard-section">

        <div className="section-title-block">

          <h2>
            Upcoming Interviews
          </h2>

          <p>
            Prepare for your next opportunity
          </p>

        </div>

        {upcomingInterviews.length === 0 ? (

          <div className="empty-message">
            No upcoming interviews.
          </div>

        ) : (

          <div className="interview-list">

            {upcomingInterviews.map(
              (interview) => (

                <div
                  className="interview-item"
                  key={interview.id}
                >

                  <div className="interview-main">

                    <strong>
                      {interview.company}
                    </strong>

                    <p>
                      {interview.role}
                    </p>

                  </div>

                  <div className="interview-right">

                    <strong>
                      Date:{" "}
                      {formatDate(
                        interview.date
                      )}
                    </strong>

                    <span className="interview-time">
                      Time: {interview.time}
                    </span>

                    <span className="interview-status">
                      {getInterviewTiming(
                        interview.date
                      )}
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

      {/* PERFORMANCE OVERVIEW */}

      <div className="dashboard-section performance-section">

        <div className="section-title-block">

          <h2>
            Performance Overview
          </h2>

          <p>
            Understand how your applications
            are progressing
          </p>

        </div>

        <div className="performance-grid">

          <div className="performance-item">

            <span>
              Success Rate
            </span>

            <strong>
              {successRate}%
            </strong>

          </div>

          <div className="performance-item">

            <span>
              Interview Rate
            </span>

            <strong>
              {interviewRate}%
            </strong>

          </div>

          <div className="performance-item">

            <span>
              Rejection Rate
            </span>

            <strong>
              {rejectionRate}%
            </strong>

          </div>

        </div>

      </div>

      {/* PLACEMENT READINESS */}

      <div className="dashboard-section readiness-section">

        <div className="section-title-block">

          <h2>
            Placement Readiness
          </h2>

          <p>
            Your current placement
            preparation score
          </p>

        </div>

        <div className="readiness-layout">

          <div className="readiness-score">

            <strong>
              {readinessScore}%
            </strong>

            <span>
              Current readiness
            </span>

          </div>

          <div className="readiness-details">

            <div>
              <span>
                Applications
              </span>

              <strong>
                {Math.round(
                  applicationScore
                )}/25
              </strong>
            </div>

            <div>
              <span>
                Interviews
              </span>

              <strong>
                {Math.round(
                  interviewScore
                )}/25
              </strong>
            </div>

            <div>
              <span>
                Shortlisted
              </span>

              <strong>
                {Math.round(
                  shortlistedScore
                )}/20
              </strong>
            </div>

            <div>
              <span>
                Selected
              </span>

              <strong>
                {selectedScore}/20
              </strong>
            </div>

            <div>
              <span>
                Performance
              </span>

              <strong>
                {performanceScore}/10
              </strong>
            </div>

          </div>

        </div>

      </div>

      {/* APPLICATION STATUS */}

      <div className="dashboard-section application-status-section">

        <div className="section-title-block">

          <h2>
            Application Status
          </h2>

          <p>
            Your applications by current status
          </p>

        </div>

        {statusData.length === 0 ? (

          <div className="empty-message">
            No application data available yet.
          </div>

        ) : (

          <div className="status-chart">

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <PieChart>

                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={115}
                  paddingAngle={3}
                  dataKey="value"
                >

                  {statusData.map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          COLORS[entry.name]
                        }
                      />
                    )
                  )}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        )}

      </div>

    </div>
  );
}

export default Dashboard;