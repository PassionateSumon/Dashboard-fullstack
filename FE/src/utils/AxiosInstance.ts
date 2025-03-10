import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5008/api/v1/users",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!config.headers) {
      config.headers = {};
    }
    if (accessToken) {
      config.headers.Authorization = accessToken;
    }

    if (config.data instanceof FormData) {
      config.headers["Content-type"] = "multipart/form-data";
    } else {
      config.headers["Content-type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axiosInstance.post("/refresh");
        const newAccessToken = (res.data as any).newAccessToken;
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = newAccessToken;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed!", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
