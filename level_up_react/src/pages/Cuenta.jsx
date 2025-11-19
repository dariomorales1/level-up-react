import { useEffect, useRef, useState } from 'react';
import SideBar from '../components/SideBar';
import '../styles/pages/cuentaStyles.css';
import '../styles/pages/panelAdministrador.css';

const BASE_URL = 'http://levelup.ddns.net:8080/users';
const TOKEN_KEY = 'accessToken';

const camposIniciales = {
  nombre: '',
  email: '',
  fechaNac: '',
  direccion: '',
  comuna: '',
  region: '',
  pais: '',
};

export default function Cuenta() {
  const [form, setForm] = useState(camposIniciales);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [usuarioRaw, setUsuarioRaw] = useState(null);
  const inputFileRef = useRef(null);

  const getToken = () => localStorage.getItem(TOKEN_KEY);

  const parseJwtPayload = (token) => {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payloadB64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const pad = payloadB64.length % 4;
      const padded = payloadB64 + (pad ? '='.repeat(4 - pad) : '');
      const json = atob(padded);
      return JSON.parse(json);
    } catch (e) {
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

  const extractUserIdFromToken = () => {
    const token = getToken();
    if (!token) return null;
    const payload = parseJwtPayload(token);
    if (!payload) return null;

    return payload.sub ?? payload.userId ?? payload.id ?? null;
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setMensaje('No se encontró sesión. Inicia sesión.');
      return;
    }
    if (isTokenExpired(token)) {
      setMensaje('La sesión expiró. Inicia sesión nuevamente.');
      return;
    }
    const uid = extractUserIdFromToken();
    setUserId(uid);
    cargarUsuario();
    cargarDireccionesYSetPrimera(uid);
  }, []);

  const cargarUsuario = async () => {
    setLoading(true);
    setMensaje('');
    const token = getToken();
    try {
      const res = await fetch(`${BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });

      if (res.status === 401) {
        setMensaje('No autorizado. Inicia sesión.');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        setMensaje(err?.message || 'Error al cargar usuario');
        setLoading(false);
        return;
      }

      const user = await res.json();
      setUsuarioRaw(user);

      setForm((f) => ({
        ...f,
        nombre: user.nombre ?? '',
        email: user.email ?? '',
        fechaNac: user.fechaNacimiento ?? '',
      }));
      setAvatarUrl(user.avatarUrl ?? '');
    } catch (err) {
      console.error('cargarUsuario error', err);
      setMensaje('Error de red al cargar usuario');
    } finally {
      setLoading(false);
    }
  };

  const cargarDireccionesYSetPrimera = async (uidFromToken) => {
    setLoading(true);
    setMensaje('');
    const token = getToken();
    try {
      const res = await fetch(`${BASE_URL}/me/direcciones`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });

      if (!res.ok) {
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        setForm((f) => ({
          ...f,
          direccion: '',
          comuna: '',
          region: '',
          pais: '',
        }));
        setLoading(false);
        return;
      }

      let primera = data[0];
      if (data.length > 1) {
        primera = data.reduce((oldest, cur) => {
          const a = new Date(oldest.creadoEn || oldest.creadoAt || 0);
          const b = new Date(cur.creadoEn || cur.creadoAt || 0);
          return a <= b ? oldest : cur;
        }, data[0]);
      }

      setForm((f) => ({
        ...f,
        direccion: `${primera.calle || ''} ${primera.numero || ''}${
          primera.depto ? ', ' + primera.depto : ''
        }`,
        comuna: primera.ciudad || '',
        region: primera.region || '',
        pais: primera.pais || '',
      }));
    } catch (err) {
      console.error('cargarDirecciones error', err);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onGuardar = async (e) => {
    e.preventDefault();
    setMensaje('');

    if (!form.nombre) {
      setMensaje('Completa al menos Nombre.');
      return;
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setMensaje('Formato de correo no válido.');
      return;
    }

    const token = getToken();
    if (!token || isTokenExpired(token)) {
      setMensaje('No autorizado. Inicia sesión.');
      return;
    }

    if (!userId) {
      const uid = extractUserIdFromToken();
      if (!uid) {
        setMensaje('No se pudo determinar el usuario. Inicia sesión.');
        return;
      }
      setUserId(uid);
    }

    const payload = {
      email: form.email,
      nombre: form.nombre,
      fechaNacimiento: form.fechaNac || null,
      avatarUrl: avatarUrl || (usuarioRaw ? usuarioRaw.avatarUrl : null),
      rol: usuarioRaw ? usuarioRaw.rol : 'USER',
      activo: usuarioRaw ? usuarioRaw.activo : true,
    };

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/${userId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        setMensaje('No autorizado. Inicia sesión.');
        setLoading(false);
        return;
      }

      if (res.ok) {
        const updated = await res.json();
        setUsuarioRaw(updated);

        setForm((f) => ({
          ...f,
          nombre: updated.nombre ?? f.nombre,
          fechaNac: updated.fechaNacimiento ?? f.fechaNac,
          email: updated.email ?? f.email,
        }));
        setAvatarUrl(updated.avatarUrl ?? avatarUrl);
        setMensaje('Perfil actualizado correctamente.');
      } else {
        const err = await res.json().catch(() => null);
        setMensaje(err?.message || 'Error al actualizar perfil');
      }
    } catch (err) {
      console.error('onGuardar error', err);
      setMensaje('Error de red al actualizar perfil');
    } finally {
      setLoading(false);
      setTimeout(() => setMensaje(''), 2200);
    }
  };

  const onSubirAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarFile(file);
      setAvatarUrl(String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  // Solo limpia el estado local (ya no lo usamos para borrar en backend)
  const limpiarAvatarLocal = () => {
    setAvatarFile(null);
    setAvatarUrl('');
    if (inputFileRef.current) inputFileRef.current.value = '';
  };

  const uploadAvatarToBackend = async () => {
    setMensaje('');

    if (!avatarFile) {
      setMensaje('Primero selecciona una imagen.');
      return;
    }

    const token = getToken();
    if (!token || isTokenExpired(token)) {
      setMensaje('Sesión expirada. Inicia sesión nuevamente.');
      return;
    }

    const uid = userId || extractUserIdFromToken();
    if (!uid) {
      setMensaje('No se pudo determinar el usuario. Inicia sesión.');
      return;
    }
    setUserId(uid);

    const formData = new FormData();
    formData.append('file', avatarFile);

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/${uid}/avatar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        setMensaje(err?.message || 'Error al subir avatar.');
        return;
      }

      const updatedUser = await res.json();
      setUsuarioRaw(updatedUser);
      setAvatarUrl(updatedUser.avatarUrl || '');
      setMensaje('Avatar actualizado correctamente.');
    } catch (err) {
      console.error('uploadAvatarToBackend error', err);
      setMensaje('Error de red al subir avatar.');
    } finally {
      setLoading(false);
      setTimeout(() => setMensaje(''), 2200);
    }
  };

  // 🔴 NUEVO: eliminar avatar en backend + storage y limpiar front
  const deleteAvatarFromBackend = async () => {
    setMensaje('');

    const token = getToken();
    if (!token || isTokenExpired(token)) {
      setMensaje('Sesión expirada. Inicia sesión nuevamente.');
      return;
    }

    const uid = userId || extractUserIdFromToken();
    if (!uid) {
      setMensaje('No se pudo determinar el usuario. Inicia sesión.');
      return;
    }
    setUserId(uid);

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/${uid}/avatar`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        setMensaje(err?.message || 'Error al eliminar avatar.');
        return;
      }

      const updatedUser = await res.json();
      setUsuarioRaw(updatedUser);
      setAvatarFile(null);
      setAvatarUrl(updatedUser.avatarUrl || '');
      if (inputFileRef.current) inputFileRef.current.value = '';
      setMensaje('Avatar eliminado correctamente.');
    } catch (err) {
      console.error('deleteAvatarFromBackend error', err);
      setMensaje('Error de red al eliminar avatar.');
    } finally {
      setLoading(false);
      setTimeout(() => setMensaje(''), 2200);
    }
  };

  return (
    <div className="panel-administrador">
      <div className="management-layout">
        <SideBar currentView="perfil" />

        <main className="management-main">
          <div className="cuenta-page">
            <div className="perfil-container">
              <div className="perfil-header">
                <h1>Mi Perfil</h1>
                <p>Administra tu información personal de Level-Up.</p>
              </div>

              <div className="perfil-grid">
                <section className="perfil-card">
                  <h2>Avatar</h2>
                  <div className="avatar-wrapper">
                    <img
                      className="avatar"
                      src={
                        avatarUrl ||
                        'https://ui-avatars.com/api/?name=Level+Up&background=111827&color=10b981'
                      }
                      alt="avatar"
                    />
                    <div className="avatar-actions">
                      <input
                        ref={inputFileRef}
                        type="file"
                        accept="image/*"
                        onChange={onSubirAvatar}
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => inputFileRef.current?.click()}
                      >
                        Seleccionar imagen
                      </button>

                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={uploadAvatarToBackend}
                        title="Sube la imagen al storage y guarda la URL en tu perfil"
                        style={{ marginLeft: 8 }}
                        disabled={loading}
                      >
                        Subir y guardar en perfil
                      </button>

                      {avatarUrl ? (
                        <button
                          type="button"
                          onClick={deleteAvatarFromBackend}
                          style={{
                            marginLeft: 8,
                            backgroundColor: '#dc2626', // rojo tailwind-ish
                            color: '#fff',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            opacity: loading ? 0.7 : 1,
                          }}
                          disabled={loading}
                        >
                          Quitar
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <p className="ayuda">
                    Sube una imagen cuadrada. La imagen se subirá al
                    storage del servidor y se usará como tu avatar en Level-Up.
                  </p>
                </section>

                <form className="perfil-card" onSubmit={onGuardar}>
                  <h2>Datos personales</h2>

                  <div className="grid-two">
                    <div className="input-group">
                      <label>Nombre</label>
                      <input
                        name="nombre"
                        value={form.nombre}
                        onChange={onChange}
                        placeholder="Ej: nombre"
                      />
                    </div>
                  </div>

                  <div className="grid-two">
                    <div className="input-group">
                      <label>Correo electrónico</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder="micorreo@mail.com"
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="grid-two">
                    <div className="input-group">
                      <label>Fecha de nacimiento</label>
                      <input
                        name="fechaNac"
                        type="date"
                        value={form.fechaNac}
                        onChange={onChange}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Dirección (primera registrada)</label>
                    <input
                      name="direccion"
                      value={form.direccion}
                      onChange={onChange}
                      placeholder="Calle, N°, Depto"
                      readOnly
                    />
                  </div>

                  <div className="grid-three">
                    <div className="input-group">
                      <label>Comuna</label>
                      <input
                        name="comuna"
                        value={form.comuna}
                        onChange={onChange}
                        placeholder="Santiago"
                        readOnly
                      />
                    </div>
                    <div className="input-group">
                      <label>Región</label>
                      <input
                        name="region"
                        value={form.region}
                        onChange={onChange}
                        placeholder="RM"
                        readOnly
                      />
                    </div>
                    <div className="input-group">
                      <label>País</label>
                      <input
                        name="pais"
                        value={form.pais}
                        onChange={onChange}
                        placeholder="Chile"
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="acciones">
                    <button type="submit" className="btn btn-success" disabled={loading}>
                      Guardar cambios
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => {
                        cargarUsuario();
                        cargarDireccionesYSetPrimera(userId);
                        setMensaje('Datos recargados');
                        setTimeout(() => setMensaje(''), 1200);
                      }}
                      style={{ marginLeft: 8 }}
                    >
                      Recargar
                    </button>
                  </div>

                  {mensaje && <div className="toast">{mensaje}</div>}
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
