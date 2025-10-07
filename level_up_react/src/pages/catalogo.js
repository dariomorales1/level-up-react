import React from "react";
import '../styles/catalogoStyles.css';
import { HeaderNav } from "../components/header";
import { Footer } from "../components/footer";
import { Link } from "react-router-dom";

export function Catalogo() {
    return (
        <div className="catalogo-container">
            <HeaderNav />
            <div>
                <h1>Catalogo Page</h1>
                <p>This is the catalogo page of your React application.</p>
                <Link to="/">Atras</Link>
            </div>
            <Footer />
        </div>
    );
}