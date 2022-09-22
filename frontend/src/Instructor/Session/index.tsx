import "./index.scss";
import {
  IonButton,
  IonCard,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  IonCol,
  IonIcon,
  IonBadge,
  IonText,
  CreateAnimation,
  useIonAlert,
  IonCardContent,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
} from "@ionic/react";
import React, { useEffect, useState, useRef } from "react";
import { useHistory, useParams } from "react-router";
import QRCode from "react-qr-code";
import { power, shareSocial, link, copy } from "ionicons/icons";
import client, { BASE_URL, getWebSocketClient } from "../../api/client";
import { useToast } from "../../hooks/util/useToast";
import clear from "../../assets/clear-bg.svg";
import confused_1 from "../../assets/confused-1-bg.svg";
import confused_2 from "../../assets/confused-2-bg.svg";
import confused_reaction from "../../assets/confused-face.svg";
import clear_reaction from "../../assets/thumbs-up.svg";
import { StudentData } from "../../types/students";
import { QuestionData } from "../../types/questions";
import QuestionsDisplay from "../../component/QuestionsDisplay";

const CLEAR_STATE = "clear";
const CONFUSED_1_STATE = "confused-1";
const CONFUSED_2_STATE = "confused-2";

// actions for the websocket
const JOIN_SESSION = "join_session";
const LEAVE_SESSION = "leave_session";
const CLEAR_REACTIONS_ACTION = "clear_reactions";

// Base URL for shareable link
const BASE_URL_FRONTEND = "https://confusedsession.vercel.app";

/**
 * Represents the page that shows the Instructor when the Instructor is
 * in view of the session.
 */
const InstructorSessionPage: React.FC = () => {
  const [levelOfConfusion, setLevelOfConfusion] = useState<string>();
  const [questions, setQuestions] = useState<QuestionData[] | []>([]);
  const [students, setStudents] = useState<StudentData[] | []>([]);
  const { presentToast } = useToast();
  const ws = useRef<WebSocket | null>(null);
  const { id }: any = useParams();
  const sessionId = parseInt(id);
  const history = useHistory();

  useEffect(() => {
    getStudentsAndQuestionsInSession(sessionId);
    ws.current = getWebSocketClient(true);
    ws.current.onopen = () => handleWsOpen(ws.current);
    ws.current.onmessage = (e) => handleMessageListener(e);
    ws.current.onclose = () => handleWsClose(ws.current);

    const wsCurrent = ws.current;

    return () => {
      wsCurrent.close();
    };
  }, []);

  // to re render screen for each update of student or questions
  useEffect(() => {}, [students, questions]);

  // Gets all students and questions in the session
  const getStudentsAndQuestionsInSession = (sessionId: number) => {
    client
      .get("/students/")
      .then((res) => {
        let studentsInCurrSession: StudentData[] = res.data.results.filter(
          (x: { session: number }) => x.session === sessionId,
        );
        setStudents(studentsInCurrSession);

        let setOfStudents: Set<number> = new Set();
        studentsInCurrSession.forEach((student) => setOfStudents.add(student.id));

        client
          .get("/questions/")
          .then((res) => {
            let questionsFetched: QuestionData[] = res.data.results;

            setQuestions(
              questionsFetched.filter((question) => setOfStudents.has(question.student)),
            );
          })
          .catch((err) => {
            presentToast({
              header: "Error occurred!",
              message: err.response.data.detail,
              color: "danger",
            });
          });
      })
      .catch((err) => {
        presentToast({
          header: "Error occurred!",
          message: err.response.data.detail,
          color: "danger",
        });
      });
  };

  const handleWsOpen = (wsCurrent: WebSocket | null) => {
    if (!wsCurrent) {
      return;
    }
    wsCurrent.send(
      JSON.stringify({
        action: JOIN_SESSION,
        pk: sessionId,
        request_id: Math.random(),
      }),
    );
  };

  const handleWsClose = (wsCurrent: WebSocket | null) => {
    if (!wsCurrent) {
      return;
    }
  };

  const handleMessageListener = (response: MessageEvent<any>) => {
    let res = JSON.parse(response.data);

    if (res.data.type === "failed") {
      res.errors.map((err: string) => handleError(err));
    }

    // student post or vote question
    if (res.action === "create_question") {
      setQuestions((questionsParam) => {
        let questionsCopy = [...questionsParam];
        let isExistingQuestion = false;
        questionsCopy.forEach((question, index) => {
          if (question.question_content === res.data.question_content) {
            questionsCopy[index] = res.data;
            isExistingQuestion = true;
            return;
          }
        });

        if (!isExistingQuestion) {
          questionsCopy = [res.data, ...questionsParam];
        }

        return questionsCopy;
      });
    }

    // student post reaction
    if (res.action === "update_student") {
      setStudents((studentsParam) => {
        let studentsCopy = [...studentsParam];
        studentsCopy.forEach((student, index) => {
          if (student.id === res.data.id) {
            studentsCopy[index] = res.data;
            return;
          }
        });
        return studentsCopy;
      });
    }

    if (res.action === "notify_joiners") {
      setStudents((studentsParam) => {
        let studentsCopy = [...studentsParam];
        for (let i = 0; i < res.data.students.length; i++) {
          studentsCopy.push(res.data.students[i]);
        }

        return studentsCopy;
      });
    }
  };

  const handleError = (msg: string) => {
    presentToast({
      header: "Error occurred",
      message: msg,
      color: "danger",
    });
    history.push("/instructor/dashboard");
  };

  return (
    <IonPage>
      <IonContent fullscreen className={`instructor-session__background--${levelOfConfusion}`}>
        <ConfusionDisplay
          levelOfConfusion={levelOfConfusion || "clear"}
          questions={questions || []}
          students={students || []}
          sessionId={sessionId}
          setLevelOfConfusion={setLevelOfConfusion}
          setStudents={setStudents}
          ws={ws.current}
        />
      </IonContent>
    </IonPage>
  );
};

interface ConfusionDisplayProps {
  levelOfConfusion: string;
  questions: QuestionData[] | [];
  students: StudentData[] | [];
  sessionId: number;
  setLevelOfConfusion: (levelOfConfusion: string) => void;
  setStudents: (students: StudentData[]) => void;
  ws: WebSocket | null;
}

const ConfusionDisplay: React.FC<ConfusionDisplayProps> = (props) => {
  let { levelOfConfusion, questions, students, sessionId, setLevelOfConfusion, setStudents, ws } =
    props;
  const [hasAnimated, setHasAnimated] = useState(false);
  const [presentAlert] = useIonAlert();
  const history = useHistory();
  const [openModal, setOpenModal] = useState(false);
  const shareableLink = `${BASE_URL_FRONTEND}/student/session/` + sessionId;

  useEffect(() => {
    setHasAnimated(true);
  }, [props]);

  useEffect(() => {
    if (hasAnimated) {
      setHasAnimated(false);
    }
  }, [hasAnimated]);

  const endSession = () => {
    if (!ws) {
      return;
    }
    clearReactions();
    ws.send(
      JSON.stringify({
        action: LEAVE_SESSION,
        pk: sessionId,
        request_id: Math.random(),
      }),
    );

    ws.close();

    history.push("/instructor/dashboard");
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    presentAlert("Copied to clipboard!");
  };

  const clearReactions = () => {
    if (!ws) {
      return;
    }
    ws.send(
      JSON.stringify({
        action: CLEAR_REACTIONS_ACTION,
        request_id: Math.random(),
      }),
    );

    let updatedStudents = [];
    for (let i = 0; i < students.length; i++) {
      let studentCopy = { ...students[i] };
      studentCopy.reaction_type = null;
      updatedStudents.push(studentCopy);
    }
    setStudents(updatedStudents);
  };

  return (
    <>
      <IonContent fullscreen className="instructor-session__container">
        <IonGrid className="instructor-session__grid">
          <CreateAnimation
            duration={2000}
            iterations={1}
            fromTo={[{ property: "opacity", fromValue: "0.1", toValue: "1" }]}
            play={hasAnimated}
          >
            <IonRow>
              <IonCol>
                <img
                  src={mapLevelToSvg[levelOfConfusion]}
                  alt={levelOfConfusion}
                  onClick={() => {}}
                  className="instructor-session__sentiment-image"
                />
              </IonCol>
            </IonRow>
          </CreateAnimation>
          <IonRow>
            <IonCol>
              <IonText className="instructor-session__text--sentiment-indicator">
                {mapLevelToText[levelOfConfusion]}
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <QuestionsDisplay questions={questions} />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <ReactionsDisplay students={students} setLevelOfConfusion={setLevelOfConfusion} />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                className="instructor-session__button instructor-session__button--reactions"
                onClick={clearReactions}
              >
                <IonCardContent>RESET</IonCardContent>
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                className="instructor-session__button instructor-session__button--share"
                onClick={() => setOpenModal(true)}
              >
                <IonIcon icon={shareSocial} size="small" color="tertiary" />
                <IonCardContent>Share to students</IonCardContent>
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                onClick={endSession}
                className="instructor-session__button instructor-session__button--end-session"
              >
                <IonIcon icon={power} color="secondary" size="medium" />
                <IonCardContent>End Session</IonCardContent>
              </IonButton>
            </IonCol>
          </IonRow>

          <IonModal
            isOpen={openModal}
            initialBreakpoint={0.75}
            breakpoints={[0, 0.25, 0.5, 0.75]}
            onIonModalWillDismiss={() => setOpenModal(false)}
          >
            <IonContent className="instructor-session__container">
              {/* <IonHeader>
                <IonToolbar>
                  <IonTitle>Share via ...</IonTitle>
                </IonToolbar>
              </IonHeader> */}
              <IonIcon className="instructor-session__share-icon" icon={link} />

              <IonItem lines="none">
                <IonText className="instructor-session__text--header">Share the session</IonText>
              </IonItem>

              <IonItem lines="none">
                <IonText className="instructor-session__text--subheading instructor-session__text--translucent">
                  Anyone with the session code or session link can join the session
                </IonText>
              </IonItem>

              <IonItem lines="none" className="instructor-session__modal--item">
                <IonText className="instructor-session__text--subheading">
                  {`Session code: ${sessionId}`}
                </IonText>
              </IonItem>

              <IonItem lines="none" className="instructor-session__modal--item">
                <IonIcon icon={link} size="large" />
                <IonCardContent>
                  <IonText className="instructor-session__text--link">{shareableLink}</IonText>
                </IonCardContent>
              </IonItem>

              {/* <IonItem className="instructor-session__modal--item"> */}
              <IonButton onClick={copyLinkToClipboard} className="instructor-session__button--copy">
                <IonIcon icon={copy} size="medium" />
                <IonCardContent>
                  <IonText>Copy</IonText>
                </IonCardContent>
              </IonButton>
              {/* </IonItem> */}

              <IonList className="instructor-session__modal--list">
                <QRCode value={shareableLink} />
              </IonList>

              <IonCardContent>
                <IonText className="instructor-session__text--subheading">
                  {`Ask your students to scan this QR code with their \"Confused\" or with their
                    preferred QR scanner`}
                </IonText>
              </IonCardContent>
            </IonContent>
          </IonModal>
        </IonGrid>
      </IonContent>
    </>
  );
};

const ReactionsDisplay: React.FC<{
  students: StudentData[] | [];
  setLevelOfConfusion: (levelOfConfusion: string) => void;
}> = ({ students, setLevelOfConfusion }) => {
  const [countOfClear, setCountOfClear] = useState<number>(0);
  const [countOfConfused, setCountOfConfused] = useState<number>(0);
  const [ratio, setRatio] = useState<number>(0.5);

  useEffect(() => {
    let countClear = 0;
    let countConfused = 0;
    students.forEach((student) => {
      if (student.reaction_type === 2) {
        countClear += 1;
      }

      if (student.reaction_type === 1) {
        countConfused += 1;
      }
    });

    setCountOfClear(countClear);
    setCountOfConfused(countConfused);

    if (countClear === 0 && countConfused === 0) {
      setRatio(0.5);
    } else {
      let ratioOfConfused = countConfused / (countClear + countConfused);
      setRatio(ratioOfConfused);
    }
  }, [students]);

  useEffect(() => {
    if (ratio > 0.7 && ratio <= 0.9) {
      setLevelOfConfusion(CONFUSED_1_STATE);
      return;
    }

    if (ratio > 0.9) {
      setLevelOfConfusion(CONFUSED_2_STATE);
      return;
    }

    setLevelOfConfusion(CLEAR_STATE);
  }, [ratio]);

  return (
    <IonGrid>
      <IonRow>
        <IonCol className="instructor-session__reaction-display">
          <IonRow>
            <img src={confused_reaction} alt={"confused"} onClick={() => {}} />
          </IonRow>
          <IonRow>
            <IonBadge className="instructor-session__reaction-count">
              <IonText>{countOfConfused}</IonText>
            </IonBadge>
          </IonRow>
        </IonCol>
        <IonCol className="instructor-session__reaction-display">
          <IonRow>
            <img src={clear_reaction} alt={"clear"} onClick={() => {}} />
          </IonRow>
          <IonRow>
            <IonBadge className="instructor-session__reaction-count">
              <IonText>{countOfClear}</IonText>
            </IonBadge>
          </IonRow>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

/**
 * Finite state machine mapping the levelOfConfusion to svg component
 */
const mapLevelToSvg: { [key: string]: any } = {
  [CLEAR_STATE]: clear,
  [CONFUSED_1_STATE]: confused_1,
  [CONFUSED_2_STATE]: confused_2,
};

/**
 * Finite state machine mapping the levelOfConfusion to text displayed
 */
const mapLevelToText: { [key: string]: string } = {
  clear: "I am clear!",
  "confused-1": "I am confused...",
  "confused-2": "I am really confused...",
};

export default InstructorSessionPage;
