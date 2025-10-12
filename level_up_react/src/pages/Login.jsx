import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/pages/authStyles.css';
import { showToast } from '../components/toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validaciones directamente en el componente
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Función para validar credenciales en localStorage
  const validateCredentials = (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(user => user.email === email && user.password === password);
      return user;
    } catch (error) {
      console.error('Error al validar credenciales:', error);
      return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.email || !formData.password) {
      showToast("Por favor completa todos los campos");
      return;
    }

    if (!validateEmail(formData.email)) {
      showToast("Por favor ingresa un email válido");
      return;
    }

    if (!validatePassword(formData.password)) {
      showToast("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // Validar credenciales en localStorage
    const user = validateCredentials(formData.email, formData.password);
    
    if (user) {
      // Login exitoso
      showToast(`¡Bienvenido de nuevo, ${user.name}!`);
      
      // Guardar sesión actual en localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Redirigir al home usando React Router
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      showToast("Credenciales incorrectas. Verifica tu email y contraseña.");
    }
  };

  return (
    <div className="page">
      <div id="headerPpal"></div>

      <main>
        <div className="container-xxl auth">
          <div className="row justify-content-center g-4">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="auth-card">
                <div className="auth-card__header">
                  <h1 className="titulo mb-0">Ingresar</h1>
                </div>

                <form id="Formulario_Login" onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="Email_login" className="form-label">
                      Correo electrónico
                    </label>
                    <input
                      id="Email_login"
                      name="email"
                      type="email"
                      className="form-control"
                      placeholder="tucorreo@ejemplo.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-2 position-relative">
                    <label htmlFor="Password_login" className="form-label">
                      Contraseña
                    </label>
                    <input
                      id="Password_login"
                      name="password"
                      type="password"
                      className="form-control pe-5"
                      placeholder="••••••••"
                      minLength="6"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Recordarme
                      </label>
                    </div>
                    <a href="#" id="forgotLink" className="auth-link">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>

                  <button className="btn btn-auth w-100 mb-3" type="submit">
                    <i className="fa-solid fa-right-to-bracket me-1"></i> Ingresar
                  </button>

                  <p className="text-center mb-0">
                    ¿No tienes cuenta?
                    <a className="auth-link ms-1" href="/register">
                      Regístrate aquí
                    </a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div id="app-footer"></div>
    </div>
  );
};

export default Login;