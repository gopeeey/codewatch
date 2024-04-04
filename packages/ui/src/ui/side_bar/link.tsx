"use client";

import GreenErrorIcon from "@/../public/error-green.svg";
import ErrorIcon from "@/../public/nav-error.svg";
import StatsIcon from "@/../public/nav-stats.svg";
import GreenStatsIcon from "@/../public/stats-green.svg";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const icons = {
  error: [ErrorIcon, GreenErrorIcon],
  stats: [StatsIcon, GreenStatsIcon],
};

interface Props extends React.PropsWithChildren {
  link: string;
  icon: keyof typeof icons;
  iconAlt: string;
}
export default function NavLink({ children, link, icon, iconAlt }: Props) {
  const pathname = usePathname();
  const isActive =
    pathname !== "" ? pathname === link : pathname.startsWith(link);
  return (
    <Link
      href={link}
      className={clsx(
        "flex items-center font-black text-sm mb-5 transition-all duration-150",
        {
          ["text-primary-400"]: isActive,
          ["text-grey-100"]: !isActive,
        }
      )}
    >
      <Image
        src={icons[icon][isActive ? 1 : 0]}
        width={16}
        alt={iconAlt}
        className="mr-3"
      />

      {children}
    </Link>
  );
}
