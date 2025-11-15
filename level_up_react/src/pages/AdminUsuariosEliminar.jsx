import React, { useState } from 'react';
import SideBar from '../components/SideBar';
import '../styles/pages/panelAdministrador.css';
import '../styles/pages/adminUsuariosEliminar.css';

const AdminUsuariosEliminar = () => {
  const [email, setEmail] = useState('');
  const [infoUsuario, setInfoUsuario] = useState(null);

  const handleBuscar = (e) => {
    e.preventDefault();
    if (!email) {
      alert('Ingresa un email para buscar.');
      return;
    }
    // Simulación de búsqueda
    setInfoUsuario({
      nombre: 'Usuario de ejemplo',
      rol: 'USER',
      estado: 'Activo',
      email,
    });
    alert('Usuario encontrado (simulado).');
  };

  const handleEliminar = (e) => {
    e.preventDefault();
    if (!infoUsuario) {
      alert('Primero busca un usuario.');
      return;
    }
    if (!window.confirm(`¿Eliminar al usuario ${infoUsuario.nombre}?`)) {
      return;
    }
    console.log('Eliminar usuario:', infoUsuario);
    alert('Usuario eliminado (simulado). Luego conectas esto a tu API.');
    setInfoUsuario(null);
    setEmail('');
  };

  return (
    <div className="panel-administrador">
      <div className="management-layout">
        <SideBar />

        <main className="management-main admin-usuarios-eliminar-main">
          <div className="admin-usuarios-eliminar-container">
            <div className="admin-usuarios-eliminar-header">
              <h1>Eliminar usuario</h1>
              <p>Busca y elimina usuarios del sistema.</p>
            </div>

            <section className="perfil-card admin-usuarios-eliminar-card">
              <form onSubmit={handleBuscar}>
                <div className="input-group">
                  <label>Email del usuario</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@mail.com"
                  />
                </div>
                <div className="acciones">
                  <button type="submit" className="btn btn-primary">
                    Buscar usuario
                  </button>
                </div>
              </form>

              {infoUsuario && (
                <>
                  <hr className="divider" />
                  <div className="usuario-resumen">
                    <h3>Resumen del usuario</h3>
                    <p>
                      <strong>Nombre:</strong> {infoUsuario.nombre}
                    </p>
                    <p>
                      <strong>Email:</strong> {infoUsuario.email}
                    </p>
                    <p>
                      <strong>Rol:</strong> {infoUsuario.rol}
                    </p>
                    <p>
                      <strong>Estado:</strong> {infoUsuario.estado}
                    </p>

                    <div className="acciones acciones-eliminar">
                      <button
                        className="btn btn-ghost"
                        type="button"
                        onClick={() => setInfoUsuario(null)}
                      >
                        Cancelar
                      </button>
                      <button
                        className="btn btn-success btn-danger"
                        type="button"
                        onClick={handleEliminar}
                      >
                        Eliminar usuario
                      </button>
                    </div>
                  </div>
                </>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUsuariosEliminar;
