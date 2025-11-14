import React, { useState } from "react";
import "../styles/pages/registroStyles.css";
import showToast from "../components/toast";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) => password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Metrica global del flujo de login
    console.time("LOGIN_FLOW");

    if (!formData.email || !formData.password) {
      showToast("Por favor completa todos los campos");
      console.timeEnd("LOGIN_FLOW");
      return;
    }

    if (!validateEmail(formData.email)) {
      showToast("Por favor ingresa un email válido");
      console.timeEnd("LOGIN_FLOW");
      return;
    }

    if (!validatePassword(formData.password)) {
      showToast("La contraseña debe tener al menos 6 caracteres");
      console.timeEnd("LOGIN_FLOW");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Autenticar con Firebase Auth
      console.time("FIREBASE_AUTH");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      console.timeEnd("FIREBASE_AUTH");

      const firebaseUser = userCredential.user;

      // 2️⃣ Valores base (rápidos) sin depender de Firestore
      let name = firebaseUser.displayName || "Usuario";
      let role = firebaseUser.email.endsWith("@levelup.ddns.net")
        ? "admin"
        : "customer";

      // 3️⃣ Intentar obtener datos más precisos desde Firestore (opcional)
      try {
        console.time("FIRESTORE_GET_USER");
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.name) name = data.name;
          if (data.role) role = data.role;
        }
        console.timeEnd("FIRESTORE_GET_USER");
      } catch (error) {
        console.timeEnd("FIRESTORE_GET_USER");
        console.warn(
          "No se pudo obtener el documento de usuario en Firestore:",
          error
        );
      }

      // 4️⃣ Construir objeto para tu contexto
      const userForAuth = {
        id: firebaseUser.uid,
        name,
        email: firebaseUser.email,
        role,
      };

      console.log("LOGIN - userForAuth final:", userForAuth);

      // 5️⃣ Guardar en contexto de auth (con Recordarme)
      login(userForAuth, rememberMe);
      showToast(`¡Bienvenido de nuevo, ${userForAuth.name}!`);

      // 6️⃣ Redirigir inmediatamente según rol
      if (userForAuth.role === "admin") {
        navigate("/paneladministrador", { replace: true });
      } else {
        // usa "/cuenta" o "/" según tu flujo
        navigate("/cuenta", { replace: true });
      }
    } catch (error) {
      console.error("Error al iniciar sesión con Firebase (Auth):", error);

      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        showToast("Credenciales incorrectas. Verifica tu email y contraseña.");
      } else if (error.code === "auth/too-many-requests") {
        showToast(
          "Demasiados intentos fallidos. Intenta nuevamente más tarde."
        );
      } else {
        showToast("Ocurrió un error al iniciar sesión. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
      console.timeEnd("LOGIN_FLOW"); // cierre global del flujo
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
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Recordarme
                      </label>
                    </div>
                    <a href="#" id="forgotLink" className="auth-link">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>

                  <button
                    className="btn btn-auth w-100 mb-3"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <span>Ingresando...</span>
                    ) : (
                      <>
                        <i className="fa-solid fa-right-to-bracket me-1"></i>{" "}
                        Ingresar
                      </>
                    )}
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
