import React from 'react';
import { useSearchParams } from 'react-router-dom';
import '../styles/pages/productoStyles.css';
import listaProductos from '../assets/listaProductos';
import renderEstrellas from '../components/stars';

const Producto = () => {
    const [searchParams] = useSearchParams();
    const codigo = searchParams.get('codigo');

    const producto = listaProductos.find(p => 
        p["Código"] === codigo || p.id === codigo
    );

    
    
    return (
        <main>
            <div className="container fluid">
                <div className="row">
                    <div className="col-1"></div>
                    <div className="col-10">
                        <section className="productDetalle">
                            <div className="cardDetalle">
                                <img src={require(`../${producto.imgLink}`)} alt={producto.Nombre} />
                                <div className="productInfo">
                                    <h2>{producto.Nombre}</h2>
                                    <p>{producto['Descripción Larga']}</p>
                                    <section className='compra'>
                                        <p className='precio'><strong>Precio: $</strong>{producto.Precio}</p>
                                        <button className="btnAgregar">Añadir al carrito</button>
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
                                                <td>{espec}</td>
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
                                                <td>{coments}</td>
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