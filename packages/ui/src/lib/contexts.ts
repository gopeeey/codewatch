import { createContext } from "react";
import { ConfirmationInterface } from "./types";

export const SideBarContext = createContext<{
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}>({ show: true, setShow: () => {} });

export const ConfirmationDialogContext = createContext<{
  dispatchConfirmation: React.Dispatch<
    React.SetStateAction<ConfirmationInterface | null>
  >;
  confirmation: ConfirmationInterface | null;
}>({ confirmation: null, dispatchConfirmation: () => {} });
