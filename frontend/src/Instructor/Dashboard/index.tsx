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
import { useSessions } from "../../hooks/session/useSession";
import { useEffect } from "react";

const DashboardPage: React.FC = () => {
  const history = useHistory();
  const { sessions, getSessions } = useSessions();

  useEffect(() => {
    getSessions();
  }, []);

  return (
    <IonPage>
      <Navbar title={"Dashboard"} showProfileIcon={true} showLogo={true} />
      <IonContent fullscreen>
        <IonGrid className="dashboard__grid">
          <IonRow>
            <IonCol>
              {sessions &&
                sessions.map((sessionData) => (
                  <SessionViewCard key={sessionData.id} {...sessionData} />
                ))}
              {!sessions && (
                <p>
                  You have not created any sessions, press the `&quot;`+`&quot;` button to create
                  one!
                </p>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            color="primary"
            className="dashboard__add-session-button"
            onClick={() => history.push("/instructor/session/create")}
          >
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default DashboardPage;
