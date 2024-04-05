import clsx from "clsx";
import { TabButton } from "./button";

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
        badgeContent={unresolvedCount ? unresolvedCount.toString() : ""}
        active={current === "unresolved"}
      />
      <TabButton
        label="Resolved"
        onClick={() => onChange("resolved")}
        badgeContent={resolvedCount ? resolvedCount.toString() : ""}
        active={current === "resolved"}
        className="ml-5"
      />
    </div>
  );
}
