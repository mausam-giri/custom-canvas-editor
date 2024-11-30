"use client";
import { createContext, useContext, useState } from "react";

type TemplateDataOptions = {
  id: string;
  name: string;
};
type UserContextOptions = {
  userId: string;
  templateInfo: TemplateDataOptions | null;
  setUserId: (id: string) => void;
  handleTemplateData: (newTemplateData: Partial<TemplateDataOptions>) => void;
};
const UserContext = createContext<UserContextOptions | undefined>(undefined);

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userId, setUserId] = useState<string>("");
  const [templateInfo, setTemplateInfo] = useState({
    id: "",
    name: "",
  });

  function handleTemplateData(newTemplateData: Partial<TemplateDataOptions>) {
    setTemplateInfo((prev) => ({
      ...prev,
      ...newTemplateData,
    }));
  }

  return (
    <UserContext.Provider
      value={{ userId, templateInfo, setUserId, handleTemplateData }}
    >
      {children}
    </UserContext.Provider>
  );
};
