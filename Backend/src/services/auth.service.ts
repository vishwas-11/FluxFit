import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { OAuth2Client } from "google-auth-library";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const e: any = new Error("User already exists");
    e.statusCode = 409;
    throw e;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    authProvider: "local",
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    const e: any = new Error("Invalid credentials");
    e.statusCode = 401;
    throw e;
  }

  if (!user.password) {
    // Account created via OAuth, no password to compare
    const e: any = new Error("Use Google sign-in for this account");
    e.statusCode = 400;
    throw e;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const e: any = new Error("Invalid credentials");
    e.statusCode = 401;
    throw e;
  }

  return user;
};

const getGoogleClient = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    const e: any = new Error("Google OAuth is not configured on server");
    e.statusCode = 500;
    throw e;
  }
  return new OAuth2Client(clientId);
};

export const loginOrRegisterWithGoogle = async (idToken: string) => {
  const client = getGoogleClient();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const sub = payload?.sub;
  const email = payload?.email;
  const name = payload?.name || payload?.given_name || "User";
  const emailVerified = payload?.email_verified;

  if (!sub || !email) {
    const e: any = new Error("Invalid Google token");
    e.statusCode = 401;
    throw e;
  }
  if (!emailVerified) {
    const e: any = new Error("Google account email is not verified");
    e.statusCode = 401;
    throw e;
  }

  // Prefer linking by googleSub first (prevents account confusion if email changes)
  let user = await User.findOne({ googleSub: sub });
  if (user) return user;

  // Otherwise, link/create by email
  user = await User.findOne({ email });
  if (user) {
    // Link existing local account to Google (keep both auth methods available)
    // Don't change authProvider - user can still use email/password if they have one
    user.googleSub = sub;
    // Only change authProvider if user has no password (was OAuth-only)
    if (!user.password) {
      user.authProvider = "google";
    }
    await user.save();
    return user;
  }

  // Create new OAuth user (no password)
  user = await User.create({
    name,
    email,
    password: undefined,
    authProvider: "google",
    googleSub: sub,
  });

  return user;
};
