import ChevronLeftIcon from "@assets/chevron-left.svg";
import ChevronRightIcon from "@assets/chevron-right.svg";
import { ButtonBase } from "@ui/buttons";
import clsx from "clsx";
import moment from "moment";
import { useMemo, useState } from "react";

export function Calendar() {
  const [focusDate, setFocusDate] = useState(moment());

  const dateRange = useMemo(() => {
    const start = focusDate.clone().startOf("month").startOf("week");
    const end = focusDate.clone().endOf("month").endOf("week");
    const dates: moment.Moment[] = [];

    while (!start.isAfter(end, "day")) {
      dates.push(start.clone());
      start.add(1, "day");
    }

    return dates;
  }, [focusDate]);

  return (
    <>
      {/* Calendar */}
      <div className="flex justify-between px-3.5 mb-7">
        <div className="text-base font-medium text-grey-100">
          {focusDate.format("MMMM YYYY")}
        </div>

        <div className="flex items-center">
          <ButtonBase
            padded
            className="px-2.5 rounded-lg hover:bg-pane-background transition-everything"
            onClick={() => {
              setFocusDate((prev) => prev.clone().subtract(1, "month"));
            }}
          >
            <img src={ChevronLeftIcon} alt="chevron left" width={7} />
          </ButtonBase>
          <ButtonBase
            className="ml-4 -mr-2.5 px-2.5 py-2 rounded-lg hover:bg-pane-background transition-everything"
            onClick={() => {
              setFocusDate((prev) => prev.clone().add(1, "month"));
            }}
          >
            <img src={ChevronRightIcon} alt="chevron right" width={7} />
          </ButtonBase>
        </div>
      </div>

      <div className="grid grid-cols-7 grid-flow-row gap-y-4">
        {moment.weekdaysMin().map((day) => (
          <div
            key={day}
            className="py-1 px-3 text-sm text-center text-grey-700"
          >
            {day}
          </div>
        ))}

        {dateRange.map((date) => (
          <div
            className="relative py-3 px-3 flex justify-center items-center"
            key={date.toISOString()}
          >
            <ButtonBase
              className={clsx(
                "absolute w-9 h-9 text-sm text-center rounded-md hover:bg-pane-background",
                {
                  "text-grey-900": !date.isSame(focusDate, "month"),
                  "border-dashed border border-primary-400": date.isSame(
                    moment(),
                    "day"
                  ),
                }
              )}
            >
              {date.get("date")}
            </ButtonBase>
          </div>
        ))}
      </div>
    </>
  );
}
