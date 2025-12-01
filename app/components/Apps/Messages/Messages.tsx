"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useChat } from "@ai-sdk/react";
import { AppContainer } from "@/app/components/Apps/AppContainer";
import {
  conversations,
  Conversation,
  Message,
  formatMessageTime,
} from "./messagesData";

// Avatar component
function Avatar({
  contact,
  size = 52,
}: {
  contact: { initials: string; avatarColor: string; name: string };
  size?: number;
}) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-medium shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: contact.avatarColor,
        fontSize: size * 0.38,
      }}
    >
      {contact.initials}
    </div>
  );
}

// Typing indicator
function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center">
      <motion.span
        className="w-2 h-2 bg-[#8E8E93] rounded-full"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
      />
      <motion.span
        className="w-2 h-2 bg-[#8E8E93] rounded-full"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
      />
      <motion.span
        className="w-2 h-2 bg-[#8E8E93] rounded-full"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  );
}

// Conversation list item
function ConversationItem({
  conversation,
  onClick,
}: {
  conversation: Conversation;
  onClick: () => void;
}) {
  const { contact, lastMessagePreview, lastMessageTime, unreadCount } =
    conversation;

  return (
    <motion.button
      className="w-full flex items-center gap-3 px-4 active:bg-[#D1D1D6] transition-colors relative"
      onClick={onClick}
      whileTap={{ backgroundColor: "#D1D1D6" }}
    >
      {/* Unread indicator */}
      {unreadCount > 0 && (
        <div className="absolute left-1.5 top-1/2 -translate-y-1/2">
          <div className="w-2.5 h-2.5 bg-[#007AFF] rounded-full" />
        </div>
      )}

      <Avatar contact={contact} />

      <div className="flex-1 min-w-0 border-b border-[#3C3C434A] py-3 pr-2">
        <div className="flex items-center justify-between mb-1">
          <span
            className={`text-[17px] leading-[22px] ${
              unreadCount > 0 ? "font-semibold" : "font-normal"
            } text-black`}
          >
            {contact.name}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[15px] text-[#3C3C4399]">
              {formatMessageTime(lastMessageTime)}
            </span>
            <svg
              width="7"
              height="12"
              viewBox="0 0 7 12"
              fill="none"
              className="text-[#3C3C4399]"
            >
              <path
                d="M1 1L6 6L1 11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div className="flex items-center">
          <p
            className={`text-[15px] leading-[20px] line-clamp-2 ${
              unreadCount > 0 ? "text-black" : "text-[#3C3C4399]"
            }`}
          >
            {lastMessagePreview}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

// Generic message bubble (for both regular and AI messages)
function MessageBubbleUI({
  text,
  isFromMe,
  showTail,
  isLastInGroup,
}: {
  text: string;
  isFromMe: boolean;
  showTail: boolean;
  isLastInGroup: boolean;
}) {
  return (
    <div
      className={`flex ${isFromMe ? "justify-end" : "justify-start"} ${
        isLastInGroup ? "mb-2" : "mb-0.5"
      }`}
    >
      <div className="relative max-w-[75%]">
        <div
          className={`px-3 py-2 ${
            isFromMe
              ? "bg-[#007AFF] text-white rounded-[18px]"
              : "bg-[#E9E9EB] text-black rounded-[18px]"
          } ${
            showTail ? (isFromMe ? "rounded-br-[4px]" : "rounded-bl-[4px]") : ""
          }`}
        >
          <p className="text-[17px] leading-[22px] whitespace-pre-wrap break-words">
            {text}
          </p>
        </div>
        {/* Tail */}
        {showTail && (
          <div
            className={`absolute bottom-0 ${
              isFromMe ? "-right-[6px]" : "-left-[6px]"
            }`}
          >
            <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
              {isFromMe ? (
                <path d="M0 16C4 16 8 12 8 6V0C8 8 4 12 0 16Z" fill="#007AFF" />
              ) : (
                <path
                  d="M12 16C8 16 4 12 4 6V0C4 8 8 12 12 16Z"
                  fill="#E9E9EB"
                />
              )}
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

// Message bubble for regular conversations
function MessageBubble({
  message,
  showTail,
  isLastInGroup,
}: {
  message: Message;
  showTail: boolean;
  isLastInGroup: boolean;
}) {
  return (
    <MessageBubbleUI
      text={message.text}
      isFromMe={message.isFromMe}
      showTail={showTail}
      isLastInGroup={isLastInGroup}
    />
  );
}

// Helper to extract text from message parts
function getMessageText(parts: Array<{ type: string; text?: string }>): string {
  return parts
    .filter((part) => part.type === "text" && part.text)
    .map((part) => part.text)
    .join("");
}

// AI Conversation View - uses useChat hook from AI SDK v6
function AIConversationView({
  conversation,
  onBack,
}: {
  conversation: Conversation;
  onBack: () => void;
}) {
  const { contact } = conversation;
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    messages: [
      {
        id: "ai-intro",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "I'm an AI. Ask me anything.",
          },
        ],
      },
    ],
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Auto-scroll to bottom when messages change or while loading
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    sendMessage({ text: input.trim() });
    setInput("");
  };

  // Process messages to add tail info
  const messagesWithMeta = messages.map((msg, idx, arr) => {
    const nextMsg = arr[idx + 1];
    // @ts-expect-error role type
    const isFromMe = msg.role === "user";
    // @ts-expect-error role type
    const nextIsFromMe = nextMsg?.role === "user";
    const isLastInGroup = !nextMsg || nextIsFromMe !== isFromMe;
    const text = getMessageText(
      msg.parts as Array<{ type: string; text?: string }>
    );
    return { ...msg, text, isFromMe, showTail: isLastInGroup, isLastInGroup };
  });

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center px-4 py-2 border-b border-[#3C3C435C] bg-[#F2F2F7]">
        <button
          className="flex items-center gap-1 shrink-0 active:opacity-50"
          onClick={onBack}
        >
          <Image
            src="/sf-symbols/chevron.left.svg"
            alt="Back"
            width={12}
            height={20}
            className="opacity-100"
            style={{
              filter:
                "invert(32%) sepia(98%) saturate(1234%) hue-rotate(201deg) brightness(97%) contrast(107%)",
            }}
          />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center">
          <Avatar contact={contact} size={34} />
          <span className="text-[11px] text-black font-medium mt-0.5">
            {contact.name}
          </span>
        </div>

        <button className="shrink-0 active:opacity-50">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect
              x="2"
              y="6"
              width="14"
              height="12"
              rx="2"
              stroke="#007AFF"
              strokeWidth="1.5"
            />
            <path
              d="M16 10L21 7V17L16 14"
              stroke="#007AFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-2 py-2 hide-scrollbar bg-white"
      >
        <div className="text-center text-[12px] text-[#8E8E93] py-2 mb-2">
          <span className="bg-[#F2F2F7] px-2 py-1 rounded-full">Today</span>
        </div>

        {messagesWithMeta.map((msg) => (
          <MessageBubbleUI
            key={msg.id}
            text={msg.text}
            isFromMe={msg.isFromMe}
            showTail={msg.showTail}
            isLastInGroup={msg.isLastInGroup}
          />
        ))}

        {/* Typing indicator while AI is loading */}
        {isLoading && (
          <div className="flex justify-start mb-2">
            <div className="bg-[#E9E9EB] rounded-[18px] rounded-bl-[4px] px-3 py-2.5 relative">
              <TypingIndicator />
              <div className="absolute bottom-0 -left-[6px]">
                <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
                  <path
                    d="M12 16C8 16 4 12 4 6V0C4 8 8 12 12 16Z"
                    fill="#E9E9EB"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-[#3C3C435C] bg-[#F2F2F7] px-3 py-2 pb-3"
      >
        <div className="flex items-end gap-2">
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-[#E5E5EA] flex items-center justify-center shrink-0 active:opacity-50"
          >
            <Image
              src="/sf-symbols/plus.svg"
              alt="Add"
              width={18}
              height={18}
              style={{
                filter:
                  "invert(56%) sepia(6%) saturate(25%) hue-rotate(346deg) brightness(95%) contrast(87%)",
              }}
            />
          </button>

          <div className="flex-1 flex items-center bg-white rounded-[20px] border border-[#3C3C435C] min-h-[36px]">
            <input
              type="text"
              placeholder="iMessage"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 text-[17px] outline-none bg-transparent px-3 py-1.5 text-black placeholder:text-[#3C3C4399]"
            />
          </div>

          {input.trim() ? (
            <button
              type="submit"
              disabled={isLoading}
              className="w-8 h-8 rounded-full bg-[#007AFF] flex items-center justify-center shrink-0 active:opacity-50 disabled:opacity-50"
            >
              <Image
                src="/sf-symbols/arrow.up.svg"
                alt="Send"
                width={16}
                height={20}
                style={{ filter: "invert(1)" }}
              />
            </button>
          ) : (
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-[#E5E5EA] flex items-center justify-center shrink-0 active:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 15C13.66 15 15 13.66 15 12V6C15 4.34 13.66 3 12 3C10.34 3 9 4.34 9 6V12C9 13.66 10.34 15 12 15Z"
                  stroke="#8E8E93"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 10V12C5 15.87 8.13 19 12 19C15.87 19 19 15.87 19 12V10"
                  stroke="#8E8E93"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 19V22"
                  stroke="#8E8E93"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// Regular Conversation View (non-AI)
function ConversationView({
  conversation,
  onBack,
}: {
  conversation: Conversation;
  onBack: () => void;
}) {
  const { contact, messages, isTyping } = conversation;
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Group messages and determine which need tails
  const messagesWithMeta = messages.map((msg, idx, arr) => {
    const nextMsg = arr[idx + 1];
    const isLastInGroup = !nextMsg || nextMsg.isFromMe !== msg.isFromMe;
    return { ...msg, showTail: isLastInGroup, isLastInGroup };
  });

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center px-4 py-2 border-b border-[#3C3C435C] bg-[#F2F2F7]">
        <button
          className="flex items-center gap-1 shrink-0 active:opacity-50"
          onClick={onBack}
        >
          <Image
            src="/sf-symbols/chevron.left.svg"
            alt="Back"
            width={12}
            height={20}
            className="opacity-100"
            style={{
              filter:
                "invert(32%) sepia(98%) saturate(1234%) hue-rotate(201deg) brightness(97%) contrast(107%)",
            }}
          />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center">
          <Avatar contact={contact} size={34} />
          <span className="text-[11px] text-black font-medium mt-0.5">
            {contact.name}
          </span>
        </div>

        <button className="shrink-0 active:opacity-50">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect
              x="2"
              y="6"
              width="14"
              height="12"
              rx="2"
              stroke="#007AFF"
              strokeWidth="1.5"
            />
            <path
              d="M16 10L21 7V17L16 14"
              stroke="#007AFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 py-2 hide-scrollbar bg-white">
        <div className="text-center text-[12px] text-[#8E8E93] py-2 mb-2">
          <span className="bg-[#F2F2F7] px-2 py-1 rounded-full">Today</span>
        </div>

        {messagesWithMeta.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            showTail={msg.showTail}
            isLastInGroup={msg.isLastInGroup}
          />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start mb-2">
            <div className="bg-[#E9E9EB] rounded-[18px] rounded-bl-[4px] px-3 py-2.5 relative">
              <TypingIndicator />
              <div className="absolute bottom-0 -left-[6px]">
                <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
                  <path
                    d="M12 16C8 16 4 12 4 6V0C4 8 8 12 12 16Z"
                    fill="#E9E9EB"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-[#3C3C435C] bg-[#F2F2F7] px-3 py-2 pb-3">
        <div className="flex items-end gap-2">
          <button className="w-8 h-8 rounded-full bg-[#E5E5EA] flex items-center justify-center shrink-0 active:opacity-50">
            <Image
              src="/sf-symbols/plus.svg"
              alt="Add"
              width={18}
              height={18}
              style={{
                filter:
                  "invert(56%) sepia(6%) saturate(25%) hue-rotate(346deg) brightness(95%) contrast(87%)",
              }}
            />
          </button>

          <div className="flex-1 flex items-center bg-white rounded-[20px] border border-[#3C3C435C] min-h-[36px]">
            <input
              type="text"
              placeholder="iMessage"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 text-[17px] outline-none bg-transparent px-3 py-1.5 text-black placeholder:text-[#3C3C4399]"
            />
          </div>

          {inputText.trim() ? (
            <button className="w-8 h-8 rounded-full bg-[#007AFF] flex items-center justify-center shrink-0 active:opacity-50">
              <Image
                src="/sf-symbols/arrow.up.svg"
                alt="Send"
                width={16}
                height={20}
                style={{ filter: "invert(1)" }}
              />
            </button>
          ) : (
            <button className="w-8 h-8 rounded-full bg-[#E5E5EA] flex items-center justify-center shrink-0 active:opacity-50">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 15C13.66 15 15 13.66 15 12V6C15 4.34 13.66 3 12 3C10.34 3 9 4.34 9 6V12C9 13.66 10.34 15 12 15Z"
                  stroke="#8E8E93"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 10V12C5 15.87 8.13 19 12 19C15.87 19 19 15.87 19 12V10"
                  stroke="#8E8E93"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 19V22"
                  stroke="#8E8E93"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Pinned conversation
function PinnedConversation({
  conversation,
  onClick,
}: {
  conversation: Conversation;
  onClick: () => void;
}) {
  const { contact, unreadCount } = conversation;

  return (
    <motion.button
      className="flex flex-col items-center shrink-0"
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
    >
      <div className="relative mb-1">
        <Avatar contact={contact} size={56} />
        {unreadCount > 0 && (
          <div className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#007AFF] rounded-full flex items-center justify-center px-1 border-2 border-white">
            <span className="text-white text-[11px] font-bold">
              {unreadCount}
            </span>
          </div>
        )}
      </div>
      <span className="text-[11px] text-center text-black w-[60px] truncate leading-tight">
        {contact.name.split(" ")[0]}
      </span>
    </motion.button>
  );
}

// Main Messages component
export function Messages() {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [searchText, setSearchText] = useState("");

  const pinnedConversations = conversations.filter((c) => c.isPinned);
  const regularConversations = conversations.filter((c) => !c.isPinned);

  // Filter conversations based on search
  const filteredRegular = searchText
    ? regularConversations.filter(
        (c) =>
          c.contact.name.toLowerCase().includes(searchText.toLowerCase()) ||
          c.lastMessagePreview.toLowerCase().includes(searchText.toLowerCase())
      )
    : regularConversations;

  const filteredPinned = searchText
    ? pinnedConversations.filter(
        (c) =>
          c.contact.name.toLowerCase().includes(searchText.toLowerCase()) ||
          c.lastMessagePreview.toLowerCase().includes(searchText.toLowerCase())
      )
    : pinnedConversations;

  const handleBack = () => {
    setSelectedConversation(null);
  };

  return (
    <AppContainer
      appId="messages"
      backgroundColor="#F2F2F7"
      statusBarVariant="dark"
    >
      <AnimatePresence mode="wait">
        {selectedConversation ? (
          <motion.div
            key={`conversation-${selectedConversation.id}`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="absolute inset-0 bg-white"
            style={{ paddingTop: "var(--status-bar-height)" }}
          >
            {selectedConversation.isAI ? (
              <AIConversationView
                conversation={selectedConversation}
                onBack={handleBack}
              />
            ) : (
              <ConversationView
                conversation={selectedConversation}
                onBack={handleBack}
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0.5 }}
            className="flex flex-col h-full"
          >
            {/* Header - iOS style */}
            <div className="bg-[#F2F2F7]">
              <div className="px-4 pt-1">
                <div className="flex items-center justify-between mb-0.5">
                  <button className="text-[17px] text-[#007AFF] font-normal active:opacity-50">
                    Edit
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center active:opacity-50">
                    <Image
                      src="/sf-symbols/square.and.pencil.svg"
                      alt="Compose"
                      width={22}
                      height={22}
                      style={{
                        filter:
                          "invert(32%) sepia(98%) saturate(1234%) hue-rotate(201deg) brightness(97%) contrast(107%)",
                      }}
                    />
                  </button>
                </div>
                <h1 className="text-[34px] font-bold text-black tracking-tight">
                  Messages
                </h1>
              </div>

              {/* Search bar */}
              <div className="px-4 py-2">
                <div className="bg-[#7676801F] rounded-[10px] flex items-center gap-1.5 px-2 py-[7px]">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                    className="shrink-0"
                  >
                    <circle
                      cx="7"
                      cy="7"
                      r="5.5"
                      stroke="#3C3C4399"
                      strokeWidth="1"
                    />
                    <path
                      d="M11 11L15 15"
                      stroke="#3C3C4399"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="flex-1 bg-transparent text-[17px] outline-none text-black placeholder:text-[#3C3C4399]"
                  />
                  {searchText && (
                    <button
                      onClick={() => setSearchText("")}
                      className="w-[18px] h-[18px] bg-[#3C3C434D] rounded-full flex items-center justify-center"
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M2 2L8 8M8 2L2 8"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto hide-scrollbar bg-white">
              {/* Pinned conversations */}
              {filteredPinned.length > 0 && (
                <div className="px-4 py-3 border-b border-[#3C3C435C]">
                  <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-1">
                    {filteredPinned.map((conv) => (
                      <PinnedConversation
                        key={conv.id}
                        conversation={conv}
                        onClick={() => setSelectedConversation(conv)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Regular conversations */}
              <div>
                {filteredRegular.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conversation={conv}
                    onClick={() => setSelectedConversation(conv)}
                  />
                ))}
              </div>

              {/* Empty state */}
              {filteredRegular.length === 0 && filteredPinned.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                  <p className="text-[#3C3C4399] text-[17px]">No Results</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppContainer>
  );
}
