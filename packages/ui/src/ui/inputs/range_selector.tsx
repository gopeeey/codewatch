import { ButtonBase } from "@ui/buttons";
import { useCallback, useEffect } from "react";

type RangeSelectorProps = {
  id: string;
  range: string[];
  onSelect: (range: string) => void;
  defaultValue: string;
};

export function RangeSelector({
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
      const newVal = document.elementFromPoint(el_x, el_y)?.lastChild
        ?.textContent;

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
          className="snap-center px-8 hover:bg-input-background-dark/70 rounded-md transition-everything"
          id={`${id}_${val}`}
        >
          {val}
        </ButtonBase>
      ))}
    </div>
  );
}
