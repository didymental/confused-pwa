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
  IonListHeader,
  IonItem,
  IonLabel,
  IonList,
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

interface ReactionState {
  title: string;
  isSelected: boolean;
  iconUrl: string;
}

const StudentSessionPage: React.FC<{
  sessionId: number;
  studentId: number;
  displayName: string;
}> = ({ sessionId, studentId, displayName }) => {
  const initialReactionStates: ReactionState[] = [
    { title: "I'm confused!", isSelected: false, iconUrl: confused_reaction },
    { title: "I'm OK!", isSelected: false, iconUrl: clear_reaction },
  ];
  const [reactionStates, setReactionStates] = useState<ReactionState[]>(initialReactionStates);
  const [question, setQuestion] = useState<string>("");
  const { presentToast } = useToast();

  /* TO DELETE - FOR TESTING ONLY */

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
    <IonPage>
      <Navbar title={"Session Title"} />
      <IonContent>
        <IonGrid className="container__questions-container">
          <QuestionsDisplay questions={[]} />
        </IonGrid>
        <IonSlides className="slides" options={{ slidesPerView: isPlatform("mobile") ? 1.5 : 5 }}>
          {reactionStates.map((item, index) => {
            return (
              <IonSlide key={item.title}>
                <IonCard
                  onClick={() => handleReactionStateChange(index)} // database starts from 1-index
                  color={item.isSelected ? "tertiary" : "light"}
                  className="card"
                >
                  <IonCardContent className="card__content">{item.title}</IonCardContent>
                  <IonCardContent>
                    <img src={item.iconUrl} />
                  </IonCardContent>
                </IonCard>
              </IonSlide>
            );
          })}
        </IonSlides>
        <IonGrid className="ion-padding">
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
