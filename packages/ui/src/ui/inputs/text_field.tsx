import clsx from "clsx";
import { DetailedHTMLProps, InputHTMLAttributes } from "react";

type Props = {
  inputProps?: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  className?: string;
  startAdornment?: React.ReactNode;
};

export function TextField({ className, inputProps, startAdornment }: Props) {
  return (
    <div
      className={clsx(
        "bg-background flex items-center rounded-xl px-3.5 focus-within:outline focus-within:outline-primary-400 focus-within:outline-2 focus-within:outline-offset-3 h-fit",
        className
      )}
      tabIndex={0}
    >
      {startAdornment ? (
        <span className="mr-3 -mt-0.5">{startAdornment}</span>
      ) : null}
      <input
        type="text"
        className="bg-transparent py-2.5 outline-none"
        {...inputProps}
      />
    </div>
  );
}
