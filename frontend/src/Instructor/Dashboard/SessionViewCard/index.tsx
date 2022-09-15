import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonPopover,
  IonRow,
  useIonAlert,
} from "@ionic/react";
import { ellipsisVertical } from "ionicons/icons";
import "./index.scss";

interface SessionData {
  sessionId: number;
  name: string;
  isOpen: boolean;
}

const SessionViewCard: React.FC<SessionData> = ({ sessionId, name, isOpen }) => {
  const deleteHandler = () => {};

  const [presentAlert] = useIonAlert();
  const deleteClickHandler = () => {
    presentAlert({
      header: "Are you sure you want to delete this session?",
      subHeader: "This action is irreversible!",
      buttons: [
        {
          text: "CANCEL",
          role: "cancel",
        },
        {
          text: "DELETE",
          role: "destructive",
          handler: deleteHandler,
        },
      ],
    });
  };

  return (
    <>
      <IonCard key={sessionId}>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size="10">
                <IonRow>
                  <IonCardTitle>{name}</IonCardTitle>
                </IonRow>
                <IonRow>
                  <IonCardSubtitle>Created at:</IonCardSubtitle>
                </IonRow>
              </IonCol>
              <IonCol size="2">
                <IonButton
                  id={`ellipsis-button-${sessionId}`}
                  fill="clear"
                  size="large"
                  className="ellipsis-button"
                >
                  <IonIcon icon={ellipsisVertical}></IonIcon>
                </IonButton>
                <IonPopover trigger={`ellipsis-button-${sessionId}`} triggerAction="click">
                  <IonButton fill="clear">Edit Session</IonButton>
                  <IonButton fill="clear" onClick={deleteClickHandler}>
                    Delete Session
                  </IonButton>
                </IonPopover>
              </IonCol>
            </IonRow>
          </IonGrid>
          {isOpen ? (
            <IonButton fill="solid" expand="block" color="tertiary">
              ONGOING
            </IonButton>
          ) : (
            <IonButton fill="solid" expand="block" color="success">
              START
            </IonButton>
          )}
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default SessionViewCard;
