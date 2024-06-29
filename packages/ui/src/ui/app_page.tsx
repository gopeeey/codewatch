import { AppBar } from "@ui/app_bar";
import { Card } from "@ui/card";
import clsx from "clsx";

type Props = {
  title: string;
  children: React.ReactNode;
  className?: string;
  appBarClassName?: string;
  cardClassName?: string;
  dimAppBar?: boolean;
  header?: React.ReactNode;
};

export function AppPage({
  title,
  children,
  className,
  appBarClassName,
  cardClassName,
  dimAppBar = false,
  header,
}: Props) {
  return (
    <main className={clsx("sm:px-12 w-full", className)}>
      <AppBar
        title={title}
        className={clsx(header ? "mb-4" : "mb-7", appBarClassName)}
        dim={dimAppBar}
      />
      {header ? <div className="mb-9">{header}</div> : null}
      <Card
        className={clsx(
          "!rounded-t-xl !rounded-b-none sm:!rounded-xl min-h-screen lg:min-h-fit",
          cardClassName
        )}
      >
        {children}
      </Card>
    </main>
  );
}
