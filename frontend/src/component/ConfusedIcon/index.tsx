import "./index.scss";
import logo from "../../assets/logo.svg";
import logoLight from "../../assets/logo-light.svg";
import { Link } from "react-router-dom";

interface UseLightLogo {
  useLightLogo?: boolean;
}

const ConfusedIcon: React.FC<UseLightLogo> = ({ useLightLogo = false }) => {
  return (
    <>
      <Link to="/">
        {useLightLogo ? (
          <img className="icon" src={logoLight} alt="logo" />
        ) : (
          <img className="icon" src={logo} alt="logo" />
        )}
      </Link>
    </>
  );
};

export default ConfusedIcon;
