import CalendarIcon from "@assets/calendar.svg";
import { Select } from "@ui/inputs/select";
import moment from "moment";
import { useEffect, useState } from "react";
import { DateRangePicker } from "./picker";

type DatePresetCode = "1" | "2" | "3" | "4";

export type DatePreset = {
  code: Exclude<DatePresetCode, "4">;
  display: string;
  value: number;
  default: boolean;
};

type Props = {
  initialStartDate?: string | null;
  initialEndDate?: string | null;
  selectClassName?: string;
  datePresets?: DatePreset[];
};

const defaultPresets: DatePreset[] = [
  {
    code: "1",
    display: "Last 24 hours",
    value: 24 * 60 * 60 * 1000,
    default: false,
  },
  {
    code: "2",
    display: "Last 3 days",
    value: 3 * 24 * 60 * 60 * 1000,
    default: true,
  },
  {
    code: "3",
    display: "Last 7 days",
    value: 7 * 24 * 60 * 60 * 1000,
    default: false,
  },
];

export function useDateRange({
  initialStartDate,
  initialEndDate,
  selectClassName,
  datePresets,
}: Props) {
  const [startDate, setStartDate] = useState(
    initialStartDate
      ? initialStartDate
      : (Date.now() - 3 * 24 * 60 * 60 * 1000).toString()
  );
  const [endDate, setEndDate] = useState(
    initialEndDate ? initialEndDate : Date.now().toString()
  );
  const presets = datePresets || defaultPresets;
  const [datePresetCode, setDatePresetCode] = useState<DatePresetCode>(
    dateToPresetCode(presets, initialStartDate, initialEndDate)
  );

  const [openDateRangePicker, setOpenDateRangePicker] = useState(false);

  useEffect(() => {
    if (datePresetCode !== "4") {
      setStartDate(presetCodeToDate(presets, datePresetCode));
      setEndDate(Date.now().toString());
    }
  }, [datePresetCode, presets]);

  const dateRangeElement = (
    <>
      <Select
        onChange={(val) => setDatePresetCode(val as DatePresetCode)}
        options={[
          ...presets.map((p) => ({
            display: p.display,
            value: p.code,
          })),
          {
            display: `${moment(Number(startDate)).format(
              "DD MMM, YYYY h:mm:ss A"
            )} - ${moment(Number(endDate)).format("DD MMM, YYYY h:mm:ss A")}`,
            listDisplay: "Custom",
            value: "4",
            onSelect: () => setOpenDateRangePicker(true),
          },
        ]}
        value={datePresetCode}
        className={selectClassName}
        valueContainerClassName="truncate"
        startAdornment={<img src={CalendarIcon} alt="search" width={14} />}
        id="date-range-picker"
      />

      <DateRangePicker
        open={openDateRangePicker}
        onClose={() => setOpenDateRangePicker(false)}
        defaultStartDate={new Date(Number(startDate)).toISOString()}
        defaultEndDate={new Date(Number(endDate)).toISOString()}
        onChange={(start, end) => {
          setStartDate(new Date(start).getTime().toString());
          setEndDate(new Date(end).getTime().toString());
        }}
      />
    </>
  );

  return {
    datePresetCode,
    setDatePresetCode,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    dateRangeElement,
  };
}

function dateToPresetCode(
  presets: DatePreset[],
  startDate?: string | null,
  endDate?: string | null
) {
  if (!startDate) {
    const defaultPreset = presets.find((p) => p.default);
    if (defaultPreset) return defaultPreset.code;
    return "1";
  }
  const now = Date.now();
  if (endDate && Number(endDate) !== now) return "4";
  const diff = now - new Date(startDate).getTime();

  const selectedPreset = presets.find((p) => p.value === diff);
  if (selectedPreset) return selectedPreset.code;
  return "4";
}

function presetCodeToDate(presets: DatePreset[], code: DatePresetCode) {
  const now = Date.now();

  const preset = presets.find((p) => p.code === code);
  if (preset) return new Date(now - preset.value).getTime().toString();
  return new Date(now - 24 * 60 * 60 * 1000).getTime().toString();
}
