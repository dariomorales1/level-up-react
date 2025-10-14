import { Link } from "react-router-dom";
import '../styles/components/sideBarStyles.css';

export default function SideBar() {
    return (
        <aside className="sideBar">
            <Link className="textSideBar" to="/cuenta/create" >Ingresar Producto</Link>
            <Link className="textSideBar" to="/cuenta/search" >Buscar Producto</Link>
            <Link className="textSideBar" to="/cuenta/list" >Listar Productos</Link>
            <Link className="textSideBar" to="/cuenta/update" >Actualizar Producto</Link>
            <Link className="textSideBar" to="/cuenta/delete" >Borrar Producto</Link>
        </aside>
        
    );
}