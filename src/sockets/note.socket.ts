import { Server, Socket } from "socket.io";
import { Note } from "../models/Note";

const notes: Record<string, string> = {};
const saveTimeouts: Record<string, NodeJS.Timeout> = {};

// noteId -> set of socketIds
const noteUsers: Record<string, Set<string>> = {};

export const registerNoteHandlers = (io: Server, socket: Socket) => {
    console.log("New client connected:", socket.id);

    // USER JOINS A ROOM (NOTE)
    socket.on("join-note", async (noteId: string) => {
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
        let note = await Note.findOne({ noteId });

        if (!note) {
            note = await Note.create({ noteId, content: "" });
        }

        socket.emit("note-load", note.content);
    });

    socket.on("typing", (noteId: string) => {
        console.log(`User ${socket.id} is typing in note ${noteId}`);
        socket.to(noteId).emit("user-typing", socket.id);
    });

    // USER EDITS NOTE
    socket.on("note-change", async ({ noteId, content }) => {
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