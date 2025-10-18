import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../styles/pages/productoStyles.css';
import listaProductos from '../assets/listaProductos';
import renderEstrellas from '../components/stars';
import showToast from '../components/toast';

const Producto = () => {
    const [searchParams] = useSearchParams();
    const codigo = searchParams.get('codigo');
    const { dispatchCart } = useApp();

    const producto = listaProductos.find(p => 
        p["Código"] === codigo || p.id === codigo
    );

    const { 
        Nombre: nombre, 
        Precio: precio, 
        imgLink
        // ... otras propiedades que necesites
    } = producto;

    const productImage = require(`../${imgLink}`)

    const AddToCart = (e) => {
        e.stopPropagation();
        
        // Crear objeto producto para el carrito
        const product = {
            id: codigo,
            name: nombre,
            price: precio,
            image: productImage
        };

        
            
        dispatchCart({ type: 'ADD_TO_CART', payload: product });
        showToast("Se ha ingresado " + nombre + " al carrito");
    };

    
    
    return (
        <main>
            <div className="container fluid">
                <div className="row">
                    <div className="col-1"></div>
                    <div className="col-10">
                        <section className="productDetalle">
                            <h2 className='productName'>{producto.Nombre}</h2>
                            <div className="cardDetalle">
                                <img src={require(`../${producto.imgLink}`)} alt={producto.Nombre} />
                                <div className="productInfo">
                                    <p className='description'>{producto['Descripción Larga']}</p>
                                    <section className='compra'>
                                        <p className='precio'><strong>Precio: $</strong>{producto.Precio}</p>
                                        <button className="btnAgregar" onClick={AddToCart}>Añadir al carrito</button>
                                    </section>
                                </div>
                            </div>
                            <hr />
                            
                            {renderEstrellas(producto.Puntuacion)}

                            <hr />
                            <div className="detalles">
                                <table className='especificaciones'>
                                    <thead>
                                        <tr>
                                            <th><strong>Especificaciones</strong></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {producto.Especificaciones.map((espec, index) => (
                                            <tr key={index}>
                                                <td className='line'>{espec}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <table className='comentarios'>
                                    <thead>
                                        <tr>
                                            <th><strong>Comentarios</strong></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {producto.Comentarios.map((coments, index) => (
                                            <tr key={index}>
                                                <td className='line'>{coments}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                    <div className="col-1"></div>
                </div>
            </div>
        </main>
    );
};

export default Producto;