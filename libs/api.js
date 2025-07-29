import axios from "axios";
import { toast } from "react-hot-toast";

// use this to interact with our own API (/app/api folder) from the front-end side
// See https://shipfa.st/docs/tutorials/api-call
const apiClient = axios.create({
  baseURL: "/api",
});

apiClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    let message = "";

    if (error.response?.status === 401) {
      // User not auth, redirect to admin login
      message = "Sesión expirada. Por favor inicia sesión nuevamente.";
      // Solo redirigir si estamos en una ruta de admin
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    } else if (error.response?.status === 403) {
      // User not authorized, must subscribe/purchase/pick a plan
      message = "Pick a plan to use this feature";
    } else {
      message =
        error?.response?.data?.error || error.message || error.toString();
    }

    error.message =
      typeof message === "string" ? message : JSON.stringify(message);

    console.error(error.message);

    // Automatically display errors to the user
    if (error.message) {
      toast.error(error.message);
    } else {
      toast.error("something went wrong...");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
