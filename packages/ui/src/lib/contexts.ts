import { createContext } from "react";

export const SideBarContext = createContext<{
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}>({ show: true, setShow: () => {} });
