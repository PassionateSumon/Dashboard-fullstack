import axios from "axios";

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
      config.headers.Authorization = accessToken;
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
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log(error.response)
    if (error.response?.status === 500 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // console.log("here")
        const res = await axios.post(
          "http://localhost:5008/api/v1/users/refresh",
          {},
          {
            withCredentials: true,
          }
        );
        const newAccessToken = (res.data as any).newAccessToken;
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = newAccessToken;
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
