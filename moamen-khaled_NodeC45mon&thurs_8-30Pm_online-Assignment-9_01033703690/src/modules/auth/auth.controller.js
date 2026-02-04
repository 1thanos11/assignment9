import { Router } from "express";
import { login, signup } from "./auth.service.js";
import { successResponse } from "../../common/utils/response/index.js";

const router = Router();

//signup
router.post("/signup", async (req, res, next) => {
  const { name, email, password, phone, age } = req.body;
  const user = await signup({ name, email, password, phone, age });

  return successResponse({ res, data: user });
});

//login
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const loginResult = await login({ email, password });

  return successResponse({ res, data: loginResult });
});

export default router;
