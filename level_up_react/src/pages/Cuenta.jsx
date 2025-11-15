import { useEffect, useRef, useState } from 'react';
import SideBar from '../components/SideBar';
import '../styles/pages/cuentaStyles.css';
import '../styles/pages/panelAdministrador.css';

const camposIniciales = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  rut: '',
  fechaNac: '',
  direccion: '',
  ciudad: '',
  region: '',
  pais: '',
  username: '',
};

export default function Cuenta() {
  const [form, setForm] = useState(camposIniciales);
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [mensaje, setMensaje] = useState('');
  const inputFileRef = useRef(null);

  useEffect(() => {
    const guardado = localStorage.getItem('levelup.perfil');
    const foto = localStorage.getItem('levelup.perfil.avatar');
    if (guardado) setForm(JSON.parse(guardado));
    if (foto) setAvatarUrl(foto);
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onGuardar = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.apellido) {
      setMensaje('Completa al menos Nombre y Apellido.');
      return;
    }
    if (
      form.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      setMensaje('Formato de correo no válido.');
      return;
    }
    localStorage.setItem('levelup.perfil', JSON.stringify(form));
    if (avatarUrl) localStorage.setItem('levelup.perfil.avatar', avatarUrl);
    setMensaje('Perfil guardado');
    setTimeout(() => setMensaje(''), 1800);
  };

  const onSubirAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(file);
      setAvatarUrl(String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  const limpiarAvatar = () => {
    setAvatar(null);
    setAvatarUrl('');
    localStorage.removeItem('levelup.perfil.avatar');
    if (inputFileRef.current) inputFileRef.current.value = '';
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
                        Subir imagen
                      </button>
                      {avatarUrl ? (
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={limpiarAvatar}
                        >
                          Quitar
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <p className="ayuda">
                    Sube una imagen cuadrada (recomendado 512×512).
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
                    <div className="input-group">
                      <label>Apellido</label>
                      <input
                        name="apellido"
                        value={form.apellido}
                        onChange={onChange}
                        placeholder="Ej: apellido"
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
                      />
                    </div>
                    <div className="input-group">
                      <label>Teléfono</label>
                      <input
                        name="telefono"
                        value={form.telefono}
                        onChange={onChange}
                        placeholder="+56 9 1234 5678"
                      />
                    </div>
                  </div>

                  <div className="grid-two">
                    <div className="input-group">
                      <label>RUT / ID</label>
                      <input
                        name="rut"
                        value={form.rut}
                        onChange={onChange}
                        placeholder="11.111.111-1"
                      />
                    </div>
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
                    <label>Dirección</label>
                    <input
                      name="direccion"
                      value={form.direccion}
                      onChange={onChange}
                      placeholder="Calle, N°, Depto"
                    />
                  </div>

                  <div className="grid-three">
                    <div className="input-group">
                      <label>Ciudad</label>
                      <input
                        name="ciudad"
                        value={form.ciudad}
                        onChange={onChange}
                        placeholder="Santiago"
                      />
                    </div>
                    <div className="input-group">
                      <label>Región/Estado</label>
                      <input
                        name="region"
                        value={form.region}
                        onChange={onChange}
                        placeholder="RM"
                      />
                    </div>
                    <div className="input-group">
                      <label>País</label>
                      <input
                        name="pais"
                        value={form.pais}
                        onChange={onChange}
                        placeholder="Chile"
                      />
                    </div>
                  </div>

                  <div className="acciones">
                    <button type="submit" className="btn btn-success">
                      Guardar cambios
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => {
                        setForm(camposIniciales);
                        setMensaje('Formulario limpiado');
                        setTimeout(() => setMensaje(''), 1200);
                      }}
                    >
                      Limpiar
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
