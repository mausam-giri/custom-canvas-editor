import { createContext } from "react";

type UserContextOptions = {
  userId: string;
  templateId: string;
  templateName: string;
};
export const UserContext = createContext<UserContextOptions | undefined>(
  undefined
);
