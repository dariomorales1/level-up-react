import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
    return (
        <footer className="footer">
            <p>&copy; 2024 Level Up React. All rights reserved.</p>
            <Link to="/catalogo">Catalogo</Link>
            <Link to="/">Home</Link>
        </footer>
    );
};