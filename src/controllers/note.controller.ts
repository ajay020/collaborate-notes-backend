import { Response, NextFunction } from "express";
import * as noteService from "../services/note.service";
import { AuthRequest } from "../types/express";

export const getNotes = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const notes = await noteService.getAllUserNotes(req.user?.userId!);
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
};

export const createNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { noteId } = req.body;
        const newNote = await noteService.createNewNote(req.user?.userId!, noteId);
        res.status(201).json(newNote);
    } catch (error) {
        next(error);
    }
};

export const deleteNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const noteId = Array.isArray(req.params.noteId) ? req.params.noteId[0] : req.params.noteId;
        await noteService.deleteUserNote(req.user?.userId!, noteId);
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        next(error);
    }
};