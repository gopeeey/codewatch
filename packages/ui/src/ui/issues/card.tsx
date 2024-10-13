import ClockIcon from "@assets/clock.svg";
import ErrorRedIcon from "@assets/error-red.svg";
import { Issue } from "@codewatch/types";
import { quantifyNumber } from "@lib/utils";
import { Checkbox } from "@ui/inputs/checkbox";
import { Skeleton } from "@ui/skeleton";
import clsx from "clsx";
import moment from "moment";
import { Link } from "react-router-dom";

type Props = {
  issue: Issue;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
};
export function IssueCard({
  issue,
  selected,
  selectable = true,
  onSelect,
  className,
}: Props) {
  return (
    <div
      className={clsx(
        "flex custom-rule items-center justify-between px-5 py-4 pr-8 transition-all duration-200 hover:bg-input-background-dark cursor-pointer",
        className
      )}
    >
      {/* Details and checkbox */}
      <div className="flex items-start w-full">
        {selectable ? (
          <Checkbox className="mt-1" checked={selected} onChange={onSelect} />
        ) : null}

        <Link to={`/issues/${issue.id}`} className="flex-grow">
          <div>
            <div className="text-base font-medium">{issue.name}</div>

            <div className="text-grey-700 text-[0.9rem]">
              {issue.lastOccurrenceMessage}
            </div>

            <div className="mt-0.5 text-[0.75rem] sm:flex">
              <span className="flex text-grey-800 items-start sm:items-center">
                <img
                  src={ClockIcon}
                  alt="clock"
                  width={11}
                  className="mr-1 mt-[0.07rem] sm:mt-0"
                />
                {moment(issue.createdAt).fromNow(true)} old | last seen{" "}
                {moment(issue.lastOccurrenceTimestamp).fromNow()}
              </span>

              {issue.unhandled ? (
                <span className="flex mt-1 sm:mt-0 sm:ml-3 text-error-bright items-start sm:items-center">
                  <img
                    src={ErrorRedIcon}
                    alt="error"
                    width={11}
                    className="mr-1 mt-[0.07rem] sm:mt-0"
                  />
                  Unhandled
                </span>
              ) : null}
            </div>
          </div>
        </Link>
      </div>

      {/* Occurence count */}
      <span className="text-base text-grey-600">
        {quantifyNumber(issue.totalOccurrences)}
      </span>
    </div>
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
