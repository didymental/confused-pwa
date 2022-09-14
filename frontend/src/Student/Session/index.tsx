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
} from "@ionic/react";
import React, { useState } from "react";
import Navbar from "../../component/Navbar";
import { send } from "ionicons/icons";

interface ReactionState {
  title: string;
  isSelected: boolean;
  iconUrl: string;
}

const StudentSessionPage: React.FC = () => {
  const initialReactionStates: ReactionState[] = [
    { title: "I'm confused!", isSelected: false, iconUrl: "" },
    { title: "I'm OK!", isSelected: false, iconUrl: "" },
  ];
  const [reactionStates, setReactionStates] = useState<ReactionState[]>(initialReactionStates);

  const handleReactionStateChange = (index: number) => {
    let newStates: ReactionState[] = [...initialReactionStates];
    newStates[index].isSelected = !reactionStates[index].isSelected;
    setReactionStates(newStates);
  };

  return (
    <IonPage>
      <Navbar title={"Session Title"} />
      <IonContent>
        <IonGrid className="container__questions-container"></IonGrid>
        <IonSlides className="slides" options={{ slidesPerView: isPlatform("mobile") ? 1.5 : 5 }}>
          {reactionStates.map((item, index) => {
            return (
              <IonSlide key={item.title}>
                <IonCard
                  onClick={() => handleReactionStateChange(index)}
                  color={item.isSelected ? "tertiary" : "light"}
                  className="card"
                >
                  <IonCardContent className="card__content">{item.title}</IonCardContent>
                </IonCard>
              </IonSlide>
            );
          })}
        </IonSlides>
        <IonGrid className="ion-padding">
          <IonRow className="textarea">
            <IonTextarea placeholder="Ask a question here..." rows={1} />
            <IonButton fill="clear">
              <IonIcon icon={send} />
            </IonButton>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default StudentSessionPage;
