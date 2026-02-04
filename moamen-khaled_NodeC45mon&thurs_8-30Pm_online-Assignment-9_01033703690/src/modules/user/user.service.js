import {
  conflictException,
  NotFoundException,
} from "../../common/utils/response/error.response.js";
import { User } from "../../DB/models/user.model.js";

//update
export const updateProfile = async (inputs) => {
  const userId = inputs.userId;
  if (inputs.email) {
    const user = await User.findOne({ email: inputs.email });
    if (user) {
      return conflictException("email already exist");
    }
  }
  const updateResult = await User.updateOne({ _id: userId }, { $set: inputs });
  if (updateResult.modifiedCount === 0) {
    return NotFoundException("try again later");
  }

  return updateResult;
};

//delete
export const deleteAccount = async (userId) => {
  const deleteResult = await User.deleteOne({ _id: userId });
  if (deleteResult.deletedCount === 0) {
    return NotFoundException("user not found");
  }

  return deleteResult;
};

//get by id
export const getUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    return NotFoundException("user not found");
  }

  return user;
};
