import { useEffect, useRef, useState } from 'react';
import SideBar from '../components/SideBar';
import '../styles/pages/cuentaStyles.css';
import '../styles/pages/panelAdministrador.css';

const BASE_URL = 'http://levelup.ddns.net:8080/users';
const TOKEN_KEY = 'accessToken';

/**
 * Cuenta.jsx
 *
 * - GET /users/me  -> carga datos del usuario actual
 * - GET /users/me/direcciones -> carga direcciones y selecciona la primera registrada (más antigua)
 * - PUT /users/{id} -> actualizar usuario (solo nombre y fechaNacimiento en la UI; backend recibe avatarUrl si cambias)
 *
 * Avatar:
 * - Si el usuario selecciona un archivo, construimos la URL pública esperada:
 *   http://localhost:8000/storage/v1/object/public/levelup_files/fotoPerfil/{userId}/Foto_Perfil.jpg
 * - NO se sube el binario al storage desde este componente porque se requieren credenciales/headers.
 *   Si quieres que el frontend haga upload directo, necesitamos un presigned URL o una API key (no seguro exponerla).
 *
 * Nota: ajusta TOKEN_KEY si tu app guarda el JWT con otra clave.
 */

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
  const [avatarFile, setAvatarFile] = useState(null); // archivo seleccionado
  const [avatarUrl, setAvatarUrl] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [usuarioRaw, setUsuarioRaw] = useState(null); // guardamos response completa para datos como rol/activo
  const inputFileRef = useRef(null);

  // ---------- JWT helpers (mismo parse usado en Direcciones) ----------
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

  // extrae userId del token (sub)
  const extractUserIdFromToken = () => {
    const token = getToken();
    if (!token) return null;
    const payload = parseJwtPayload(token);
    if (!payload) return null;
    // Algunos tokens usan 'sub', otros 'userId' — comprobamos ambos
    return payload.sub ?? payload.userId ?? payload.id ?? null;
  };

  // ---------- Fetch inicial ----------
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Carga usuario ----------
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
      // Mapear campos a UI: backend usa 'fechaNacimiento' (LocalDate)
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

  // ---------- Carga direcciones y selecciona la primera ingresada (más antigua) ----------
  const cargarDireccionesYSetPrimera = async (uidFromToken) => {
    setLoading(true);
    setMensaje('');
    const token = getToken();
    try {
      const res = await fetch(`${BASE_URL}/me/direcciones`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });

      if (!res.ok) {
        // no rompemos el formulario si no hay direcciones
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        // no hay direcciones
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

      // Elegir la PRIMERA ingresada en el sistema (más antigua):
      // Como el backend suele devolver por creadoEn desc, calculamos la más antigua por fecha creadoEn.
      let primera = data[0];
      if (data.length > 1) {
        primera = data.reduce((oldest, cur) => {
          const a = new Date(oldest.creadoEn || oldest.creadoAt || 0);
          const b = new Date(cur.creadoEn || cur.creadoAt || 0);
          return a <= b ? oldest : cur;
        }, data[0]);
      }

      // Mapear a los campos del form (dirección mostrada como readonly)
      setForm((f) => ({
        ...f,
        direccion: `${primera.calle || ''} ${primera.numero || ''}${primera.depto ? ', ' + primera.depto : ''}`,
        comuna: primera.ciudad || '',
        region: primera.region || '',
        pais: primera.pais || '',
      }));
    } catch (err) {
      console.error('cargarDirecciones error', err);
      // no bloqueamos el form
    } finally {
      setLoading(false);
    }
  };

  // ---------- Handlers del formulario ----------
  const onChange = (e) => {
    const { name, value } = e.target;
    // solo nombre y fechaNac son editables por requerimiento; aun así permitimos setear si se disparan por mistake
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onGuardar = async (e) => {
    e.preventDefault();
    setMensaje('');

    if (!form.nombre) {
      setMensaje('Completa al menos Nombre.');
      return;
    }

    // Validación formato correo (aunque no es editable)
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
      // fallback: extraer
      const uid = extractUserIdFromToken();
      if (!uid) {
        setMensaje('No se pudo determinar el usuario. Inicia sesión.');
        return;
      }
      setUserId(uid);
    }

    // Preparar payload según UsuarioRequest esperado por backend.
    // Backend en service usa: email, nombre, fechaNacimiento, avatarUrl, rol, activo
    // Tomamos rol/activo del usuarioRaw si existe; si no, dejamos valores por defecto.
    const payload = {
      email: form.email, // no editable pero lo incluimos
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
        // actualizar campos visibles
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

  // ---------- Avatar handlers ----------
  // Al seleccionar una imagen local, mostramos preview. No hacemos upload real.
  const onSubirAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // preview en base64
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarFile(file);
      setAvatarUrl(String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  const limpiarAvatar = () => {
    setAvatarFile(null);
    setAvatarUrl('');
    if (inputFileRef.current) inputFileRef.current.value = '';
  };

  // Construye la URL pública esperada en el storage siguiendo tu patrón
  // Ejemplo: http://localhost:8000/storage/v1/object/public/levelup_files/fotoPerfil/{ID}/Foto_Perfil.jpg
  const buildStorageAvatarUrl = (uid) => {
    if (!uid) return '';
    // usar host/puerto real si difiere
    return `http://localhost:8000/storage/v1/object/public/levelup_files/fotoPerfil/${uid}/Foto_Perfil.jpg`;
  };

  // Al confirmar subir imagen al "storage" (opcional): aquí solo actualizamos avatarUrl con la URL esperada.
  // NOTA: esto NO sube el archivo al storage. Para subirlo, ver seccion al final.
  const applyAvatarToStorageUrl = () => {
    if (!userId) {
      setMensaje('No se conoce el ID del usuario. Guarda perfil primero.');
      return;
    }
    const publicUrl = buildStorageAvatarUrl(userId);
    setAvatarUrl(publicUrl);
    setMensaje('URL de avatar actualizada (archivo no subido automáticamente).');
    setTimeout(() => setMensaje(''), 2000);
  };

  // ---------- Render ----------
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
                {/* Avatar */}
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
                        onClick={applyAvatarToStorageUrl}
                        title="Construir y guardar la URL pública del avatar en la base de datos (no sube el archivo)"
                        style={{ marginLeft: 8 }}
                      >
                        Usar en perfil (guardar URL)
                      </button>

                      {avatarUrl ? (
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={limpiarAvatar}
                          style={{ marginLeft: 8 }}
                        >
                          Quitar
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <p className="ayuda">
                    Sube una imagen cuadrada (recomendado 512×512). Si quieres que el archivo
                    se suba al storage, configura el backend para aceptar el upload o
                    proporciona un presigned URL.
                  </p>
                </section>

                {/* Datos personales */}
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
                        readOnly // email NO editable según tu requerimiento
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
                        // recargar datos de usuario/direccion
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
