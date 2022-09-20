import React, { useEffect, useState } from "react";
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
  IonText,
} from "@ionic/react";

import "./index.scss";

import Navbar from "../../component/Navbar";
import { useHistory, useLocation } from "react-router";
import { useToast } from "../../hooks/util/useToast";
import { useSessions } from "../../hooks/session/useSession";
import { SessionEntity } from "../../types/session";
import { useAuthentication } from "../../hooks/authentication/useAuthentication";

const SessionForm: React.FunctionComponent = () => {
  const location = useLocation();
  const history = useHistory();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<number>();
  const [sessionName, setSessionName] = useState<string>("");
  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { presentToast } = useToast();
  const { user } = useAuthentication();
  const { sessions, createSession, updateSession } = useSessions();

  useEffect(() => {
    if (location.pathname === "/instructor/session/create") {
      setIsEdit(false);
      return;
    }
    setIsEdit(true);
    const id = new URLSearchParams(location.search).get("id");
    const name = new URLSearchParams(location.search).get("name");
    setSessionId(Number(id));
    setSessionName(name ?? "");
  }, [location.pathname, location.search]);

  const handleCreate = async () => {
    await createSession({
      name: sessionName,
      is_open: false,
    });
  };

  const handleEdit = async () => {
    let old_session: SessionEntity;
    if (!sessions || !sessionId) {
      return;
    }
    for (let i = 0; i < sessions?.length; i++) {
      if (sessions[i].id === sessionId) {
        old_session = sessions[i];
        break;
      }
    }
    await updateSession({
      id: sessionId,
      instructor: user!.id,
      name: sessionName,
      is_open: old_session!.is_open,
    });
  };

  const onSubmit = () => {
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

    if (isEdit) {
      handleEdit();
    } else {
      handleCreate();
    }

    presentToast({
      header: `${isEdit ? "Edited" : "Created"} session successfully!`,
      color: "success",
    });

    setTimeout(() => {
      history.push("/instructor/dashboard");
    }, 800);
  };

  return (
    <IonApp>
      <IonPage>
        <Navbar title={`${isEdit ? "Edit" : "Create"} Sesssion`} showBackButton={true} />
        <IonContent>
          <IonGrid className="session-form__grid">
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
