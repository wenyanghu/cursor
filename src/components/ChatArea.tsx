"use client";

import { useState, useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; username: string };
}

interface Props {
  roomId: string;
  roomName: string;
  userId: string;
  socketRef: React.RefObject<Socket | null>;
}

export default function ChatArea({
  roomId,
  roomName,
  userId,
  socketRef,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/messages?roomId=${roomId}`)
      .then((r) => r.json())
      .then(setMessages);

    const socket = socketRef.current;
    if (!socket) return;

    socket.emit("join-room", roomId);

    const handler = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };
    socket.on("new-message", handler);

    return () => {
      socket.emit("leave-room", roomId);
      socket.off("new-message", handler);
    };
  }, [roomId, socketRef]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socketRef.current) return;

    socketRef.current.emit("send-message", {
      content: input.trim(),
      userId,
      roomId,
    });
    setInput("");
  };

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString("zh-TW", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900">
      <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50">
        <h2 className="text-lg font-semibold text-white"># {roomName}</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-slate-500 text-center mt-8">
            還沒有訊息，來說點什麼吧 👋
          </p>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-3 group">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {msg.user.username[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span
                  className={`font-semibold text-sm ${msg.user.id === userId ? "text-purple-400" : "text-green-400"}`}
                >
                  {msg.user.username}
                </span>
                <span className="text-xs text-slate-500">
                  {formatTime(msg.createdAt)}
                </span>
              </div>
              <p className="text-slate-200 break-words">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={sendMessage}
        className="px-6 py-4 border-t border-slate-700"
      >
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`在 #${roomName} 發送訊息...`}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
          >
            發送
          </button>
        </div>
      </form>
    </div>
  );
}
