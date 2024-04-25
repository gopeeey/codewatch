import clsx from "clsx";
import { BaseButtonProps, ButtonBase } from "./base";

interface Props extends BaseButtonProps {
  color?: "primary";
}
export function Button({
  className,
  children,
  color = "primary",
  ...props
}: Props) {
  return (
    <ButtonBase
      className={clsx(
        "px-3 py-2 rounded-md",
        {
          "bg-primary-400 text-white hover:bg-primary-700": color === "primary",
        },
        className
      )}
      {...props}
    >
      {children}
    </ButtonBase>
  );
}
