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
import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const JoinPage: React.FC = () => {
  const [sessionPIN, setSessionPIN] = useState<string>("ABCDEF");
  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const invalidPINMsg: string = "Please enter a valid session code";
  const sessionNotFoundMsg: string = "Session not found";
  const unknownErrorMsg: string = "error. Please contact administrators for more details";

  const handleJoinSession = () => {
    if (!sessionPIN) {
      setMessage(invalidPINMsg);
      setIserror(true);
      return;
    }

    const api = axios.create({
      baseURL: "https://reqres.in/api",
    });

    let resStatus: number = 0;
    if (sessionPIN === "VALIDCODE") {
      //Simulating a valid session PIN
      api
        .get("/unknown/2")
        .then((res) => {
          console.log(res);
          resStatus = res.status;
        })
        .catch((error) => {
          console.log(error);
          setMessage(error.message + unknownErrorMsg);
          setIserror(true);
        });
    } else {
      //Simulating session not found
      api
        .get("/unknown/23")
        .then((res) => {
          console.log(res);
          resStatus = res.status;
        })
        .catch((error) => {
          console.log(error);
          setMessage(sessionNotFoundMsg + ". " + invalidPINMsg);
          setIserror(true);
        });
    }
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Enter Session Code</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding ion-text-center">
        <IonGrid>
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
              <IonIcon style={{ fontSize: "70px", color: "#0040ff" }} />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Session Code</IonLabel>
                <IonInput
                  type="text"
                  value={sessionPIN}
                  onIonChange={(e) => setSessionPIN(e.detail.value!)}
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonButton expand="block" onClick={handleJoinSession}>
                Join Session
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default JoinPage;
