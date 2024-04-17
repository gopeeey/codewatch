import SideBar from "@ui/side_bar";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout() {
  return (
    <div className="flex bg-background min-h-full text-grey-100">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={true}
        newestOnTop={false}
        theme="colored"
      />
      <SideBar />
      <Outlet />
    </div>
  );
}
