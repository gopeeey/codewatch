import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  title: string;
  className?: string;
};

const normalPadding = "px-5 py-2";
export function InfoCard({ children, title, className }: Props) {
  return (
    <div className={clsx("bg-background rounded-xl", className)}>
      <div
        className={clsx(
          normalPadding,
          "border-b-[1.5px] border-b-pane-background font-medium text-[0.9rem]"
        )}
      >
        {title}
      </div>
      <div className={clsx(normalPadding, "text-[0.9rem]")}>{children}</div>
    </div>
  );
}
