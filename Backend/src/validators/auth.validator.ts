import { email, z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})

export const googleAuthSchema = z.object({
  // Google Identity Services returns an ID token as "credential"
  credential: z.string().min(10, "Missing Google credential"),
});