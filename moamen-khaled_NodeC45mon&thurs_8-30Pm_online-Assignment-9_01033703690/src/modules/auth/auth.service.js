import bcrypt from "bcrypt";
import {
  conflictException,
  invalidCredentials,
  NotFoundException,
} from "../../common/utils/response/index.js";
import { User } from "../../DB/models/user.model.js";

//signup
export const signup = async (inputs) => {
  const { name, email, password, phone, age } = inputs;
  const isExist = await User.findOne({ email });
  if (isExist) {
    return conflictException("email already exist");
  }
  const user = new User({ name, email, password, phone, age });
  await user.save();

  return user;
};

//login
export const login = async (inputs) => {
  const { email, password } = inputs;
  const user = await User.findOne({ email });
  if (!user) {
    return invalidCredentials("email or password is wrong");
  }
  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    return invalidCredentials("email or password is wrong");
  }
  const token = user.generateAuthToken();
  user.token = token;
  await user.save();

  return user;
};
