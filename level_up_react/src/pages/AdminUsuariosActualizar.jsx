import React, { useState } from 'react';
import SideBar from '../components/SideBar';
import '../styles/pages/panelAdministrador.css';
import '../styles/pages/adminUsuariosActualizar.css';
import { useAuth } from '../hooks/useAuth';
import showToast from '../components/toast';

const AdminUsuariosActualizar = () => {
  const [email, setEmail] = useState('');
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const { obtenerUsuarios, actualizarUsuario } = useAuth();

  const [form, setForm] = useState({
    nombre: '',
    email: '',         
    fechaNacimiento: '',  
    rol: 'USER',
    activo: true,
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!email) {
      showToast('Ingresa un email para buscar.', 'error');
      return;
    }

    try {
      setBuscando(true);
      setUsuarioEncontrado(null);
      
      const usuarios = await obtenerUsuarios();
      
      const usuario = usuarios.find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (!usuario) {
        showToast('No se encontró ningún usuario con ese email.', 'error');
        return;
      }

      let fechaNacimiento = '';
      if (usuario.fechaNacimiento) {
        try {
          const date = new Date(usuario.fechaNacimiento);
          if (!isNaN(date.getTime())) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            fechaNacimiento = `${year}-${month}-${day}`;
          } else {
            fechaNacimiento = String(usuario.fechaNacimiento).slice(0, 10);
          }
        } catch {
          fechaNacimiento = String(usuario.fechaNacimiento).slice(0, 10);
        }
      }

      setUsuarioEncontrado(usuario);
      setForm({
        nombre: usuario.nombre || '',
        email: usuario.email || '',
        fechaNacimiento: fechaNacimiento || '',
        rol: usuario.rol || 'USER',
        activo:
          usuario.activo !== undefined && usuario.activo !== null
            ? usuario.activo
            : true,
      });
      
      showToast('Usuario encontrado correctamente.', 'success');
      
    } catch (error) {
      console.error('Error buscando usuario:', error);
      showToast('Error al buscar usuario: ' + error.message, 'error');
    } finally {
      setBuscando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ 
      ...f, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!usuarioEncontrado) {
      showToast('Primero debes buscar un usuario.', 'error');
      return;
    }

    try {
      setLoading(true);
      
      const datosActualizacion = {
        nombre: form.nombre,
        email: form.email, 
        fechaNacimiento: form.fechaNacimiento || '2000-01-01',
        avatarUrl: usuarioEncontrado.avatarUrl || '',
        rol: form.rol,
        activo: form.activo,
      };

      console.log('Enviando datos de actualización:', datosActualizacion);

      const usuarioActualizado = await actualizarUsuario(
        usuarioEncontrado.id,
        datosActualizacion
      );
      
      setUsuarioEncontrado(usuarioActualizado);
      showToast('Usuario actualizado correctamente.', 'success');
      
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      showToast('Error al actualizar usuario: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const limpiarBusqueda = () => {
    setEmail('');
    setUsuarioEncontrado(null);
    setForm({
      nombre: '',
      email: '',
      fechaNacimiento: '',
      rol: 'USER',
      activo: true,
    });
  };

  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    return maxDate.toISOString().split('T')[0];
  };

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
    <div className="panel-administrador">
      <div className="management-layout">
        <SideBar />

        <main className="management-main admin-usuarios-actualizar-main">
          <div className="admin-usuarios-actualizar-container">
            <div className="admin-usuarios-actualizar-header">
              <h1>Actualizar usuario</h1>
              <p>Busca un usuario por email y actualiza sus datos.</p>
            </div>

            <section className="perfil-card admin-usuarios-actualizar-card">
              <form onSubmit={handleSearch}>
                <div className="input-group">
                  <label>Email del usuario</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@mail.com"
                    disabled={buscando}
                  />
                </div>
                <div className="acciones">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={buscando}
                  >
                    {buscando ? 'Buscando...' : 'Buscar usuario'}
                  </button>
                  {usuarioEncontrado && (
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={limpiarBusqueda}
                    >
                      Limpiar
                    </button>
                  )}
                </div>
              </form>

              {usuarioEncontrado && (
                <>
                  <hr className="divider" />

                  <div
                    className="usuario-info"
                    style={{
                      background: '#1e293b',
                      padding: '1rem',
                      borderRadius: '8px',
                      marginBottom: '1.5rem',
                      border: '1px solid #334155',
                    }}
                  >
                    <h3
                      style={{
                        color: '#e5e7eb',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Usuario encontrado:
                    </h3>
                    <p style={{ color: '#9ca3af', margin: '0.25rem 0' }}>
                      <strong>ID:</strong>{' '}
                      {usuarioEncontrado.id
                        ? usuarioEncontrado.id.substring(0, 12) + '...'
                        : 'N/A'}
                    </p>
                    <p style={{ color: '#9ca3af', margin: '0.25rem 0' }}>
                      <strong>Email:</strong> {usuarioEncontrado.email}
                    </p>
                    <p style={{ color: '#9ca3af', margin: '0.25rem 0' }}>
                      <strong>Registro:</strong>{' '}
                      {usuarioEncontrado.creadoEn
                        ? new Date(
                            usuarioEncontrado.creadoEn
                          ).toLocaleDateString('es-CL')
                        : 'N/A'}
                    </p>
                  </div>

                  <form onSubmit={handleUpdate}>
                    <div className="input-group">
                      <label>Nombre</label>
                      <input
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        placeholder="Nombre del usuario"
                        required
                      />
                    </div>

                    <div className="input-group">
                      <label>Email</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email del usuario"
                        required
                        disabled
                      />
                    </div>

                    <div className="input-group">
                      <label>Fecha de nacimiento</label>
                      <input
                        name="fechaNacimiento"
                        type="date"
                        min={getMinDate()}
                        max={getMaxDate()}
                        value={form.fechaNacimiento}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid-two">
                      <div className="input-group">
                        <label>Rol</label>
                        <select
                          name="rol"
                          value={form.rol}
                          onChange={handleChange}
                          className="select-input"
                        >
                          <option value="USER">Usuario</option>
                          <option value="ADMIN">Administrador</option>
                        </select>
                      </div>

                      <div className="input-group">
                        <label>Estado</label>
                        <input
                          name="estado"
                          value={form.activo ? 'Activo' : 'Inactivo'}
                          onChange={handleChange}
                          placeholder="Estado del usuario"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="acciones">
                      <button 
                        type="submit" 
                        className="btn btn-success"
                        disabled={loading}
                      >
                        {loading ? 'Actualizando...' : 'Guardar cambios'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUsuariosActualizar;
