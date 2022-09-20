import { useIonToast } from "@ionic/react";

interface ToastState {
  presentToast: (props: ToastProps) => void;
}

interface ToastProps {
  header: string;
  message?: string;
  color: "success" | "danger" | "primary";
}

export const useToast = (): ToastState => {
  const [present] = useIonToast();

  const presentToast = ({ header, message, color }: ToastProps) => {
    present({
      header: header,
      message: message,
      duration: 1000,
      position: "top",
      color: color === "success" ? "toastsuccess" : color,
    });
  };

  return {
    presentToast,
  };
};
