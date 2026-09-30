// Thin Socket.IO client wrapper. Only connects when a real backend (VITE_API_URL) is
// configured — in pure mock mode there is nothing to connect to, so this is a no-op.
import { io } from 'socket.io-client';
import { USE_MOCK } from './api';

let socket = null;

export function getSocket() {
  if (USE_MOCK) return null;
  if (!socket) {
    const base = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');
    socket = io(base, { autoConnect: true, transports: ['websocket', 'polling'] });
  }
  return socket;
}

/** Subscribe to a server event; returns an unsubscribe function. No-op in mock mode. */
export function onServerEvent(event, handler) {
  const s = getSocket();
  if (!s) return () => {};
  s.on(event, handler);
  return () => s.off(event, handler);
}

export const emitTyping = (conversationId) => getSocket()?.emit('typing', { conversationId });
