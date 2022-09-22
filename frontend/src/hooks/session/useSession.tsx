import { atom, useRecoilState } from "recoil";
import { useHistory } from "react-router";
import { CreateSessionRequest, SessionEntity } from "../../types/session";
import api from "../../api";
import { useToast } from "../util/useToast";
import useAnalyticsTracker from "../util/useAnalyticsTracker";
import { getUser } from "../../localStorage/auth";
import {
  deleteLocalSessionId,
  getLocalSessionsIds,
  setLocalSessionsIds,
} from "../../localStorage/localSessions";
import {
  addOfflineSessionRequest,
  getOfflineSessionRequests,
  setOfflineSessionRequests,
  updateOfflineSessionRequest,
  removeOfflineSessionRequest,
} from "../../localStorage/sessionRequests";
import { OfflineSessionRequest, RequestType } from "../../types/offlineRequests";

const sessionsState = atom({
  key: "SESSIONS_ATOM",
  default: null as SessionEntity[] | null,
});

const useSessionsState = () => {
  const [sessions, setSessions] = useRecoilState(sessionsState);

  // add a new session or update an existing session
  const setSession = (session: SessionEntity) => {
    const sessionId = session.id;
    if (!sessions) {
      return;
    }
    let newSessions = [...sessions];
    for (let i = 0; i < sessions.length; i++) {
      if (sessions[i].id === sessionId) {
        newSessions[i] = session;
        setSessions(newSessions);
        return;
      }
    }
    newSessions = [session, ...sessions];
    setSessions(newSessions);
  };

  const deleteSessionValue = (sessionId: number) => {
    if (!sessions) {
      return;
    }
    const index = sessions.findIndex((value) => value.id === sessionId);
    if (index !== -1) {
      const newSessions = [...sessions];
      newSessions.splice(index, 1);
      setSessions(newSessions);
    }
  };

  return {
    sessions,
    setSessions,
    setSession,
    deleteSessionValue,
  };
};

interface UpdateSessionsState {
  sessions: SessionEntity[] | null;
  getSessions: () => Promise<void>;
  createSession: (
    createSessionRequest: CreateSessionRequest,
    reconnected?: boolean,
  ) => Promise<void>;
  createSampleSessions: () => Promise<void>;
  updateSession: (updateSessionRequest: SessionEntity, reconnected?: boolean) => Promise<void>;
  deleteSession: (sessionId: number) => Promise<void>;
  sendSessionSavedData: () => Promise<void>;
}

const sampleSessions = [
  {
    name: "Welcome to Confused!",
    is_open: false,
  },
  {
    name: 'Click "+" to create session',
    is_open: false,
  },
  {
    name: 'Click "Start" to start and share session',
    is_open: false,
  },
];

export const useSessions = (isOnline = true): UpdateSessionsState => {
  const history = useHistory();
  const { sessions, setSessions, setSession, deleteSessionValue } = useSessionsState();
  const { presentToast } = useToast();
  const sessionAnalyticsTracker = useAnalyticsTracker("Session");
  const user = getUser();

  const getSessions = async () => {
    try {
      const localSessionIds = getLocalSessionsIds();
      if (isOnline && localSessionIds?.length === 0) {
        const response = await api.session.getSessions();
        const { results } = response.data;
        setSessions(results);
      }
    } catch (err: any) {
      presentToast({
        header: "Fetch sessions failed!",
        color: "danger",
      });
    }
  };

  const createSession = async (
    createSessionRequest: CreateSessionRequest,
    reconnected: boolean = false,
  ) => {
    try {
      let session: SessionEntity;
      if (isOnline) {
        const response = await api.session.createSession(createSessionRequest);
        session = response.data;
        sessionAnalyticsTracker("Created session");

        getSessions();
      } else {
        const fakeSessionId = sessions ? sessions[0].id + 1 : 0;

        // add to offline requests queue
        const offlineRequest: OfflineSessionRequest = {
          type: RequestType.CREATE,
          id: fakeSessionId,
          body: createSessionRequest,
        };
        addOfflineSessionRequest(offlineRequest);

        // add fake session id to local storage
        const localSessionIds = getLocalSessionsIds();
        if (!localSessionIds || localSessionIds.length === 0) {
          setLocalSessionsIds([fakeSessionId]);
        } else {
          setLocalSessionsIds([...localSessionIds, fakeSessionId]);
        }

        session = {
          id: fakeSessionId,
          instructor: user?.id ?? "",
          created_date_time: new Date().toString(),
          ...createSessionRequest,
        };
        setSession(session);
      }

      if (!reconnected) {
        history.push("/instructor/dashboard");
        presentToast({ header: "Create session successfully!", color: "success" });
      }
    } catch (err: any) {
      presentToast({
        header: "Create sessions failed!",
        color: "danger",
      });
    }
  };

  const createSampleSessions = async () => {
    try {
      await api.session.createSession(sampleSessions[2]);
      await api.session.createSession(sampleSessions[1]);
      await api.session.createSession(sampleSessions[0]);
    } catch (err: any) {
      presentToast({
        header: "Create sessions failed!",
        color: "danger",
      });
    }
  };

  const updateSession = async (sessionEntity: SessionEntity, reconnected = false) => {
    try {
      let session: SessionEntity;
      if (isOnline) {
        const response = await api.session.updateSession(sessionEntity);
        session = response.data;
        sessionAnalyticsTracker("Updated session");
        await getSessions();
      } else {
        session = {
          ...sessionEntity,
        };
        if (getLocalSessionsIds()?.includes(sessionEntity.id)) {
          // edit a session created during offline
          // update the create request in the queue
          updateOfflineSessionRequest(session);
        } else {
          // edit a session created during online
          const request: OfflineSessionRequest = {
            type: RequestType.UPDATE,
            body: sessionEntity,
          };
          addOfflineSessionRequest(request);
        }
        setSession(session);
      }

      if (!reconnected) {
        history.push("/instructor/dashboard");
        presentToast({ header: "Edit session successfully!", color: "success" });
      }
    } catch (err: any) {
      presentToast({
        header: "Edit sessions failed!",
        color: "danger",
      });
    }
  };

  const deleteSession = async (sessionId: number, reconnected = false) => {
    try {
      if (isOnline) {
        await api.session.deleteSession(sessionId);
        sessionAnalyticsTracker("Deleted session");
      } else {
        if (getLocalSessionsIds()?.includes(sessionId)) {
          // attempt to delete a local session
          deleteLocalSessionId(sessionId);
          removeOfflineSessionRequest(sessionId);
        } else {
          // attempt to delete a synced session
          const offlineRequest: OfflineSessionRequest = {
            type: RequestType.DELETE,
            param: sessionId,
          };
          // remove the request from the queue
          addOfflineSessionRequest(offlineRequest);
        }
        deleteSessionValue(sessionId);
      }

      if (!reconnected) {
        presentToast({ header: "Delete session successfully!", color: "success" });
      }
    } catch (err: any) {
      presentToast({
        header: "Delete sessions failed!",
        color: "danger",
      });
    }
  };

  // executes when internet is offline
  // sends the locally stored data into the end point when stores it in DB
  // once stored, removes it from local storage
  const sendSessionSavedData = async () => {
    const requests = getOfflineSessionRequests();
    if (!requests || requests.length === 0) {
      return;
    }

    const isReconnected = true;
    while (requests.length > 0) {
      const { type, id = 0, param, body } = requests[0];
      switch (type) {
        case RequestType.CREATE:
          await createSession(body as CreateSessionRequest, isReconnected);
          deleteLocalSessionId(id);
          break;
        case RequestType.UPDATE:
          await updateSession(body as SessionEntity, isReconnected);
          break;
        case RequestType.DELETE:
          await deleteSession(param as number, isReconnected);
          break;
        default:
          break;
      }
      requests.shift();
      setOfflineSessionRequests(requests);
    }
    setOfflineSessionRequests();
    getSessions();
  };
  return {
    sessions,
    getSessions,
    createSession,
    createSampleSessions,
    updateSession,
    deleteSession,
    sendSessionSavedData,
  };
};
