import { useEffect, useState } from "react";
import api from "../axiosConfig";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [resume, setResume] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeUploading, setResumeUploading] = useState(false);

  const emptyProfile = {
    name: "",
    email: "",
    phone: "",
    location: "",
    college: "",
    degree: "",
    cgpa: "",
    graduation_year: "",
  };

  const [profile, setProfile] = useState(emptyProfile);
  const [formData, setFormData] = useState(emptyProfile);
  const [errors, setErrors] = useState({});

  /* =========================
     LOAD PROFILE
     ========================= */

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const response = await api.get("/api/profile/");

      const profiles = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      if (profiles.length > 0) {
        const data = profiles[0];

        const loadedProfile = {
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          college: data.college || "",
          degree: data.degree || "",
          cgpa:
            data.cgpa !== null &&
            data.cgpa !== undefined
              ? String(data.cgpa)
              : "",
          graduation_year:
            data.graduation_year !== null &&
            data.graduation_year !== undefined
              ? String(data.graduation_year)
              : "",
        };

        setProfileId(data.id);
        setProfile(loadedProfile);
        setFormData(loadedProfile);

        if (data.resume) {
          if (data.resume.startsWith("http")) {
            setResumeUrl(data.resume);
          } else {
            setResumeUrl(
              `http://127.0.0.1:8000${data.resume}`
            );
          }
        }
      }
    } catch (error) {
      console.log(
        "GET PROFILE ERROR:",
        error.response?.data || error
      );

      alert("Could not load profile.");
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     FORM CHANGE
     ========================= */

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: "",
      }));
    }
  }

  /* =========================
     VALIDATION
     ========================= */
     
     function validateForm() {
       const newErrors = {};
     
       const name = formData.name.trim();
     
       if (!name) {
         newErrors.name = "Name is required.";
       } else if (!/^[A-Za-z ]+$/.test(name)) {
         newErrors.name =
           "Name can contain only letters and spaces.";
       } else if (name.length < 2) {
         newErrors.name =
           "Name must contain at least 2 characters.";
       }
     
       const email = formData.email.trim();
     
       if (!email) {
         newErrors.email = "Email is required.";
       } else if (
         !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
       ) {
         newErrors.email =
           "Enter a valid email address.";
       }
     
       const phone = formData.phone.trim();
     
       if (!phone) {
         newErrors.phone =
           "Phone number is required.";
       } else if (!/^\d{10}$/.test(phone)) {
         newErrors.phone =
           "Phone number must contain exactly 10 digits.";
       }
       const location = formData.location?.trim() || "";
       
     
       const college = formData.college.trim();
     
       if (!college) {
         newErrors.college =
           "College name is required.";
       }
     
       const degree = formData.degree.trim();
     
       if (!degree) {
         newErrors.degree =
           "Degree is required.";
       }
     
       const cgpa = Number(formData.cgpa);
     
       if (formData.cgpa === "") {
         newErrors.cgpa = "CGPA is required.";
       } else if (isNaN(cgpa)) {
         newErrors.cgpa = "Enter a valid CGPA.";
       } else if (cgpa < 0 || cgpa > 10) {
         newErrors.cgpa =
           "CGPA must be between 0 and 10.";
       } else if (
         !/^\d+(\.\d{1,2})?$/.test(formData.cgpa)
       ) {
         newErrors.cgpa =
           "CGPA can have up to 2 decimal places.";
       }
     
       const graduationYear = Number(
         formData.graduation_year
       );
     
       if (!formData.graduation_year) {
         newErrors.graduation_year =
           "Graduation year is required.";
       } else if (!Number.isInteger(graduationYear)) {
         newErrors.graduation_year =
           "Enter a valid graduation year.";
       } else if (
         graduationYear < 2000 ||
         graduationYear > 2100
       ) {
         newErrors.graduation_year =
           "Enter a valid graduation year.";
       }
     
       setErrors(newErrors);
       

       return Object.keys(newErrors).length === 0;
      
     
       return Object.keys(newErrors).length === 0;
     }
     
     
  
  /* =========================
     SAVE PROFILE
     ========================= */

  async function saveProfile() {
    
    const isValid = validateForm();

if (!isValid) {
  return;
}
    const profileData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      location: formData.location.trim(),
      college: formData.college.trim(),
      degree: formData.degree.trim(),
      cgpa: Number(formData.cgpa),
      graduation_year: Number(
        formData.graduation_year
      ),
    };

    try {
      let response;

      if (profileId) {
        response = await api.put(
          `/api/profile/${profileId}/`,
          profileData
        );
      } else {
        response = await api.post(
          "/api/profile/",
          profileData
        );

        setProfileId(response.data.id);
      }

      const savedProfile = {
        name: response.data.name || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
        location: response.data.location || "",
        college: response.data.college || "",
        degree: response.data.degree || "",
        cgpa:
          response.data.cgpa !== null &&
          response.data.cgpa !== undefined
            ? String(response.data.cgpa)
            : "",
        graduation_year:
          response.data.graduation_year !== null &&
          response.data.graduation_year !== undefined
            ? String(
                response.data.graduation_year
              )
            : "",
      };

      setProfile(savedProfile);
      setFormData(savedProfile);
      setErrors({});
      setIsEditing(false);

      alert("Profile updated successfully!");
    } catch (error) {
      console.log(
        "SAVE PROFILE ERROR:",
        error.response?.data || error
      );

      alert("Could not save profile.");
    }
  }

  /* =========================
     RESUME SELECT
     ========================= */

  function handleResumeChange(e) {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      alert("Please select a PDF file.");
      e.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("Resume must be smaller than 5 MB.");
      e.target.value = "";
      return;
    }

    setResume(selectedFile);
  }

  /* =========================
     UPLOAD RESUME
     ========================= */

  async function uploadResume() {
    if (!resume) {
      alert("Please select a resume first.");
      return;
    }

    if (!profileId) {
      alert(
        "Please save your profile before uploading your resume."
      );
      return;
    }

    const formData = new FormData();

    formData.append("resume", resume);

    try {
      setResumeUploading(true);

      const response = await api.patch(
        `/api/profile/${profileId}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.resume) {
        if (
          response.data.resume.startsWith("http")
        ) {
          setResumeUrl(response.data.resume);
        } else {
          setResumeUrl(
            `http://127.0.0.1:8000${response.data.resume}`
          );
        }
      }

      setResume(null);

      const fileInput =
        document.getElementById("resume-input");

      if (fileInput) {
        fileInput.value = "";
      }

      alert("Resume uploaded successfully!");

      await loadProfile();
    } catch (error) {
      console.log(
        "RESUME UPLOAD ERROR:",
        error.response?.data || error
      );

      alert("Could not upload resume.");
    } finally {
      setResumeUploading(false);
    }
  }

  /* =========================
     CANCEL EDIT
     ========================= */

  function cancelEdit() {
    setFormData(profile);
    setErrors({});
    setIsEditing(false);
  }

  /* =========================
     LOADING
     ========================= */

  if (loading) {
    return (
      <div className="profile-page">
        <h1>Profile</h1>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">

      {/* HEADER */}

      <div className="page-header">
        <div>
          <h1>Profile</h1>

          <p className="profile-subtitle">
            Manage your personal information and
            academic details
          </p>
        </div>
      </div>

      {/* PROFILE HERO */}

      <div className="profile-hero">

        <div className="profile-hero-content">

          <div className="profile-avatar">
            {profile.name
              ? profile.name
                  .charAt(0)
                  .toUpperCase()
              : "S"}
          </div>

          
            

        

        </div>

        {!isEditing && (
          <button
            className="profile-edit-button"
            onClick={() =>
              setIsEditing(true)
            }
          >
            Edit Profile
          </button>
        )}

      </div>

      {/* EDIT FORM */}

      {isEditing ? (

        <div className="profile-card">

          <div className="profile-card-header">

            <div>
              <h2>Edit Profile</h2>

              <p>
                Update your personal and academic
                information
              </p>
            </div>

          </div>

          <div className="profile-form-grid">

            {/* NAME */}

            <div className="profile-field">

              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="Enter your name"
                onChange={handleChange}
              />

              {errors.name && (
                <small className="profile-error">
                  {errors.name}
                </small>
              )}

            </div>

            {/* EMAIL */}

            <div className="profile-field">

              <label>Email Address</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Enter your email"
                onChange={handleChange}
              />

              {errors.email && (
                <small className="profile-error">
                  {errors.email}
                </small>
              )}

            </div>

            {/* PHONE */}

            <div className="profile-field">

              <label>Phone Number</label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                placeholder="Enter your phone number"
                maxLength="10"
                onChange={handleChange}
              />

              {errors.phone && (
                <small className="profile-error">
                  {errors.phone}
                </small>
              )}

            </div>

            {/* LOCATION */}

            <div className="profile-field">

              <label>Location</label>

              <input
                type="text"
                name="location"
                value={formData.location}
                placeholder="Enter your location"
                onChange={handleChange}
              />

              {errors.location && (
                <small className="profile-error">
                  {errors.location}
                </small>
              )}

            </div>

            {/* COLLEGE */}

            <div className="profile-field">

              <label>College</label>

              <input
                type="text"
                name="college"
                value={formData.college}
                placeholder="Enter your college"
                onChange={handleChange}
              />

              {errors.college && (
                <small className="profile-error">
                  {errors.college}
                </small>
              )}

            </div>

            {/* DEGREE */}

            <div className="profile-field">

              <label>Degree</label>

              <input
                type="text"
                name="degree"
                value={formData.degree}
                placeholder="Enter your degree"
                onChange={handleChange}
              />

              {errors.degree && (
                <small className="profile-error">
                  {errors.degree}
                </small>
              )}

            </div>

            {/* CGPA */}

            <div className="profile-field">

              <label>CGPA</label>

              <input
                type="number"
                name="cgpa"
                value={formData.cgpa}
                placeholder="Enter your CGPA"
                min="0"
                max="10"
                step="0.01"
                onChange={handleChange}
              />

              <small>
                Enter a value between 0 and 10
              </small>

              {errors.cgpa && (
                <small className="profile-error">
                  {errors.cgpa}
                </small>
              )}

            </div>

            {/* GRADUATION YEAR */}

            <div className="profile-field">

              <label>Graduation Year</label>

              <input
                type="number"
                name="graduation_year"
                value={formData.graduation_year}
                placeholder="Example: 2027"
                min="2000"
                max="2100"
                onChange={handleChange}
              />

              {errors.graduation_year && (
                <small className="profile-error">
                  {errors.graduation_year}
                </small>
              )}

            </div>

          </div>

          {/* ACTION BUTTONS */}

          <div className="profile-actions">

            <button
              className="profile-cancel-button"
              onClick={cancelEdit}
            >
              Cancel
            </button>

            <button
              className="profile-save-button"
              onClick={saveProfile}
            >
              Save Changes
            </button>

          </div>

        </div>

      ) : (

        <div className="profile-grid">

          {/* PERSONAL INFORMATION */}

          <div className="profile-card">

            <div className="profile-card-header">

              <div>
                <h2>
                  Personal Information
                </h2>

                <p>
                  Your saved profile details
                </p>
              </div>

            </div>

            <div className="profile-info-grid">

              <div className="profile-info-item">
                <span>Email</span>
                <strong>
                  {profile.email ||
                    "Not added"}
                </strong>
              </div>

              <div className="profile-info-item">
                <span>Phone</span>
                <strong>
                  {profile.phone ||
                    "Not added"}
                </strong>
              </div>

              <div className="profile-info-item">
                <span>Location</span>
                <strong>
                  {profile.location ||
                    "Not added"}
                </strong>
              </div>

              <div className="profile-info-item">
                <span>College</span>
                <strong>
                  {profile.college ||
                    "Not added"}
                </strong>
              </div>

              <div className="profile-info-item">
                <span>Degree</span>
                <strong>
                  {profile.degree ||
                    "Not added"}
                </strong>
              </div>

              <div className="profile-info-item">
                <span>CGPA</span>
                <strong>
                  {profile.cgpa ||
                    "Not added"}
                </strong>
              </div>

              <div className="profile-info-item">
                <span>Graduation Year</span>
                <strong>
                  {profile.graduation_year ||
                    "Not added"}
                </strong>
              </div>

            </div>

          </div>

          {/* =========================
              RESUME
              ========================= */}

          <div className="profile-card resume-card">

            <div className="profile-card-header">

              <div>
                <h2>Resume</h2>

                <p>
                  Keep your latest resume ready
                </p>
              </div>

            </div>

            {resumeUrl ? (

              <div className="resume-box">

                <div className="resume-icon">
                  📄
                </div>

                <div>
                  <strong>
                    Resume uploaded
                  </strong>

                  <p>
                    Your resume is saved in
                    your profile.
                  </p>
                </div>

              </div>

            ) : (

              <div className="resume-box">

                <div className="resume-icon">
                  📄
                </div>

                <div>
                  <strong>
                    No resume uploaded
                  </strong>

                  <p>
                    Upload your resume for
                    placement applications.
                  </p>
                </div>

              </div>

            )}

            <input
              id="resume-input"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleResumeChange}
              style={{ display: "none" }}
            />

            <div className="resume-actions">

              <label
                htmlFor="resume-input"
                className="profile-upload-button"
              >
                {resume
                  ? "Change Resume"
                  : "Choose Resume"}
              </label>

              {resume && (
                <button
                  className="profile-save-button"
                  onClick={uploadResume}
                  disabled={resumeUploading}
                >
                  {resumeUploading
                    ? "Uploading..."
                    : "Upload Resume"}
                </button>
              )}

              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-view-resume"
                >
                  View Resume
                </a>
              )}

            </div>

            <small className="resume-note">
              PDF only • Maximum size 5 MB
            </small>

          </div>

          {/* SKILLS */}

          <div className="profile-card profile-skills-card">

            <div className="profile-skills-header">

              <div>
                <h2>Skills</h2>

                <p>
                  Technologies and skills
                  you're working on
                </p>
              </div>

            </div>

            <div className="profile-skills-list">

              <span className="profile-skill">
                Python
              </span>

              <span className="profile-skill">
                JavaScript
              </span>

              <span className="profile-skill">
                React
              </span>

              <span className="profile-skill">
                SQL
              </span>

              <span className="profile-skill">
                HTML
              </span>

              <span className="profile-skill">
                CSS
              </span>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Profile;