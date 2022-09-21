import { atom, useRecoilState } from "recoil";
import { useHistory } from "react-router";
import { CreateSessionRequest, SessionEntity } from "../../types/session";
import api from "../../api";
import { useToast } from "../util/useToast";
import useAnalyticsTracker from "../util/useAnalyticsTracker";

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
  createSession: (createSessionRequest: CreateSessionRequest) => Promise<void>;
  createSampleSessions: () => Promise<void>;
  updateSession: (updateSessionRequest: SessionEntity) => Promise<void>;
  deleteSession: (sessionId: number) => Promise<void>;
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

export const useSessions = (): UpdateSessionsState => {
  const history = useHistory();
  const { sessions, setSessions, setSession } = useSessionsState();
  const { presentToast } = useToast();
  const sessionAnalyticsTracker = useAnalyticsTracker("Session");

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

  const createSession = async (createSessionRequest: CreateSessionRequest) => {
    try {
      const response = await api.session.createSession(createSessionRequest);
      const session = response.data;
      setSession(session);

      sessionAnalyticsTracker("Created session");
      history.push("/instructor/dashboard");
      presentToast({ header: "Create session success!", color: "success" });
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

  const updateSession = async (sessionEntity: SessionEntity) => {
    try {
      const response = await api.session.updateSession(sessionEntity);
      const session = response.data;
      setSession(session);

      sessionAnalyticsTracker("Updated session");
      history.push("/instructor/dashboard");
      presentToast({ header: "Edit session success!", color: "success" });
    } catch (err: any) {
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
      presentToast({ header: "Delete session success!", color: "success" });
    } catch (err: any) {
      presentToast({
        header: "Delete sessions failed!",
        color: "danger",
      });
    }
  };
  return {
    sessions,
    getSessions,
    createSession,
    createSampleSessions,
    updateSession,
    deleteSession,
  };
};
