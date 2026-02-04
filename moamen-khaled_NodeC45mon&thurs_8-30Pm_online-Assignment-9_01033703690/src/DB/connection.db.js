import { connect } from "mongoose";
import { DB_URI } from "../../config/config.service.js";

export const connectDB = async () => {
  try {
    await connect(DB_URI);
    console.log("DataBase Connected Ssuccessfully 🫰");
  } catch (error) {
    console.log("DataBase Connection Failed ❌");
  }
};
