import {
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonIcon,
  IonPage,
  IonRow,
} from "@ionic/react";
import Navbar from "../../component/Navbar";
import "./index.scss";
import SessionViewCard from "./SessionViewCard";
import { add } from "ionicons/icons";

const DashboardPage: React.FC = () => {
  const data = [
    {
      sessionId: 1,
      name: "CS3216 Lecture 1",
      isOpen: false,
    },
    {
      sessionId: 2,
      name: "Uncle Soo Classroom Week 1",
      isOpen: true,
    },
  ];

  return (
    <IonPage>
      <Navbar title={"Dashboard"} />
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol>
              {data.map((sessionData) => (
                <SessionViewCard key={sessionData.sessionId} {...sessionData} />
              ))}
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="primary" className="add-session-button">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default DashboardPage;
