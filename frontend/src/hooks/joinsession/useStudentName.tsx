import { atom, useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";

const studentNameState = atom({
  key: "STUDENT_NAME",
  default: "",
});

export const useStudentName = () => {
  const [studentName, setStudentName] = useRecoilState(studentNameState);

  return {
    studentName,
    setStudentName,
  };
};
