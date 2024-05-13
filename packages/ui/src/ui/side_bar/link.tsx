"use client";

import GreenErrorIcon from "@assets/error-green.svg";
import ErrorIcon from "@assets/nav-error.svg";
import StatsIcon from "@assets/nav-stats.svg";
import GreenStatsIcon from "@assets/stats-green.svg";
import { SideBarContext } from "@lib/contexts";
import clsx from "clsx";
import { useContext } from "react";
import { NavLink as ReactRouterNavLink } from "react-router-dom";

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
  const { setShow } = useContext(SideBarContext);
  return (
    <ReactRouterNavLink
      to={link}
      className={({ isActive }) =>
        clsx(
          "flex items-center font-medium text-md mb-5 transition-all duration-150",
          {
            ["text-primary-400"]: isActive,
            ["text-grey-100"]: !isActive,
          }
        )
      }
      onClick={() => setShow(true)}
    >
      {({ isActive }) => (
        <>
          <img
            src={icons[icon][isActive ? 1 : 0]}
            width={16}
            alt={iconAlt}
            className="mr-3"
          />

          {children}
        </>
      )}
    </ReactRouterNavLink>
  );
}
