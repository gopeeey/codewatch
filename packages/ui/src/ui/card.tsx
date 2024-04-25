import clsx from "clsx";
import { forwardRef } from "react";

export const Card = forwardRef<
  HTMLDivElement,
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>(({ children, className }, ref) => {
  return (
    <div
      className={clsx("bg-pane-background shadow rounded-xl p-5", className)}
      ref={ref}
    >
      {children}
    </div>
  );
});
