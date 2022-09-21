import "./index.scss";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonGrid,
  IonIcon,
  IonPage,
  IonRow,
  IonSlide,
  IonSlides,
  IonTextarea,
  CreateAnimation,
  IonTitle,
  IonHeader,
} from "@ionic/react";
import React, { useEffect, useState, useRef } from "react";

import { send } from "ionicons/icons";
import confused_reaction from "../../assets/confused-face.svg";
import clear_reaction from "../../assets/thumbs-up.svg";
import { getWebSocketClient } from "../../api/client";
import { useToast } from "../../hooks/util/useToast";
import { QuestionData } from "../../types/questions";
import QuestionsDisplay from "../../component/QuestionsDisplay";
import { useSessionDetails } from "../../hooks/joinsession/useJoinDetails";

const POST_QUESTION = "post_question";
const PUT_REACTION = "put_reaction";
const JOIN_SESSION = "join_session";
const LEAVE_SESSION = "leave_session";

interface ReactionState {
  title: string;
  isSelected: boolean;
  iconUrl: string;
}

const StudentSessionPage: React.FC<void> = () => {
  const initialReactionStates: ReactionState[] = [
    { title: "I'm confused!", isSelected: false, iconUrl: confused_reaction },
    { title: "I'm OK!", isSelected: false, iconUrl: clear_reaction },
  ];
  const [reactionStates, setReactionStates] = useState<ReactionState[]>(initialReactionStates);
  const [question, setQuestion] = useState<string>("");
  const { sessionId, displayName, studentId } = useSessionDetails();
  const [questions, setQuestions] = useState<QuestionData[] | []>([]);
  const [sessionName, setSessionName] = useState<string>("");
  const { presentToast } = useToast();
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = getWebSocketClient(false);
    ws.current.onopen = () => handleWsOpen(ws.current);
    ws.current.onmessage = (e) => handleWsMessageListener(e);
    ws.current.onclose = () => handleWsClose(ws.current);
    ws.current.onerror = () => handleError("The connection has failed. Please try again.");

    const wsCurrent = ws.current;

    return () => {
      wsCurrent.close();
    };
  }, []);

  const askQuestion = (wsCurrent: WebSocket | null) => {
    if (!wsCurrent) {
      return;
    }

    wsCurrent.send(
      JSON.stringify({
        action: POST_QUESTION,
        question_content: question,
        request_id: Math.random(),
      }),
    );

    setQuestion("");
  };

  const handleWsOpen = (wsCurrent: WebSocket | null) => {
    if (!wsCurrent) {
      return;
    }
    wsCurrent.send(
      JSON.stringify({
        action: JOIN_SESSION,
        pk: sessionId,
        display_name: displayName,
        request_id: Math.random(),
      }),
    );
  };

  const handleWsClose = (wsCurrent: WebSocket | null) => {
    if (!wsCurrent) {
      return;
    }
  };

  const handleWsMessageListener = (msg: MessageEvent<any>) => {
    let res = JSON.parse(msg.data);
    console.log(res);

    if (res.data.type === "success" && res.data.questions) {
      setQuestions((questionsParam) => res.data.questions);
    }

    if (sessionName === "" && res.data.type === "update_joiners" && res.data.session) {
      setSessionName(res.data.session.name);
    }

    if (res.data.type === "failed") {
      res.errors.map((err: string) => handleError(err));
      return;
    }
    // listen to other students' questions
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
  };

  const handleError = (msg: string) => {
    presentToast({
      header: "Error occurred",
      message: msg,
      color: "danger",
    });
  };

  const handleReactionStateChange = (index: number) => {
    let newStates: ReactionState[] = [...initialReactionStates];
    newStates[index].isSelected = !reactionStates[index].isSelected;
    updateStudentReaction(newStates[index].isSelected ? newStates[index].iconUrl : "", ws.current);
    setReactionStates(newStates);
  };

  const updateStudentReaction = (reactionType: string, wsCurrent: WebSocket | null) => {
    if (!wsCurrent) {
      return;
    }
    let reactionId = null;
    if (reactionType === confused_reaction) {
      reactionId = 1;
    }

    if (reactionType === clear_reaction) {
      reactionId = 2;
    }

    wsCurrent.send(
      JSON.stringify({
        action: PUT_REACTION,
        reaction_type_pk: reactionId,
        request_id: Math.random(),
      }),
    );
  };

  return (
    <IonPage className="student-session">
      <IonHeader>
        <IonCardContent>
          <IonTitle>{sessionName}</IonTitle>
        </IonCardContent>
      </IonHeader>
      <IonContent>
        <IonGrid className="container__questions-container">
          <QuestionsDisplay questions={questions} />
        </IonGrid>

        <IonSlides
          className="student-session__grid"
          options={{
            slidesPerView: 2,
          }}
        >
          {reactionStates.map((item, index) => {
            return (
              <IonSlide key={item.title}>
                <CreateAnimation
                  play={item.isSelected}
                  iterations={1}
                  duration={400}
                  keyframes={[
                    { offset: 0, transform: "scale(1)", opacity: "1" },
                    { offset: 0.2, transform: "scale(1.2)", opacity: "0.5" },
                    { offset: 0.5, transform: "scale(1)", opacity: "1" },
                  ]}
                >
                  <IonCard
                    onClick={() => handleReactionStateChange(index)}
                    color={item.isSelected ? "primary" : "light"}
                    className="card"
                  >
                    <IonCardContent className="card__content">{item.title}</IonCardContent>
                    <IonCardContent>
                      <img src={item.iconUrl} />
                    </IonCardContent>
                  </IonCard>
                </CreateAnimation>
              </IonSlide>
            );
          })}
        </IonSlides>
        <IonGrid className="student-session__grid">
          <IonRow className="textarea">
            <IonTextarea
              placeholder="Ask a question here..."
              value={question.length === 0 ? null : question}
              onIonChange={(e) => setQuestion(e.detail.value || "")}
              rows={1}
            />
            <IonButton fill="clear" onClick={() => askQuestion(ws.current)}>
              <IonIcon icon={send} />
            </IonButton>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default StudentSessionPage;
