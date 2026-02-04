import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      //   required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

noteSchema.virtual("User", {
  localField: "userId",
  foreignField: "_id",
  ref: "User",
});

export const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);
