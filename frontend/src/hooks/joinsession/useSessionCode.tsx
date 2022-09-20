import { atom, useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";

const sessionCodeState = atom({
  key: "SESSION_CODE",
  default: "",
});

export const useSessionCode = () => {
  const [sessionCode, setSessionCode] = useRecoilState(sessionCodeState);

  return {
    sessionCode,
    setSessionCode,
  };
};
