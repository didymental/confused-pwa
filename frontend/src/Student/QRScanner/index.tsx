import {
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonIcon,
  IonPage,
  IonRow,
} from "@ionic/react";
import { close } from "ionicons/icons";
import "../join-page.scss";
import { useState, useEffect } from "react";
import QrScanner from "qr-scanner";
import { useHistory, Redirect } from "react-router-dom";
import { useSessionIdInput } from "../../hooks/joinsession/useJoinDetails";

const Scanner: React.FC = (props) => {
  const { sessionIdInput, setSessionIdInput } = useSessionIdInput();
  const [shouldGoBack, setShouldGoBack] = useState(false);

  const history = useHistory();

  let [qrScanner, setQrScanner] = useState<QrScanner>();

  //Create scanner and start scanning on page load. No rerenders otherwise
  useEffect(() => {
    setShouldGoBack(false);

    /* Code to listt all available cameras
    const listCameras = async () => {
      const list = await QrScanner.listCameras();
      presentToast({
        header: "After list cameraS",
        message: list.toString(),
        color: "primary",
      });

      return list;
    };
    */

    const video = document.getElementById("qr-video") as HTMLVideoElement;
    if (qrScanner === undefined) {
      setQrScanner(
        new QrScanner(
          video,
          (result) => {
            setSessionIdInput(result.data);
            setShouldGoBack(true);
          },
          {
            returnDetailedScanResult: true,
          },
        ),
      );
    }

    if (qrScanner !== undefined) {
      qrScanner.setCamera("environment");

      qrScanner.start();
    }
    //Cleanup function to unload the qrScanner
    return () => {
      if (qrScanner !== undefined) {
        qrScanner.stop();
      }
    };
  }, [qrScanner, setSessionIdInput, setShouldGoBack]);

  return (
    <IonPage>
      <IonContent fullscreen className="join-page__container">
        <IonGrid className="join-page__container">
          <IonRow>
            <IonCol>
              <video id="qr-video" className="join-page__qr-scan-box"></video>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton color="secondary" onClick={() => setShouldGoBack(true)}>
            <IonIcon icon={close} />
          </IonFabButton>
        </IonFab>
        {shouldGoBack ? <Redirect to="/student" /> : <></>}
      </IonContent>
    </IonPage>
  );
};

export default Scanner;
