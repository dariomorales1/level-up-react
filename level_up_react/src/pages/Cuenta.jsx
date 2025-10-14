import React from 'react';
import SideBar from '../components/sideBar';
import '../styles/pages/cuentaStyles.css';

export default function Cuenta() {
    return (
        <div className="container-fluid cuenta-page">
            <div className="row">
                <div className="col-2 sideBarContainer">
                    <SideBar />
                </div>
                <div className="col-8">
                    <h1>Cuenta</h1>
                </div>
                <div className="col-2"></div>
            </div>
        </div>
    );
};