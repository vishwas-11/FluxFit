import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // Password is optional for OAuth users
    password: { type: String, required: false },

    // OAuth support (keep it minimal but explicit)
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
      required: true,
    },
    googleSub: { type: String, required: false, index: true },


    age: Number,  
    height: Number, 
    weight: Number, 

    goals: {
      primary: String, 
      targetWeight: Number,
    },

    preferences: {
      injury: String,
      cuisine: String,
      dietType: String, 
    },

    // Optional profile image that can be updated by the user
    avatarUrl: String,
  },
  { timestamps: true }
);

export const User = model("User", userSchema);
