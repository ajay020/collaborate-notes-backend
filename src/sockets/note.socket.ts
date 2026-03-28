import { Server, Socket } from "socket.io";

const notes: Record<string, string> = {};

export const registerNoteHandlers = (io: Server, socket: Socket) => {
    console.log("New client connected:", socket.id);

    // USER JOINS A ROOM (NOTE)
    socket.on("join-note", (noteId: string) => {
        socket.join(noteId);
        console.log(`User ${socket.id} joined note ${noteId}`);

        // send existing note content
        const existingContent = notes[noteId] || "";
        socket.emit("note-load", existingContent);
    });

    // USER EDITS NOTE
    socket.on("note-change", ({ noteId, content }) => {
        console.log(`Note ${noteId} updated`);

        // SAVE in memory
        notes[noteId] = content;

        // SEND to others in same room
        socket.to(noteId).emit("note-update", content);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
};