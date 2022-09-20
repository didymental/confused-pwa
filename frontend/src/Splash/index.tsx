import { IonButton, IonContent, IonGrid, IonPage, IonRow } from "@ionic/react";
import "./index.scss";
import logo from "../assets/logo-light.svg";
import { useHistory } from "react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import splash from "../assets/question-splash-2.json";
import useAnalyticsTracker from "../hooks/util/useAnalyticsTracker";

const Splash: React.FC = () => {
  const history = useHistory();
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(true);
  const eventTracker = useAnalyticsTracker("Splash Page");

  useEffect(() => {
    const loadImage = (imageUrl: string) => {
      return new Promise((resolve, reject) => {
        const loadImg = new Image();
        loadImg.src = imageUrl;
        resolve(imageUrl);
        loadImg.onerror = (err) => reject(err);
      });
    };

    loadImage(logo)
      .then(() => {
        setTimeout(() => {
          setIsAnimationPlaying(false);
        }, 2000);
      })
      .catch((err) => console.log("Failed to load logo", err));
  }, []);

  return (
    <IonPage>
      <IonContent className="content">
        {isAnimationPlaying && (
          <AnimatePresence>
            <motion.div
              className="app-animation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="app-animation__container">
                <Lottie autoPlay={true} className="app-animation__lottie" animationData={splash} />
              </div>
            </motion.div>
          </AnimatePresence>
        )}
        {!isAnimationPlaying && (
          <div className="page">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
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
                      eventTracker("Clicked button", "Instructor");
                      history.push("/login");
                    }}
                  >
                    INSTRUCTOR
                  </IonButton>
                </IonRow>
                <IonRow className="grid__row">
                  <p>or</p>
                </IonRow>
                <IonRow className="grid__row">
                  <IonButton
                    color="secondary"
                    onClick={() => {
                      eventTracker("Clicked button", "Student");
                      history.push("/student");
                    }}
                  >
                    STUDENT
                  </IonButton>
                </IonRow>
              </IonGrid>
            </motion.div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Splash;
