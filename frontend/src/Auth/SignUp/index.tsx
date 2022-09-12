import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";

const SignUp: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sign Up</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p>This is the sign up page.</p>
      </IonContent>
    </IonPage>
  );
};

export default SignUp;
