import React, { useState } from "react";
import "../styles/pages/registroStyles.css";
import showToast from "../components/toast";
import { auth } from "../firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      showToast("Por favor ingresa tu correo electrónico");
      return;
    }

    if (!validateEmail(email)) {
      showToast("Por favor ingresa un email válido");
      return;
    }

    setLoading(true);

    try {
      console.time("PASSWORD_RESET_EMAIL");
      
      // Enviar email de recuperación de contraseña
      await sendPasswordResetEmail(auth, email);
      
      console.timeEnd("PASSWORD_RESET_EMAIL");
      
      setEmailSent(true);
      showToast("¡Email de recuperación enviado! Revisa tu bandeja de entrada.");

    } catch (error) {
      console.error("Error al enviar email de recuperación:", error);

      if (error.code === "auth/user-not-found") {
        showToast("No existe una cuenta con este correo electrónico.");
      } else if (error.code === "auth/too-many-requests") {
        showToast("Demasiados intentos. Intenta nuevamente más tarde.");
      } else if (error.code === "auth/invalid-email") {
        showToast("El formato del correo electrónico no es válido.");
      } else {
        showToast("Error al enviar el email de recuperación. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
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
                  <h1 className="titulo mb-0">
                    {emailSent ? "Revisa tu email" : "Recuperar Contraseña"}
                  </h1>
                </div>

                {!emailSent ? (
                  <form id="Formulario_ForgotPassword" onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="email_recovery" className="form-label">
                        Correo electrónico
                      </label>
                      <input
                        id="email_recovery"
                        name="email"
                        type="email"
                        className="form-control"
                        placeholder="tucorreo@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>

                    <button
                      className="btn btn-auth w-100 mb-3"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <span>Enviando...</span>
                      ) : (
                        <>
                          <i className="fa-solid fa-paper-plane me-1"></i>{" "}
                          Enviar enlace de recuperación
                        </>
                      )}
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        className="btn btn-link auth-link p-0"
                        onClick={handleBackToLogin}
                      >
                        <i className="fa-solid fa-arrow-left me-1"></i>
                        Volver al inicio de sesión
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center">
                    <div className="mb-4">
                      <i className="fa-solid fa-envelope-circle-check text-success" style={{fontSize: '3rem'}}></i>
                    </div>
                    
                    <p className="mb-4">
                      Hemos enviado un enlace de recuperación a <strong>{email}</strong>. 
                      Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
                    </p>

                    <div className="d-flex flex-column gap-2">
                      <button
                        className="btn btn-auth w-100"
                        onClick={handleBackToLogin}
                      >
                        <i className="fa-solid fa-right-to-bracket me-1"></i>{" "}
                        Volver al inicio de sesión
                      </button>
                      
                      <button
                        type="button"
                        className="btn btn-outline-secondary w-100"
                        onClick={() => {
                          setEmailSent(false);
                          setEmail("");
                        }}
                      >
                        <i className="fa-solid fa-rotate me-1"></i>
                        Enviar a otro correo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <div id="app-footer"></div>
    </div>
  );
};

export default ForgotPassword;