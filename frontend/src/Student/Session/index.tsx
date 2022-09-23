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
  IonToolbar,
  IonButtons,
  IonSpinner,
  IonProgressBar,
  IonLabel,
  IonInput,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import { useKeyboardState } from "@ionic/react-hooks/keyboard";
import React, { useEffect, useState, useRef } from "react";
import { send } from "ionicons/icons";
import confused_reaction from "../../assets/confused-face.svg";
import clear_reaction from "../../assets/thumbs-up.svg";
import { getWebSocketClient } from "../../api/client";
import { useToast } from "../../hooks/util/useToast";
import { QuestionData } from "../../types/questions";
import QuestionsDisplay from "../../component/QuestionsDisplay";
import { useSessionDetails } from "../../hooks/joinsession/useJoinDetails";
import { useHistory, useParams } from "react-router";
import useAnalyticsTracker from "../../hooks/util/useAnalyticsTracker";
import StudentsDisplay from "../../component/StudentsDisplay";
import useWindowDimensions from "../../hooks/util/useWindowDimensions";

const POST_QUESTION = "post_question";
const PUT_REACTION = "put_reaction";
const JOIN_SESSION = "join_session";
const LEAVE_SESSION_ACTION = "leave_session";

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
  const [questions, setQuestions] = useState<QuestionData[] | []>([]);
  const [sessionName, setSessionName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { presentToast } = useToast();
  const ws = useRef<WebSocket | null>(null);
  const history = useHistory();
  const { sessionId, displayName } = useSessionDetails();
  const profileAnalyticsTracker = useAnalyticsTracker("Student In Session");
  const [selectedTab, setSelectedTab] = useState<string>("questions");
  const { isOpen, keyboardHeight } = useKeyboardState();
  // const {width, height} = useWindowDimensions();

  useEffect(() => {
    ws.current = getWebSocketClient(false);
    const wsCurrent = ws.current;
    wsCurrent.onopen = () => handleWsOpen(wsCurrent);
    wsCurrent.onmessage = (e) => handleWsMessageListener(e);
    wsCurrent.onclose = () => handleWsClose(wsCurrent);
    wsCurrent.onerror = () => handleError("The connection has failed. Please try again.");

    return () => {
      wsCurrent.close();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      console.log("i am scrolling");
      window.scroll({
        top: keyboardHeight,
        behavior: "smooth",
      });
    } else {
      window.scroll({
        top: keyboardHeight ? -keyboardHeight : 0,
        behavior: "smooth",
      });
    }
  }, [isOpen]);

  const askQuestion = (wsCurrent: WebSocket | null) => {
    if (!wsCurrent) {
      return;
    }

    if (question === "") {
      presentToast({
        header: "Note!",
        message: "Please type a question",
        color: "danger",
      });
    }

    profileAnalyticsTracker("Student ask questions");
    wsCurrent.send(
      JSON.stringify({
        action: POST_QUESTION,
        question_content: question,
        request_id: Math.random(),
      }),
    );

    setQuestion("");
  };

  const handleWsOpen = (wsCurrent: WebSocket | null) => {};

  const handleWsClose = (wsCurrent: WebSocket | null) => {
    if (!wsCurrent) {
      return;
    }
    setIsLoading(true);
  };

  const handleWsMessageListener = (msg: MessageEvent<any>) => {
    let res = JSON.parse(msg.data);

    console.log("kw res", res);

    if (res.action === "connect" && res.data.type === "success") {
      if (!ws.current) {
        return; // not possible
      }

      // join session
      ws.current.send(
        JSON.stringify({
          action: JOIN_SESSION,
          pk: sessionId,
          display_name: displayName,
          request_id: Math.random(),
        }),
      );
      setIsLoading(false);
    }

    if (res.data.message === "You have left or been removed from session " + sessionId) {
      leaveSession(ws.current);
      presentToast({
        header: "Notification",
        message: "You have left or been removed from session",
        color: "success",
      });
    }

    if (res.data.type === "update_clear_reactions") {
      setReactionStates(initialReactionStates);
    }

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
    history.goBack();
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

    if (reactionType !== "") {
      profileAnalyticsTracker("Student send reaction");
    }

    wsCurrent.send(
      JSON.stringify({
        action: PUT_REACTION,
        reaction_type_pk: reactionId,
        request_id: Math.random(),
      }),
    );
  };

  const leaveSession = (wsCurrent: WebSocket | null) => {
    if (!wsCurrent) {
      return null;
    }

    profileAnalyticsTracker("Student leave session");

    updateStudentReaction("", wsCurrent);

    wsCurrent.send(
      JSON.stringify({
        action: LEAVE_SESSION_ACTION,
        request_id: Math.random(),
      }),
    );
    wsCurrent.close();
    history.goBack();
  };

  const openKeyboard = () => {};

  const closeKeyboard = () => {};

  return (
    <IonPage className="student-session">
      {isLoading ? (
        <IonProgressBar type="indeterminate" color="tertiary" />
      ) : (
        <>
          <IonHeader>
            <IonToolbar className="toolbar">
              <IonLabel className="toolbar__title">{sessionName}</IonLabel>
              <IonButtons slot="end">
                <IonButton onClick={() => leaveSession(ws.current)}>Leave Session</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen className="student-session__container">
            <IonGrid className="student-session__grid">
              <IonRow>
                <IonSegment value={selectedTab}>
                  <IonSegmentButton value="questions">
                    <IonLabel>Questions from students ({questions.length})</IonLabel>
                  </IonSegmentButton>
                </IonSegment>
                <QuestionsDisplay questions={questions} />
              </IonRow>
              <IonRow>
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
                              <img src={item.iconUrl} alt={"reaction"} />
                            </IonCardContent>
                          </IonCard>
                        </CreateAnimation>
                      </IonSlide>
                    );
                  })}
                </IonSlides>
              </IonRow>
              <IonRow className="textarea">
                <IonInput
                  placeholder="Ask a question here..."
                  value={question.length === 0 ? null : question}
                  onIonChange={(e) => setQuestion(e.detail.value || "")}
                  onIonFocus={openKeyboard}
                  onIonBlur={closeKeyboard}
                />
                <IonButton fill="clear" onClick={() => askQuestion(ws.current)}>
                  <IonIcon icon={send} />
                </IonButton>
              </IonRow>
            </IonGrid>
          </IonContent>
        </>
      )}
    </IonPage>
  );
};

export default StudentSessionPage;
