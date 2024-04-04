import clsx from "clsx";
import { DetailedHTMLProps, InputHTMLAttributes } from "react";

type Props = {
  inputProps?: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  className?: string;
};

export function TextField({ className, inputProps }: Props) {
  return (
    <div className={clsx("", className)}>
      <input type="text" {...inputProps} />
    </div>
  );
}
