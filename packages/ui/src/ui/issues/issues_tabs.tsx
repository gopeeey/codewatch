import { IssueTab } from "@codewatch/types";
import { quantifyNumber } from "@lib/utils";
import { TabButton } from "@ui/tabs/button";
import clsx from "clsx";

export type TabType = "resolved" | "unresolved";
type Props = {
  currentTab: IssueTab;
  onChange: (current: IssueTab) => void;
  resolvedCount: number;
  unresolvedCount: number;
  archivedCount: number;
  className?: string;
};

export function IssuesTabs({
  currentTab,
  onChange,
  resolvedCount,
  unresolvedCount,
  archivedCount,
  className,
}: Props) {
  return (
    <div className={clsx("flex items-center", className)}>
      <TabButton
        label="Unresolved"
        onClick={() => onChange("unresolved")}
        badgeContent={unresolvedCount ? quantifyNumber(unresolvedCount) : ""}
        active={currentTab === "unresolved"}
      />

      <TabButton
        label="Resolved"
        onClick={() => onChange("resolved")}
        badgeContent={resolvedCount ? quantifyNumber(resolvedCount) : ""}
        active={currentTab === "resolved"}
        className="ml-5"
        variant="resolved"
      />

      <TabButton
        label="Archived"
        onClick={() => onChange("archived")}
        badgeContent={archivedCount ? quantifyNumber(archivedCount) : ""}
        active={currentTab === "archived"}
        className="ml-5"
        variant="resolved"
      />
    </div>
  );
}
