import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, Send, Settings } from 'lucide-react';
import { useInbox } from '@/context/InboxContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { CANNED_REPLIES } from '@/data/messages';
import { PageHeader } from '@/components/layout/PageHeader';
import { Avatar } from '@/components/ui/Avatar';
import { IconButton } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/Field';
import { EmptyState } from '@/components/ui/States';
import { RowsSkeleton } from '@/components/ui/Skeleton';
import { cn } from '@/utils/cn';
import { formatRelative, formatTime } from '@/utils/format';

function ConversationList({ conversations, activeId, onSelect, search, onSearch, typingId }) {
  const filtered = conversations.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line p-3">
        <SearchInput
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search conversations…"
          aria-label="Search conversations"
        />
      </div>
      <ul className="scroll-thin flex-1 overflow-y-auto">
        {filtered.map((c) => {
          const last = c.messages[c.messages.length - 1];
          const active = c.id === activeId;
          const isTyping = c.id === typingId;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                aria-current={active}
                className={cn(
                  'flex w-full items-start gap-3 border-b border-line px-4 py-3.5 text-left transition-colors hover:bg-sunken',
                  active && 'bg-accent-soft/50',
                )}
              >
                <Avatar name={c.name} size="md" status={c.status} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[13.5px] font-medium text-ink">{c.name}</p>
                    <span className="shrink-0 text-xs text-ink-3">
                      {last && formatRelative(last.at)}
                    </span>
                  </div>
                  <p className="truncate text-xs text-ink-3">{c.role}</p>
                  {isTyping ? (
                    <p className="mt-1 flex items-center gap-1 text-[13px] font-medium text-accent-strong">
                      <span className="flex gap-0.5">
                        <span className="h-1 w-1 animate-pulse-dot rounded-full bg-current" />
                        <span className="h-1 w-1 animate-pulse-dot rounded-full bg-current [animation-delay:0.15s]" />
                        <span className="h-1 w-1 animate-pulse-dot rounded-full bg-current [animation-delay:0.3s]" />
                      </span>
                      typing…
                    </p>
                  ) : (
                    <p
                      className={cn(
                        'mt-1 truncate text-[13px]',
                        c.unread ? 'font-medium text-ink' : 'text-ink-2',
                      )}
                    >
                      {last?.from === 'me' && <span className="text-ink-3">You: </span>}
                      {last?.text}
                    </p>
                  )}
                </div>
                {c.unread > 0 && (
                  <span className="tnum mt-1 inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-accent px-1.5 text-2xs font-semibold text-accent-fg">
                    {c.unread}
                  </span>
                )}
              </button>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <EmptyState compact icon={Search} title="No conversations found" />
        )}
      </ul>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-sunken px-4 py-3">
        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-ink-3" />
        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-ink-3 [animation-delay:0.15s]" />
        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-ink-3 [animation-delay:0.3s]" />
      </div>
    </div>
  );
}

function Thread({ conversation, onSend, onBack, isTyping }) {
  const [text, setText] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [conversation?.messages.length, isTyping]);

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  if (!conversation) {
    return (
      <EmptyState
        icon={Send}
        title="Select a conversation"
        description="Choose someone from the list to see the full thread."
        className="h-full"
      />
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-line px-5 py-3.5">
        {onBack && (
          <IconButton
            label="Back to conversations"
            icon={ArrowLeft}
            onClick={onBack}
            className="-ml-1.5 md:hidden"
          />
        )}
        <Avatar name={conversation.name} size="md" status={conversation.status} />
        <div>
          <p className="text-[13.5px] font-medium text-ink">{conversation.name}</p>
          <p className="text-xs text-ink-3">{isTyping ? 'typing…' : conversation.status}</p>
        </div>
      </div>

      <div className="scroll-thin flex-1 space-y-3 overflow-y-auto p-5">
        {conversation.messages.map((m) => (
          <div key={m.id} className={cn('flex', m.from === 'me' ? 'justify-end' : 'justify-start')}>
            <div
              className={cn(
                'max-w-[75%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-5',
                m.from === 'me'
                  ? 'rounded-br-md bg-accent text-accent-fg'
                  : 'rounded-bl-md bg-sunken text-ink',
              )}
            >
              {m.text}
              <span
                className={cn(
                  'mt-1 block text-right text-[11px]',
                  m.from === 'me' ? 'text-accent-fg/70' : 'text-ink-3',
                )}
              >
                {formatTime(m.at)}
              </span>
            </div>
          </div>
        ))}
        {isTyping && <TypingBubble />}
        <div ref={endRef} />
      </div>

      <div className="border-t border-line p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {CANNED_REPLIES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onSend(r)}
              className="rounded-full border border-line px-3 py-1 text-xs text-ink-2 transition-colors hover:bg-sunken hover:text-ink"
            >
              {r}
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a message…"
            aria-label="Message"
            className="control flex-1"
          />
          <IconButton
            label="Send message"
            icon={Send}
            variant="primary"
            type="submit"
            disabled={!text.trim()}
          />
        </form>
      </div>
    </div>
  );
}

export default function Messages() {
  const {
    conversations,
    ready,
    openConversation,
    sendMessage,
    setViewingConversationId,
    typingConversationId,
  } = useInbox();
  const [params, setParams] = useSearchParams();
  const [activeId, setActiveId] = useState(params.get('open'));
  const [search, setSearch] = useState('');
  const isDesktop = useMediaQuery('(min-width: 900px)');

  useEffect(() => {
    const id = params.get('open');
    if (id) setActiveId(id);
  }, [params]);

  useEffect(() => {
    if (ready && conversations.length && !activeId && isDesktop) setActiveId(conversations[0].id);
  }, [ready, conversations, activeId, isDesktop]);

  // Tell the inbox which thread is on-screen so ambient replies here don't count as "unread".
  useEffect(() => {
    setViewingConversationId(activeId ?? null);
    return () => setViewingConversationId(null);
  }, [activeId, setViewingConversationId]);

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId],
  );

  const select = (id) => {
    setActiveId(id);
    setParams({}, { replace: true });
    openConversation(id);
  };

  const back = () => {
    setActiveId(null);
    setParams({}, { replace: true });
  };

  return (
    <>
      <PageHeader
        title="Messages"
        description="Conversations with your customers."
        actions={
          <IconButton
            as={Link}
            to="/settings?tab=notifications"
            label="Message settings"
            icon={Settings}
          />
        }
      />
      <div className="card grid h-[calc(100dvh-220px)] min-h-[420px] grid-cols-1 overflow-hidden md:grid-cols-[320px_1fr]">
        <div className={cn('border-line md:border-r', active && !isDesktop && 'hidden')}>
          {!ready ? (
            <RowsSkeleton rows={6} />
          ) : (
            <ConversationList
              conversations={conversations}
              activeId={activeId}
              onSelect={select}
              search={search}
              onSearch={setSearch}
              typingId={typingConversationId}
            />
          )}
        </div>
        <div className={cn(!active && !isDesktop && 'hidden')}>
          <Thread
            conversation={active}
            onSend={(text) => sendMessage(activeId, text)}
            onBack={!isDesktop ? back : undefined}
            isTyping={!!active && typingConversationId === active.id}
          />
        </div>
      </div>
    </>
  );
}
