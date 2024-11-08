import { Card } from "@ui/card";
import clsx from "clsx";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function ModalCard({ children, className }: Props) {
  return (
    <Card
      className={clsx(
        "!bg-background absolute origin-center transition-everything shadow-transparent border-primary-400 border-[0.1em] !rounded-3xl",
        className
      )}
    >
      {children}
    </Card>
  );
}
