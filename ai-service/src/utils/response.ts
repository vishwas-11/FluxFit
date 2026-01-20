import { Response } from "express";

export const sendSuccess = (
  res: Response,
  data: any,
  message = "Success"
) => {
  return res.json({
    success: true,
    message,
    data,
  });
};
