import { generateRange } from "@lib/utils";
import { RangeSelector } from "../range_selector";

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
