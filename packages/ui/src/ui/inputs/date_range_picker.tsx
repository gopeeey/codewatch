import useClickAwayListener from "@hooks/use_click_away_listener";
import { Card } from "@ui/card";
import clsx from "clsx";
import { useCallback, useEffect, useRef } from "react";

type Props = {
  anchorId: string;
  open: boolean;
  onClose: () => void;
};
export function DateRangePicker({ anchorId, open, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
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
      Hello world
    </Card>
  );
}
