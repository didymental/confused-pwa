import api from "../../api";
import { JoinSessionRequest } from "../../types/join";
import { useToast } from "../util/useToast";
import { useHistory } from "react-router-dom";
import { useStudentId, useSessionId } from "./useJoinDetails";

export const useJoinSession = () => {
  // const { sessionCode } = useSessionCode();
  // const { studentName } = useStudentName();
  const { presentToast } = useToast();

  const { setStudentId } = useStudentId();
  const { setSessionId } = useSessionId();

  const history = useHistory();

  const joinSession = async (joinRequest: JoinSessionRequest) => {
    try {
      const response = await api.join.joinSession(joinRequest);
      const { data } = response;
      setStudentId(data.id);
      setSessionId(data.session);
      history.push("/student/session");
    } catch (err) {
      presentToast({
        header: "Join session failed",
        message: "Invalid session code",
        color: "danger",
      });
    }
  };

  return {
    joinSession,
  };
};
