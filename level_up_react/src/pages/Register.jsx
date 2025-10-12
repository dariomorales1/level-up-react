import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/pages/authStyles.css'; // Ajusta la ruta según tu estructura

// Función showToast integrada directamente en el componente
const showToast = (msg) => {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 2000);
};

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTermsChange = (e) => {
    setAcceptedTerms(e.target.checked);
  };

  // Validaciones directamente en el componente
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name) => {
    return name.length >= 2;
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validatePasswordsMatch = (password, confirmPassword) => {
    return password === confirmPassword;
  };

  // Función para verificar si el email ya existe
  const checkEmailExists = (email) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      return users.some(user => user.email === email);
    } catch (error) {
      console.error('Error al verificar email:', error);
      return false;
    }
  };

  // Función para guardar usuario en localStorage
  const saveUserToLocalStorage = (userData) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push(userData);
      localStorage.setItem('users', JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.name || !formData.email || !formData.password || !formData.password2) {
      showToast("Por favor completa todos los campos");
      return;
    }

    if (!validateName(formData.name)) {
      showToast("El nombre debe tener al menos 2 caracteres");
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

    if (!validatePasswordsMatch(formData.password, formData.password2)) {
      showToast("Las contraseñas no coinciden");
      return;
    }

    if (!acceptedTerms) {
      showToast("Debes aceptar los términos y condiciones");
      return;
    }

    // Verificar si el email ya está registrado
    if (checkEmailExists(formData.email)) {
      showToast("Este email ya está registrado. Usa otro email o inicia sesión.");
      return;
    }

    // Crear objeto de usuario
    const userData = {
      id: Date.now(), // ID único basado en timestamp
      name: formData.name,
      email: formData.email,
      password: formData.password,
      createdAt: new Date().toISOString()
    };

    // Guardar usuario en localStorage
    if (saveUserToLocalStorage(userData)) {
      showToast("¡Cuenta creada exitosamente!");
      
      // Guardar sesión automáticamente
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        password: '',
        password2: ''
      });
      setAcceptedTerms(false);
      
      // Redirigir al home usando React Router
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      showToast("Error al crear la cuenta. Intenta nuevamente.");
    }
  };

  return (
    <div className="page">
      <main>
        <div className="container-xxl auth">
          <div className="row justify-content-center g-4">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="auth-card">
                <div className="auth-card__header">
                  <h1 className="titulo mb-0">Crear cuenta</h1>
                </div>

                <form id="FormularioRegistro" onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="registroNombre" className="form-label">
                      Nombre
                    </label>
                    <input
                      id="registroNombre"
                      name="name"
                      type="text"
                      className="form-control"
                      placeholder="Ej: Daniel Gamer"
                      minLength="2"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="registroEmail" className="form-label">
                      Correo electrónico
                    </label>
                    <input
                      id="registroEmail"
                      name="email"
                      type="email"
                      className="form-control"
                      placeholder="tucorreo@ejemplo.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3 position-relative">
                    <label htmlFor="registroPassword" className="form-label">
                      Contraseña
                    </label>
                    <input
                      id="registroPassword"
                      name="password"
                      type="password"
                      className="form-control pe-5"
                      placeholder="Mínimo 6 caracteres"
                      minLength="6"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3 position-relative">
                    <label htmlFor="registroPassword2" className="form-label">
                      Repetir contraseña
                    </label>
                    <input
                      id="registroPassword2"
                      name="password2"
                      type="password"
                      className="form-control pe-5"
                      placeholder="Repite tu contraseña"
                      minLength="6"
                      value={formData.password2}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="checkTerminos"
                      checked={acceptedTerms}
                      onChange={handleTermsChange}
                      required
                    />
                    <label className="form-check-label" htmlFor="checkTerminos">
                      Acepto los{" "}
                      <a className="auth-link" href="/terminos" target="_blank" rel="noopener noreferrer">
                        Términos y condiciones
                      </a>
                    </label>
                  </div>

                  <button className="btn btn-auth w-100 mb-3" type="submit">
                    <i className="fa-solid fa-user-plus me-1"></i> Registrarme
                  </button>

                  <p className="text-center mb-0">
                    ¿Ya tienes cuenta?
                    <a className="auth-link ms-1" href="/login">
                      Inicia sesión
                    </a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;