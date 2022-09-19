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
import { createOutline, trashOutline, ellipsisVertical } from "ionicons/icons";
import { useHistory } from "react-router";
import "./index.scss";

interface SessionData {
  sessionId: number;
  name: string;
  isOpen: boolean;
}

const SessionViewCard: React.FC<SessionData> = ({ sessionId, name, isOpen }) => {
  const history = useHistory();
  // TODO
  const deleteHandler = () => {};

  const editClickHandler = (sessionId: number) => {
    history.push(`/instructor/session/edit?id=${sessionId}&name=${name}`);
  };
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
              <IonCol className="dashboard__menu" size="2">
                <IonButton
                  id={`ellipsis-button-${sessionId}`}
                  fill="clear"
                  size="large"
                  className="dashboard__ellipsis-button"
                >
                  <IonIcon icon={ellipsisVertical}></IonIcon>
                </IonButton>
                <IonPopover
                  dismiss-on-select
                  trigger={`ellipsis-button-${sessionId}`}
                  triggerAction="click"
                >
                  <IonButton fill="clear" onClick={() => editClickHandler(sessionId)}>
                    <IonIcon slot="start" icon={createOutline}></IonIcon>
                    Edit Session
                  </IonButton>
                  <IonButton fill="clear" onClick={deleteClickHandler}>
                    <IonIcon slot="start" icon={trashOutline}></IonIcon>
                    Delete Session
                  </IonButton>
                </IonPopover>
              </IonCol>
            </IonRow>
          </IonGrid>
          {isOpen ? (
            <IonButton fill="solid" expand="block" color="secondary">
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
