https://github.com/dariomorales1/level-up-react.git

🌐 LevelUP Gamer – Frontend Web (React)

Frontend oficial de LevelUP Gamer, una plataforma de e-commerce enfocada en productos gamer, desarrollada en React + Context API, con integración a un backend propio, autenticación con Firebase y manejo avanzado de carrito y pedidos.

Proyecto académico para demostrar arquitectura frontend moderna, consumo de APIs, administración de usuarios/productos, componentes reutilizables y una experiencia UI/UX profesional.

👥 Integrantes del Proyecto
Rol	Nombre
Frontend Developer	Felipe Ulloa
Frontend Developer	Darío Morales
🏗️ Tecnologías Principales
🎨 Frontend & UI

CSS Modules + CSS personalizado

Bootstrap 5.3
FontAwesome Icons
React Router DOM

🔥 Autenticación & Backend

Firebase Authentication
Persistencia en localStorage
Axios para consumo de API
Tokens JWT (access + refresh)

🛠 Arquitectura & Estado

Context API (Auth, App, Cart)
Custom Hooks (useAuth, useCart, useOrders)
Estructura modular basada en componentes reutilizables

📦 Descripción del Proyecto

La plataforma incluye:

✔ Catálogo gamer completo
✔ Filtros por categoría
✔ Detalle de producto
✔ Carrito persistente por usuario o invitado
✔ Sistema de registro/login con Firebase
✔ Panel de administración con creación, edición y eliminación de productos
✔ Módulo completo de administración de usuarios
✔ Puntos, descuentos, órdenes y checkout
✔ Blog de noticias gamer
✔ Contacto y páginas informativas

Todo el frontend se basa en React, manteniendo un flujo de navegación simple, moderno y responsivo.

✨ Funcionalidades Principales
🧑‍💻 Autenticación

Login con Firebase ID Token
Persistencia de sesión
Refresh automático del token
Logout completo
Roles: CLIENTE / ADMIN

🛍 Catálogo y productos

Listado completo desde microservicio
Filtros por categoría
Buscador (a nivel API)
Vista de detalle con imágenes, precios, especificaciones y stock

🛒 Carrito de compras

Añadir, editar, eliminar productos
Carrito individual por usuario
Carrito invitado (guest session)
Migración automática de carrito invitado al iniciar sesión
Cálculo de total, subtotal y envío

💳 Checkout

Resumen de compra
Sistema de puntos y top 5
Descuento institucional DUOC
Creación de orden vía API

🧭 Panel de administración

Administración de productos:

Crear productos
Editar productos
Eliminar productos
Subida de imágenes
Vista en cards


Administración de usuarios:

Listar todos los usuarios
Actualizar datos
Eliminar usuario (base + Firebase)
Vista en tarjetas responsivas


📄 Blog & Páginas extra

Noticias gamer 2025
Contacto
Garantías
Términos
Dashboard y perfil usuario


📂 Estructura del Proyecto

Resumido a partir del repo completo:

src/
  components/
  context/
  hooks/
  pages/
  services/
  styles/
public/
scripts/


🧩 Componentes clave

Header + SideBar + NavButton
Card, CardsContainer, Carousel
CartDrawer (carrito lateral)
Toast (notificación temporal)

🧠 Contextos

AppContext → info de usuario + sesión
CartContext → carrito (auth & guest)
useAuth → login, logout, refresh
useOrders → puntos, órdenes y top 5


🔌 Servicios

productService.jsx
cartService.jsx

Conexión vía Axios a:

http://levelup.ddns.net:8080

🔗 Endpoints Consumidos
🧑‍💻 Autenticación
Método	Endpoint	Descripción
| POST	/auth/login	Iniciar sesión con Firebase Token
| POST	/auth/refresh	Renovar Access Token
| POST	/auth/logout	Cerrar sesión
| DELETE	/auth/admin/delete-user	Eliminar usuario Firebase

👤 Usuarios

| GET	/users
| GET	/users/{id}
| PUT	/users/{id}
| DELETE	/users/{id}
| GET	/users/me

🛒 Carrito

| GET | /carts/user/{userId} 
| POST | /carts/user/{userId}/items 
| PUT | /carts/user/{userId}/items/{productId} 
| DELETE | /carts/user/{userId}/items/{productId} 
| DELETE | /carts/user/{userId}/clear 
| GET | /carts/guest/{sessionId} 

🛍 Productos

| GET | /products 
| GET | /products/{codigo} 
| POST | /products 
| PUT | /products/{codigo} 
| DELETE | /products/{codigo} 

📦 Órdenes

| GET | /orders/user/{id} 
| GET | /orders/user/{id}/points 
| POST | /orders/user/{id} 


▶️ Instalación y Ejecución

1️⃣ Clonar el repositorio
git clone <repo-url>
cd level_up_react

2️⃣ Instalar dependencias
npm install

3️⃣ Variables necesarias (Firebase)

Crea archivo:

src/firebase/config.js

4️⃣ Ejecutar en modo desarrollo
npm start

5️⃣ Compilar para producción
npm run build



🧪 Testing

Includes basic tests in:
/spec/src/components/*.spec.js

Frameworks:
Jasmine
Jest (CRA setup)




🏛️ Arquitectura Completa

🧠 State Management
Todo el estado global usa Context API

Flujo:
Hooks → Context → Components → Pages


🔁 Ciclos importantes

Autologin al cargar app
Carga y migración del carrito
Refresh del token automático
Sincronización de puntos/top 5


🔐 Seguridad

Tokens guardados en localStorage
Refresh + verificación de expiración
Headers dinámicos en Axios


🎨 UI & UX

Responsive desktop/mobile
Drawer lateral
Cards con hover
Componentes claros y consistentes
Iconografía moderna


📘 Objetivo educativo

Este proyecto demuestra dominio en:

React avanzado
Integración con microservicios
Manejo de autenticación real
Administración de usuarios/productos
Diseño y arquitectura escalable
Manejo de estado y ciclos complejos

📄 Licencia

Proyecto académico – uso exclusivo para fines educativos.