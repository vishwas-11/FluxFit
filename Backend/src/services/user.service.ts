import { User } from "../models/user.model";

export const getUserProfile = async (userId: string) => {
  return await User.findById(userId).select("-password");
};

export const updateUserProfile = async (
  userId: string,
  data: any
) => {
  return await User.findByIdAndUpdate(userId, data, {
    new: true,
    runValidators: true,
  }).select("-password");
};
