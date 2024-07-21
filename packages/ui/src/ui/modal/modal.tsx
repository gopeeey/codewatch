import clsx from "clsx";
import { ReactElement, useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactElement;
};

export function Modal({ open, onClose, children }: Props) {
  const [transition, setTransition] = useState<"open" | "close">("close");
  const [showing, setShowing] = useState(false);
  const timeout = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setShowing(true);
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        setTransition("open");
      }, 50);
    } else {
      setTransition("close");
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        setShowing(false);
      }, 500);
    }

    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, [open]);

  // useEffect(() => {
  //   if (!open) return;
  //   if (timeout.current) clearTimeout(timeout.current);
  //   timeout.current = setTimeout(() => {
  //     setTransition("open");
  //   }, 10);

  //   return () => {
  //     if (timeout.current) clearTimeout(timeout.current);
  //   };
  // }, [open]);

  return showing ? (
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
        onClick={onClose}
      />
      <div
        className={clsx(
          "w-full h-full flex justify-center items-center transition-everything duration-500",
          {
            "scale-50": transition === "close",
            "scale-100": transition === "open",
          }
        )}
        ref={containerRef}
        onClick={(e) => {
          if (e.target === containerRef.current) onClose();
        }}
      >
        {children}
      </div>
    </div>
  ) : null;
}
