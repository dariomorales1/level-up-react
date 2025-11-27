import { useState, useCallback } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';


const ORDER_API_BASE_URL = 'http://levelup.ddns.net:8080';

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

  const getAccessToken = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No hay token de acceso disponible');
    }
    return token;
  };

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

      const isTop5 = !!data.top5ByPoints;
      const hasDuoc = !!data.hasDuocEmail;

      setEsTop5PorPuntos(isTop5);

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

  const cargarOrdenesYPoints = useCallback(
    async (userId) => {
      await Promise.all([
        obtenerOrdenesUsuario(userId),
        obtenerPuntosUsuario(userId),
      ]);
    },
    [obtenerOrdenesUsuario, obtenerPuntosUsuario]
  );

  const refrescarPuntosYTop = useCallback(
    async (userId) => {
      await obtenerPuntosUsuario(userId);
    },
    [obtenerPuntosUsuario]
  );

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
    puntosUsuario,
    esTop5PorPuntos,
    correoInstitucional,

    crearOrdenDesdeCarrito,
    obtenerOrdenesUsuario,
    obtenerPuntosUsuario,
    cargarOrdenesYPoints,
    refrescarPuntosYTop,
  };
};
