import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.js';
import Contacto from './pages/Contacto';
import Garantia from './pages/Garantia';
import Terminos from './pages/Terminos';
import Blog from './pages/Blog';
import Catalogo from './pages/Catalogo.js';
import Login from './pages/Login';
import Register from './pages/Register';
import Cuenta from './pages/Cuenta';
import Producto from './pages/Producto';
import './App.css';

function App() {
    return (
        <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalogo" element={<Catalogo />} />
                    <Route path="/producto/:id" element={<Producto />} />
                    <Route path="/contacto" element={<Contacto />} />
                    <Route path="/garantia" element={<Garantia />} />
                    <Route path="/terminos" element={<Terminos />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/cuenta" element={<Cuenta />} />
                </Routes>
        </Router>
    );
}

export default App;