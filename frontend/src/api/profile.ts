import { AxiosResponse } from "axios";
import { ProfileData } from "../types/profiles";
import client from "./client";

export async function getProfile(): Promise<AxiosResponse<ProfileData>> {
  return client.get("/profile/");
}
