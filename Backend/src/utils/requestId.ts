import { randomUUID } from "crypto";

export const generateRequestId = () => {
  return randomUUID();
};
