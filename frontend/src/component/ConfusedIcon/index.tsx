import "./index.scss";
import logo from "../../assets/logo.svg";
import logoLight from "../../assets/logo-light.svg";
import { useState } from "react";
import { IonSpinner } from "@ionic/react";
import { Link } from "react-router-dom";

interface UseLightLogo {
  useLightLogo?: boolean;
}

const ConfusedIcon: React.FC<UseLightLogo> = ({ useLightLogo = false }) => {
  // const [loading, setLoading] = useState(true);

  return (
    <>
      {/* <div style={{ display: loading ? "block" : "none" }}>
        <IonSpinner name="crescent" />
      </div> */}
      <Link to="/">
        {useLightLogo ? (
          <img className="icon" src={logoLight} alt="logo" />
        ) : (
          //onLoad={() => setLoading(false)} />
          <img className="icon" src={logo} alt="logo" />
          //onLoad={() => setLoading(false)} />
        )}
      </Link>
    </>
  );
};

export default ConfusedIcon;
