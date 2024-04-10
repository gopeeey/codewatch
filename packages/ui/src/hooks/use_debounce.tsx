import { useCallback, useRef } from "react";

export function useDebounce<T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number
) {
  const timer = useRef<number | null>();

  const debouncedSubmit = useCallback(
    (...args: T) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        if (typeof callback === "function") callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedSubmit;
}
