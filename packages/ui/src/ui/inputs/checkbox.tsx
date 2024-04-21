import clsx from "clsx";
import { ChangeEventHandler, MouseEventHandler } from "react";

type Props = {
  label?: string;
  disabled?: boolean;
  className?: string;
  checked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onClick?: MouseEventHandler;
};

export function Checkbox({
  label,
  disabled = false,
  className,
  checked,
  onChange,
  onClick,
}: Props) {
  return (
    <div className={clsx("inline-block", className)}>
      <label className="relative flex items-center">
        <input
          type="checkbox"
          className={clsx(
            "w-4 h-4 mr-3 appearance-none border border-1 border-grey-700 rounded-[0.35rem] checked:bg-[url('/src/assets/checkbox.svg')] checked:border-none cursor-pointer",
            { "custom-disabled": disabled }
          )}
          checked={checked}
          onChange={onChange}
          onClick={onClick}
        />
        {label}
      </label>
    </div>
  );
}
