import React from "react";
import '../styles/homeStyles.css';
import { HeaderNav } from "../components/header";
import { Footer } from "../components/footer";

export function Home() {
    return (
        <div className="home-container">
            <HeaderNav />
            <div className="home-content">
                <h1>Welcome to Level Up React!</h1>
                <p>This is the hoame page of your React application.</p>
            </div>
            <Footer />
        </div>
    );
}