import axios from "axios";

const beBaseRequest = axios.create({
  baseURL: window._apis.beBaseUrl,
  timeout: 10000, // 10 giây
  withCredentials: true,
});

export { beBaseRequest };
