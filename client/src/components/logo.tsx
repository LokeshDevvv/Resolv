import { Link } from "react-router-dom";
import logo from "../assets/Group 3.svg";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <img src={logo} alt="Logo" className="h-16 w-48" />
    </Link>
  );
};

export default Logo;