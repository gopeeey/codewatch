import clsx from "clsx";

type Props = { children: React.ReactNode; className?: string };

export function Card({ children, className }: Props) {
  return (
    <div
      className={clsx("bg-pane-background shadow rounded-xl p-5", className)}
    >
      {children}
    </div>
  );
}
