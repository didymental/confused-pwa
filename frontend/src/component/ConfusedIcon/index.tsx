import "./index.scss";
import logo from "../../assets/logo.svg";
import { useState } from "react";
import { IonSpinner } from "@ionic/react";

const ConfusedIcon: React.FC = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <div style={{ display: loading ? "block" : "none" }}>
        <IonSpinner name="crescent" />
      </div>
      <a href="/">
        <img className="icon" src={logo} alt="logo" onLoad={() => setLoading(false)} />
      </a>
    </>
  );
};

export default ConfusedIcon;
