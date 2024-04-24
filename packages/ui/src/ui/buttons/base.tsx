import clsx from "clsx";
import { MouseEvent } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: (e?: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  active?: boolean;
  disabled?: boolean;
  padded?: boolean;
}

export function ButtonBase({
  onClick,
  className,
  disabled,
  padded,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      onClick={(e) => {
        if (!disabled && onClick) onClick(e);
      }}
      className={clsx(
        "text-center py-1.5 cursor-pointer active:scale-95 transition-all duration-200",
        {
          "!custom-disabled active:scale-100": disabled,
          "px-2 py-2": padded,
        },
        className
      )}
      {...props}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
