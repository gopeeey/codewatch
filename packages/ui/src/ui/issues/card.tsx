import ClockIcon from "@assets/clock.svg";
import ErrorRedIcon from "@assets/error-red.svg";
import { Issue } from "@codewatch/types";
import { quantifyNumber } from "@lib/utils";
import { Checkbox } from "@ui/inputs/checkbox";
import { Skeleton } from "@ui/skeleton";
import moment from "moment";
import { Link } from "react-router-dom";

type Props = { issue: Issue; selected: boolean; onSelect: () => void };
export function IssueCard({ issue, selected, onSelect }: Props) {
  return (
    <Link to={`/issues/${issue.id}`}>
      <div className="flex custom-rule items-center justify-between px-5 py-4 pr-8 transition-all duration-200 hover:bg-input-background-dark cursor-pointer">
        {/* Details and checkbox */}
        <div className="flex items-start">
          <Checkbox className="mt-1" checked={selected} onChange={onSelect} />

          <div>
            <div className="text-base font-medium">{issue.name}</div>

            <div className="text-grey-700 text-sm">
              {issue.lastOccurrenceMessage}
            </div>

            <div className="mt-0.5 text-[0.68rem] flex">
              <span className="flex text-grey-800">
                <img src={ClockIcon} alt="clock" width={11} className="mr-1" />
                {moment(issue.lastOccurrenceTimestamp).fromNow()} |{" "}
                {moment(issue.createdAt).fromNow(true)} old
              </span>

              {issue.unhandled ? (
                <span className="flex ml-3 text-error-bright">
                  <img
                    src={ErrorRedIcon}
                    alt="error"
                    width={11}
                    className="mr-1"
                  />
                  Unhandled
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Occurence count */}
        <span className="text-base text-grey-600">
          {quantifyNumber(issue.totalOccurrences)}
        </span>
      </div>
    </Link>
  );
}

export function IssueCardSkeleton() {
  return (
    <div className="flex custom-rule items-center justify-between px-5 py-4 pr-8 transition-all duration-200 hover:bg-input-background-dark cursor-pointer">
      {/* Details and checkbox */}
      <div className="flex items-start">
        <Skeleton className="w-4 h-4" />

        <div className="ml-3">
          <Skeleton className="w-44 h-5" />

          <Skeleton className="w-72 h-4" containerClassName="mt-2" />

          <Skeleton className="w-40 h-3" containerClassName="mt-2" />
        </div>
      </div>

      {/* Occurence count */}
      <Skeleton className="w-5 h-5" />
    </div>
  );
}
