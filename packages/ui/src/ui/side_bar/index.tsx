import CloseIcon from "@assets/close.svg";
import LogoSmall from "@assets/logo.svg";
import { SideBarContext } from "@lib/contexts";
import { ButtonBase } from "@ui/buttons";
import clsx from "clsx";
import { useContext } from "react";
import NavLink from "./link";

export default function SideBar() {
  const { show, setShow } = useContext(SideBarContext);
  return (
    <aside
      className={clsx(
        "w-64 flex-shrink-0 px-6 py-8 h-screen bg-pane-background shadow z-20 fixed lg:sticky top-0 transition-everything",
        show ? "-ml-64 lg:ml-0" : "ml-0 lg:-ml-64"
      )}
    >
      {/* Logo and greeting */}
      <div className="flex items-center justify-between">
        <div className="flex items-center ">
          <img src={LogoSmall} width={22} alt="logo" />
          <div className="text-xl -mt-1 ml-2 font-medium text-white">
            Codewatch
          </div>
        </div>

        <ButtonBase
          onClick={() => setShow(true)}
          className="ml-4 -mt-1 -mr-1 lg:hidden"
        >
          <img src={CloseIcon} width={16} alt="close" />
        </ButtonBase>
      </div>

      {/* Navigation */}
      <div className="mt-40">
        <NavLink link="/" icon="error" iconAlt="error-icon">
          Issues
        </NavLink>
        <NavLink link="/statistics" icon="stats" iconAlt="stats-icon">
          Statistics
        </NavLink>
      </div>
    </aside>
  );
}
