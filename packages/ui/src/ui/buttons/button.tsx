import clsx from "clsx";
import { BaseButtonProps, ButtonBase } from "./base";

interface Props extends BaseButtonProps {
  color?: "primary" | "error";
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
        "px-3 py-2 rounded-[0.9rem]",
        {
          "bg-primary-400 text-white hover:bg-primary-700": color === "primary",
          "bg-error text-white hover:bg-error-dark": color === "error",
        },
        className
      )}
      {...props}
    >
      {children}
    </ButtonBase>
  );
}
