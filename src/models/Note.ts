import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        noteId: { type: String, required: true, unique: true },
        content: { type: String, default: "" },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

export const Note = mongoose.model("Note", noteSchema);