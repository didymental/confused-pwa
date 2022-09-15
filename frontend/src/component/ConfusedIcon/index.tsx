import "./index.scss";
import logo from "../../Assets/logo.svg";

const ConfusedIcon: React.FC = () => {
  return (
    <a href="/">
      <img className="icon" src={logo} alt="logo" />
    </a>
  );
};

export default ConfusedIcon;
