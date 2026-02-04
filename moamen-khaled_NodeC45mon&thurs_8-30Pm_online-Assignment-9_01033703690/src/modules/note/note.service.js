import { Types } from "mongoose";
import { Note } from "../../DB/models/note.model.js";
import { User } from "../../DB/models/user.model.js";
import { NotFoundException } from "../../common/utils/response/error.response.js";

//create
export const create = async (inputs) => {
  const { title, content, userId } = inputs;
  const isExist = await User.findById(userId);
  if (!isExist) {
    return Notification("user not found");
  }
  const note = new Note({ title, content, userId });
  await note.save();

  return note;
};

//update
export const updateNote = async (inputs) => {
  const userId = inputs.userId;
  const updateResult = await Note.updateOne(
    { $and: [{ _id: inputs.noteId }, { userId }] },
    { $set: inputs },
    { runValidators: true }
  );
  if (updateResult.modifiedCount === 0 || updateResult.matchedCount === 0) {
    throw new Error("try again later", { cause: { status: 400 } });
  }

  return updateResult;
};

//replace document
export const replace = async (inputs) => {
  const { title, content, userId, noteId } = inputs;
  const replaceReuslt = await Note.findOneAndReplace(
    { _id: noteId, userId },
    { title, content, userId: new Types.ObjectId(userId) },
    { runValidators: true, new: true }
  );

  return replaceReuslt;
};

//update all titles for notes of some user
export const updateTitles = async (inputs) => {
  const updateResult = await Note.updateMany(
    { userId: inputs.userId },
    { $set: { title: inputs.title } }
  );

  return updateResult;
};

//delete
export const deleteNote = async (inputs) => {
  const note = await Note.findOne({ _id: inputs.noteId });
  if (!note) {
    return NotFoundException("note not found");
  }
  const deleteResult = await Note.deleteOne({
    _id: inputs.noteId,
    userId: inputs.userId,
  });
  if (deleteResult.deletedCount === 0) {
    throw new Error("try again later", { cause: { status: 400 } });
  }

  return { deleteResult, note };
};

//get by id
export const getNote = async (inputs) => {
  const note = await Note.findOne({
    _id: inputs.noteId,
    userId: inputs.userId,
  });
  if (!note) {
    return NotFoundException("note not found");
  }

  return note;
};

//get by content
export const getNoteByContent = async (inputs) => {
  const { userId, content } = inputs;
  const note = await Note.find({
    $and: [{ userId }, { content: { $regex: content, $options: "i" } }],
  });
  if (!note.length) {
    return NotFoundException("note not found");
  }

  return note;
};

//get all notes for some user
export const getAll = async (inputs) => {
  const { userId } = inputs;
  const notes = await Note.find({ userId })
    .select("title userId createdAt")
    .populate([{ path: "User", select: "email" }])
    .lean();

  return notes;
};

//aggregate
export const aggregate = async (inputs) => {
  const { userId, title } = inputs;
  const notes = await Note.aggregate([
    {
      $match: {
        title: { $regex: title, $options: "i" },
        userId: new Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "User",
      },
    },
    {
      $project: {
        "User.name": 1,
        "User.email": 1,
        title: 1,
        userId: 1,
      },
    },
  ]);

  return notes;
};

//delete all notes
export const deleteAll = async (userId) => {
  const deleteResult = await Note.deleteMany({ userId });

  return deleteResult;
};
