import { AxiosResponse } from "axios";
import { LoginRequest, SignUpRequest } from "../types/auth";
import client from "./client";

export async function signUp(data: SignUpRequest): Promise<AxiosResponse> {
  return client.post<SignUpRequest>("/signup/", data);
}

export async function login(data: LoginRequest): Promise<AxiosResponse> {
  return client.post<LoginRequest>("/login/", data);
}

// export async function logout() {
//   return client.delete<LogoutRequest>("/logout");
// }

// export const confirmEmail = (token: string): Promise<AxiosResponse> => {
//   return client.post(`${URL}/confirm_email`, { token });
// };

// export const resendConfirmEmailLink = (email: string): Promise<AxiosResponse> => {
//   return client.post(`${URL}/resend_confirm_email_link`, { email });
// };
