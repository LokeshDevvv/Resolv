import logo from "@/assets/logo.svg";
import {Link} from "react-router-dom";

const Logo = ({href}: { href?: string }) => {
    return (<Link to={href || "/"}><img src={logo} alt={'logo'} className={'w-48'}/></Link>);
};

export default Logo;