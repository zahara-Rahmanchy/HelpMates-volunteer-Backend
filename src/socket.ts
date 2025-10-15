import { Socket, Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";
import { $Enums, PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { GoogleGenAI } from "@google/genai";
import prisma from "./shared/prisma";


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- Configuration ---
const MAX_MESSAGES_PER_SESSION = 50; // keep only last 50 messages in memory
const GUEST_SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes idle

interface SessionChat {
  userId?: string;
  guestId?: string;
  messages: { role: "user" | "model"; content: string }[];
  lastActive: number; // timestamp to track idle
  timeout?: NodeJS.Timeout;
}
const activeChats: Record<string, SessionChat> = {};

interface ChatSocket extends Socket {
  handshake: any;
 
  userId?: string;
  guestId?: string;
}

export function initSocket(server: any) {
  const io = new SocketIOServer(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.use((socket: ChatSocket, next) => {
    const token = socket.handshake.auth?.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        socket.userId = decoded.id;
        return next();
      } catch {
        return next(new Error("Invalid token"));
      }
    } else {
      socket.guestId = uuidv4();
      return next();
    }
  });

  io.on("connection", async (socket: ChatSocket) => {
    const sessionKey = socket.userId || socket.guestId!;
    let session = activeChats[sessionKey];

    // Create session if not exists
    if (!session) {
      session = activeChats[sessionKey] = {
        userId: socket.userId,
        guestId: socket.guestId,
       messages: [
          {
            role: "user",
            content: `You are a special HelpMates agent. You help users discover volunteering opportunities based on their interests.
            You ask short and natural follow-up questions like "What kind of causes are you most passionate about?" or "Do you prefer remote or on-site volunteering?".
            If a message is unclear or unrelated, reply politely with "Hmm, I’m not sure about that — could you please clarify?".
            Keep responses short (2–3 sentences).`
          }
        ],
        lastActive: Date.now(),
      };
    }

    // Auto-clean idle guest sessions
    if (socket.guestId) {
      const resetTimeout = () => {
        if (session!.timeout) clearTimeout(session!.timeout);
        session!.timeout = setTimeout(() => {
          delete activeChats[sessionKey];
          console.log("Guest session expired:", sessionKey);
        }, GUEST_SESSION_TIMEOUT);
      };
      resetTimeout();
    }

    console.log("Connected:", sessionKey);

    // Load previous chat for logged-in users
    if (socket.userId) {
      const previousChats = await prisma.chatMessage.findMany({
        where: { userId: socket.userId },
        orderBy: { createdAt: "asc" },
      });
      socket.emit("load_previous_chat", previousChats);

      previousChats.forEach((c) =>
        session!.messages.push({
          role: c.role === "bot" ? "model" : "user",
          content: c.content,
        })
      );
    } else {
      socket.emit("load_previous_chat", []);
    }

    // Handle user messages
    socket.on("user_message", async (message: string) => {
      session!.messages.push({ role: "user", content: message });
      session!.lastActive = Date.now();

      // Limit messages in memory
      if (session!.messages.length > MAX_MESSAGES_PER_SESSION) {
        session!.messages = session!.messages.slice(-MAX_MESSAGES_PER_SESSION);
      }

      if (socket.guestId && session!.timeout) clearTimeout(session!.timeout); // reset idle timer
      if (socket.guestId) {
        session!.timeout = setTimeout(() => {
          delete activeChats[sessionKey];
          console.log("Guest session expired:", sessionKey);
        }, GUEST_SESSION_TIMEOUT);
      }

      // Create Gemini chat session with memory
      const chatSession = ai.chats.create({
        model: "gemini-2.5-flash",
        history: session!.messages.map((m) => ({
          role: m.role,
          parts: [{ text: m.content }],
        })),
      });

      // Stream Gemini response
      const stream = await chatSession.sendMessageStream({ message });
      console.log("stream: ",stream)
      let botReply = "";

      for await (const chunk of stream) {
        botReply += chunk.text;
        console.log("chunks: ",chunk.text)
        socket.emit("bot_reply_stream", (chunk.text)) ;
      }

      session!.messages.push({ role: "model", content: botReply });
      if (session!.messages.length > MAX_MESSAGES_PER_SESSION) {
        session!.messages = session!.messages.slice(-MAX_MESSAGES_PER_SESSION);
      }
    });

    // End chat → save to DB for logged-in users
    socket.on("end_chat", async () => {
      if (session!.userId && session!.messages.length > 0) {
        await prisma.chatMessage.createMany({
          data: session!.messages.map((m) => ({
            userId: session?.userId!,
            role: m.role === "model" ? "bot" : "user",
            content: m.content,
          })),
        });
      }
      delete activeChats[sessionKey];
      socket.emit("chat_saved");
    });

    // Disconnect → optionally save logged-in chats
    socket.on("disconnect", async () => {
      console.log("Disconnected:", sessionKey);
      if (session?.userId && session.messages.length > 0) {
        await prisma.chatMessage.createMany({
          data: session.messages.map((m) => ({
            userId: session.userId!,
            role: m.role === "model" ? "bot" : "user",
            content: m.content,
          })),
        });
      }
      delete activeChats[sessionKey];
    });
  });

  return io;
}
