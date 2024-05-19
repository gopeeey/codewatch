import CalendarIcon from "@assets/calendar.svg";
import { Select } from "@ui/inputs/select";
import moment from "moment";
import { useEffect, useState } from "react";
import { DateRangePicker } from "./picker";

type Props = {
  initialStartDate?: string | null;
  initialEndDate?: string | null;
  selectClassName?: string;
};

type DatePreset = "1" | "2" | "3" | "4";

export function useDateRange({
  initialStartDate,
  initialEndDate,
  selectClassName,
}: Props) {
  const [startDate, setStartDate] = useState(
    initialStartDate
      ? initialStartDate
      : (Date.now() - 3 * 24 * 60 * 60 * 1000).toString()
  );
  const [endDate, setEndDate] = useState(
    initialEndDate ? initialEndDate : Date.now().toString()
  );
  const [datePreset, setDatePreset] = useState<DatePreset>(
    dateToPreset(initialStartDate, initialEndDate)
  );

  const [openDateRangePicker, setOpenDateRangePicker] = useState(false);

  useEffect(() => {
    if (datePreset !== "4") {
      setStartDate(presetToDate(datePreset));
      setEndDate(Date.now().toString());
    }
  }, [datePreset]);

  const dateRangeElement = (
    <>
      <Select
        onChange={(val) => setDatePreset(val as DatePreset)}
        options={[
          { display: "Last 24 hours", value: "1" },
          { display: "Last 3 days", value: "2" },
          { display: "Last 7 days", value: "3" },
          {
            display: `${moment(Number(startDate)).format(
              "DD MMM, YYYY h:mm:ss A"
            )} - ${moment(Number(endDate)).format("DD MMM, YYYY h:mm:ss A")}`,
            listDisplay: "Custom",
            value: "4",
            onSelect: () => setOpenDateRangePicker(true),
          },
        ]}
        value={datePreset}
        className={selectClassName}
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
    datePreset,
    setDatePreset,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    dateRangeElement,
  };
}

function dateToPreset(startDate?: string | null, endDate?: string | null) {
  if (!startDate) return "2";
  const now = Date.now();
  if (endDate && Number(endDate) !== now) return "4";
  const diff = now - new Date(startDate).getTime();

  switch (diff) {
    case 24 * 60 * 60 * 1000:
      return "1";
    case 3 * 24 * 60 * 60 * 1000:
      return "2";
    case 7 * 24 * 60 * 60 * 1000:
      return "3";
    default:
      return "4";
  }
}

function presetToDate(preset: DatePreset) {
  const now = Date.now();

  switch (preset) {
    case "1":
      return new Date(now - 24 * 60 * 60 * 1000).getTime().toString();
    case "2":
      return new Date(now - 3 * 24 * 60 * 60 * 1000).getTime().toString();
    case "3":
      return new Date(now - 7 * 24 * 60 * 60 * 1000).getTime().toString();
    default:
      return new Date(now - 24 * 60 * 60 * 1000).getTime().toString();
  }
}
