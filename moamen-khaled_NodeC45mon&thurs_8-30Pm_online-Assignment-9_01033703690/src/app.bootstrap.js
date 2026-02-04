import express from "express";
import { connectDB } from "./DB/connection.db.js";
import { PORT } from "../config/config.service.js";
import { authRouter, noteRouter, userRouter } from "./modules/index.js";
import { globlErrorHandling } from "./common/utils/response/error.response.js";

async function bootstrap() {
  //DB
  await connectDB();

  const app = express();
  app.use(express.json());

  //routes
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/note", noteRouter);

  //error handling
  app.use(globlErrorHandling);

  app.listen(PORT, () => {
    console.log(`Server Is Running On PORT ${PORT} 🚀`);
  });
}

export default bootstrap;
