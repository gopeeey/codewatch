import { quantifyNumber } from "@lib/utils";
import { TabButton } from "@ui/tabs/button";
import clsx from "clsx";

export type TabType = "resolved" | "unresolved";
type Props = {
  current: TabType;
  onChange: (current: TabType) => void;
  resolvedCount: number;
  unresolvedCount: number;
  className?: string;
};

export function IssuesTabs({
  current,
  onChange,
  resolvedCount,
  unresolvedCount,
  className,
}: Props) {
  return (
    <div className={clsx("flex items-center justify-center", className)}>
      <TabButton
        label="Unresolved"
        onClick={() => onChange("unresolved")}
        badgeContent={unresolvedCount ? quantifyNumber(unresolvedCount) : ""}
        active={current === "unresolved"}
      />
      <TabButton
        label="Resolved"
        onClick={() => onChange("resolved")}
        badgeContent={resolvedCount ? quantifyNumber(resolvedCount) : ""}
        active={current === "resolved"}
        className="ml-5"
        variant="resolved"
      />
    </div>
  );
}
