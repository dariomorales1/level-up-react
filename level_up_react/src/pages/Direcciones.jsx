import React, { useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import '../styles/pages/panelAdministrador.css';
import '../styles/pages/cuentaStyles.css';
import '../styles/pages/direccionesStyles.css';

const Direcciones = () => {
  const [direcciones, setDirecciones] = useState([]);
  const [form, setForm] = useState({
    alias: '',
    calle: '',
    numero: '',
    depto: '',
    ciudad: '',
    region: '',
    pais: 'Chile',
  });

  useEffect(() => {
    const guardadas = localStorage.getItem('levelup.direcciones');
    if (guardadas) {
      setDirecciones(JSON.parse(guardadas));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.calle || !form.numero || !form.ciudad) {
      alert('Completa al menos Calle, Número y Ciudad.');
      return;
    }

    const nuevaDireccion = {
      id: Date.now(),
      ...form,
    };

    const actualizadas = [...direcciones, nuevaDireccion];
    setDirecciones(actualizadas);
    localStorage.setItem('levelup.direcciones', JSON.stringify(actualizadas));

    setForm({
      alias: '',
      calle: '',
      numero: '',
      depto: '',
      ciudad: '',
      region: '',
      pais: 'Chile',
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Eliminar esta dirección?')) return;
    const filtradas = direcciones.filter((d) => d.id !== id);
    setDirecciones(filtradas);
    localStorage.setItem('levelup.direcciones', JSON.stringify(filtradas));
  };

  return (
    <div className="panel-administrador">
      <div className="management-layout">
        <SideBar />

        <main className="management-main">
          <div className="direcciones-page">
            <div className="perfil-container">
              <div className="perfil-header">
                <h1>Mis direcciones</h1>
                <p>Administra tus direcciones de envío para tus compras.</p>
              </div>

              <div className="direcciones-grid">
                {/* Formulario nueva dirección */}
                <section className="perfil-card">
                  <h2>Nueva dirección</h2>

                  <form onSubmit={handleSubmit}>
                    <div className="input-group">
                      <label>Alias (opcional)</label>
                      <input
                        name="alias"
                        value={form.alias}
                        onChange={handleChange}
                        placeholder="Casa, Trabajo, etc."
                      />
                    </div>

                    <div className="grid-two">
                      <div className="input-group">
                        <label>Calle *</label>
                        <input
                          name="calle"
                          value={form.calle}
                          onChange={handleChange}
                          placeholder="Calle principal"
                        />
                      </div>
                      <div className="input-group">
                        <label>Número *</label>
                        <input
                          name="numero"
                          value={form.numero}
                          onChange={handleChange}
                          placeholder="123"
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Departamento / Casa</label>
                      <input
                        name="depto"
                        value={form.depto}
                        onChange={handleChange}
                        placeholder="Depto 304, Casa 2, etc."
                      />
                    </div>

                    <div className="grid-three">
                      <div className="input-group">
                        <label>Ciudad *</label>
                        <input
                          name="ciudad"
                          value={form.ciudad}
                          onChange={handleChange}
                          placeholder="Santiago"
                        />
                      </div>
                      <div className="input-group">
                        <label>Región</label>
                        <input
                          name="region"
                          value={form.region}
                          onChange={handleChange}
                          placeholder="RM"
                        />
                      </div>
                      <div className="input-group">
                        <label>País</label>
                        <input
                          name="pais"
                          value={form.pais}
                          onChange={handleChange}
                          placeholder="Chile"
                        />
                      </div>
                    </div>

                    <div className="acciones">
                      <button type="submit" className="btn btn-success">
                        Guardar dirección
                      </button>
                    </div>
                  </form>
                </section>

                {/* Lista de direcciones guardadas */}
                <section className="perfil-card direcciones-list-card">
                  <h2>Direcciones guardadas</h2>

                  {direcciones.length === 0 ? (
                    <p className="direcciones-empty">
                      Aún no tienes direcciones guardadas.
                    </p>
                  ) : (
                    <div className="direcciones-list">
                      {direcciones.map((dir) => (
                        <div key={dir.id} className="direccion-item">
                          <div className="direccion-text">
                            <strong>{dir.alias || 'Sin alias'}</strong>
                            <span>
                              {dir.calle} {dir.numero}
                              {dir.depto ? `, ${dir.depto}` : ''}
                            </span>
                            <span>
                              {dir.ciudad}
                              {dir.region ? `, ${dir.region}` : ''} - {dir.pais}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="btn btn-ghost btn-delete-direccion"
                            onClick={() => handleDelete(dir.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Direcciones;
