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
  isPlatform,
  CreateAnimation,
  IonCol,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import Navbar from "../../component/Navbar";
import { send } from "ionicons/icons";
import confused_reaction from "../../assets/confused-face.svg";
import clear_reaction from "../../assets/thumbs-up.svg";
import client from "../../api/client";
import { useToast } from "../../hooks/util/useToast";
import { StudentData } from "../../types/students";
import { QuestionData } from "../../types/questions";
import QuestionsDisplay from "../../component/QuestionsDisplay";
import { toUSVString } from "util";

interface ReactionState {
  title: string;
  isSelected: boolean;
  iconUrl: string;
}

const StudentSessionPage: React.FC<{
  sessionId: number;
  studentId: number;
  displayName: string;
}> = (props) => {
  let { sessionId, studentId, displayName } = props;
  const initialReactionStates: ReactionState[] = [
    { title: "I'm confused!", isSelected: false, iconUrl: confused_reaction },
    { title: "I'm OK!", isSelected: false, iconUrl: clear_reaction },
  ];
  const [reactionStates, setReactionStates] = useState<ReactionState[]>(initialReactionStates);
  const [question, setQuestion] = useState<string>("");
  const { presentToast } = useToast();

  /* TO DELETE - FOR TESTING ONLY */
  sessionId = 3;
  studentId = 3;
  displayName = "Test User";

  // on mount, reset all reactions to false
  useEffect(() => {
    updateStudentReaction("", studentId);

    // on dismount, clear all reactions from student
    return () => {
      updateStudentReaction("", studentId);
    };
  }, []);

  const getQuestionsInSession = () => {
    // To change to GET_QUESTION action from websocket
  };

  const upVoteQuestion = () => {
    // To change to PUT_QUESTION action from websocket
  };

  const askQuestion = () => {
    let toSend: QuestionData = {
      student: studentId,
      question_content: question,
      vote_count: 0,
    };

    // To change to POST_QUESTION action on websocket
    client
      .post("/questions/", toSend)
      .then((res) => {
        setQuestion("");
      })
      .catch((err) => {
        presentToast({
          header: "Error occurred!",
          message: err.response.data.detail,
          color: "danger",
        });
      });
  };

  const handleReactionStateChange = (index: number) => {
    let newStates: ReactionState[] = [...initialReactionStates];
    newStates[index].isSelected = !reactionStates[index].isSelected;
    setReactionStates(newStates);
    updateStudentReaction(newStates[index].isSelected ? newStates[index].iconUrl : "", studentId);
  };

  const updateStudentReaction = (reactionType: string, studentId: number) => {
    let reactionId = null;
    if (reactionType === confused_reaction) {
      reactionId = 1;
    }

    if (reactionType === clear_reaction) {
      reactionId = 2;
    }

    let toSend: StudentData = {
      id: studentId,
      display_name: displayName,
      session: sessionId,
      reaction_type: reactionId,
    };

    // To change to PUT_REACTION on Websocket
    client.put(`/students/${studentId}`, toSend).catch((err) => {
      presentToast({
        header: "Error occurred!",
        message: err.response.data.detail,
        color: "danger",
      });
    });
  };

  return (
    <IonPage className="student-session">
      <Navbar title={"Session Title"} />
      <IonContent>
        <IonGrid className="container__questions-container">
          <QuestionsDisplay questions={[]} />
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
            <IonButton fill="clear" onClick={askQuestion}>
              <IonIcon icon={send} />
            </IonButton>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default StudentSessionPage;
