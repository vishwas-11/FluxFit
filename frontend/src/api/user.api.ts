import api from "./axios";

export type UserProfile = {
  _id?: string;
  name: string;
  email?: string;
  age?: number;
  height?: number;
  weight?: number;
  preferences?: {
    injury?: string;
    cuisine?: string;
    dietType?: string;
  };
  goals?: {
    primary?: string;
    targetWeight?: number;
  };
  avatarUrl?: string;
};

export const fetchProfile = async () => {
  const res = await api.get("/users/me");
  return res.data?.data as UserProfile;
};

export const updateProfile = async (payload: Partial<UserProfile>) => {
  const res = await api.put("/users/me", payload);
  return res.data?.data as UserProfile;
};
