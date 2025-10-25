import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/pages/actualizarProducto.css';

const EditProduct = ({ product: propProduct, onSave, onCancel }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const productFromState = location && location.state && location.state.product ? location.state.product : null;

  const [formData, setFormData] = useState({
    Código: '',
    Nombre: '',
    Precio: '',
    'Descripción Corta': '',
    'Descripción Larga': '',
    Categoría: '',
    Stock: '',
    Especificaciones: [''],
    Puntuacion: '',
    Comentarios: [''],
    imgLink: ''
  });

  useEffect(() => {
    const product = propProduct || productFromState;
    if (product) {
      setFormData({
        ...product,
        Especificaciones: product.Especificaciones || [''],
        Comentarios: product.Comentarios || ['']
      });
    }
  }, [propProduct, productFromState]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatPrice = (value) => {
    if (value === undefined || value === null || value === '') return '';
    const digits = String(value).replace(/\D/g, '');
    if (!digits) return '';
    const num = parseInt(digits, 10) || 0;
    const formatted = new Intl.NumberFormat('de-DE').format(num);
    return `${formatted} CLP`;
  };

  const handlePriceChange = (e) => {
    const raw = e.target.value;
    const digits = (raw || '').replace(/\D/g, '');
    const formatted = formatPrice(digits);
    setFormData(prev => ({ ...prev, Precio: formatted }));
  };

  const handleSpecificationChange = (index, value) => {
    const newSpecs = [...formData.Especificaciones];
    newSpecs[index] = value;
    setFormData(prev => ({
      ...prev,
      Especificaciones: newSpecs
    }));
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      Especificaciones: [...prev.Especificaciones, '']
    }));
  };

  const removeSpecification = (index) => {
    const newSpecs = formData.Especificaciones.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      Especificaciones: newSpecs
    }));
  };

  const handleCommentChange = (index, value) => {
    const newComments = [...formData.Comentarios];
    newComments[index] = value;
    setFormData(prev => ({
      ...prev,
      Comentarios: newComments
    }));
  };

  const addComment = () => {
    setFormData(prev => ({
      ...prev,
      Comentarios: [...prev.Comentarios, '']
    }));
  };

  const removeComment = (index) => {
    const newComments = formData.Comentarios.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      Comentarios: newComments
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.Código || !formData.Nombre || !formData.Precio) {
      alert('Por favor complete los campos obligatorios');
      return;
    }

    //Filtro especificaciones y comentarios vacios
    const filteredSpecs = formData.Especificaciones.filter(spec => spec.trim() !== '');
    const filteredComments = formData.Comentarios.filter(comment => comment.trim() !== '');
    
    const updated = {
      ...formData,
      Especificaciones: filteredSpecs.length > 0 ? filteredSpecs : ['Sin especificaciones'],
      Comentarios: filteredComments.length > 0 ? filteredComments : ['Sin comentarios']
    };

    if (typeof onSave === 'function') {
      onSave(updated);
    } else {
      alert('Producto actualizado (simulado).');
      navigate('/listar');
    }
  };

  const product = propProduct || productFromState;
  if (!product) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="edit-product-container">
      <h2>Editar Producto: {product.Nombre}</h2>
      
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
              disabled
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
              max="999999"
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
          <textarea
            name="Descripción Corta"
            value={formData['Descripción Corta']}
            onChange={handleInputChange}
            rows="3"
            required
          />
        </div>

        <div className="form-group">
          <label>Descripción Larga</label>
          <textarea
            name="Descripción Larga"
            value={formData['Descripción Larga']}
            onChange={handleInputChange}
            rows="5"
          />
        </div>

        <div className="form-group">
          <label>URL de la imagen</label>
          <input
            type="text"
            name="imgLink"
            value={formData.imgLink}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Puntuación (0-10)</label>
          <input
            type="number"
            name="Puntuacion"
            value={formData.Puntuacion}
            onChange={handleInputChange}
            min="0"
            max="10"
          />
        </div>

        <div className="form-group">
          <label>Especificaciones</label>
          {formData.Especificaciones.map((spec, index) => (
            <div key={index} className="specification-item">
              <input
                type="text"
                value={spec}
                onChange={(e) => handleSpecificationChange(index, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeSpecification(index)}
                className="btn-remove"
              >
                ✕
              </button>
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

        <div className="form-group">
          <label>Comentarios</label>
          {formData.Comentarios.map((comment, index) => (
            <div key={index} className="specification-item">
              <input
                type="text"
                value={comment}
                onChange={(e) => handleCommentChange(index, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeComment(index)}
                className="btn-remove"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addComment}
            className="btn-add"
          >
            + Agregar Comentario
          </button>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-save">
            Guardar Cambios
          </button>
          <button type="button" onClick={() => { if (typeof onCancel === 'function') { onCancel(); } else { navigate('/listar'); } }} className="btn-cancel">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;