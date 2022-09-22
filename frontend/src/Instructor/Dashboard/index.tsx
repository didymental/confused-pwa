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
  useIonLoading,
} from "@ionic/react";
import Navbar from "../../component/Navbar";
import "./index.scss";
import SessionViewCard from "./SessionViewCard";
import { add } from "ionicons/icons";
import { useHistory } from "react-router";
import { useSessions } from "../../hooks/session/useSession";
import { useEffect, useState } from "react";
import { useOnlineStatus } from "../../hooks/util/useOnlineStatus";

const DashboardPage: React.FC = () => {
  const history = useHistory();
  const isOnline = useOnlineStatus();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { sessions, getSessions, deleteSession, sendSessionSavedData } = useSessions(isOnline);
  const [present, dismiss] = useIonLoading();
  const renderMainContent = () => {
    if (sessions) {
      return sessions.map((sessionData) => (
        <SessionViewCard key={sessionData.id} deleteHandler={handleDelete} session={sessionData} />
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

  const handleDelete = async (sessionId: number) => {
    await present({
      message: "Deleting",
    });
    await deleteSession(sessionId);
    await getSessions();
    await dismiss();
  };

  useEffect(() => {
    handleRendering();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isOnline) {
      sendSessionSavedData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

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
