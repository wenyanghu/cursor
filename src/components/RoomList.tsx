"use client";

interface Room {
  id: string;
  name: string;
}

interface Props {
  rooms: Room[];
  activeRoomId: string | null;
  onSelectRoom: (room: Room) => void;
  username: string;
}

export default function RoomList({
  rooms,
  activeRoomId,
  onSelectRoom,
  username,
}: Props) {
  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-bold text-white">💬 ChatRoom</h2>
        <p className="text-sm text-slate-400 truncate mt-1">👤 {username}</p>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <p className="text-xs text-slate-500 uppercase px-2 py-1 font-semibold">
          聊天頻道
        </p>
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onSelectRoom(room)}
            className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition-colors ${
              activeRoomId === room.id
                ? "bg-purple-600 text-white"
                : "text-slate-300 hover:bg-slate-700"
            }`}
          >
            # {room.name}
          </button>
        ))}
      </div>
    </div>
  );
}
