import { Link } from "react-router-dom";
import '../styles/components/navButtonStyles.css';

export default function NavButton({ text, to }) {
    return (
        <Link to={to} className="btnAgregar">
        {text}
        </Link>
    );
}