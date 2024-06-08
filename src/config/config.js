const axios = require('axios');

async function config() {
  axios.interceptors.request.use(
    async (config) => {
      let accessToken = cookies.getItem("accessToken");

      if (!accessToken) {
        const refreshToken = document.cookie
          .split(";")
          .find((c) => c.trim().startsWith("refreshToken="));
        if (refreshToken) {
          const refreshResponse = await refresh(refreshToken, accessToken);
          if (refreshResponse.success) {
            accessToken = refreshResponse.accessToken;
            localStorage.setItem("accessToken", accessToken);
          } else {
            window.location.href = "/login";
          }
        } else {
          window.location.href = "/login";
        }
      }

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
}


module.exports = {
    config
}