import ChevronLeftIcon from "@assets/chevron-left.svg";
import ChevronRightIcon from "@assets/chevron-right.svg";
import { ButtonBase } from "@ui/buttons";
import clsx from "clsx";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";

type Props = {
  defaultStart: moment.Moment | null;
  defaultEnd: moment.Moment | null;
  onStartChange: (date: moment.Moment) => void;
  onEndChange: (date: moment.Moment) => void;
  currentSelectionType: "start" | "end";
};
export function RangeCalendar({
  defaultStart,
  defaultEnd,
  onStartChange,
  onEndChange,
}: Props) {
  const [focusDate, setFocusDate] = useState(defaultStart || moment());
  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(defaultEnd);

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

  const handleClick = useCallback(
    (d: moment.Moment) => {
      const date = d.clone();
      setFocusDate(date);

      if (start && end) {
        setStart(date);
        setEnd(null);
        return;
      }

      if (start) return setEnd(date);

      setStart(date);
    },
    [start, end]
  );

  useEffect(() => {
    if (start) onStartChange(start);
    if (end) onEndChange(end);
  }, [start, end, onStartChange, onEndChange]);

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
            className="px-2.5 rounded-lg hover:bg-input-background-dark transition-everything"
            onClick={() => {
              setFocusDate((prev) => prev.clone().subtract(1, "month"));
            }}
          >
            <img src={ChevronLeftIcon} alt="chevron left" width={7} />
          </ButtonBase>
          <ButtonBase
            className="ml-4 -mr-2.5 px-2.5 py-2 rounded-lg hover:bg-input-background-dark transition-everything"
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
            className={clsx(
              "relative py-3.5 px-3 flex justify-center items-center",
              {
                "bg-primary-400/20": date.isBetween(start, end, "day"),
                "bg-gradient-to-r from-transparent to-primary-400/20":
                  date.isSame(start, "day"),
                "bg-gradient-to-l from-transparent to-primary-400/20":
                  date.isSame(end, "day"),
              }
            )}
            key={date.toISOString()}
          >
            <ButtonBase
              className={clsx(
                "absolute w-9 h-9 text-sm text-center rounded-md hover:bg-input-background-dark",
                {
                  "text-grey-900": !date.isSame(focusDate, "month"),
                  "border-dashed border border-primary-400": date.isSame(
                    moment(),
                    "day"
                  ),
                  "bg-primary-400 hover:bg-primary-400":
                    date.isSame(start, "day") || date.isSame(end, "day"),
                }
              )}
              onClick={() => handleClick(date)}
            >
              {date.get("date")}
            </ButtonBase>
          </div>
        ))}
      </div>
    </>
  );
}
