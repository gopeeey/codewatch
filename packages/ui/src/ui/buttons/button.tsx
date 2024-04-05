import clsx from "clsx";

type Props = {
  label: string;
  onClick?: () => unknown;
  className?: string;
  disabled?: boolean;
};

export function Button({ label, onClick, className, disabled = false }: Props) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "bg-input-background text-grey-200 rounded-[0.45rem] text-[0.66rem] px-3.5 py-[0.175rem] transition-all duration-200 hover:bg-input-background-dark active:scale-95",
        className,
        { "custom-disabled": disabled }
      )}
    >
      {label}
    </button>
  );
}
