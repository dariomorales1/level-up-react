import React, { useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import '../styles/pages/panelAdministrador.css';
import '../styles/pages/cuentaStyles.css';
import '../styles/pages/direccionesStyles.css';



const TOKEN_KEY = 'accessToken'; 

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

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const getToken = () => localStorage.getItem(TOKEN_KEY);

  const parseJwtPayload = (token) => {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payloadB64 = parts[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const pad = payloadB64.length % 4;
      const padded = payloadB64 + (pad ? '='.repeat(4 - pad) : '');
      const json = atob(padded);
      return JSON.parse(json);
    } catch (e) {
      console.warn('parseJwtPayload error', e);
      return null;
    }
  };

  const isTokenExpired = (token) => {
    if (!token) return true;
    const payload = parseJwtPayload(token);
    if (!payload) return true;
    const exp = payload.exp;
    if (!exp) return true;
    const nowSec = Math.floor(Date.now() / 1000);
    return nowSec >= Number(exp);
  };

  const ensureValidTokenOrSetMessage = () => {
    const token = getToken();
    if (!token) {
      setMessage('No se encontró sesión. Por favor inicia sesión.');
      return false;
    }
    if (isTokenExpired(token)) {
      setMessage('La sesión expiró. Por favor inicia sesión de nuevo.');
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (ensureValidTokenOrSetMessage()) {
      fetchDirecciones();
    }
  }, []);

  const fetchDirecciones = async () => {
    setLoading(true);
    setMessage(null);
    const token = getToken();

    if (!token || isTokenExpired(token)) {
      setMessage('No autorizado. Inicia sesión.');
      setDirecciones([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://levelup.ddns.net:8080/users/me/direcciones`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (res.status === 401) {
        setMessage('No autorizado. Inicia sesión nuevamente.');
        setDirecciones([]);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        setMessage(err?.message || 'Error al obtener direcciones');
        setDirecciones([]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setDirecciones(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('fetchDirecciones error', err);
      setMessage('Error de red al obtener direcciones');
      setDirecciones([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validar = () => {
    if (!form.calle || !form.numero || !form.ciudad) {
      alert('Completa al menos Calle, Número y Ciudad.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!validar()) return;

    const token = getToken();
    if (!token || isTokenExpired(token)) {
      setMessage('No autorizado. Inicia sesión.');
      return;
    }

    if (editingId) {
      await actualizarDireccion(editingId, form);
    } else {
      await crearDireccion(form);
    }
  };

  const crearDireccion = async (payload) => {
    setLoading(true);
    setMessage(null);
    const token = getToken();

    try {
      const res = await fetch(`http://levelup.ddns.net:8080/users/me/direcciones`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        setMessage('No autorizado. Inicia sesión.');
        setLoading(false);
        return;
      }

      if (res.status === 201) {
        const created = await res.json();
        setDirecciones((prev) => [created, ...prev]);
        resetForm();
        setMessage('Dirección guardada correctamente.');
      } else if (res.status === 400) {
        const err = await res.json().catch(() => ({ message: 'Validación inválida' }));
        setMessage(err.message || 'Error al guardar la dirección');
      } else {
        const err = await res.json().catch(() => ({ message: 'Error al guardar' }));
        setMessage(err.message || 'Error al guardar la dirección');
      }
    } catch (err) {
      console.error('crearDireccion error', err);
      setMessage('Error de red al guardar la dirección');
    } finally {
      setLoading(false);
    }
  };

  const actualizarDireccion = async (id, payload) => {
    setLoading(true);
    setMessage(null);
    const token = getToken();

    try {
      const res = await fetch(`http://levelup.ddns.net:8080/users/me/direcciones/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        setMessage('No autorizado. Inicia sesión.');
        setLoading(false);
        return;
      }

      if (res.ok) {
        const updated = await res.json();
        setDirecciones((prev) =>
          prev.map((d) => (String(d.id) === String(id) ? updated : d))
        );
        resetForm();
        setMessage('Dirección actualizada correctamente.');
      } else if (res.status === 404) {
        setMessage('Dirección no encontrada (posiblemente ya fue eliminada).');
      } else {
        const err = await res.json().catch(() => ({ message: 'Error al actualizar' }));
        setMessage(err.message || 'Error al actualizar la dirección');
      }
    } catch (err) {
      console.error('actualizarDireccion error', err);
      setMessage('Error de red al actualizar la dirección');
    } finally {
      setLoading(false);
    }
  };

  const eliminarDireccion = async (id) => {
    const confirm = window.confirm('¿Eliminar esta dirección?');
    if (!confirm) return;

    setLoading(true);
    setMessage(null);
    const token = getToken();

    try {
      const res = await fetch(`http://levelup.ddns.net:8080/users/me/direcciones/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        setMessage('No autorizado. Inicia sesión.');
        setLoading(false);
        return;
      }

      if (res.status === 204) {
        setDirecciones((prev) => prev.filter((d) => String(d.id) !== String(id)));
        if (editingId && String(editingId) === String(id)) resetForm();
        setMessage('Dirección eliminada.');
      } else if (res.status === 404) {
        setMessage('Dirección no encontrada.');
      } else {
        const err = await res.json().catch(() => ({ message: 'Error al eliminar' }));
        setMessage(err.message || 'Error al eliminar la dirección');
      }
    } catch (err) {
      console.error('eliminarDireccion error', err);
      setMessage('Error de red al eliminar la dirección');
    } finally {
      setLoading(false);
    }
  };

  const seleccionarParaEditar = (direccion) => {
    setEditingId(direccion.id);
    setForm({
      alias: direccion.alias || '',
      calle: direccion.calle || '',
      numero: direccion.numero || '',
      depto: direccion.depto || '',
      ciudad: direccion.ciudad || '',
      region: direccion.region || '',
      pais: direccion.pais || '',
    });
    setMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    resetForm();
    setMessage(null);
  };

  const resetForm = () => {
    setEditingId(null);
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
                <section className="perfil-card">
                  <h2>{editingId ? 'Editar dirección' : 'Nueva dirección'}</h2>

                  {message && <p className="form-message">{message}</p>}

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
                      <button
                        type="submit"
                        className="btn btn-success"
                        disabled={loading}
                      >
                        {editingId ? 'Actualizar dirección' : 'Guardar dirección'}
                      </button>

                      {editingId && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={cancelarEdicion}
                          disabled={loading}
                          style={{ marginLeft: 8 }}
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </form>
                </section>

                <section className="perfil-card direcciones-list-card">
                  <h2>Direcciones guardadas</h2>

                  {loading && direcciones.length === 0 ? (
                    <p className="direcciones-empty">Cargando direcciones...</p>
                  ) : direcciones.length === 0 ? (
                    <p className="direcciones-empty">Aún no tienes direcciones guardadas.</p>
                  ) : (
                    <div className="direcciones-list">
                      {direcciones.map((dir) => (
                        <div
                          key={dir.id}
                          className={`direccion-item ${editingId && String(editingId) === String(dir.id) ? 'selected' : ''}`}
                        >
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

                          <div className="direccion-actions">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => seleccionarParaEditar(dir)}
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              className="btn btn-ghost btn-delete-direccion"
                              onClick={() => eliminarDireccion(dir.id)}
                              style={{ marginLeft: 8 }}
                            >
                              Eliminar
                            </button>
                          </div>
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
