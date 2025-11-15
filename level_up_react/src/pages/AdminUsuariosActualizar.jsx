import React, { useState } from 'react';
import SideBar from '../components/SideBar';
import '../styles/pages/panelAdministrador.css';
import '../styles/pages/adminUsuariosActualizar.css';

const AdminUsuariosActualizar = () => {
  const [email, setEmail] = useState('');
  const [form, setForm] = useState({
    nombre: '',
    rol: 'USER',
    estado: 'Activo',
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!email) {
      alert('Ingresa un email para buscar.');
      return;
    }
    // Simula que encuentra un usuario:
    setForm({
      nombre: 'Usuario de ejemplo',
      rol: 'USER',
      estado: 'Activo',
    });
    alert('Usuario cargado (simulado).');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log('Actualizar usuario:', { email, ...form });
    alert('Usuario actualizado (simulado). Luego conectas a tu API.');
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
                  />
                </div>
                <div className="acciones">
                  <button type="submit" className="btn btn-primary">
                    Buscar usuario
                  </button>
                </div>
              </form>

              <hr className="divider" />

              <form onSubmit={handleUpdate}>
                <div className="input-group">
                  <label>Nombre</label>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Nombre del usuario"
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
                    <select
                      name="estado"
                      value={form.estado}
                      onChange={handleChange}
                      className="select-input"
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>

                <div className="acciones">
                  <button type="submit" className="btn btn-success">
                    Guardar cambios
                  </button>
                </div>
              </form>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUsuariosActualizar;
