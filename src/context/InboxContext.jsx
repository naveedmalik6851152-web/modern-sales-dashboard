import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { USE_MOCK, emitChange, messagesApi, notificationsApi } from '@/services/api';
import { onServerEvent, emitTyping } from '@/services/socket';
import { useToast } from '@/context/ToastContext';

const InboxContext = createContext(null);

/** Believable auto-replies used to simulate the other side of a conversation in mock mode. */
const AUTO_REPLIES = [
  'Sounds good, thank you!',
  'Got it, appreciate the update.',
  'Perfect — let’s go ahead with that.',
  'Thanks for confirming so quickly.',
  'That works well on my end.',
  'Appreciate the fast turnaround.',
  'Noted, I’ll follow up next week.',
  'Great, looking forward to it.',
  'Understood, thanks for the heads up.',
];
const randomOf = (list) => list[Math.floor(Math.random() * list.length)];
const between = (min, max) => min + Math.random() * (max - min);

/** Notifications and conversations, shared by the navbar badges and their pages.
 *
 * Two modes:
 *  - Mock (default, no backend): replies and ambient messages are simulated locally so the
 *    inbox feels alive with zero setup.
 *  - Real backend (VITE_API_URL set): messages are sent to and received from the actual
 *    server over Socket.IO, so two browser tabs (or two real people) see each other's
 *    messages arrive instantly — genuine real-time, not a simulation.
 */
export function InboxProvider({ children }) {
  const toast = useToast();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const [viewingConversationId, setViewingConversationId] = useState(null);
  const [typingConversationId, setTypingConversationId] = useState(null);

  const conversationsRef = useRef(conversations);
  const viewingRef = useRef(viewingConversationId);
  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);
  useEffect(() => {
    viewingRef.current = viewingConversationId;
  }, [viewingConversationId]);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [n, c] = await Promise.all([notificationsApi.list(), messagesApi.listConversations()]);
      setNotifications(n);
      setConversations(c);
    } catch (e) {
      setError(e);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setRead = useCallback((id, read) => {
    setNotifications((list) => list.map((n) => (n.id === id ? { ...n, read } : n)));
    notificationsApi.markRead(id, read);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((list) => list.map((n) => ({ ...n, read: true })));
    notificationsApi.markAllRead();
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications((list) => list.filter((n) => n.id !== id));
    notificationsApi.remove(id);
  }, []);

  const openConversation = useCallback((id) => {
    setConversations((list) => list.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
    messagesApi.markRead(id);
  }, []);

  const appendMessage = useCallback((conversationId, message, { unread = false } = {}) => {
    setConversations((list) =>
      list.map((c) =>
        c.id === conversationId
          ? { ...c, messages: [...c.messages, message], unread: unread ? c.unread + 1 : c.unread }
          : c,
      ),
    );
  }, []);

  /** Mock-mode only: simulates the other person typing back, then delivers their reply. */
  const simulateReply = useCallback(
    (conversationId, { toastOnArrival = true } = {}) => {
      const typingDelay = between(1200, 2200);
      const replyDelay = typingDelay + between(1400, 2600);

      setTimeout(() => setTypingConversationId(conversationId), typingDelay);

      setTimeout(async () => {
        setTypingConversationId((current) => (current === conversationId ? null : current));
        const conversation = conversationsRef.current.find((c) => c.id === conversationId);
        if (!conversation) return;
        const text = randomOf(AUTO_REPLIES);
        try {
          const message = await messagesApi.send(conversationId, text, 'them');
          const isViewing = viewingRef.current === conversationId;
          appendMessage(conversationId, message, { unread: !isViewing });
          if (toastOnArrival && !isViewing) {
            toast.info(`New message from ${conversation.name}`, {
              description: text,
              action: {
                label: 'Open',
                onClick: () => navigate(`/messages?open=${conversationId}`),
              },
            });
          }
        } catch {
          // Silently drop a failed simulated reply — nothing for the user to retry.
        }
      }, replyDelay);
    },
    [appendMessage, toast, navigate],
  );

  /** Send a message as the current user. In mock mode we append optimistically and then
   * simulate a reply. In real-backend mode we deliberately do NOT append optimistically —
   * the server broadcasts the saved message back over Socket.IO to every connected client,
   * including the sender's own tab, so appending here too would show it twice. */
  const sendMessage = useCallback(
    async (conversationId, text) => {
      if (USE_MOCK) {
        const optimistic = {
          id: `local-${Date.now()}`,
          from: 'me',
          text,
          at: new Date().toISOString(),
        };
        appendMessage(conversationId, optimistic);
        try {
          await messagesApi.send(conversationId, text);
        } catch {
          // The optimistic message still shows even if the mock "network" call rejects.
        }
        simulateReply(conversationId);
        return;
      }
      emitTyping(conversationId);
      await messagesApi.send(conversationId, text);
      // No local append here — see note above; the socket 'message:new' handler does it.
    },
    [appendMessage, simulateReply],
  );

  // Mock mode: ambient activity so the inbox feels alive with zero setup —
  // every 45–100s, someone who isn't being watched sends a message.
  useEffect(() => {
    if (!USE_MOCK || !ready) return undefined;
    let timeoutId;
    const tick = () => {
      timeoutId = setTimeout(
        () => {
          const list = conversationsRef.current;
          const candidates = list.filter((c) => c.id !== viewingRef.current);
          if (candidates.length) simulateReply(randomOf(candidates).id, { toastOnArrival: true });
          tick();
        },
        between(45000, 100000),
      );
    };
    tick();
    return () => clearTimeout(timeoutId);
  }, [ready, simulateReply]);

  // Real-backend mode: listen for genuine events pushed over Socket.IO from the server
  // (which fires them whenever *any* client — this tab, another tab, another person — posts).
  useEffect(() => {
    if (USE_MOCK) return undefined;
    const offMessage = onServerEvent('message:new', ({ conversationId, message }) => {
      const isViewing = viewingRef.current === conversationId;
      appendMessage(conversationId, message, { unread: message.from !== 'me' && !isViewing });
      if (message.from !== 'me' && !isViewing) {
        const conversation = conversationsRef.current.find((c) => c.id === conversationId);
        toast.info(`New message from ${conversation?.name ?? 'a customer'}`, {
          description: message.text,
          action: { label: 'Open', onClick: () => navigate(`/messages?open=${conversationId}`) },
        });
      }
    });
    const offTyping = onServerEvent('typing', ({ conversationId }) => {
      setTypingConversationId(conversationId);
      setTimeout(() => setTypingConversationId((c) => (c === conversationId ? null : c)), 2500);
    });
    const offUser = onServerEvent('user:updated', () => emitChange());
    const offReset = onServerEvent('reset', () => load());
    return () => {
      offMessage();
      offTyping();
      offUser();
      offReset();
    };
  }, [appendMessage, toast, navigate, load]);

  const value = useMemo(
    () => ({
      ready,
      error,
      reload: load,
      notifications,
      conversations,
      unreadNotifications: notifications.filter((n) => !n.read).length,
      unreadMessages: conversations.reduce((s, c) => s + c.unread, 0),
      typingConversationId,
      viewingConversationId,
      setViewingConversationId,
      setRead,
      markAllRead,
      dismissNotification,
      openConversation,
      appendMessage,
      sendMessage,
    }),
    [
      ready,
      error,
      load,
      notifications,
      conversations,
      typingConversationId,
      viewingConversationId,
      setRead,
      markAllRead,
      dismissNotification,
      openConversation,
      appendMessage,
      sendMessage,
    ],
  );

  return <InboxContext.Provider value={value}>{children}</InboxContext.Provider>;
}

export function useInbox() {
  const ctx = useContext(InboxContext);
  if (!ctx) throw new Error('useInbox must be used within InboxProvider');
  return ctx;
}
