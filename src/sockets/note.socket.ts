import { Server, Socket } from "socket.io";

const notes: Record<string, string> = {};

// noteId -> set of socketIds
const noteUsers: Record<string, Set<string>> = {};

export const registerNoteHandlers = (io: Server, socket: Socket) => {
    console.log("New client connected:", socket.id);

    // USER JOINS A ROOM (NOTE)
    socket.on("join-note", (noteId: string) => {
        socket.join(noteId);

        // init if not exists
        if (!noteUsers[noteId]) {
            noteUsers[noteId] = new Set();
        }

        noteUsers[noteId].add(socket.id);

        console.log(`User ${socket.id} joined ${noteId}`);

        //  send updated count
        io.to(noteId).emit("users-update", {
            count: noteUsers[noteId].size,
        });

        // send existing note
        const existingContent = notes[noteId] || "";
        socket.emit("note-load", existingContent);
    });

    socket.on("typing", (noteId: string) => {
        console.log(`User ${socket.id} is typing in note ${noteId}`);
        socket.to(noteId).emit("user-typing", socket.id);
    });

    // USER EDITS NOTE
    socket.on("note-change", ({ noteId, content }) => {
        // save
        notes[noteId] = content;

        //  send content + sender id
        socket.to(noteId).emit("note-update", {
            content,
            senderId: socket.id,
        });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);

        // remove user from all rooms
        for (const noteId in noteUsers) {
            if (noteUsers[noteId].has(socket.id)) {
                noteUsers[noteId].delete(socket.id);

                // update others
                io.to(noteId).emit("users-update", {
                    count: noteUsers[noteId].size,
                });
            }
        }
    });
};