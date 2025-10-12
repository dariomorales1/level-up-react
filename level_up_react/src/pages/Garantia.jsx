import React from "react";  
import '../styles/pages/blogStyles.css';


const Garantia = () => {
  return (
    <div className="container-xxl garantia mt-4">
      <hr />
      <h1 className="titulo mb-4">Nuestra garantía</h1>
      <hr />

      <div className="garantia_contenido">
        <p>
          Todo producto nuevo cuenta con una{" "}
          <strong>garantía legal de seis meses</strong> contados desde la fecha
          de compra en caso de falla de fábrica (Ley del Consumidor 19.496). Si
          durante este plazo el producto falla, contáctanos para ver el modo más
          rápido para resolver la situación.{" "}
          <strong>Level-Up Gamer</strong> no ofrece garantía de satisfacción
          para sus productos.
        </p>

        <p>
          En el caso de compras por la web, la ley establece un plazo máximo de{" "}
          <strong>10 días corridos</strong> para derecho a retracto. Para hacer
          efectiva la devolución, el producto debe contar con su{" "}
          <strong>empaque original</strong> y volver en el estado más parecido al
          de su entrega. En caso contrario, los embalajes, piezas dañadas o
          piezas que muestren uso podrían ser descontadas del monto a devolver.
        </p>

        <p>
          Para una mejor aplicación de la garantía te recomendamos presentar el
          comprobante de compra, que puede ser el correo recibido al comprar por
          el sitio web, la boleta o factura original, el producto sin daño
          físico, embalajes completos y todos los accesorios del producto.
        </p>

        <p>
          Ante cualquier duda —antes, durante o después de tu compra— puedes
          contactarnos mediante nuestras redes sociales, correos de contacto o
          WhatsApp.
        </p>

        <p>
          Los productos con <strong>garantías especiales</strong> se encuentran
          especificados en la descripción de cada producto.
        </p>

        <p>
          <strong>NO</strong> contamos con garantía de satisfacción.
        </p>
      </div>
    </div>
  );
};

export default Garantia;
