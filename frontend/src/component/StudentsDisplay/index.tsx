import "./index.scss";
import React from "react";
import { IonCard, IonList, IonItem } from "@ionic/react";
import { StudentData } from "../../types/students";

const StudentsDisplay: React.FC<{ students: StudentData[] | [] }> = ({ students }) => {
  return (
    <IonCard className="students">
      <IonList className="students__list">
        {students.length === 0 ? (
          <IonItem className="students__item is-transparent" key={"no-students"}>
            There are currently no students
          </IonItem>
        ) : (
          students.map((student: StudentData, index: number) => (
            <IonItem className="students__item" key={"" + student.display_name + index}>
              {student.display_name}
            </IonItem>
          ))
        )}
      </IonList>
    </IonCard>
  );
};

export default StudentsDisplay;
