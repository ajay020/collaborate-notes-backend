import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        noteId: { type: String, required: true, unique: true },
        content: { type: String, default: "" },
    },
    { timestamps: true }
);

export const Note = mongoose.model("Note", noteSchema);