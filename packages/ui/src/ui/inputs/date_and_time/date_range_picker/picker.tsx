import { Button } from "@ui/buttons";
import { ButtonBase } from "@ui/buttons/base";
import { Card } from "@ui/card";
import { Modal } from "@ui/modal";
import moment, { Moment } from "moment";
import { useCallback, useState } from "react";
import { RangeCalendar } from "../range_calendar";
import { TimePickerComponent } from "../time_picker_component";

type Props = {
  open: boolean;
  onClose: () => void;
  defaultStartDate?: string;
  defaultEndDate?: string;
  onChange: (startDate: string, endDate: string) => void;
};

type SelectionType = "start" | "end";
type SelectionMode = "date" | "time";

export function DateRangePicker({
  open,
  onClose,
  defaultStartDate,
  defaultEndDate,
  onChange,
}: Props) {
  const [startDate, setStartDate] = useState(moment(defaultStartDate));
  const [endDate, setEndDate] = useState(moment(defaultEndDate));
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("date");
  const [selectionType, setSelectionType] = useState<SelectionType>("start");

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

  const handleSubmit = useCallback(() => {
    onChange(startDate.format(), endDate.format());
    handleClose();
  }, [onChange, handleClose, startDate, endDate]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Card className="!bg-background absolute origin-center transition-everything w-[26rem] py-7 shadow-transparent">
        {selectionMode === "date" ? (
          <RangeCalendar
            defaultStart={defaultStartDate ? moment(defaultStartDate) : null}
            defaultEnd={defaultEndDate ? moment(defaultEndDate) : null}
            currentSelectionType={selectionType}
            onEndChange={(date) => setEndDate(date)}
            onStartChange={(date) => setStartDate(date)}
          />
        ) : (
          <TimePickerComponent
            handleHourChange={handleHourChange}
            handleMinutesChange={handleMinutesChange}
            handlePeriodChange={handlePeriodChange}
            handleSecondsChange={handleSecondsChange}
            defaultTime={selectionType === "start" ? startDate : endDate}
          />
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
        </div>

        <div className="flex justify-end px-3.5 mt-7">
          <Button onClick={handleSubmit}>Ok</Button>
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
    <div className="flex items-center text-primary-300">
      <ButtonBase
        className="hover:bg-input-background-dark transition-everything"
        onClick={handleDateClick}
      >
        {date.format("DD MMM, YYYY")}
      </ButtonBase>

      <ButtonBase
        className="hover:bg-input-background-dark transition-everything ml-1.5"
        onClick={handleTimeClick}
      >
        {date.format("h:mm:ss A")}
      </ButtonBase>
    </div>
  );
}
