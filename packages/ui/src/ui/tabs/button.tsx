import clsx from "clsx";
import { Badge } from "../badge";

type Props = {
  label: string;
  onClick: () => void;
  active: boolean;
  badgeContent?: string;
  className?: string;
  variant?: "resolved" | "unresolved";
};

export function TabButton({
  label,
  onClick,
  active,
  badgeContent,
  className,
  variant = "unresolved",
}: Props) {
  return (
    <button
      type="button"
      className={clsx(
        "py-1.5",
        {
          "text-primary-400 rounded-none border-b-[2px] border-b-primary-400 transition-all duration-150":
            active,
        },
        className
      )}
      onClick={onClick}
    >
      {label}
      {!!badgeContent && (
        <Badge
          content={badgeContent}
          variant={variant === "unresolved" ? "error" : "default"}
          className="ml-1.5"
        />
      )}
    </button>
  );
}
