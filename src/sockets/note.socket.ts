import { Server, Socket } from "socket.io";
import { Note } from "../models/Note";

const saveTimeouts: Record<string, NodeJS.Timeout> = {};

// noteId -> set of socketIds
const noteUsers: Record<string, Set<string>> = {};

export const registerNoteHandlers = (io: Server, socket: Socket) => {
    console.log("New client connected:", socket.id);

    // USER JOINS A ROOM (NOTE)
    socket.on("join-note", async (noteId: string) => {
        const userId = (socket as any).userId;
        console.log(`User ${userId} joined with noteId ${noteId}`);

        socket.join(noteId);

        if (!noteUsers[noteId]) {
            noteUsers[noteId] = new Set();
        }

        noteUsers[noteId].add(socket.id);

        //  send updated count
        io.to(noteId).emit("users-update", {
            count: noteUsers[noteId].size,
        });

        // send existing note
        const note = await Note.findOneAndUpdate(
            { noteId, owner: userId },
            { $setOnInsert: { content: "" } },
            { new: true, upsert: true }
        );

        socket.emit("note-load", note.content);

        // tell frontend if user is owner
        socket.emit("note-role", {
            isOwner: note.owner?.toString() === userId,
        });
    });

    socket.on("typing", (noteId: string) => {
        console.log(`User ${socket.id} is typing in note ${noteId}`);
        socket.to(noteId).emit("user-typing", socket.id);
    });

    // USER EDITS NOTE
    socket.on("note-change", async ({ noteId, content }) => {
        console.log(`User ${socket.id} changed note ${noteId}`);

        const userId = (socket as any).userId;

        const note = await Note.findOne({ noteId });

        if (!note) return;

        if (saveTimeouts[noteId]) {
            clearTimeout(saveTimeouts[noteId]);
        }

        saveTimeouts[noteId] = setTimeout(async () => {
            await Note.findOneAndUpdate(
                { noteId },
                { content },
                { upsert: true }
            );

            console.log("Saved to DB");
        }, 2000); // debounce save by 2 seconds

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