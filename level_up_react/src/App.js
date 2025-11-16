import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
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
import AdminProductos from './pages/AdminProductos';    
import CrearProducto from './pages/CrearProducto';
import Direcciones from './pages/Direcciones';
import HistorialCompras from './pages/HistorialCompras';
import Dashboard from './pages/Dashboard';
import AdminProductosHome from './pages/AdminProductosHome';
import AdminUsuariosHome from './pages/AdminUsuariosHome';
import AdminUsuariosListado from './pages/AdminUsuariosListado';
import AdminUsuariosActualizar from './pages/AdminUsuariosActualizar';
import AdminUsuariosEliminar from './pages/AdminUsuariosEliminar';
import ForgotPassword from './pages/ForgotPassword';

function App() {
    return (
        <AppProvider>
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
                        <Route path="/PanelAdministrador" element={<AdminProductos />} />
                        <Route path="/CrearProducto" element={<CrearProducto />} />
                        <Route path="/direcciones" element={<Direcciones />} />
                        <Route path="/historial" element={<HistorialCompras />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/adminUsuariosListado" element={<AdminUsuariosListado />} />
                        <Route path="/adminUsuariosActualizar" element={<AdminUsuariosActualizar />} />
                        <Route path="/adminUsuariosEliminar" element={<AdminUsuariosEliminar />} />
                        <Route path="/admin/productos" element={<AdminProductosHome />} />
                        <Route path="/admin/usuarios" element={<AdminUsuariosHome />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                    </Routes>
                <Footer />
            </Router>
        </AppProvider>
        
    );
}

export default App;