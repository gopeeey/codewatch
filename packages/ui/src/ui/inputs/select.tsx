"use client";

import ChevronDownIcon from "@assets/chevron-down.svg";
import useClickAwayListener from "@hooks/use_click_away_listener";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
type Props = {
  onChange: (val: string) => void;
  value: string;
  options: {
    display: string;
    listDisplay?: string;
    value: string;
    onSelect?: () => unknown;
  }[];
  className?: string;
  valueContainerClassName?: string;
  startAdornment?: React.ReactNode;
  containerRef?: React.MutableRefObject<HTMLDivElement | null>;
  id?: string;
};

export function Select({
  className,
  valueContainerClassName,
  startAdornment,
  value,
  onChange,
  options,
  id,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState("");

  const clickAwayRef = useClickAwayListener(() => setIsOpen(false));

  const selectDisplayValue = useCallback(
    (val: Props["value"]) => {
      let newDisplayValue = "";
      for (const option of options) {
        if (option.value === val) {
          newDisplayValue = option.display;
          break;
        }
      }
      setDisplayValue(newDisplayValue);
    },
    [options]
  );

  useEffect(() => {
    selectDisplayValue(value);
  }, [value, selectDisplayValue]);

  const handleSelect = (option: Props["options"][number]) => {
    onChange(option.value);
    if (option.onSelect) option.onSelect();
    setIsOpen(false);
  };

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={clsx("relative", className)} ref={clickAwayRef} id={id}>
      {/* Input box */}
      <div
        className={clsx(
          "bg-background flex items-center justify-between cursor-pointer rounded-xl px-3.5 py-2.5 focus-within:outline focus-within:outline-primary-400 focus-within:outline-2 focus-within:outline-offset-3"
        )}
        tabIndex={0}
        onClick={handleClick}
      >
        <div className="flex items-center max-w-[98%] pr-3">
          {startAdornment ? (
            <div className="block mr-3 -mt-0.5">{startAdornment}</div>
          ) : null}
          <div className={clsx(valueContainerClassName)}>{displayValue}</div>
        </div>

        <img
          src={ChevronDownIcon}
          alt="chevron-down"
          width={11}
          className={clsx("block transition-all duration-150", {
            "origin-center rotate-180": isOpen,
          })}
        />
      </div>

      {/* Drop down */}
      <div
        className={clsx(
          "bg-background shadow rounded-lg absolute py-3 z-20 min-w-full mt-3 origin-top scale-y-0 transition-all duration-300 opacity-0",
          { "opacity-100 scale-y-100": isOpen }
        )}
      >
        {options.map((option) => (
          <div
            key={option.value}
            className={clsx(
              "px-4 py-2 cursor-pointer min-w-max hover:bg-input-background-dark hover:text-white transition-everything",
              {
                "bg-primary-400 hover:bg-primary-400 text-white":
                  option.value === value,
              }
            )}
            onClick={() => handleSelect(option)}
          >
            {option.listDisplay || option.display}
          </div>
        ))}
      </div>
    </div>
  );
}
