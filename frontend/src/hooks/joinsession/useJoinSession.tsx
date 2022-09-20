import api from "../../api";
import { JoinSessionRequest } from "../../types/join";
import { useToast } from "../util/useToast";
import { useHistory } from "react-router-dom";

export const useJoinSession = () => {
  // const { sessionCode } = useSessionCode();
  // const { studentName } = useStudentName();
  const { presentToast } = useToast();

  const history = useHistory();

  const joinSession = async (joinRequest: JoinSessionRequest) => {
    try {
      const response = await api.join.joinSession(joinRequest);
      const { data } = response;
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
