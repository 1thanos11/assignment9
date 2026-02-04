import { Router } from "express";
import { deleteAccount, getUser, updateProfile } from "./user.service.js";
import { successResponse } from "../../common/utils/response/success.response.js";
import { auth } from "../../middlewares/auth.js";

const router = Router();

//update
router.patch("/update", auth, async (req, res, next) => {
  const userId = req.user._id;
  const { name, email, phone, age } = req.body;
  const updateResult = await updateProfile({ userId, name, email, phone, age });

  return successResponse({ res, data: updateResult });
});

//delete

router.delete("/delete", auth, async (req, res, next) => {
  const userId = req.user._id;
  const deleteResult = await deleteAccount(userId);

  return successResponse({ res, data: deleteResult });
});

//get user by id
router.get("/profile", auth, async (req, res, next) => {
  const userId = req.user._id;
  const user = await getUser(userId);

  return successResponse({ res, data: user });
});

export default router;
