import "dotenv/config";
import { createServer } from "http";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import { PrismaClient } from "./src/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new SocketIOServer(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join-room", async (roomId: string) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on("leave-room", (roomId: string) => {
      socket.leave(roomId);
    });

    socket.on(
      "send-message",
      async (data: { content: string; userId: string; roomId: string }) => {
        try {
          const message = await prisma.message.create({
            data: {
              content: data.content,
              userId: data.userId,
              roomId: data.roomId,
            },
            include: { user: true, room: true },
          });
          io.to(data.roomId).emit("new-message", message);
        } catch (err) {
          console.error("Error saving message:", err);
          socket.emit("error", "Failed to send message");
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  httpServer.listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
