import { useState, useEffect } from "react";
import api from "./axiosConfig";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Companies from "./components/Companies";
import Applications from "./components/Applications";
import Interviews from "./components/Interviews";
import Skills from "./components/Skills";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Register from "./components/Register";

import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("placementLoggedIn") === "true"
  );

  const [showRegister, setShowRegister] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const [applications, setApplications] = useState([
    {
      id: 1,
      company: "TCS",
      role: "Software Developer",
      status: "Applied",
      appliedDate: "2026-09-01",
      deadline: "2026-09-15",
    },
    {
      id: 2,
      company: "Infosys",
      role: "System Engineer",
      status: "Interview",
      appliedDate: "2026-08-25",
      deadline: "2026-09-20",
    },
    {
      id: 3,
      company: "Accenture",
      role: "Associate Software Engineer",
      status: "Rejected",
      appliedDate: "2026-08-20",
      deadline: "2026-08-30",
    },
  ]);

  const [interviews, setInterviews] = useState([
    {
      id: 1,
      company: "TCS",
      role: "Software Developer",
      date: "2026-09-16",
      time: "10:00 AM",
      status: "Upcoming",
    },
    {
      id: 2,
      company: "Infosys",
      role: "System Engineer",
      date: "2026-09-20",
      time: "2:00 PM",
      status: "Upcoming",
    },
  ]);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const loadData = async () => {
      try {
        const applicationsResponse = await api.get(
          "/api/applications/"
        );

        setApplications(applicationsResponse.data);
      } catch (error) {
        console.error(
          "Failed to load applications:",
          error
        );
      }

      try {
        const interviewsResponse = await api.get(
          "/api/interviews/"
        );

        setInterviews(interviewsResponse.data);
      } catch (error) {
        console.error(
          "Failed to load interviews:",
          error
        );
      }
    };

    loadData();
  }, [isLoggedIn]);

  function handleLogin() {
    localStorage.setItem("placementLoggedIn", "true");

    setIsLoggedIn(true);
    setShowRegister(false);
    setCurrentPage("dashboard");
  }

  function handleLogout() {
    localStorage.removeItem("placementLoggedIn");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setIsLoggedIn(false);
    setShowRegister(false);
    setCurrentPage("dashboard");
  }

  function handleRegisterSuccess() {
    setShowRegister(false);
  }

  function handleBackToLogin() {
    setShowRegister(false);
  }

  if (!isLoggedIn) {
    if (showRegister) {
      return (
        <Register
          onRegister={handleRegisterSuccess}
          onBackToLogin={handleBackToLogin}
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onRegister={() => setShowRegister(true)}
      />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <Dashboard
            applications={applications}
            interviews={interviews}
            setCurrentPage={setCurrentPage}
          />
        );

      case "companies":
        return (
          <Companies
            applications={applications}
            setApplications={setApplications}
            cgpa={7.8}
          />
        );

      case "applications":
        return (
          <Applications
            applications={applications}
            setApplications={setApplications}
          />
        );

      case "interviews":
        return (
          <Interviews
            interviews={interviews}
            setInterviews={setInterviews}
            applications={applications}
            setApplications={setApplications}
          />
        );

      case "skills":
        return <Skills />;

      case "profile":
        return <Profile />;

      default:
        return (
          <Dashboard
            applications={applications}
            interviews={interviews}
            setCurrentPage={setCurrentPage}
          />
        );
    }
  };

  return (
    <div className="app">
      <Navbar
        setCurrentPage={setCurrentPage}
        onLogout={handleLogout}
      />

      <div className="app-layout">
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        <main className="main-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;