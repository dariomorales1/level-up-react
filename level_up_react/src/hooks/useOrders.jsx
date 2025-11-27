import { useState, useCallback } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';

// 👉 Usa el gateway. Si en local usas otra URL, cámbiala aquí.
const ORDER_API_BASE_URL = 'http://localhost:8080';

const orderApi = axios.create({
  baseURL: ORDER_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useOrders = () => {
  const { user, setUserOrders, setUserPoints } = useApp();

  const [puntosUsuario, setPuntosUsuario] = useState(0);
  const [esTop5PorPuntos, setEsTop5PorPuntos] = useState(false);
  const [correoInstitucional, setCorreoInstitucional] = useState(false);

  // ==========================
  // 🔹 Helper: get access token
  // ==========================
  const getAccessToken = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No hay token de acceso disponible');
    }
    return token;
  };

  // ==========================
  // 🔹 Axios + token
  // ==========================
  const doAuthRequest = async (config) => {
    const token = getAccessToken();

    const finalConfig = {
      ...config,
      headers: {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    };

    return orderApi.request(finalConfig);
  };

  // ======================================================
  // 🔹 OBTENER ÓRDENES DEL USUARIO
  // GET /orders/user/{userId}
  // ======================================================
  const obtenerOrdenesUsuario = useCallback(
    async (userId) => {
      if (!userId) {
        throw new Error('userId es requerido para obtener órdenes');
      }

      const response = await doAuthRequest({
        method: 'GET',
        url: `/orders/user/${userId}`,
      });

      const data = response.data || [];

      if (setUserOrders) {
        setUserOrders(data);
      }

      localStorage.setItem(`orders_${userId}`, JSON.stringify(data));

      return data;
    },
    [setUserOrders]
  );

  // ======================================================
  // 🔹 OBTENER PUNTOS + ESTADO TOP5 / CORREO
  // GET /orders/user/{userId}/points
  //
  // Se asume que el backend puede devolver opcionalmente:
  // { userId, totalPoints, top5ByPoints, hasDuocEmail }
  // Si no lo hace, los flags quedan en false.
  // ======================================================
  const obtenerPuntosUsuario = useCallback(
    async (userId) => {
      if (!userId) {
        throw new Error('userId es requerido para obtener puntos');
      }

      const response = await doAuthRequest({
        method: 'GET',
        url: `/orders/user/${userId}/points`,
      });

      const data = response.data || {};
      const puntos = data.totalPoints ?? 0;

      setPuntosUsuario(puntos);
      if (setUserPoints) {
        setUserPoints(puntos);
      }

      localStorage.setItem(`points_${userId}`, String(puntos));

      // Flags opcionales
      const isTop5 = !!data.top5ByPoints;
      const hasDuoc = !!data.hasDuocEmail;

      setEsTop5PorPuntos(isTop5);

      // Si el backend no lo envía, lo deducimos del usuario logueado
      if (data.hasDuocEmail !== undefined) {
        setCorreoInstitucional(hasDuoc);
      } else {
        const email = user?.email?.toLowerCase() || '';
        setCorreoInstitucional(email.endsWith('@duocuc.cl'));
      }

      return data;
    },
    [setUserPoints, user]
  );

  // ======================================================
  // 🔹 CARGAR ÓRDENES + PUNTOS (para Historial)
  // ======================================================
  const cargarOrdenesYPoints = useCallback(
    async (userId) => {
      await Promise.all([
        obtenerOrdenesUsuario(userId),
        obtenerPuntosUsuario(userId),
      ]);
    },
    [obtenerOrdenesUsuario, obtenerPuntosUsuario]
  );

  // ======================================================
  // 🔹 SOLO refrescar puntos/top (para Checkout)
  // ======================================================
  const refrescarPuntosYTop = useCallback(
    async (userId) => {
      await obtenerPuntosUsuario(userId);
    },
    [obtenerPuntosUsuario]
  );

  // ======================================================
  // 🔹 CREAR ORDEN DESDE CARRITO
  // POST /orders/user/{userId}
  // body: { usePointsDiscount: boolean }
  // ======================================================
  const crearOrdenDesdeCarrito = useCallback(
    async (userId, payload = { usePointsDiscount: false }) => {
      if (!userId) {
        throw new Error('userId es requerido para crear una orden');
      }

      const response = await doAuthRequest({
        method: 'POST',
        url: `/orders/user/${userId}`,
        data: JSON.stringify(payload),
      });

      const data = response.data;

      // Después de crear la orden, refrescamos órdenes + puntos
      try {
        await cargarOrdenesYPoints(userId);
      } catch (e) {
        console.warn('No se pudo refrescar órdenes/puntos después de crear la orden', e);
      }

      return data;
    },
    [cargarOrdenesYPoints]
  );

  return {
    // datos
    puntosUsuario,
    esTop5PorPuntos,
    correoInstitucional,

    // acciones
    crearOrdenDesdeCarrito,
    obtenerOrdenesUsuario,
    obtenerPuntosUsuario,
    cargarOrdenesYPoints,
    refrescarPuntosYTop,
  };
};
