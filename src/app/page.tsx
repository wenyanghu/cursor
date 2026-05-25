"use client";

import { useState, useEffect } from "react";
import LoginForm from "@/components/LoginForm";
import RoomList from "@/components/RoomList";
import ChatArea from "@/components/ChatArea";
import { useSocket } from "@/hooks/useSocket";

interface Room {
  id: string;
  name: string;
}

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const socketRef = useSocket();

  useEffect(() => {
    if (userId) {
      fetch("/api/rooms")
        .then((r) => r.json())
        .then((data: Room[]) => {
          setRooms(data);
          if (data.length > 0 && !activeRoom) {
            setActiveRoom(data[0]);
          }
        });
    }
  }, [userId]);

  const handleLogin = (id: string, name: string) => {
    setUserId(id);
    setUsername(name);
  };

  if (!userId) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen flex bg-slate-900">
      <RoomList
        rooms={rooms}
        activeRoomId={activeRoom?.id ?? null}
        onSelectRoom={setActiveRoom}
        username={username}
      />
      {activeRoom ? (
        <ChatArea
          roomId={activeRoom.id}
          roomName={activeRoom.name}
          userId={userId}
          socketRef={socketRef}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500">
          選擇一個聊天頻道開始
        </div>
      )}
    </div>
  );
}
