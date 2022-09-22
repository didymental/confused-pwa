import { CONFUSED_PREFIX } from "./constants";
import { OfflineSessionRequest, RequestType } from "../types/offlineRequests";
import { SessionEntity, CreateSessionRequest } from "../types/session";

export const OFFLINE_SESSION_REQUESTS = `${CONFUSED_PREFIX} OFFLINE_SESSION_REQUESTS`;

export function getOfflineSessionRequests(): OfflineSessionRequest[] | null {
  const rawRequest = localStorage.getItem(OFFLINE_SESSION_REQUESTS);
  if (!rawRequest) {
    return [];
  }
  const requests = JSON.parse(localStorage.getItem(OFFLINE_SESSION_REQUESTS) ?? "[]");
  return requests;
}

export function setOfflineSessionRequests(
  offlineSessionRequests?: OfflineSessionRequest[] | null,
): void {
  if (offlineSessionRequests) {
    localStorage.setItem(OFFLINE_SESSION_REQUESTS, JSON.stringify(offlineSessionRequests));
  } else {
    localStorage.removeItem(OFFLINE_SESSION_REQUESTS);
  }
}

export function addOfflineSessionRequest(request: OfflineSessionRequest) {
  const requests = getOfflineSessionRequests();
  requests?.push(request);
  setOfflineSessionRequests(requests);
}

export function dequeueOfflineSessionRequest() {
  const requests = getOfflineSessionRequests();
  requests?.shift();
  setOfflineSessionRequests(requests);
}

export function updateOfflineSessionRequest(session: SessionEntity) {
  const requests = getOfflineSessionRequests();
  if (!requests) {
    return;
  }

  const index = requests.findIndex((value) => {
    // Only update create requests
    if (value.type !== RequestType.CREATE) {
      return false;
    }
    return value.id === session.id;
  });

  const createSessionRequest: CreateSessionRequest = {
    name: session.name,
    is_open: session.is_open,
  };

  const newRequest: OfflineSessionRequest = {
    ...requests[index],
    body: createSessionRequest,
  };

  requests[index] = newRequest;
  setOfflineSessionRequests(requests);
}

export function removeOfflineSessionRequest(id: number) {
  const requests = getOfflineSessionRequests();
  if (!requests) {
    return;
  }

  const index = requests.findIndex((value) => {
    // Only delete create requests
    if (value.type !== RequestType.CREATE) {
      return false;
    }
    return value.id === id;
  });

  if (index !== -1) {
    requests.splice(index, 1);
    setOfflineSessionRequests(requests);
  }
}

const sessionRequests = {
  getOfflineSessionRequests,
  setOfflineSessionRequests,
  addOfflineSessionRequest,
  dequeueOfflineSessionRequest,
  updateOfflineSessionRequest,
  removeOfflineSessionRequest,
};

export default sessionRequests;
