import { Note } from "../models/Note";
import { AppError } from "../utils/app-error";

export const getAllUserNotes = async (userId: string) => {
    return await Note.find({ owner: userId }).sort({ updatedAt: -1 });
};

export const createNewNote = async (userId: string, noteId: string) => {
    // Check if noteId already exists to avoid collisions
    const existing = await Note.findOne({ noteId });
    if (existing) throw new AppError("Note ID already exists", 400);

    return await Note.create({
        noteId,
        owner: userId,
        content: ""
    });
};

export const deleteUserNote = async (userId: string, noteId: string) => {
    const note = await Note.findOneAndDelete({ noteId, owner: userId });
    if (!note) throw new AppError("Note not found or unauthorized", 404);
    
    return note;
};