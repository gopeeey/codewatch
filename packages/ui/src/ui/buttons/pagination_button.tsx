import clsx from "clsx";
import { ButtonBase } from "./base";

type Props = {
  label: string | React.ReactNode;
  onClick: () => void;
  className?: string;
  position: "first" | "last" | "middle" | "edge";
  active?: boolean;
  disabled?: boolean;
};

export function PaginationButton({
  label,
  onClick,
  className,
  position,
  active,
  disabled,
}: Props) {
  return (
    <ButtonBase
      onClick={onClick}
      className={clsx(
        "text-center  min-w-8 py-1.5 bg-background mx-[0.5px] hover:bg-pane-background",
        {
          "rounded-l-xl": position === "first",
          "rounded-r-xl": position === "last",
          "bg-primary-400": active,
          "rounded-xl flex justify-center py-[0.68rem]": position === "edge",
        },
        className
      )}
      disabled={disabled}
    >
      {label}
    </ButtonBase>
  );
}
