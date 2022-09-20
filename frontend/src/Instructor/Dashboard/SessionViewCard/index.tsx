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
  useIonLoading,
} from "@ionic/react";
import { createOutline, trashOutline, ellipsisVertical } from "ionicons/icons";
import { useHistory } from "react-router";
import { useSessions } from "../../../hooks/session/useSession";
import { SessionEntity } from "../../../types/session";
import "./index.scss";
import moment from "moment";

const SessionViewCard: React.FC<SessionEntity> = (session) => {
  const sessionId = session.id;
  const name = session.name;
  const isOpen = session.is_open;
  // TODO: convert to correct date format
  const createdAt = moment(session.created_date_time ?? null).format("YYYY/MM/DD kk:mm:ss");

  const history = useHistory();
  const { getSessions, deleteSession } = useSessions();
  const [present, dismiss] = useIonLoading();

  const deleteHandler = async (sessionId: number) => {
    present({
      message: "Deleting",
    });
    await deleteSession(sessionId);
    await getSessions();
    dismiss();
  };

  const editClickHandler = (sessionId: number) => {
    history.push(`/instructor/session/edit?id=${sessionId}&name=${name}`);
  };
  const [presentAlert] = useIonAlert();
  const deleteClickHandler = (sessionId: number) => {
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
          handler: () => deleteHandler(sessionId),
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
                  <IonCardSubtitle>{`Created at: ${createdAt}`}</IonCardSubtitle>
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
                  <IonButton fill="clear" onClick={() => deleteClickHandler(sessionId)}>
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
