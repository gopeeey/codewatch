import useClickAwayListener from "@hooks/use_click_away_listener";
import { Card } from "@ui/card";
import clsx from "clsx";
import moment, { Moment } from "moment";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Props = {
  anchorId: string;
  open: boolean;
  onClose: () => void;
};

export function DateRangePicker({ anchorId, open, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [focusDate, setFocusDate] = useState(moment());

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
  const clickAwayRef = useClickAwayListener(handleClose);

  useEffect(() => {
    if (!open || !anchorId || !containerRef.current) return;
    const anchor = document.getElementById(anchorId);
    if (!anchor) return;
    const anchorCoordinates = anchor.getBoundingClientRect();
    containerRef.current.style.left = `${anchorCoordinates.left}px`;
    containerRef.current.style.top = `${anchorCoordinates.bottom + 10}px`;
  }, [open, anchorId, containerRef]);

  return (
    <Card
      ref={(node) => {
        containerRef.current = node;
        clickAwayRef.current = node;
      }}
      className={clsx(
        "!bg-background absolute origin-center scale-y-0 transition-all duration-300 opacity-0",
        { "!opacity-100 !scale-y-100": open }
      )}
    >
      {/* Calendar */}
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
            key={date.toISOString()}
            className={clsx("py-1 px-3 text-sm text-center cursor-pointer", {
              "text-grey-900": !date.isSame(focusDate, "month"),
            })}
          >
            {date.get("date")}
          </div>
        ))}
      </div>
    </Card>
  );
}
