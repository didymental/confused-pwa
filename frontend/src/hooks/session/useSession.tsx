import { atom, useRecoilState } from "recoil";
import { useHistory } from "react-router";
import { CreateSessionRequest, SessionEntity } from "../../types/session";
import api from "../../api";
import { useToast } from "../util/useToast";
import useAnalyticsTracker from "../util/useAnalyticsTracker";
import { useOnlineStatus } from "../util/useOnlineStatus";
import { CREATE_SESSION_DATA_ID, EDIT_SESSION_DATA_ID, getUser } from "../../localStorage";
import { useEffect } from "react";
import { sleep } from "../../utils/time";

const sessionsState = atom({
  key: "SESSIONS_ATOM",
  default: null as SessionEntity[] | null,
});

const useSessionsState = () => {
  const [sessions, setSessions] = useRecoilState(sessionsState);
  const setSession = (session: SessionEntity) => {
    const session_id = session.id;
    if (!sessions) {
      return;
    }
    let new_sessions = [...sessions];
    for (let i = 0; i < sessions.length; i++) {
      if (sessions[i].id === session_id) {
        new_sessions[i] = session;
        setSessions(new_sessions);
        return;
      }
    }
    new_sessions = [session, ...sessions];
    setSessions(new_sessions);
  };

  return {
    sessions,
    setSessions,
    setSession,
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
  const { sessions, setSessions, setSession } = useSessionsState();
  const { presentToast } = useToast();
  const sessionAnalyticsTracker = useAnalyticsTracker("Session");
  // const isOnline = useOnlineStatus();
  const user = getUser();

  const getSessions = async () => {
    try {
      const response = await api.session.getSessions();
      const { results } = response.data;
      setSessions(results);
    } catch (err: any) {
      presentToast({
        header: "Fetch sessions failed!",
        color: "danger",
      });
    }
  };

  const createSession = async (
    createSessionRequest: CreateSessionRequest,
    reonnected: boolean = false,
  ) => {
    try {
      let session: SessionEntity;
      if (!isOnline) {
        localStorage.setItem(CREATE_SESSION_DATA_ID, JSON.stringify(createSessionRequest));
        session = {
          id: sessions?.length ?? 0,
          instructor: user?.id ?? "",
          created_date_time: new Date().toJSON(),
          ...createSessionRequest,
        };
        setSession(session);
      } else {
        const response = await api.session.createSession(createSessionRequest);
        session = response.data;
        sessionAnalyticsTracker("Created session");
        getSessions();
      }
      if (reonnected) {
        localStorage.removeItem(CREATE_SESSION_DATA_ID);
      } else {
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
      if (!isOnline) {
        localStorage.setItem(EDIT_SESSION_DATA_ID, JSON.stringify(sessionEntity));
        session = {
          ...sessionEntity,
        };
      } else {
        const response = await api.session.updateSession(sessionEntity);
        session = response.data;
        sessionAnalyticsTracker("Updated session");
      }

      setSession(session);
      if (reconnected) {
        localStorage.removeItem(EDIT_SESSION_DATA_ID);
      } else {
        history.push("/instructor/dashboard");
        presentToast({ header: "Edit session successfully!", color: "success" });
      }
    } catch (err: any) {
      if (localStorage.getItem(EDIT_SESSION_DATA_ID)) {
        // if user attempt to edit a session created during offline
        localStorage.removeItem(EDIT_SESSION_DATA_ID);
      }
      presentToast({
        header: "Edit sessions failed!",
        color: "danger",
      });
    }
  };

  const deleteSession = async (session_id: number) => {
    try {
      await api.session.deleteSession(session_id);

      sessionAnalyticsTracker("Deleted session");
      presentToast({ header: "Delete session successfully!", color: "success" });
    } catch (err: any) {
      presentToast({
        header: "Delete sessions failed!",
        color: "danger",
      });
    }
  };

  //executes when internet is offline
  // sends the locally stored data into the end point when stores it in DB
  // once stored, removes it from local storage
  const sendSessionSavedData = async () => {
    if (localStorage.getItem(EDIT_SESSION_DATA_ID)) {
      updateSession(JSON.parse(localStorage.getItem(EDIT_SESSION_DATA_ID) ?? ""), true).then(() =>
        localStorage.removeItem(EDIT_SESSION_DATA_ID),
      );
    }

    if (localStorage.getItem(CREATE_SESSION_DATA_ID)) {
      createSession(JSON.parse(localStorage.getItem(CREATE_SESSION_DATA_ID) ?? ""), true).then(
        () => {
          localStorage.removeItem(CREATE_SESSION_DATA_ID);
        },
      );
    }
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
