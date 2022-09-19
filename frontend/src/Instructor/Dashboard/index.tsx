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
import { useHistory } from "react-router";

const DashboardPage: React.FC = () => {
  const history = useHistory();
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
        <IonGrid className="dashboard__grid">
          <IonRow>
            <IonCol>
              {data.map((sessionData) => (
                <SessionViewCard key={sessionData.sessionId} {...sessionData} />
              ))}
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            color="primary"
            className="dashboard__add-session-button"
            onClick={() => history.push("/instructor/create_session")}
          >
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default DashboardPage;
