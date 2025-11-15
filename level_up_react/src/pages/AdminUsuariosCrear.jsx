import React, { useState } from 'react';
import SideBar from '../components/SideBar';
import '../styles/pages/panelAdministrador.css';
import '../styles/pages/adminUsuariosCrear.css';

const AdminUsuariosCrear = () => {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'USER',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.password) {
      alert('Completa nombre, email y contraseña.');
      return;
    }
    console.log('Crear usuario:', form);
    alert('Usuario creado (simulado). Luego conectas esto a tu API.');
    setForm({
      nombre: '',
      email: '',
      password: '',
      rol: 'USER',
    });
  };

  return (
    <div className="panel-administrador">
      <div className="management-layout">
        <SideBar />

        <main className="management-main admin-usuarios-crear-main">
          <div className="admin-usuarios-crear-container">
            <div className="admin-usuarios-crear-header">
              <h1>Crear usuario</h1>
              <p>Registra un nuevo usuario en el sistema.</p>
            </div>

            <section className="perfil-card admin-usuarios-crear-card">
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label>Nombre completo *</label>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                <div className="input-group">
                  <label>Correo electrónico *</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="usuario@mail.com"
                  />
                </div>

                <div className="input-group">
                  <label>Contraseña *</label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                </div>

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

                <div className="acciones">
                  <button type="submit" className="btn btn-success">
                    Crear usuario
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

export default AdminUsuariosCrear;
