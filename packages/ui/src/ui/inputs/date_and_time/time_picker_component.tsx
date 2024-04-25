import { generateRange } from "@lib/utils";
import { ButtonBase } from "@ui/buttons";
import { useCallback, useEffect } from "react";

type Props = {
  handleHourChange: (hour: string) => void;
  handleMinutesChange: (minutes: string) => void;
  handleSecondsChange: (seconds: string) => void;
  handlePeriodChange: (period: string) => void;
  defaultTime: moment.Moment;
};

export function TimePickerComponent({
  handleHourChange,
  handleMinutesChange,
  handlePeriodChange,
  handleSecondsChange,
  defaultTime,
}: Props) {
  return (
    <div className="flex justify-between items-center relative mask-timer">
      {/* Time Picker */}
      <RangeSelector
        range={[12, ...generateRange(1, 11)].map((num) => num.toString())}
        onSelect={handleHourChange}
        id="hours"
        defaultValue={defaultTime.format("h")}
      />
      <span className="z-10 font-bold">:</span>
      <RangeSelector
        range={generateRange(0, 59).map((num) =>
          num.toString().padStart(2, "0")
        )}
        onSelect={handleMinutesChange}
        id="minutes"
        defaultValue={defaultTime.format("mm")}
      />
      <span className="z-10 font-bold">:</span>
      <RangeSelector
        range={generateRange(0, 59).map((num) =>
          num.toString().padStart(2, "0")
        )}
        onSelect={handleSecondsChange}
        id="seconds"
        defaultValue={defaultTime.format("ss")}
      />
      <RangeSelector
        range={["am", "pm"]}
        onSelect={handlePeriodChange}
        id="period"
        defaultValue={defaultTime.format("a")}
      />
      <div className="w-full h-9 bg-primary-400 absolute rounded-md z-0"></div>
    </div>
  );
}

type RangeSelectorProps = {
  id: string;
  range: string[];
  onSelect: (range: string) => void;
  defaultValue: string;
};
function RangeSelector({
  id,
  range,
  onSelect,
  defaultValue,
}: RangeSelectorProps) {
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

  const scrollToSelect = useCallback(
    (val: string) => {
      const el = document.getElementById(`${id}_${val}`);
      if (!el) return;

      el.scrollIntoView({ block: "center" });
    },
    [id]
  );

  useEffect(() => {
    if (defaultValue) scrollToSelect(defaultValue);
  }, [defaultValue, scrollToSelect]);

  return (
    <div
      id={`${id}_root`}
      className="flex flex-col h-36 overflow-y-scroll no-scrollbar py-36 snap-y snap-mandatory relative z-10"
    >
      {range.map((val) => (
        <ButtonBase
          key={val}
          onClick={() => scrollToSelect(val)}
          className="snap-center px-8 hover:bg-primary-400/70 rounded-md transition-everything"
          id={`${id}_${val}`}
        >
          {val}
        </ButtonBase>
      ))}
    </div>
  );
}
