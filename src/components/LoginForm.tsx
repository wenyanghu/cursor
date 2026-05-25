"use client";

import { useState } from "react";

interface Props {
  onLogin: (userId: string, username: string) => void;
}

export default function LoginForm({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.trim() }),
    });
    const user = await res.json();
    setLoading(false);
    onLogin(user.id, user.username);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-700"
      >
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          💬 ChatRoom
        </h1>
        <p className="text-slate-400 text-center mb-6">輸入你的名字開始聊天</p>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="你的名字..."
          className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
          autoFocus
          maxLength={20}
        />
        <button
          type="submit"
          disabled={loading || !username.trim()}
          className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
        >
          {loading ? "進入中..." : "進入聊天室"}
        </button>
      </form>
    </div>
  );
}
