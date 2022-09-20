import { atom, useRecoilState } from "recoil";
import { useHistory } from "react-router";
import { CreateSessionRequest, SessionEntity } from "../../types/session";
import api from "../../api";
import { useToast } from "../util/useToast";

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
  updateSession: (updateSessionRequest: SessionEntity) => Promise<void>;
  deleteSession: (sessionId: number) => Promise<void>;
}

export const useSessions = (): UpdateSessionsState => {
  const history = useHistory();
  const { sessions, setSessions, setSession } = useSessionsState();
  const { presentToast } = useToast();
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
      history.push("/instructor/dashboard");
      presentToast({ header: "Create session successfully!", color: "success" });
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
      history.push("/instructor/dashboard");
      presentToast({ header: "Edit session successfully!", color: "success" });
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
      presentToast({ header: "Delete session successfully!", color: "success" });
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
    updateSession,
    deleteSession,
  };
};
