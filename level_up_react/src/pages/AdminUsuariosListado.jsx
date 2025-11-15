import React, { useState } from 'react';
import SideBar from '../components/SideBar';
import '../styles/pages/panelAdministrador.css';
import '../styles/pages/adminUsuariosListado.css';

const AdminUsuariosListado = () => {
  const [usuarios] = useState([
    {
      id: 1,
      nombre: 'Felipe Ulloa',
      email: 'felipe@example.com',
      rol: 'ADMIN',
      estado: 'Activo',
    },
    {
      id: 2,
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      rol: 'USER',
      estado: 'Activo',
    },
    {
      id: 3,
      nombre: 'María Gómez',
      email: 'maria@example.com',
      rol: 'USER',
      estado: 'Inactivo',
    },
  ]);

  return (
    <div className="panel-administrador">
      <div className="management-layout">
        <SideBar />

        <main className="management-main admin-usuarios-main">
          <div className="admin-usuarios-container">
            <div className="admin-usuarios-header">
              <h1>Usuarios</h1>
              <p>Listado de usuarios registrados en el sistema.</p>
            </div>

            <div className="admin-usuarios-card">
              <div className="usuarios-table-wrapper">
                <table className="usuarios-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u) => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.nombre}</td>
                        <td>{u.email}</td>
                        <td>{u.rol}</td>
                        <td>
                          <span
                            className={`tag-estado ${
                              u.estado === 'Activo'
                                ? 'tag-activo'
                                : 'tag-inactivo'
                            }`}
                          >
                            {u.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="usuarios-hint">
                * Aquí puedes agregar filtros, búsqueda o paginación cuando
                conectes tu API real.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUsuariosListado;
