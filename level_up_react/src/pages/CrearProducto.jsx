import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../components/SideBar';
import productService from '../services/productService';
import '../styles/pages/crearProducto.css';
import '../styles/pages/panelAdministrador.css';

const CrearProducto = ({ onSave, onCancel }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Código: '',
    Nombre: '',
    Precio: '',
    'Descripción Corta': '',
    'Descripción Larga': '',
    Categoría: '',
    Stock: '',
    Especificaciones: [''],
    imgLink: '', 
  });

  const [imageFile, setImageFile] = useState(null); 
  const [imagePreview, setImagePreview] = useState(''); 
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatPrice = (value) => {
    if (!value) return '';
    const digits = String(value).replace(/\D/g, '');
    if (!digits) return '';
    const num = parseInt(digits, 10) || 0;
    return `${new Intl.NumberFormat('de-DE').format(num)} CLP`;
  };

  const handlePriceChange = (e) => {
    const raw = e.target.value;
    const digits = (raw || '').replace(/\D/g, '');
    const formatted = formatPrice(digits);
    setFormData((prev) => ({ ...prev, Precio: formatted }));
  };

  const handleSpecificationChange = (index, value) => {
    const newSpecs = [...formData.Especificaciones];
    newSpecs[index] = value;
    setFormData((prev) => ({ ...prev, Especificaciones: newSpecs }));
  };

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      Especificaciones: [...prev.Especificaciones, ''],
    }));
  };

  const removeSpecification = (index) => {
    const newSpecs = formData.Especificaciones.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, Especificaciones: newSpecs }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Código || !formData.Nombre || !formData.Precio) {
      alert('Por favor complete los campos obligatorios');
      return;
    }

    const precioNumerico = parseInt(
      String(formData.Precio).replace(/\D/g, '')
    );

    const newProduct = {
      codigo: formData.Código,
      nombre: formData.Nombre,
      descripcionCorta: formData['Descripción Corta'],
      descripcionLarga: formData['Descripción Larga'],
      categoria: formData.Categoría,
      precio: precioNumerico,
      stock: parseInt(formData.Stock || '0', 10),
      imagenUrl: formData.imgLink,
      especificaciones: formData.Especificaciones
        .filter((s) => s.trim() !== '')
        .map((s) => ({ specification: s })),
    };

    try {
      setLoading(true);

      if (imageFile) {
        const uploadResponse = await productService.uploadProductImage(
          formData.Código,     
          imageFile,           
          formData.Categoría,  
          formData.Nombre      
        );

        const publicUrl =
          uploadResponse.publicUrl ||
          uploadResponse.url ||
          uploadResponse.imagenUrl ||
          null;

        if (!publicUrl) {
          console.error('Respuesta de upload sin URL usable:', uploadResponse);
          alert('La imagen no pudo ser subida correctamente');
          setLoading(false);
          return;
        }

        newProduct.imagenUrl = publicUrl;
      }

      await productService.addProduct(newProduct);
      alert('Producto guardado correctamente');
      navigate('/PanelAdministrador');
    } catch (err) {
      console.log('Producto enviado al backend:', newProduct);
      console.error('Error al crear producto:', err);
      alert('Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    if (typeof onCancel === 'function') {
      onCancel();
    } else {
      navigate('/PanelAdministrador');
    }
  };

  return (
    <div className="panel-administrador">
      <div className="management-layout">
        <SideBar />

        <main className="management-main">
          <div className="create-product-container">
            <h2>Crear Nuevo Producto</h2>

            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Código *</label>
                  <input
                    type="text"
                    name="Código"
                    value={formData.Código}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    name="Nombre"
                    value={formData.Nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Precio *</label>
                  <input
                    type="text"
                    name="Precio"
                    value={formData.Precio}
                    onChange={handlePriceChange}
                    placeholder="29.990 CLP"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="Stock"
                    value={formData.Stock}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Categoría *</label>
                <select
                  name="Categoría"
                  value={formData.Categoría}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  <option value="Juegos de Mesa">Juegos de Mesa</option>
                  <option value="Accesorios">Accesorios</option>
                  <option value="Consolas">Consolas</option>
                  <option value="Computadores Gamers">Computadores Gamers</option>
                  <option value="Sillas Gamers">Sillas Gamers</option>
                  <option value="Mouse">Mouse</option>
                  <option value="Mousepad">Mousepad</option>
                  <option value="Poleras Personalizadas">Poleras Personalizadas</option>
                  <option value="Polerones Gamers Personalizados">
                    Polerones Gamers Personalizados
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Descripción Corta *</label>
                <textarea
                  name="Descripción Corta"
                  value={formData['Descripción Corta']}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción Larga (max: 255)</label>
                <textarea
                  name="Descripción Larga"
                  value={formData['Descripción Larga']}
                  onChange={handleInputChange}
                  rows="5"
                  maxLength={255}
                />
              </div>

              <div className="form-group">
                <label>Imagen del producto</label>
                <div className="product-image-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                  />
                  {imagePreview && (
                    <div className="product-image-preview" style={{ marginTop: '8px' }}>
                      <img
                        src={imagePreview}
                        alt="Preview producto"
                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                      />
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  name="imgLink"
                  value={formData.imgLink}
                  onChange={handleInputChange}
                  placeholder="URL manual (opcional, se sobreescribe si subes archivo)"
                  style={{ marginTop: '8px' }}
                />
              </div>

              <div className="form-group">
                <label>Especificaciones</label>
                {formData.Especificaciones.map((spec, index) => (
                  <div key={index} className="specification-item">
                    <input
                      type="text"
                      value={spec}
                      onChange={(e) =>
                        handleSpecificationChange(index, e.target.value)
                      }
                      placeholder="Especificación del producto"
                    />
                    {formData.Especificaciones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpecification(index)}
                        className="btn-remove"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSpecification}
                  className="btn-add"
                >
                  + Agregar Especificación
                </button>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-save" disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar Producto'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="btn-cancel"
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CrearProducto;
