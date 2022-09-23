import "./index.scss";
import React from "react";
import { IonCard, IonList, IonItem } from "@ionic/react";
import { QuestionData } from "../../types/questions";

const QuestionsDisplay: React.FC<{ questions: QuestionData[] | [] }> = ({ questions }) => {
  return (
    <IonCard className="questions">
      <IonList className="questions__list">
        {questions.length === 0 ? (
          <IonItem className="questions__item is-transparent" key={"no-questions"}>
            There are currently no questions
          </IonItem>
        ) : (
          questions.map((question: QuestionData, index: number) => (
            <IonItem className="questions__item" key={"" + question.question_content + index}>
              {'"' + question.question_content + '"'}
            </IonItem>
          ))
        )}
      </IonList>
    </IonCard>
  );
};

export default QuestionsDisplay;
