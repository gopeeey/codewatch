import { Issue } from "@codewatch/types";
import { quantifyNumber } from "@lib/utils";
import { TabButton } from "@ui/tabs/button";
import clsx from "clsx";

export type TabType = "resolved" | "unresolved";
type Props = {
  resolved: Issue["resolved"];
  onChange: (current: Issue["resolved"]) => void;
  resolvedCount: number;
  unresolvedCount: number;
  className?: string;
};

export function IssuesTabs({
  resolved,
  onChange,
  resolvedCount,
  unresolvedCount,
  className,
}: Props) {
  return (
    <div className={clsx("flex items-center", className)}>
      <TabButton
        label="Unresolved"
        onClick={() => onChange(false)}
        badgeContent={unresolvedCount ? quantifyNumber(unresolvedCount) : ""}
        active={!resolved}
      />

      <TabButton
        label="Resolved"
        onClick={() => onChange(true)}
        badgeContent={resolvedCount ? quantifyNumber(resolvedCount) : ""}
        active={resolved}
        className="ml-5"
        variant="resolved"
      />

      <TabButton
        label="Archived"
        onClick={() => onChange(true)}
        badgeContent={resolvedCount ? quantifyNumber(resolvedCount) : ""}
        active={resolved}
        className="ml-5"
        variant="resolved"
      />
    </div>
  );
}
