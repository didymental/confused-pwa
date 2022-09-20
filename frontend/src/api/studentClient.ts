import axios, { AxiosRequestConfig } from "axios";
import { BASE_URL, WS_BASE_URL } from "./client";

const client = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 30000,
  headers: {
    Accept: "application/json",
  },
});

const studentClientApi = {
  get: client.get,
  delete: client.delete,
  post: client.post,
  put: client.put,
  patch: client.patch,
};

Object.freeze(studentClientApi);

export default studentClientApi;
