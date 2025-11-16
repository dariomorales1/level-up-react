import React, { useState } from 'react';
import SideBar from '../components/SideBar';
import '../styles/pages/panelAdministrador.css';
import '../styles/pages/adminUsuariosEliminar.css';
import { useAuth } from '../hooks/useAuth';
import showToast from '../components/toast';

const AdminUsuariosEliminar = () => {
  const [email, setEmail] = useState('');
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const { apiCall, obtenerUsuarios } = useAuth();

  // Buscar usuario por email
  const handleBuscar = async (e) => {
    e.preventDefault();
    
    if (!email) {
      showToast('Ingresa un email para buscar.', 'error');
      return;
    }

    try {
      setBuscando(true);
      setUsuarioEncontrado(null);
      
      // Obtener todos los usuarios
      const usuarios = await obtenerUsuarios();
      
      // Buscar por email
      const usuario = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!usuario) {
        showToast('No se encontró ningún usuario con ese email.', 'error');
        return;
      }

      setUsuarioEncontrado(usuario);
      showToast('Usuario encontrado correctamente.', 'success');
      
    } catch (error) {
      console.error('Error buscando usuario:', error);
      showToast('Error al buscar usuario: ' + error.message, 'error');
    } finally {
      setBuscando(false);
    }
  };

  // Eliminar usuario
  const handleEliminar = async (e) => {
    e.preventDefault();
    
    if (!usuarioEncontrado) {
      showToast('Primero busca un usuario.', 'error');
      return;
    }

    // Confirmación de eliminación
    if (!window.confirm(`¿Estás seguro de eliminar al usuario ${usuarioEncontrado.nombre}?\n\n⚠️ ESTA ACCIÓN NO SE PUEDE DESHACER\n\nSe eliminará:\n• Usuario de la base de datos\n• Cuenta de Firebase Auth\n• Todos los datos asociados`)) {
      return;
    }

    try {
      setLoading(true);

      // 1. Primero eliminar de Firebase Auth
      try {
        await apiCall('http://levelup.ddns.net:8080/auth/admin/delete-user', {
          method: 'DELETE',
          body: JSON.stringify({
            userId: usuarioEncontrado.id
          })
        });
        console.log('✅ Usuario eliminado de Firebase');
      } catch (firebaseError) {
        console.warn('No se pudo eliminar de Firebase:', firebaseError);
        // Preguntar si continuar aunque falle Firebase
        if (!window.confirm('No se pudo eliminar de Firebase. ¿Deseas eliminar solo de la base de datos?')) {
          return;
        }
      }

      // 2. Luego eliminar de la base de datos
      await apiCall(`http://levelup.ddns.net:8080/users/${usuarioEncontrado.id}`, {
        method: 'DELETE'
      });

      console.log('✅ Usuario eliminado de la base de datos');

      showToast('Usuario eliminado correctamente del sistema.', 'success');
      
      // Limpiar estado
      setUsuarioEncontrado(null);
      setEmail('');
      
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      showToast('Error al eliminar usuario: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const limpiarBusqueda = () => {
    setUsuarioEncontrado(null);
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
                    disabled={buscando || loading}
                  />
                </div>
                <div className="acciones">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={buscando || loading}
                  >
                    {buscando ? 'Buscando...' : 'Buscar usuario'}
                  </button>
                </div>
              </form>

              {usuarioEncontrado && (
                <>
                  <hr className="divider" />
                  
                  <div className="usuario-info" style={{
                    background: '#1e293b',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    border: '1px solid #334155'
                  }}>
                    <h3 style={{color: '#e5e7eb', marginBottom: '0.5rem'}}>Usuario encontrado:</h3>
                    <p style={{color: '#9ca3af', margin: '0.25rem 0'}}>
                      <strong>ID:</strong> {usuarioEncontrado.id.substring(0, 12)}...
                    </p>
                    <p style={{color: '#9ca3af', margin: '0.25rem 0'}}>
                      <strong>Nombre:</strong> {usuarioEncontrado.nombre}
                    </p>
                    <p style={{color: '#9ca3af', margin: '0.25rem 0'}}>
                      <strong>Email:</strong> {usuarioEncontrado.email}
                    </p>
                    <p style={{color: '#9ca3af', margin: '0.25rem 0'}}>
                      <strong>Rol:</strong> 
                      <span className={`tag-rol tag-${usuarioEncontrado.rol?.toLowerCase() || 'user'}`} style={{marginLeft: '0.5rem'}}>
                        {usuarioEncontrado.rol}
                      </span>
                    </p>
                    <p style={{color: '#9ca3af', margin: '0.25rem 0'}}>
                      <strong>Estado:</strong> 
                      <span className={`tag-estado ${usuarioEncontrado.activo ? 'tag-activo' : 'tag-inactivo'}`} style={{marginLeft: '0.5rem'}}>
                        {usuarioEncontrado.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </p>
                    <p style={{color: '#9ca3af', margin: '0.25rem 0'}}>
                      <strong>Registro:</strong> {usuarioEncontrado.creadoEn ? 
                        new Date(usuarioEncontrado.creadoEn).toLocaleDateString('es-CL') : 'N/A'}
                    </p>
                  </div>

                  <div className="warning-box" style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    <h4 style={{color: '#f87171', marginBottom: '0.5rem'}}>⚠️ Advertencia</h4>
                    <p style={{color: '#fca5a5', margin: '0', fontSize: '0.9rem'}}>
                      Esta acción eliminará permanentemente al usuario del sistema. 
                      No se podrá recuperar la cuenta ni los datos asociados.
                    </p>
                  </div>

                  <div className="acciones acciones-eliminar">
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={limpiarBusqueda}
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                    <button
                      className="btn btn-danger"
                      type="button"
                      onClick={handleEliminar}
                      disabled={loading}
                    >
                      {loading ? 'Eliminando...' : 'Eliminar usuario'}
                    </button>
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