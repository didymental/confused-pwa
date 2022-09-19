import { IonButton, IonContent, IonGrid, IonPage, IonRow } from "@ionic/react";
import "./index.scss";
import logo from "../assets/logo-light.svg";
import { useHistory } from "react-router";
import { useEffect, useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import Lottie from "lottie-react";
// import splash from "../assets/splash.json";

const Splash: React.FC = () => {
  const history = useHistory();
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(true);

  useEffect(() => {
    const loadImage = (imageUrl: string) => {
      return new Promise((resolve, reject) => {
        const loadImg = new Image();
        loadImg.src = imageUrl;
        resolve(imageUrl);
        loadImg.onerror = (err) => reject(err);
      });
    };

    loadImage(logo[1])
      .then(() => {
        setTimeout(() => {
          setIsAnimationPlaying(false);
        }, 2000);
      })
      .catch((err) => console.log("Failed to load logo", err));
  }, []);

  return (
    <IonPage>
      {/* {isAnimationPlaying && (
        <AnimatePresence>
          <motion.div
            className="app-animation-outer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="app-animation">
              <Lottie autoPlay={true} className="app-lottie-animation" animationData={splash} />
            </div>
          </motion.div>
        </AnimatePresence>
      )} */}

      {!isAnimationPlaying && (
        <IonContent className="splash">
          <div className="page">
            <IonGrid>
              <IonRow className="grid__row">
                <img src={logo} className="logo" alt="logo" />
              </IonRow>
              <IonRow className="grid__row">
                <h2>Confused? You don&apos;t have to be!</h2>
              </IonRow>
              <IonRow className="grid__row">
                <p>Get started as a</p>
              </IonRow>
              <IonRow className="grid__row">
                <IonButton
                  color="secondary"
                  onClick={() => {
                    history.push("/login");
                  }}
                >
                  Instructor
                </IonButton>
              </IonRow>
              <IonRow className="grid__row">
                <p>or</p>
              </IonRow>
              <IonRow className="grid__row">
                <IonButton
                  color="secondary"
                  onClick={() => {
                    history.push("/student");
                  }}
                >
                  Student
                </IonButton>
              </IonRow>
            </IonGrid>
          </div>
        </IonContent>
      )}
    </IonPage>
  );
};

export default Splash;
