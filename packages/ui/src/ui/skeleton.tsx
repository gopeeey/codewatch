import clsx from "clsx";

const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-input-background before:to-transparent";

type Props = {
  className?: string;
  containerClassName?: string;
};
export function Skeleton({ className, containerClassName }: Props) {
  return (
    <span
      className={clsx(
        "relative flex overflow-hidden max-w-fit bg-input-background-dark rounded-md",
        containerClassName
      )}
    >
      <span
        className={clsx(`${shimmer} flex text-transparent p-0`, className)}
      ></span>
    </span>
  );
}
