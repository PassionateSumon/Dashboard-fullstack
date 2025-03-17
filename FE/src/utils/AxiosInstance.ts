import axios from "axios";
import Cookies from "js-cookie";

class LoadingManager {
  private activeRequests: number = 0;
  private listeners: ((isLoading: boolean) => void)[] = [];

  startLoading() {
    this.activeRequests++;
    this.notifyListeners();
  }

  stopLoading() {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    this.notifyListeners();
  }

  isLoading(): boolean {
    return this.activeRequests > 0;
  }

  subscribe(cb: (isLoading: boolean) => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((lis) => lis !== cb);
    };
  }

  private notifyListeners() {
    const isLoading = this.isLoading();
    this.listeners.forEach((lis) => lis(isLoading));
  }
}

export const loadingManager = new LoadingManager();

const axiosInstance = axios.create({
  baseURL: "http://localhost:5008/api/v1/users",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    loadingManager.startLoading();
    const accessToken = localStorage.getItem("accessToken");
    if (!config.headers) {
      config.headers = {};
    }
    if (accessToken) {
      config.headers["Authorization"] = accessToken;
    }

    if (config.data instanceof FormData) {
      config.headers["Content-type"] = "multipart/form-data";
    } else {
      config.headers["Content-type"] = "application/json";
    }

    return config;
  },
  (error) => {
    loadingManager.stopLoading();
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    loadingManager.stopLoading();
    // console.log(response)
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // console.log(error.response);
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const rToken = Cookies.get("refreshToken");
        // console.log("rToken: -- ",rToken);
        if (!rToken) {
          console.error("Refresh token not found!");
          loadingManager.stopLoading();
          localStorage.removeItem("accessToken");
          return Promise.reject(error);
        }
        // console.log(localStorage.getItem("accessToken"))
        const res = await axiosInstance.post("/refresh", {
          refreshToken: rToken,
        });
        // console.log(first)
        const { newAccessToken, newRefreshToken } = (res.data as any)?.data;
        // console.log("newA: ", newAccessToken);
        // console.log("newR: ", newRefreshToken);
        localStorage.setItem("accessToken", newAccessToken);
        Cookies.set("refreshToken", newRefreshToken);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed!", refreshError);
        loadingManager.stopLoading();
        return Promise.reject(refreshError);
      }
    }
    loadingManager.stopLoading();
    return Promise.reject(error);
  }
);

export default axiosInstance;
