import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

let timeout: NodeJS.Timeout;

socket.on("connect", () => {
    console.log("Connected:", socket.id);

    socket.emit("join-note", "note-123");

    simulateTyping();
});

function simulateTyping() {
    const text = "Hello world ✍️";

    socket.emit("typing", "note-123");

    let current = "";

    text.split("").forEach((char, index) => {
        setTimeout(() => {
            current += char;

            // 👇 debounce logic
            if (timeout) clearTimeout(timeout);

            timeout = setTimeout(() => {
                socket.emit("note-change", {
                    noteId: "note-123",
                    content: current,
                });
            }, 500); // wait 500ms after typing stops
        }, index * 200);
    });
}

// load existing
socket.on("note-load", (content) => {
    console.log("Loaded:", content);
});

// updates
socket.on("note-update", (content) => {
    console.log("Updated:", content);
});

socket.on("user-typing", (userId) => {
    console.log(`User ${userId} is typing...`);
});