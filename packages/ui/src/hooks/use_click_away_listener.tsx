import { useEffect, useRef } from "react";

export default function useClickAwayListener(callback: () => unknown) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 100);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [callback]);

  return ref;
}
