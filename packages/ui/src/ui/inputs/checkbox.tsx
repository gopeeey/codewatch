import clsx from "clsx";

type Props = {
  label?: string;
  disabled?: boolean;
  className?: string;
};

export function Checkbox({ label, disabled = false, className }: Props) {
  return (
    <div className={clsx("inline-block", className)}>
      <label className="relative flex items-center">
        <input
          type="checkbox"
          className={clsx(
            "w-4 h-4 mr-3 appearance-none border border-1 border-grey-700 rounded-[0.35rem] checked:bg-[url('/checkbox.svg')] checked:border-none cursor-pointer",
            { "custom-disabled": disabled }
          )}
        />
        {label}
      </label>
    </div>
  );
}
