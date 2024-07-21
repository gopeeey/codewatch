import clsx from "clsx";
import { ButtonBase } from "./base";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

export function ActionButton({
  children,
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
      contentClassName="flex items-center"
      disabled={disabled}
    >
      {children}
    </ButtonBase>
  );
}
