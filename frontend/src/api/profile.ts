import { AxiosResponse } from "axios";
import { ProfileData, PutProfileData } from "../types/profiles";
import client from "./client";

export async function getProfiles(): Promise<AxiosResponse<ProfileData[]>> {
  return client.get("/profile/");
}

export async function updateProfile(
  id: string,
  data: PutProfileData,
): Promise<AxiosResponse<ProfileData>> {
  return client.patch(`/profile/${id}/`, data);
}
