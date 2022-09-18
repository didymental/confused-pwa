import {
  IonAlert,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "../join-page.scss";
import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import logo from "../../Assets/logo-light.svg";

const JoinDetailPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const history = useHistory();

  const invalidNameMsg: string = "Please enter a valid display name";
  const sessionNotFoundMsg: string = "Session not found";
  const unknownErrorMsg: string = "error. Please contact administrators for more details";

  const handleSetName = () => {
    if (!name) {
      setMessage(invalidNameMsg);
      setIserror(true);
      return;
    }
  };
  return (
    <IonPage>
      <IonContent fullscreen className="join-page__container splash">
        <IonGrid className="join-page__content">
          <IonRow>
            <IonCol>
              <IonAlert
                isOpen={iserror}
                onDidDismiss={() => setIserror(false)}
                cssClass="my-custom-class"
                header={"Error!"}
                message={message}
                buttons={["Dismiss"]}
              />
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <img width="200em" src={logo} className="logo-noanim" alt="logo" />
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonItem fill="outline">
                <IonLabel position="floating">Display Name</IonLabel>
                <IonInput
                  type="text"
                  value={name}
                  placeholder={"John Doe"}
                  onIonChange={(e) => setName(e.detail.value!)}
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <p
                className="
                join-page__auxilliary-text--medium
                join-page__auxilliary-text--translucent
              "
              >
                This name will be displayed to your instructor. You can&apos;t change this name
                later.
              </p>
              <IonButton color="secondary" size="default" expand="block" onClick={handleSetName}>
                Join Session
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default JoinDetailPage;
