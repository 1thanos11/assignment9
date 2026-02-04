import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { JWT_SECRET, SALT_ROUND } from "../../../config/config.service.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
      max: 60,
    },
    token: String,
  },
  {
    strict: true,
  }
);

//hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, SALT_ROUND);
});

//hash phone
userSchema.pre("save", async function () {
  if (!this.isModified("phone")) return;
  this.phone = await bcrypt.hash(this.phone, SALT_ROUND);
});

//generate token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id.toString() }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
};

export const User = mongoose.models.User || mongoose.model("User", userSchema);
