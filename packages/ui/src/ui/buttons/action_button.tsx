import clsx from "clsx";
import { ButtonBase } from "./base";

type Props = {
  label: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

export function ActionButton({
  label,
  onClick,
  className,
  disabled = false,
}: Props) {
  return (
    <ButtonBase
      onClick={onClick}
      className={clsx(
        "bg-input-background text-grey-200 rounded-[0.45rem] text-[0.66rem] px-3.5 py-[0.175rem] hover:bg-input-background-dark",
        className
      )}
      disabled={disabled}
    >
      {label}
    </ButtonBase>
  );
}
