import { CONFUSED_PREFIX } from "./constants";

export const LOCAL_SESSION_IDS = `${CONFUSED_PREFIX} LOCAL_SESSION_IDS`;

export function getLocalSessionsIds(): number[] | null {
  const rawIds = localStorage.getItem(LOCAL_SESSION_IDS) ?? "[]";
  const ids: number[] = JSON.parse(rawIds).map((id: string) => Number(id));
  return ids;
}

export function setLocalSessionsIds(localSessionsIds?: number[] | null): void {
  if (localSessionsIds) {
    localStorage.setItem(LOCAL_SESSION_IDS, JSON.stringify(localSessionsIds));
  } else {
    localStorage.removeItem(LOCAL_SESSION_IDS);
  }
}

export function deleteLocalSessionId(localSessionsId: number): void {
  const sessionIds = getLocalSessionsIds();
  if (!sessionIds) {
    return;
  }
  const index = sessionIds?.indexOf(localSessionsId);
  if (index !== -1) {
    sessionIds?.splice(index, 1);
    setLocalSessionsIds(sessionIds);
  }
}

const localSessions = {
  getLocalSessionsIds,
  setLocalSessionsIds,
  deleteLocalSessionId,
};

export default localSessions;
