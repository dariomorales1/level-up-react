import React from 'react';
import '../styles/pages/terminosStyles.css';

const Terminos = () => {
  return (

    <div className="container-xxl terminos mt-4">
      <hr />
      <h1 className="titulo mb-2">Términos y Condiciones</h1>
      <hr />

      <div className="terminos_contenido">
        <ol className="terminos_lista">
          <li>
            Las operaciones realizadas en nuestro sitio web están sujetas a
            estos términos y condiciones, además de la legislación chilena
            vigente. Con cada compra se entiende aceptada esta política.
          </li>
          <li>
            Las ofertas y promociones comunicadas en nuestros canales (sitio web,
            redes sociales y correos electrónicos) aplican solo durante los
            períodos indicados y mientras exista disponibilidad de stock.
          </li>
          <li>
            Los precios publicados en <strong>levelupgamer.cl</strong> aplican
            únicamente para compras efectuadas en la página web y no son válidos
            para transacciones realizadas por otros medios.
          </li>
          <li>
            Si un producto adquirido en <strong>Level-Up Gamer</strong> presenta
            fallas o defectos, no cumple especificaciones técnicas descriptas, o
            presenta daños/piezas faltantes, el cliente podrá optar por la
            devolución, cambio o reparación conforme a la normativa del
            consumidor.
          </li>
          <li>
            Para hacer efectiva la garantía de cualquier producto, escríbenos a{" "}
            <a href="mailto:postventa@levelupgamer.cl">
              postventa@levelupgamer.cl
            </a>{" "}
            describiendo el problema y adjuntando imágenes o video que evidencien
            la falla.
          </li>
          <li>
            En caso de devolución de dinero, se realizará a través del mismo
            método de pago del cliente. De no ser posible, se realizará mediante
            transferencia electrónica.
          </li>
          <li>
            El tiempo de procesamiento para devoluciones de dinero por
            transferencia electrónica es de{" "}
            <strong>5 a 10 días hábiles</strong>.
          </li>
          <li>
            El tiempo de procesamiento para devoluciones de dinero realizadas por
            sistemas de pago como Mercado Pago dependerá de las condiciones de
            cada plataforma y podrá tomar hasta{" "}
            <strong>15 días hábiles</strong>.
          </li>
          <li>
            Los costos de envío hacia nuestras dependencias (tienda, bodega o
            servicio técnico) corren por cuenta del cliente. Para hacer válido
            este punto se requiere el comprobante de compra (correo de
            confirmación del sitio, boleta o factura). Más detalles en nuestra
            página de{" "}
            <a href="#" className="link-externo">
              <strong>Nuestra Garantía</strong>
            </a>
            .
          </li>
          <li>
            En caso de arrepentimiento, devolución o cambio: si el producto ya va
            en camino, los gastos de retiro serán por cuenta del cliente y no se
            devolverán los costos del despacho original. La devolución o el envío
            de un nuevo producto se realizará una vez recibido y verificado el
            estado del original.
          </li>
          <li>
            La recepción de productos debe ser realizada por un mayor de edad,
            quien deberá firmar y escribir su nombre y RUT en la guía de despacho
            para acreditar la conformidad de la recepción. Al recibir el
            producto, verifica que corresponda con tu compra y que esté en buen
            estado antes de firmar la guía.
          </li>
          <li>
            En caso de disconformidad o no haber solicitado el producto, debes
            rechazar la entrega e inmediatamente comunicarte con nuestro equipo a{" "}
            <a href="mailto:postventa@levelupgamer.cl">
              postventa@levelupgamer.cl
            </a>{" "}
            para generar el caso. Aceptado el reclamo, Level-Up Gamer no se
            responsabiliza por costos adicionales de traslado.
          </li>
          <li>
            <strong>Level-Up Gamer no ofrece garantía de satisfacción</strong> en
            los productos.
          </li>
          <li>
            Antes de retirar en tienda, recibirás un correo o un mensaje por
            WhatsApp notificando que tu pedido está listo.
          </li>
          <li>
            Level-Up Gamer se reserva el derecho de atender o vender productos
            exclusivamente a clientes que mantengan un comportamiento respetuoso
            con el equipo y con la comunidad.
          </li>
          <li>
            Los productos con condición{" "}
            <strong>“Entrega diferida”</strong> NO cuentan con entrega inmediata.
            Su despacho puede tardar un plazo adicional (entre 2 y 4 días
            hábiles, según cantidad y tipo de producto).
          </li>
        </ol>
      </div>
    </div>
  );
};

export default Terminos;


