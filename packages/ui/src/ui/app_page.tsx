import { AppBar } from "@ui/app_bar";
import { Card } from "@ui/card";
import clsx from "clsx";

type Props = {
  title: string;
  children: React.ReactNode;
  className?: string;
  appBarClassName?: string;
  cardClassName?: string;
};

export function AppPage({
  title,
  children,
  className,
  appBarClassName,
  cardClassName,
}: Props) {
  return (
    <main className={clsx("px-12 w-full", className)}>
      <AppBar title={title} className={clsx("mb-7", appBarClassName)} />
      <Card className={cardClassName}>{children}</Card>
    </main>
  );
}
