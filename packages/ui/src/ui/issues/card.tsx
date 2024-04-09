import ClockIcon from "@assets/clock.svg";
import ErrorRedIcon from "@assets/error-red.svg";
import { Checkbox } from "@ui/inputs/checkbox";

export function IssueCard() {
  return (
    <div className="flex custom-rule items-center justify-between px-5 py-4 pr-8 transition-all duration-200 hover:bg-input-background-dark cursor-pointer">
      {/* Details and checkbox */}
      <div className="flex items-start">
        <Checkbox className="mt-1" />

        <div>
          <div className="text-base font-medium">
            Unhandled Promise Rejection
          </div>

          <div className="text-grey-700 text-sm">
            This right here is the message of the error
          </div>

          <div className="mt-0.5 text-[0.68rem] flex">
            <span className="flex text-grey-800">
              <img src={ClockIcon} alt="clock" width={11} className="mr-1" />4
              hours ago | 10 years old
            </span>

            <span className="flex ml-3 text-error-bright">
              <img src={ErrorRedIcon} alt="error" width={11} className="mr-1" />
              Unhandled
            </span>
          </div>
        </div>
      </div>

      {/* Occurence count */}
      <span className="text-base text-grey-600">3k</span>
    </div>
  );
}
