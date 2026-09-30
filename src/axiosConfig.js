import axios from "axios";


const api = axios.create({

  baseURL: "http://127.0.0.1:8000",

});


/*
=================================
ADD ACCESS TOKEN TO EVERY REQUEST
=================================
*/

api.interceptors.request.use(

  (config) => {

    const accessToken =
      localStorage.getItem("accessToken");

    if (accessToken) {

      config.headers.Authorization =
        `Bearer ${accessToken}`;

    }

    return config;

  },

  (error) => {

    return Promise.reject(error);

  }

);


/*
=================================
REFRESH ACCESS TOKEN IF EXPIRED
=================================
*/

api.interceptors.response.use(

  (response) => {

    return response;

  },

  async (error) => {

    const originalRequest =
      error.config;


    /*
    Only try refreshing when:
    - server says 401
    - request hasn't already been retried
    */

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;


      const refreshToken =
        localStorage.getItem("refreshToken");


      if (!refreshToken) {

        localStorage.removeItem(
          "accessToken"
        );

        localStorage.removeItem(
          "refreshToken"
        );

        localStorage.removeItem(
          "placementLoggedIn"
        );

        return Promise.reject(error);

      }


      try {

        const response = await axios.post(

          "http://127.0.0.1:8000/api/token/refresh/",

          {
            refresh: refreshToken
          }

        );


        const newAccessToken =
          response.data.access;


        localStorage.setItem(
          "accessToken",
          newAccessToken
        );


        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;


        return api(originalRequest);

      }

      catch (refreshError) {

        localStorage.removeItem(
          "accessToken"
        );

        localStorage.removeItem(
          "refreshToken"
        );

        localStorage.removeItem(
          "placementLoggedIn"
        );


        window.location.reload();


        return Promise.reject(
          refreshError
        );

      }

    }


    return Promise.reject(error);

  }

);


export default api;