import ChevronDownIcon from "@assets/chevron-down.svg";
import ClockIcon from "@assets/clock.svg";
import { Occurrence } from "@codewatch/types";
import clsx from "clsx";
import moment from "moment";
import { useState } from "react";

type Props = {
  occurrence: Occurrence;
};

const spacingStyles = "py-4 px-5";

export function OccurrenceDetails({ occurrence }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className="custom-rule">
      <div
        className={clsx(
          spacingStyles,
          "sticky top-0 bg-pane-background z-10 flex justify-between cursor-pointer hover:bg-input-background-dark transition-everything"
        )}
        onClick={() => setOpen((prev) => !prev)}
      >
        <div>
          <h4 className="font-medium text-base">{occurrence.message}</h4>
          <span className="flex text-grey-800 text-[0.76rem] mt-1">
            <img src={ClockIcon} alt="clock" width={11} className="mr-1" />
            {moment(occurrence.timestamp).format("ddd MMM Do YYYY, h:mm:ss A")}
          </span>
        </div>

        <img
          src={ChevronDownIcon}
          alt="chevron"
          className={clsx("transition-everything", { ["rotate-180"]: open })}
        />
      </div>

      <div
        className={clsx(
          "scale-y-0 max-h-0 relative origin-top transition-everything",
          {
            ["scale-y-100 max-h-[1000em] overflow-auto"]: open,
          }
        )}
      >
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
      </div>
    </div>
  );
}
