import "./index.scss";
import React from "react";
import { IonCard, IonList, IonListHeader, IonItem, IonLabel } from "@ionic/react";
import { QuestionData } from "../../types/questions";

const QuestionsDisplay: React.FC<{ questions: QuestionData[] | [] }> = ({ questions }) => {
  return (
    <IonCard className="questions">
      <IonListHeader lines="full">
        <IonLabel className="questions__list-header-label">Questions from Students</IonLabel>
      </IonListHeader>
      <IonList className="questions__list">
        {questions.map((question: QuestionData) => (
          <IonItem className="questions__item is-transparent" key={question.question_content}>
            {'"' + question.question_content + '"'}
          </IonItem>
        ))}
      </IonList>
    </IonCard>
  );
};

export default QuestionsDisplay;
