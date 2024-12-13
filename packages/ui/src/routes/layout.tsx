import { ConfirmationDialogContext, SideBarContext } from "@lib/contexts";
import { ConfirmationInterface } from "@lib/types";
import { ConfirmationDialog } from "@ui/confirmation_dialog";
import SideBar from "@ui/side_bar";
import { useEffect, useState } from "react";
import { Outlet, useMatch, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout() {
  const [showSideBar, setShowSideBar] = useState(true);
  const [confirmation, setConfirmation] =
    useState<ConfirmationInterface | null>(null);
  const onRoot = useMatch("/");
  const navigate = useNavigate();

  useEffect(() => {
    if (onRoot) navigate("/issues");
  }, [onRoot, navigate]);
  return (
    <div className="flex w-full max-w-full bg-background min-h-full text-grey-100">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={true}
        newestOnTop={false}
        theme="colored"
      />

      <ConfirmationDialogContext.Provider
        value={{ confirmation, dispatchConfirmation: setConfirmation }}
      >
        <SideBarContext.Provider
          value={{ show: showSideBar, setShow: setShowSideBar }}
        >
          <ConfirmationDialog />
          <SideBar />
          <Outlet />
        </SideBarContext.Provider>
      </ConfirmationDialogContext.Provider>
    </div>
  );
}
