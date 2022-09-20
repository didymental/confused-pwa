import "./index.scss";
import {
  IonButton,
  IonCard,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  IonList,
  IonListHeader,
  IonItem,
  IonCol,
  IonIcon,
  IonBadge,
  IonText,
  CreateAnimation,
  IonLabel,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { powerSharp, qrCode, shareSocialSharp } from "ionicons/icons";
import client from "../../api/client";
import { useToast } from "../../hooks/util/useToast";
import clear from "../../assets/clear-bg.svg";
import confused_1 from "../../assets/confused-1-bg.svg";
import confused_2 from "../../assets/confused-2-bg.svg";
import confused_reaction from "../../assets/confused-face.svg";
import clear_reaction from "../../assets/thumbs-up.svg";

const CLEAR_STATE = "clear";
const CONFUSED_1_STATE = "confused-1";
const CONFUSED_2_STATE = "confused-2";

/**
 * Represents the page that shows the Instructor when the Instructor is
 * in view of the session.
 *
 * @param sessionId the id of the Session the Instructor is in view of.
 */
const InstructorSessionPage: React.FC<{ sessionId: number }> = ({ sessionId }) => {
  const [levelOfConfusion, setLevelOfConfusion] = useState<string>();
  const [questions, setQuestions] = useState<QuestionData[] | []>([]);
  const [students, setStudents] = useState<StudentData[] | []>([]);
  const { presentToast } = useToast();

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

  useEffect(() => {
    sessionId = 3;
    setLevelOfConfusion(CLEAR_STATE); // default to set as clear
    getStudentsAndQuestionsInSession(sessionId);
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen className={`ion-content-instructor-session__${levelOfConfusion}`}>
        <ConfusionDisplay
          levelOfConfusion={levelOfConfusion || "clear"}
          questions={questions || []}
          students={students || []}
          sessionId={sessionId}
          setLevelOfConfusion={setLevelOfConfusion}
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
}

const ConfusionDisplay: React.FC<ConfusionDisplayProps> = (props) => {
  let { levelOfConfusion, questions, students, sessionId, setLevelOfConfusion } = props;
  const [hasAnimated, setHasAnimated] = useState(false);
  const { presentToast } = useToast();

  useEffect(() => {
    setHasAnimated(true);
  }, [props]);

  useEffect(() => {
    if (hasAnimated) {
      setHasAnimated(false);
    }
  }, [hasAnimated]);

  const endSession = () => {
    client
      .get(`/sessions/${sessionId}/`)
      .then((res) => {
        let toSend = { ...res.data, is_open: false };
        client.put(`/sessions/${sessionId}/`, toSend).catch((err) => {
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

  // TODO: share link to join session
  const shareLink = () => {};

  // TODO: open qr code to join session
  const openQrCode = () => {};

  return (
    <>
      <IonCard />
      <IonGrid className="ion-grid-instructor-session__overall">
        <CreateAnimation
          duration={2000}
          iterations={1}
          fromTo={[{ property: "opacity", fromValue: "0.1", toValue: "1" }]}
          play={hasAnimated}
        >
          <IonRow className="ion-row-instructor-session">
            <img src={mapLevelToSvg[levelOfConfusion]} alt={levelOfConfusion} onClick={() => {}} />
          </IonRow>
        </CreateAnimation>
        <IonRow className="ion-row-instructor-session">
          <IonText className="ion-text-instructor-session">
            {mapLevelToText[levelOfConfusion]}
          </IonText>
        </IonRow>
        <IonRow className="ion-row-instructor-session">
          <QuestionsDisplay questions={questions} />
        </IonRow>
        <IonRow className="ion-row-instructor-session">
          <ReactionsDisplay students={students} setLevelOfConfusion={setLevelOfConfusion} />
        </IonRow>
        <IonRow className="ion-row-instructor-session">
          <IonCol className="ion-col-instructor-session__share">
            <IonButton
              onClick={shareLink}
              className="ion-btn-instructor-session__share"
              fill="clear"
            >
              <IonIcon icon={shareSocialSharp} size="small" />
            </IonButton>
          </IonCol>
          <IonCol className="ion-col-instructor-session__share">
            <IonButton
              className="ion-btn-instructor-session__end-session"
              fill="clear"
              onClick={endSession}
            >
              <IonIcon icon={powerSharp} size="small" />
            </IonButton>
          </IonCol>
          <IonCol className="ion-col-instructor-session__share">
            <IonButton
              onClick={openQrCode}
              className="ion-btn-instructor-session__share"
              fill="clear"
            >
              <IonIcon icon={qrCode} size="small" />
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </>
  );
};

/**
 * Defines the structure of the QuestionData that
 * is received from the backend.
 */
interface QuestionData {
  student: number;
  question_content: string;
  vote_count: number;
}

/**
 * Defines the structure of the StudentData that
 * is received from the backend.
 */
interface StudentData {
  id: number;
  display_name: string;
  session: number;
  reaction_type: number | null;
}

const QuestionsDisplay: React.FC<{ questions: QuestionData[] | [] }> = ({ questions }) => {
  return questions.length === 0 ? null : (
    <IonCard className="ion-card-instructor-session__questions">
      <IonListHeader lines="full">
        <IonLabel className="ion-label-instructor-session__header">
          Questions from Students
        </IonLabel>
      </IonListHeader>
      <IonList className="ion-list-instructor-session__questions">
        {questions.map((question: QuestionData) => (
          <IonItem
            className="ion-item-instructor-session__questions"
            key={question.question_content}
          >
            {'"' + question.question_content + '"'}
          </IonItem>
        ))}
      </IonList>
    </IonCard>
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

  const clearReactions = () => {
    let toSend = [];
    for (let i = 0; i < students.length; i++) {
      let studentCopy = { ...students[i] };
      studentCopy.reaction_type = null;
      toSend.push(studentCopy);
    }
    client.put("/students/", toSend);
  };

  return (
    <IonGrid>
      <IonRow>
        <IonCol className="ion-col-instructor-session__reactions">
          <IonRow>
            <img src={confused_reaction} alt={"confused"} onClick={() => {}} />
          </IonRow>
          <IonRow>
            <IonBadge className="ion-badge-instructor-session__reactions" color="light">
              <IonText>{countOfConfused}</IonText>
            </IonBadge>
          </IonRow>
        </IonCol>
        <IonCol className="ion-col-instructor-session__reactions">
          <IonRow>
            <img src={clear_reaction} alt={"clear"} onClick={() => {}} />
          </IonRow>
          <IonRow>
            <IonBadge className="ion-badge-instructor-session__reactions" color="light">
              <IonText>{countOfClear}</IonText>
            </IonBadge>
          </IonRow>
        </IonCol>
        <IonCol className="ion-col-instructor-session__reactions">
          <IonButton
            className="ion-btn-instructor-session__reactions"
            onClick={clearReactions}
            fill="clear"
          >
            <IonText>Reset Reactions</IonText>
          </IonButton>
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
