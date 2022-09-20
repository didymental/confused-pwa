import { atom, useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";

const sessionIdInputState = atom({
  key: "SESSION_CODE",
  default: "",
});

const sessionIdState = atom({
  key: "SESSION_ID",
  default: 0,
});

const studentNameState = atom({
  key: "STUDENT_NAME",
  default: "",
});

const studentIdState = atom({
  key: "STUDENT_ID",
  default: 0,
});

export const useSessionIdInput = () => {
  const [sessionIdInput, setSessionIdInput] = useRecoilState(sessionIdInputState);

  return {
    sessionIdInput,
    setSessionIdInput,
  };
};

export const useSessionId = () => {
  const [sessionId, setSessionId] = useRecoilState(sessionIdState);

  return {
    sessionId,
    setSessionId,
  };
};

export const useStudentName = () => {
  const [studentName, setStudentName] = useRecoilState(studentNameState);

  return {
    studentName,
    setStudentName,
  };
};

export const useStudentId = () => {
  const [studentId, setStudentId] = useRecoilState(studentIdState);

  return {
    studentId,
    setStudentId,
  };
};

export const useSessionDetails = () => {
  const details = {
    session: useRecoilValue(sessionIdState),
    name: useRecoilValue(studentNameState),
    id: useRecoilValue(studentIdState),
  };

  return details;
};
