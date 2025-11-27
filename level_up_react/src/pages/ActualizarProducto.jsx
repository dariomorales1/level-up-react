import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/actualizarProducto.css';
import productService from '../services/productService';

const ActualizarProducto = ({ product: propProduct, onSave, onCancel }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    precio: '',
    stock: '',
    categoria: '',
    descripcionCorta: '',
    descripcionLarga: '',
    especificaciones: [],
    imagenUrl: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (propProduct) {
      setFormData({
        codigo: propProduct.codigo,
        nombre: propProduct.nombre,
        precio: propProduct.precio,
        stock: propProduct.stock,
        categoria: propProduct.categoria,
        descripcionCorta: propProduct.descripcionCorta,
        descripcionLarga: propProduct.descripcionLarga,
        imagenUrl: propProduct.imagenUrl || '',
        especificaciones: (propProduct.especificaciones || []).map((s) => ({
          id: s.id ?? null,
          specification: s.specification ?? s
        }))
      });
    }
  }, [propProduct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecChange = (index, value) => {
    const newSpecs = [...formData.especificaciones];
    newSpecs[index].specification = value;
    setFormData(prev => ({ ...prev, especificaciones: newSpecs }));
  };

  const addSpec = () => {
    setFormData(prev => ({
      ...prev,
      especificaciones: [...prev.especificaciones, { id: null, specification: '' }]
    }));
  };

  const removeSpec = (index) => {
    setFormData(prev => ({
      ...prev,
      especificaciones: prev.especificaciones.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanProduct = {
        ...formData,
        especificaciones: formData.especificaciones.map((s) => ({
          id: s.id ?? null,
          specification: s.specification
        }))
      };

      await productService.updateProduct(formData.codigo, cleanProduct);

      alert('Producto actualizado exitosamente.');
      navigate('/admin/productos');

    } catch (error) {
      alert('Error al actualizar producto: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!propProduct) return <div>Cargando producto...</div>;

  return (
    <div className="edit-product-container">
      <h2>Editar Producto: {formData.nombre}</h2>

      <form onSubmit={handleSubmit} className="product-form">

        <div className="form-group">
          <label>Código *</label>
          <input type="text" name="codigo" value={formData.codigo} disabled />
        </div>

        <div className="form-group">
          <label>Nombre *</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Precio *</label>
            <input type="number" name="precio" value={formData.precio} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label>Stock *</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Categoría *</label>
          <select name="categoria" value={formData.categoria} onChange={handleInputChange} required>
            <option value="Juegos de Mesa">Juegos de Mesa</option>
            <option value="Accesorios">Accesorios</option>
            <option value="Consolas">Consolas</option>
            <option value="Computadores Gamers">Computadores Gamers</option>
            <option value="Sillas Gamers">Sillas Gamers</option>
            <option value="Mouse">Mouse</option>
            <option value="Mousepad">Mousepad</option>
            <option value="Poleras Personalizadas">Poleras Personalizadas</option>
            <option value="Polerones Gamers Personalizados">Polerones Gamers Personalizados</option>
          </select>
        </div>

        <div className="form-group">
          <label>Descripción Corta *</label>
          <textarea name="descripcionCorta" value={formData.descripcionCorta} onChange={handleInputChange} rows="3" required />
        </div>

        <div className="form-group">
          <label>Descripción Larga</label>
          <textarea name="descripcionLarga" value={formData.descripcionLarga} onChange={handleInputChange} rows="5" />
        </div>

        <div className="form-group">
          <label>URL Imagen</label>
          <input type="text" name="imagenUrl" value={formData.imagenUrl} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label>Especificaciones</label>

          {formData.especificaciones.map((spec, index) => (
            <div key={index} className="specification-item">
              <input
                type="text"
                value={spec.specification}
                onChange={(e) => handleSpecChange(index, e.target.value)}
              />
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeSpec(index)}
              >
                ✕
              </button>
            </div>
          ))}

          <button type="button" className="btn-add" onClick={addSpec}>
            + Agregar Especificación
          </button>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>

          <button
            type="button"
            className="btn-cancel"
            onClick={() => onCancel ? onCancel() : navigate('/admin/productos')}
          >
            Cancelar
          </button>
        </div>

      </form>
    </div>
  );
};

export default ActualizarProducto;
