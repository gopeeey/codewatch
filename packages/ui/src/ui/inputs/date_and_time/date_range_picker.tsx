import { ButtonBase } from "@ui/buttons/base";
import { Card } from "@ui/card";
import { Modal } from "@ui/modal";
import moment, { Moment } from "moment";
import { useCallback, useState } from "react";
import { Calendar } from "./calendar";
import { TimePickerComponent } from "./time_picker_component";

type Props = {
  open: boolean;
  onClose: () => void;
};

type SelectionType = "start" | "end";
type SelectionMode = "date" | "time";

export function DateRangePicker({ open, onClose }: Props) {
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
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

  return (
    <Modal open={open} onClose={handleClose}>
      <Card className="!bg-background absolute origin-center transition-everything w-[26rem] py-7 shadow-transparent">
        {selectionMode === "date" ? (
          <Calendar />
        ) : (
          <TimePickerComponent
            handleHourChange={handleHourChange}
            handleMinutesChange={handleMinutesChange}
            handlePeriodChange={handlePeriodChange}
            handleSecondsChange={handleSecondsChange}
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
