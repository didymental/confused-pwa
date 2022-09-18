/* eslint-disable */
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
  IonCol
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import client from "../../api/client";
import Navbar from "../../component/Navbar";
import { useToast } from "../../hooks/util/useToast";

import clear from "../../assets/clear-bg.svg";
import confused_1 from "../../assets/confused-1-bg.svg";
import confused_2 from "../../assets/confused-2-bg.svg";
import confused_reaction from "../../assets/confused-face.svg";
import clear_reaction from "../../assets/thumbs-up.svg";


interface ConfusionDisplayProps {
  levelOfConfusion: string,
  questions: QuestionData[] | [],
  students: StudentData[] | [],
  sessionId: number
}

const ConfusionDisplay: React.FC<ConfusionDisplayProps> = ({ levelOfConfusion, questions, students, sessionId }) => {
  const { presentToast } = useToast();

  const endSession = () => {
    client.get(`/sessions/${sessionId}`)
      .then(res => {
        let toSend = { ...res.data, is_open: false }
        client.post(`/sessions/${sessionId}`, toSend)
          .catch(err => {
            presentToast({
              header: "Error occurred!",
              message: err.response.data.detail,
              color: "danger",
            });
          });
      })
      .catch(err => {
        presentToast({
          header: "Error occurred!",
          message: err.response.data.detail,
          color: "danger",
        });
      });

  }

  return (
    <IonCard className={`ion-card-instructor-session__${levelOfConfusion}`}>
      <IonGrid>
        <IonRow className="ion-row-instructor-session">
          <img
            src={mapLevelToSvg[levelOfConfusion]}
            alt={levelOfConfusion}
            onClick={() => { }}
          />
        </IonRow>
        <IonRow className="ion-row-instructor-session">
          <h5>
            {mapLevelToText[levelOfConfusion]}
          </h5>
        </IonRow>
        <IonRow className="ion-row-instructor-session">
          <QuestionsDisplay questions={questions} />
        </IonRow>
        <IonRow className="ion-row-instructor-session">
          <ReactionsDisplay students={students} levelOfConfusion={levelOfConfusion} />
        </IonRow>
        <IonRow className="ion-row-instructor-session">
          <IonButton
            className="ion-btn-instructor-session__end-session"
            fill="clear"
            onClick={endSession}
          >
            End Session
          </IonButton>
        </IonRow>
      </IonGrid>
    </IonCard >
  );
}

const QuestionsDisplay: React.FC<{ questions: QuestionData[] | [] }> = ({ questions }) => {
  return (
    questions.length === 0
      ? null
      : <IonList className="ion-list-instructor-session__questions">
        <IonListHeader className="ion-list-header-instructor-session__questions">
          Questions from Students
        </IonListHeader>
        <IonGrid>
          {questions.map((question: QuestionData) =>
            <IonItem className="ion-item-instructor-session__questions">
              {question.question_content}
            </IonItem>)}
        </IonGrid>
      </IonList>
  );
}

const ReactionsDisplay: React.FC<{ students: StudentData[] | [], levelOfConfusion: string }> = ({ students, levelOfConfusion }) => {
  const [countOfClear, setCountOfClear] = useState(0);
  const [countOfConfused, setCountOfConfused] = useState(0);

  useEffect(() => {
    let countClear = 0;
    let countConfused = 0;
    students.forEach(student => {
      if (student.reaction_type_id === 2) {
        countClear += 1;
      }

      if (student.reaction_type_id === 1) {
        countConfused += 1
      }
    });

    setCountOfClear(countClear);
    setCountOfConfused(countConfused);
  }, [students])

  const clearReactions = () => {
    let toSend = [];
    for (let i = 0; i < students.length; i++) {
      let studentCopy = { ...students[i] }
      studentCopy.reaction_type_id = null;
      toSend.push(studentCopy);
    }
    client.put("/students/", toSend);
  }

  return (
    <IonGrid>
      <IonRow>
        <IonCol className="ion-col-instructor-session__reactions">
          <img
            src={confused_reaction}
            alt={"confused"}
            onClick={() => { }}
          />
          <IonCard className="ion-card-instructor-session__reactions">
            {countOfConfused}
          </IonCard>
        </IonCol>
        <IonCol className="ion-col-instructor-session__reactions">
          <img
            src={clear_reaction}
            alt={"clear"}
            onClick={() => { }}
          />
          <IonCard className="ion-card-instructor-session__reactions">
            {countOfClear}
          </IonCard>
        </IonCol>
      </IonRow>
      {
        levelOfConfusion === CONFUSED_2_STATE
          ? <IonRow className="ion-row-instructor-session__reactions">
            <IonButton
              className="ion-btn-instructor-session__reactions"
              onClick={clearReactions}
            >
              Clear Reactions
            </IonButton>
          </IonRow>
          : null
      }
    </IonGrid>
  );
}

/**
 * Defines the structure of the QuestionData that 
 * is received from the backend.
 */
interface QuestionData {
  student_id: number,
  question_content: string,
  vote_count: number
}

/**
 * Defines the structure of the StudentData that 
 * is received from the backend.
 */
interface StudentData {
  id: number,
  display_name: string,
  session_id: number,
  reaction_type_id: number | null
}

const InstructorSessionPage: React.FC<{ sessionId: number }> = ({ sessionId }) => {
  const [levelOfConfusion, setLevelOfConfusion] = useState<string>();
  const [questions, setQuestions] = useState<QuestionData[] | []>([]);
  const [students, setStudents] = useState<StudentData[] | []>([]);
  const { presentToast } = useToast();

  // Gets all students and questions in the session
  const getStudentsAndQuestionsInSession = (sessionId: number) => {
    client.get("/students/").then(res => {
      let studentsInCurrSession: StudentData[] = res.data.results
        .filter((x: { session_id: number; }) => x.session_id === sessionId);
      setStudents(studentsInCurrSession)

      let setOfStudents: Set<number> = new Set();
      studentsInCurrSession.forEach(student => setOfStudents.add(student.id))

      client.get("/questions/")
        .then(res => {
          let questionsFetched: QuestionData[] = res.data.results;
          setQuestions(questionsFetched.filter(question => setOfStudents.has(question.student_id)));
        }).catch(err => {
          presentToast({
            header: "Error occurred!",
            message: err.response.data.detail,
            color: "danger",
          });
        });

    }).catch(err => {
      presentToast({
        header: "Error occurred!",
        message: err.response.data.detail,
        color: "danger",
      });
    });
  }

  useEffect(() => {
    sessionId = 3; /** TODO: delete after integration with other parts **/
    setLevelOfConfusion(CONFUSED_2_STATE) // default to set as clear
    getStudentsAndQuestionsInSession(sessionId)
  }, []);

  return (
    <IonPage>
      <Navbar title={"Session Title"} />
      <IonContent fullscreen>
        <ConfusionDisplay
          levelOfConfusion={levelOfConfusion || "clear"}
          questions={questions || []}
          students={students || []}
          sessionId={sessionId}
        />
      </IonContent>
    </IonPage>
  );
};

const CLEAR_STATE = "clear";
const CONFUSED_1_STATE = "confused-1";
const CONFUSED_2_STATE = "confused-2";

/**
 * Finite state machine mapping the levelOfConfusion to svg component
 */
const mapLevelToSvg: { [key: string]: any } = {
  [CLEAR_STATE]: clear,
  [CONFUSED_1_STATE]: confused_1,
  [CONFUSED_2_STATE]: confused_2
};

/**
 * Finite state machine mapping the levelOfConfusion to text displayed
 */
const mapLevelToText: { [key: string]: string } = {
  "clear": "I am clear!",
  "confused-1": "I am confused...",
  "confused-2": "I am really confused..."
}

const mapReactionIdToSvg: { [key: number]: any } = {
  1: confused_reaction,
  2: clear_reaction
}

export default InstructorSessionPage;
