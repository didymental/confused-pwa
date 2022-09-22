import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
} from "@ionic/react";
import React, { useRef } from "react";

interface PolicyModalProps {
  presentingElement?: HTMLElement;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ presentingElement }) => {
  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  return (
    <IonModal
      ref={modal}
      trigger="open-modal"
      // canDismiss={canDismiss}
      presentingElement={presentingElement}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>Modal</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => dismiss()}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p className="ion-padding-horizontal">
          You must accept the terms and conditions to close this modal.
        </p>
        <IonItem></IonItem>
      </IonContent>
    </IonModal>
  );
};
