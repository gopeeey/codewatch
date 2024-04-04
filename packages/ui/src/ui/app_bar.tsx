"use client";

import MenuIcon from "@public/menu.svg";
import clsx from "clsx";
import Image from "next/image";

type Props = { title: string; className?: string };
export function AppBar({ title, className }: Props) {
  return (
    <nav
      className={clsx(
        "py-7 flex text-grey-100 text-xl font-black w-full",
        className
      )}
    >
      <Image src={MenuIcon} width={20} alt="menu-icon" />
      <span className="ml-8">{title}</span>
    </nav>
  );
}
