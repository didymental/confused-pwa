import {
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonIcon,
  IonPage,
  IonRow,
  IonSpinner,
} from "@ionic/react";
import Navbar from "../../component/Navbar";
import "./index.scss";
import SessionViewCard from "./SessionViewCard";
import { add } from "ionicons/icons";
import { useHistory } from "react-router";
import { useSessions } from "../../hooks/session/useSession";
import { useEffect, useState } from "react";

const DashboardPage: React.FC = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { sessions, getSessions } = useSessions();

  const renderMainContent = () => {
    if (sessions) {
      return sessions.map((sessionData, index) => (
        <SessionViewCard key={sessionData.id} session={sessionData} index={index} />
      ));
    } else {
      return (
        <p>You have not created any sessions, press the `&quot;`+`&quot;` button to create one!</p>
      );
    }
  };

  const handleRendering = async () => {
    await getSessions();
    setIsLoading(false);
  };

  useEffect(() => {
    handleRendering();
    // eslint-disable-next-line
  }, []);

  return (
    <IonPage>
      <Navbar title={"Dashboard"} showProfileIcon={true} showLogo={true} />
      <IonContent fullscreen>
        <IonGrid className="dashboard__grid">
          <IonRow>
            <IonCol className={isLoading ? "dashboard__column" : ""}>
              {isLoading ? (
                <IonSpinner color="primary" name="crescent"></IonSpinner>
              ) : (
                renderMainContent()
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            color="dark-purple"
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
