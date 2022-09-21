import axios, { AxiosRequestConfig } from "axios";
import { getAccessToken } from "../localStorage";

export const BASE_URL =
  process.env.REACT_APP_BASE_URL || "https://confused-backend-3216.herokuapp.com";
export const WS_BASE_URL = BASE_URL.replace(/^https/, "ws") + "/ws/session/";

/**
 * Creates a connection to the WebSocket.
 * Provides a way to exchange data between browser and server via a persistent connection
 */
export const getWebSocketClient = (isInstructor: boolean) => {
  if (!isInstructor) {
    return new WebSocket(WS_BASE_URL);
  }
  let token = getAccessToken();
  let ws = new WebSocket(WS_BASE_URL + "?token=" + token);
  return ws;
};

const client = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 30000,
  headers: {
    Accept: "application/json",
  },
});

client.interceptors.request.use((config: AxiosRequestConfig) => {
  const accessToken = getAccessToken();
  if (config.headers) {
    config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : "";
  }
  return config;
});

const clientApi = {
  get: client.get,
  delete: client.delete,
  post: client.post,
  put: client.put,
  patch: client.patch,
};

Object.freeze(clientApi);

export default clientApi;
