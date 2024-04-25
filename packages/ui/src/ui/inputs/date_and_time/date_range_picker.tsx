import ChevronLeftIcon from "@assets/chevron-left.svg";
import ChevronRightIcon from "@assets/chevron-right.svg";
import { generateRange } from "@lib/utils";
import { ButtonBase } from "@ui/buttons/base";
import { Card } from "@ui/card";
import { Modal } from "@ui/modal";
import clsx from "clsx";
import moment, { Moment } from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

type SelectionType = "start" | "end";
type SelectionMode = "date" | "time";

export function DateRangePicker({ open, onClose }: Props) {
  // const containerRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   if (!open || !anchorId || !containerRef.current) return;
  //   const anchor = document.getElementById(anchorId);
  //   if (!anchor) return;
  //   const anchorCoordinates = anchor.getBoundingClientRect();
  //   containerRef.current.style.left = `${anchorCoordinates.left}px`;
  //   containerRef.current.style.top = `${anchorCoordinates.bottom + 10}px`;
  // }, [open, anchorId, containerRef]);

  const [focusDate, setFocusDate] = useState(moment());
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("time");
  const [selectionType, setSelectionType] = useState<SelectionType>("start");

  const dateRange = useMemo(() => {
    const start = focusDate.clone().startOf("month").startOf("week");
    const end = focusDate.clone().endOf("month").endOf("week");
    const dates: Moment[] = [];

    while (!start.isAfter(end, "day")) {
      dates.push(start.clone());
      start.add(1, "day");
    }

    return dates;
  }, [focusDate]);

  const handleClose = useCallback(() => {
    if (!open) return;
    onClose();
  }, [onClose, open]);

  const handleHourChange = useCallback(
    (hour: string) => {
      const currentDate = (
        selectionType === "start" ? startDate : endDate
      ).clone();

      if (currentDate.format("a") === "am") {
        if (hour === "12") hour = "0";
        currentDate.set("hour", parseInt(hour));
      } else {
        let theHour = parseInt(hour) + 12;
        if (theHour === 24) theHour = 12;
        currentDate.set("hour", theHour);
      }

      const setter = selectionType === "start" ? setStartDate : setEndDate;
      setter(currentDate);
    },
    [selectionType, startDate, endDate]
  );

  const handleMinutesChange = useCallback(
    (minutes: string) => {
      const currentDate = (
        selectionType === "start" ? startDate : endDate
      ).clone();

      const setter = selectionType === "start" ? setStartDate : setEndDate;
      setter(currentDate.set("minute", parseInt(minutes)));
    },
    [selectionType, startDate, endDate]
  );

  const handleSecondsChange = useCallback(
    (seconds: string) => {
      const currentDate = (
        selectionType === "start" ? startDate : endDate
      ).clone();

      const setter = selectionType === "start" ? setStartDate : setEndDate;
      setter(currentDate.set("seconds", parseInt(seconds)));
    },
    [selectionType, startDate, endDate]
  );

  const handlePeriodChange = useCallback(
    (period: string) => {
      const currentDate = (
        selectionType === "start" ? startDate : endDate
      ).clone();

      if (currentDate.format("a") === period) return;

      const setter = selectionType === "start" ? setStartDate : setEndDate;
      if (currentDate.format("a") === "am") {
        setter(currentDate.set("hour", currentDate.get("hour") + 12));
      } else {
        setter(currentDate.set("hour", currentDate.get("hour") - 12));
      }
    },
    [selectionType, startDate, endDate]
  );

  return (
    <Modal open={open} onClose={handleClose}>
      <Card className="!bg-background absolute origin-center transition-everything max-w-full py-7 shadow-transparent">
        {selectionMode === "date" ? (
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
        ) : (
          <div className="flex justify-between items-center relative mask-timer">
            {/* Time Picker */}
            <RangeSelector
              range={[12, ...generateRange(1, 11)].map((num) => num.toString())}
              onSelect={handleHourChange}
              id="hours"
            />
            <span className="z-10 font-bold">:</span>
            <RangeSelector
              range={generateRange(0, 59).map((num) =>
                num.toString().padStart(2, "0")
              )}
              onSelect={handleMinutesChange}
              id="minutes"
            />
            <span className="z-10 font-bold">:</span>
            <RangeSelector
              range={generateRange(0, 59).map((num) =>
                num.toString().padStart(2, "0")
              )}
              onSelect={handleSecondsChange}
              id="seconds"
            />
            <RangeSelector
              range={["am", "pm"]}
              onSelect={handlePeriodChange}
              id="period"
            />
            <div className="w-full h-9 bg-pane-background absolute z-0"></div>
          </div>
        )}

        <div className="px-3.5 text-xs mt-9 flex justify-between items-center">
          <DisplayDateButton
            type="start"
            date={startDate}
            setMode={setSelectionMode}
            setType={setSelectionType}
          />
          |
          <DisplayDateButton
            type="end"
            date={endDate}
            setMode={setSelectionMode}
            setType={setSelectionType}
          />
          {/* {startDate.format("DD MMM, YYYY. h:mm A")} —{" "}
        {endDate.format("DD MMM, YYYY. h:mm A")} */}
        </div>
      </Card>
    </Modal>
  );
}

type DisplayButtonProps = {
  date: Moment;
  type: SelectionType;
  setType: (type: SelectionType) => void;
  setMode: (mode: SelectionMode) => void;
};
function DisplayDateButton({
  date,
  type,
  setType,
  setMode,
}: DisplayButtonProps) {
  const handleDateClick = useCallback(() => {
    setType(type);
    setMode("date");
  }, [type, setType, setMode]);

  const handleTimeClick = useCallback(() => {
    setType(type);
    setMode("time");
  }, [type, setType, setMode]);

  return (
    <div className="flex items-center text-primary-400">
      <ButtonBase
        className="hover:bg-pane-background transition-everything"
        onClick={handleDateClick}
      >
        {date.format("DD MMM, YYYY")}
      </ButtonBase>

      <ButtonBase
        className="hover:bg-pane-background transition-everything ml-1.5"
        onClick={handleTimeClick}
      >
        {date.format("h:mm:ss A")}
      </ButtonBase>
    </div>
  );
}

type RangeSelectorProps = {
  id: string;
  range: string[];
  onSelect: (range: string) => void;
};
function RangeSelector({ id, range, onSelect }: RangeSelectorProps) {
  const handleRangeClick = useCallback(
    (range: string) => {
      onSelect(range);
    },
    [onSelect]
  );

  useEffect(() => {
    const root = document.getElementById(`${id}_root`);
    if (!root) return;
    const { x, y, height, width } = root.getBoundingClientRect();
    const el_y = y + height / 2;
    const el_x = x + width / 2;

    const handler = () => {
      const newVal = document.elementFromPoint(el_x, el_y)?.innerHTML;
      if (newVal) onSelect(newVal);
    };

    root.addEventListener("scrollend", handler);

    return () => {
      root.removeEventListener("scrollend", handler);
    };
  }, [onSelect, id]);

  return (
    <div
      id={`${id}_root`}
      className="flex flex-col h-36 overflow-y-scroll no-scrollbar py-36 snap-y snap-mandatory relative z-10"
    >
      {range.map((val) => (
        <ButtonBase
          key={val}
          onClick={() => handleRangeClick(val)}
          className="snap-center px-8"
        >
          {val}
        </ButtonBase>
      ))}
    </div>
  );
}
