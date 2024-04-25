import clsx from "clsx";
import { ReactElement, useCallback, useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactElement;
};

export function Modal({ open, onClose, children }: Props) {
  const [transition, setTransition] = useState<"open" | "close">("close");
  const timeout = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setTransition("open");
    }, 10);

    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, [open]);

  const handleClose = useCallback(() => {
    setTransition("close");
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(onClose, 520);
  }, [onClose]);

  return open ? (
    <div
      className={clsx(
        "w-full h-full fixed top-0 left-0 z-[1000] flex justify-center items-center transition-everything !duration-500",
        {
          "opacity-0": transition === "close",
          "opacity-100": transition === "open",
        }
      )}
    >
      <div
        className="fixed w-full h-full bg-pane-background/80"
        onClick={handleClose}
      />
      {children}
    </div>
  ) : null;
}
