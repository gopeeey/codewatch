import clsx from "clsx";
import { MouseEvent } from "react";

export interface BaseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: (e?: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
  padded?: boolean;
  loading?: boolean;
}

export function ButtonBase({
  onClick,
  className,
  disabled,
  padded,
  children,
  loading,
  contentClassName,
  ...props
}: BaseButtonProps) {
  return (
    <button
      onClick={(e) => {
        if (!disabled && onClick) onClick(e);
      }}
      className={clsx(
        "relative text-center py-1.5 cursor-pointer active:scale-95 transition-all duration-200",
        {
          "!custom-disabled active:scale-100": disabled,
          "px-2 py-2": padded,
        },
        className
      )}
      {...props}
      disabled={disabled || loading}
    >
      <span
        className={clsx(
          "absolute w-full left-0 bg-red-400 flex justify-center",
          {
            "z-20 opacity-100": loading,
            "z-0 opacity-0": !loading,
          }
        )}
      >
        <span className="absolute font-bold typewriter text-left">. . .</span>
      </span>

      <span
        className={clsx("relative z-10 inline-block", contentClassName, {
          "z-0 opacity-0": loading,
          "z-10 opacity-100": !loading,
        })}
      >
        {children}
      </span>
    </button>
  );
}
