"use client";

import MenuIcon from "@assets/menu.svg";
import { SideBarContext } from "@lib/contexts";
import clsx from "clsx";
import { useContext } from "react";
import { ButtonBase } from "./buttons";

type Props = { title: string; className?: string; dim?: boolean };
export function AppBar({ title, className, dim }: Props) {
  const { setShow } = useContext(SideBarContext);
  return (
    <nav
      className={clsx(
        "px-6 sm:px-0 py-7 flex text-grey-100 text-xl font-medium w-full items-center",
        { ["opacity-30"]: dim },
        className
      )}
    >
      <ButtonBase onClick={() => setShow((prev) => !prev)}>
        <img src={MenuIcon} width={20} alt="menu-icon" />
      </ButtonBase>

      <span className="ml-6 -mt-1">{title}</span>
    </nav>
  );
}
