import { atom, useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";

const sessionCodeState = atom({
  key: "SESSION_CODE",
  default: "",
});

const studentNameState = atom({
  key: "STUDENT_NAME",
  default: "",
});

export const useSessionCode = () => {
  const [sessionCode, setSessionCode] = useRecoilState(sessionCodeState);

  return {
    sessionCode,
    setSessionCode,
  };
};

export const useStudentName = () => {
  const [studentName, setStudentName] = useRecoilState(studentNameState);

  return {
    studentName,
    setStudentName,
  };
};
