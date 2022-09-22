import { CONFUSED_PREFIX } from "./constants";
import { OfflineProfileRequest } from "../types/offlineRequests";

const OFFLINE_PROFILE_REQUEST = `${CONFUSED_PREFIX} OFFLINE_PROFILE_REQUEST`;

export function getOfflineProfileRequest(): OfflineProfileRequest | null {
  const rawRequest = localStorage.getItem(OFFLINE_PROFILE_REQUEST);
  if (!rawRequest) {
    return null;
  }
  const request = JSON.parse(rawRequest ?? "{}");
  return request;
}

export function setOfflineProfileRequest(
  offlineSessionRequest?: OfflineProfileRequest | null,
): void {
  if (offlineSessionRequest) {
    localStorage.setItem(OFFLINE_PROFILE_REQUEST, JSON.stringify(offlineSessionRequest));
  } else {
    localStorage.removeItem(OFFLINE_PROFILE_REQUEST);
  }
}

const profileRequests = {
  getOfflineProfileRequest,
  setOfflineProfileRequest,
};

export default profileRequests;
