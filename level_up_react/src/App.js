import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Contacto from './pages/Contacto';
import Garantia from './pages/Garantia';
import Terminos from './pages/Terminos';
import Blog from './pages/Blog';
import Catalogo from './pages/catalogo';
import Login from './pages/Login';
import Register from './pages/Register';
import Cuenta from './pages/Cuenta';
import Producto from './pages/Producto';
import './App.css';
import Header from './components/header';
import Footer from './components/footer';
import ScrollToTop from './components/ScrollToTop';

function App() {
    return (
        <Router>
            <ScrollToTop />
            <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalogo" element={<Catalogo />} />
                    <Route path="/producto.html" element={<Producto />} />
                    <Route path="/contacto" element={<Contacto />} />
                    <Route path="/garantia" element={<Garantia />} />
                    <Route path="/terminos" element={<Terminos />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/cuenta" element={<Cuenta />} />
                </Routes>
            <Footer />
        </Router>
    );
}

export default App;