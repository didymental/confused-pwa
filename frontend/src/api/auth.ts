import { AxiosResponse } from "axios";
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  SignUpRequest,
  SignUpResponse,
} from "../types/auth";
import client from "./client";

export async function signUp(data: SignUpRequest): Promise<AxiosResponse<SignUpResponse>> {
  return client.post("/signup/", data);
}

export async function login(data: LoginRequest): Promise<AxiosResponse<LoginResponse>> {
  return client.post("/login/", data);
}

export async function refreshAccessToken(
  data: RefreshTokenRequest,
): Promise<AxiosResponse<RefreshTokenResponse>> {
  return client.post("/login/refresh/", data);
}
