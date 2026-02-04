import { Router } from "express";
import {
  aggregate,
  create,
  deleteAll,
  deleteNote,
  getAll,
  getNote,
  getNoteByContent,
  replace,
  updateNote,
  updateTitles,
} from "./note.service.js";
import { successResponse } from "../../common/utils/response/success.response.js";
import { auth } from "../../middlewares/auth.js";

const router = Router();

//create
router.post("/create", auth, async (req, res, next) => {
  const userId = req.user._id;
  const { title, content } = req.body;
  const note = await create({ userId, title, content });

  return successResponse({ res, status: 201, data: note });
});

//update Titles
router.patch("/update/titles", auth, async (req, res, next) => {
  const userId = req.user._id;
  const { title } = req.body;
  const updateResult = await updateTitles({ userId, title });

  return successResponse({ res, data: updateResult });
});

//update
router.patch("/update/:noteId", auth, async (req, res, next) => {
  const userId = req.user._id;
  const { noteId } = req.params;
  const { title, content } = req.body;
  const updateResult = await updateNote({ userId, noteId, title, content });

  return successResponse({ res, data: updateResult });
});

//replace
router.patch("/replace/:noteId", auth, async (req, res, next) => {
  const userId = req.user._id;
  const { noteId } = req.params;
  const { title, content } = req.body;
  const replaceResult = await replace({ userId, noteId, title, content });

  return successResponse({ res, data: replaceResult });
});

//delete
router.delete("/delete/:noteId", auth, async (req, res, next) => {
  const userId = req.user._id;
  const { noteId } = req.params;
  const { deleteResult, note } = await deleteNote({ userId, noteId });

  return successResponse({ res, data: { deleteResult, note } });
});

//get by id
router.get("/get/:noteId", auth, async (req, res, next) => {
  const userId = req.user._id;
  const { noteId } = req.params;
  const note = await getNote({ userId, noteId });

  return successResponse({ res, data: note });
});

//get by content
router.get("/note-by-content", auth, async (req, res, next) => {
  const userId = req.user._id;
  const { content } = req.query;
  const note = await getNoteByContent({ userId, content });

  return successResponse({ res, data: note });
});

//get ll
router.get("/get-all", auth, async (req, res, next) => {
  const userId = req.user._id;
  const notes = await getAll({ userId });

  return successResponse({ res, data: notes });
});

//aggregate
router.get("/aggregate", auth, async (req, res, next) => {
  const userId = req.user._id;
  const { title } = req.query;
  const notes = await aggregate({ userId, title });

  return successResponse({ res, data: notes });
});

//delete all
router.delete("/delete-all", auth, async (req, res, next) => {
  const userId = req.user._id;
  const deleteResult = await deleteAll(userId);

  return successResponse({ res, data: deleteResult });
});

export default router;
