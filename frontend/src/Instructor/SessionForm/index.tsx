import React, { useState } from "react";
import {
  IonApp,
  IonButton,
  IonContent,
  IonPage,
  IonItem,
  IonInput,
  IonCol,
  IonRow,
  IonGrid,
  IonToast,
  IonText,
} from "@ionic/react";

import "./index.scss";

import Navbar from "../../component/Navbar";
import { useHistory } from "react-router";

const SessionForm: React.FunctionComponent = () => {
  const history = useHistory();
  const [sessionName, setSessionName] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const onSubmit = () => {
    // TODO
    if (!sessionName) {
      setMessage("Please enter a session name.");
      setIserror(true);
      return;
    }
    if (sessionName.length < 5) {
      setMessage("Please fill in at least 5 characters.");
      setIserror(true);
      return;
    }
    setIserror(false);
    setShowToast(true);
    setTimeout(() => {
      history.push("/instructor/dashboard");
    }, 800);
  };

  return (
    <IonApp>
      <IonPage>
        <Navbar title="Create Sesssion" />
        <IonContent>
          <IonGrid className="session-form__grid">
            <IonRow>
              <IonCol>
                <IonToast
                  color="success"
                  isOpen={showToast}
                  position="top"
                  onDidDismiss={() => setShowToast(false)}
                  message="Created successfully!"
                  duration={1000}
                />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="session-form__description">
                <h3>What is your session name?</h3>
                <p>Fill in a descriptive name for your session!</p>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem fill="outline">
                  {/* <IonLabel position="floating"> Email</IonLabel> */}
                  <IonInput
                    type="text"
                    placeholder="e.g. CS1101S Studio Group 8"
                    value={sessionName}
                    onIonChange={(e) => setSessionName(e.detail.value!)}
                  ></IonInput>
                </IonItem>
                {iserror && (
                  <IonText color="danger">
                    <p>{message}</p>
                  </IonText>
                )}
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol className="session-form__button">
                <IonButton onClick={onSubmit}>submit</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    </IonApp>
  );
};

export default SessionForm;
