import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

socket.on("connect", () => {
    console.log("Connected:", socket.id);

    socket.emit("join-note", "note-123");

    // simulate typing after 2 sec
    setTimeout(() => {
        socket.emit("note-change", {
            noteId: "note-123",
            content: "First version of note ✍️",
        });
    }, 2000);
});

// 👇 load existing note
socket.on("note-load", (content) => {
    console.log("Loaded note:", content);
});

// 👇 listen updates
socket.on("note-update", (content) => {
    console.log("Updated note:", content);
});