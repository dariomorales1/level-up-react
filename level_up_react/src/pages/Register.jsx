import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/registroStyles.css";
import showToast from "../components/toast";
import { useAuth } from "../hooks/useAuth";

import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    fecha_nacimiento: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTermsChange = (e) => {
    setAcceptedTerms(e.target.checked);
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateName = (name) => name.length >= 2;
  const validatePassword = (password) => password.length >= 6;
  const validatePasswordsMatch = (password, confirmPassword) => password === confirmPassword;
  
  // VALIDACIÓN: Mayor de edad (18 años)
  const esMayorDeEdad = (fecha) => {
    if (!fecha) return false;
    
    const birthDate = new Date(fecha);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    
    // Si el mes actual es menor al mes de nacimiento, o es el mismo mes pero el día actual es menor al día de nacimiento
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      return age - 1 >= 18;
    }
    return age >= 18;
  };

  // FUNCIÓN PARA GUARDAR USUARIO EN POSTGRESQL
  const saveUserToPostgreSQL = async (userData, role) => {
    try {
      const response = await fetch('/api/usuarios/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: userData,
          rol: role
        }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar usuario en la base de datos');
      }

      return await response.json();
    } catch (error) {
      console.error('Error guardando en PostgreSQL:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.name || !formData.email || !formData.password || !formData.password2 || !formData.fecha_nacimiento) {
      showToast("Por favor completa todos los campos obligatorios");
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

    // VALIDACIÓN DE MAYORÍA DE EDAD
    if (!esMayorDeEdad(formData.fecha_nacimiento)) {
      showToast("Debes ser mayor de edad (18 años o más) para registrarte");
      return;
    }

    if (!acceptedTerms) {
      showToast("Debes aceptar los términos y condiciones");
      return;
    }

    setIsRegistering(true);

    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const firebaseUser = userCredential.user;

      // Actualizar perfil en Firebase
      try {
        await updateProfile(firebaseUser, {
          displayName: formData.name,
        });
      } catch (error) {
        console.warn("No se pudo actualizar el displayName:", error);
      }

      // Determinar rol basado en email
      const role = formData.email.endsWith("@levelup.ddns.net") ? "admin" : "cliente";

      // Preparar datos para PostgreSQL
      const userDataForPostgreSQL = {
        id: firebaseUser.uid,
        email: formData.email,
        nombre: formData.name,
        fecha_nacimiento: formData.fecha_nacimiento,
        activo: true,
        creado_en: new Date().toISOString(),
        actualizado_en: new Date().toISOString()
      };

      try {
        // Guardar en Firestore (backup o datos adicionales)
        await setDoc(doc(db, "users", firebaseUser.uid), {
          name: formData.name,
          email: formData.email,
          role,
          fecha_nacimiento: formData.fecha_nacimiento,
          createdAt: serverTimestamp(),
        });

        // Guardar en PostgreSQL
        await saveUserToPostgreSQL(userDataForPostgreSQL, role);

      } catch (error) {
        console.warn("Error guardando datos adicionales:", error);
        // No impide el registro si falla el guardado adicional
      }

      // Preparar usuario para el contexto de autenticación
      const userForAuth = {
        id: firebaseUser.uid,
        name: formData.name,
        email: formData.email,
        role,
        fecha_nacimiento: formData.fecha_nacimiento
      };

      login(userForAuth);
      showToast("¡Cuenta creada exitosamente!");

      navigate("/login", { replace: true });

      // Limpiar formulario
      setFormData({
        name: "",
        email: "",
        password: "",
        password2: "",
        fecha_nacimiento: "",
      });
      setAcceptedTerms(false);

    } catch (error) {
      console.error("Error en el registro (Auth):", error);

      if (error.code === "auth/email-already-in-use") {
        showToast("Este email ya está registrado. Usa otro email o inicia sesión.");
      } else if (error.code === "auth/weak-password") {
        showToast("La contraseña es demasiado débil.");
      } else if (error.code === "auth/invalid-email") {
        showToast("El formato del email no es válido.");
      } else {
        showToast("Error al crear la cuenta. Intenta nuevamente.");
      }
    } finally {
      setIsRegistering(false);
    }
  };

  // FECHA MÁXIMA: Hace exactamente 18 años desde HOY
  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    return maxDate.toISOString().split('T')[0];
  };

  // FECHA MÍNIMA: Hace 100 años desde HOY
  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date(
      today.getFullYear() - 100,
      today.getMonth(),
      today.getDate()
    );
    return minDate.toISOString().split('T')[0];
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
                      Nombre completo *
                    </label>
                    <input
                      id="registroNombre"
                      name="name"
                      type="text"
                      className="form-control"
                      placeholder="Ej: Juan Pérez"
                      minLength="2"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="registroEmail" className="form-label">
                      Correo electrónico *
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

                  <div className="mb-3">
                    <label htmlFor="registroFechaNacimiento" className="form-label">
                      Fecha de nacimiento *
                    </label>
                    <input
                      id="registroFechaNacimiento"
                      name="fecha_nacimiento"
                      type="date"
                      className="form-control"
                      min={getMinDate()}
                      max={getMaxDate()}
                      value={formData.fecha_nacimiento}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-label mt-2">
                      **Debes ser mayor de edad (18 años) para registrarte
                    </label>
                  </div>

                  <div className="mb-3 position-relative">
                    <label htmlFor="registroPassword" className="form-label">
                      Contraseña *
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
                      Repetir contraseña *
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
                      <a
                        className="auth-link"
                        href="/terminos"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Términos y condiciones
                      </a>
                    </label>
                  </div>

                  <button
                    className="btn btn-auth w-100 mb-3"
                    type="submit"
                    disabled={isRegistering}
                  >
                    <i className="fa-solid fa-user-plus me-1"></i>
                    {isRegistering ? "Registrando..." : "Registrarme"}
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
}