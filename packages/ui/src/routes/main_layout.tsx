import SideBar from "@ui/side_bar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex bg-background min-h-full text-grey-100">
      <SideBar />
      <Outlet />
    </div>
  );
}
