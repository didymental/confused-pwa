import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonItemDivider,
  IonPopover,
  IonRow,
  useIonAlert,
} from "@ionic/react";
import { createOutline, trashOutline, ellipsisVertical } from "ionicons/icons";
import { useHistory } from "react-router";
import { SessionEntity } from "../../../types/session";
import { getFormattedDate } from "../../../utils/date";
import "./index.scss";

const colors = ["yellow", "green", "red", "blue"];

interface SessionViewCardProps {
  session: SessionEntity;
  index: number;
  deleteHandler: (sessionId: number) => void;
}

const SessionViewCard: React.FC<SessionViewCardProps> = ({ session, index, deleteHandler }) => {
  const { id: sessionId, name, is_open: isOpen, created_date_time: dateTime } = session;
  const createdDate = dateTime ? getFormattedDate(dateTime) : null;
  const colorId = sessionId % 4;
  const [presentAlert] = useIonAlert();

  const history = useHistory();

  const editClickHandler = (sessionId: number) => {
    history.push(`/instructor/session/edit?id=${sessionId}&name=${name}`);
  };

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
          handler: () => deleteHandler(sessionId),
        },
      ],
    });
  };

  const startHandler = () => {
    history.push(`/instructor/session/${sessionId}`);
  };

  return (
    <>
      <IonCard key={sessionId}>
        <IonItemDivider color={colors[colorId]} className="card__topbar"></IonItemDivider>
        <IonCardContent className="card__container">
          <IonGrid>
            <IonRow>
              <IonCol size="10">
                <IonRow>
                  <IonCardTitle>{name}</IonCardTitle>
                </IonRow>
                <IonRow className="card__subtitle">
                  <IonCardSubtitle>{`Created on ${createdDate}`}</IonCardSubtitle>
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
            <IonButton fill="solid" expand="block" color={"primary"}>
              ONGOING
            </IonButton>
          ) : (
            <IonButton fill="outline" expand="block" color={"primary"} onClick={startHandler}>
              START
            </IonButton>
          )}
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default SessionViewCard;
