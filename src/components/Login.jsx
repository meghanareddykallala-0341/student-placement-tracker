import { useState } from "react";

import api from "../axiosConfig";


function Login({ onLogin, onRegister }) {

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  async function handleSubmit(e) {

    e.preventDefault();


    if (
      !username.trim() ||
      !password
    ) {

      alert(
        "Please enter username and password."
      );

      return;

    }


    try {

      setLoading(true);


      /*
      ================================
      LOGIN
      ================================
      */

      const response = await api.post(

        "/api/token/",

        {
          username: username.trim(),
          password: password,
        }

      );


      /*
      ================================
      SAVE JWT TOKENS
      ================================
      */

      localStorage.setItem(
        "accessToken",
        response.data.access
      );

      localStorage.setItem(
        "refreshToken",
        response.data.refresh
      );


      /*
      ================================
      TELL APP LOGIN WAS SUCCESSFUL
      ================================
      */

      onLogin();

    }

    catch (error) {

      console.error(
        "Login error:",
        error.response?.data || error
      );


      if (
        error.response?.status === 401
      ) {

        alert(
          "Invalid username or password."
        );

      }

      else {

        alert(
          "Login failed. Please try again."
        );

      }

    }

    finally {

      setLoading(false);

    }

  }


  return (

    <div className="login-page">

      <div className="login-card">


        {/* LEFT SIDE */}

        <div className="login-left">

          <div className="login-brand">

            🎓 Placement Tracker

          </div>


          <h1>

            Your Placement
            <br />
            Journey Starts Here

          </h1>


          <p>

            Track applications, manage interviews,
            <br />
            and build your future.

          </p>


          <div className="login-illustration">

            💻

          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="login-right">

          <h2>

            Welcome Back

          </h2>


          <p className="login-subtitle">

            Login to your account

          </p>


          <form
            onSubmit={handleSubmit}
          >


            <label>

              Username

            </label>


            <input

              type="text"

              placeholder="Enter username"

              value={username}

              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }

            />


            <label>

              Password

            </label>


            <input

              type="password"

              placeholder="Enter password"

              value={password}

              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }

            />


            <button

              type="submit"

              className="login-button"

              disabled={loading}

            >

              {loading
                ? "Logging in..."
                : "Login"}

            </button>


          </form>


          <p className="login-footer">

            Don't have an account?{" "}

            <span

              className="register-link"

              onClick={onRegister}

            >

              Register

            </span>

          </p>


        </div>

      </div>

    </div>

  );

}


export default Login;