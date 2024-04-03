import LogoSmall from "@/../public/logo.svg";
import Image from "next/image";
import NavLink from "./link";

export default function SideBar() {
  return (
    <aside className="w-72 px-6 py-8 h-screen bg-pane-background">
      {/* Logo and greeting */}
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Image src={LogoSmall} width={33} height={39.99} alt="logo" />
        </div>
        <div className="ml-3">
          <div className="text-xl -mt-1 font-black text-white">Codewatch</div>
          <div className="text-sm text-grey-600">Hi there</div>
        </div>
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
