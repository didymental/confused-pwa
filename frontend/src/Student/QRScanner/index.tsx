import {
  IonAlert,
  IonButton,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
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
  getPlatforms,
  useIonToast,
  NavContext,
  useIonLoading,
} from "@ionic/react";
import { close } from "ionicons/icons";
import "../join-page.scss";
import { useState, useEffect, useContext } from "react";
import QrScanner from "qr-scanner";
import { useHistory } from "react-router-dom";
import { useSessionCode } from "../../hooks/joinsession/useJoinDetails";
import { useToast } from "../../hooks/util/useToast";

const Scanner: React.FC = (props) => {
  const { presentToast } = useToast();
  const { goBack } = useContext(NavContext);
  const { sessionCode, setSessionCode } = useSessionCode();

  const history = useHistory();

  let [qrScanner, setQrScanner] = useState<QrScanner>();

  //Create scanner and start scanning on page load. No rerenders otherwise
  useEffect(() => {
    // const listCameras = async () => {
    //   const list = await QrScanner.listCameras();
    //   presentToast({
    //     header: "After list cameraS",
    //     message: list.toString(),
    //     color: "primary",
    //   });

    //   return list;
    // };

    const video = document.getElementById("qr-video") as HTMLVideoElement;
    if (qrScanner === undefined) {
      setQrScanner(
        new QrScanner(
          video,
          (result) => {
            setSessionCode(result.data);
            goBack();
          },
          {
            returnDetailedScanResult: true,
          },
        ),
      );
    }

    if (qrScanner !== undefined) {
      qrScanner.setCamera("environment");
      // let list = listCameras().catch((e) =>
      //   presentToast({
      //     header: "Error",
      //     color: "danger",
      //   }),
      // );

      qrScanner.start();
    }
    //Cleanup function to unload the qrScanner
    return () => {
      if (qrScanner !== undefined) {
        qrScanner.stop();
      }
    };
  }, [qrScanner, setSessionCode, goBack]);

  return (
    <IonPage>
      <IonContent fullscreen className="join-page__container splash">
        <IonGrid className="join-page_qr-container">
          <IonRow>
            <IonCol>
              <video id="qr-video" className="join-page__qr-scan-box"></video>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton color="secondary" onClick={() => goBack()}>
            <IonIcon icon={close} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Scanner;
