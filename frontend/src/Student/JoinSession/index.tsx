import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";

const JoinPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Join A Session</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p>This is the join session page.</p>
      </IonContent>
    </IonPage>
  );
};

export default JoinPage;
