import clsx from "clsx";

type Props = {
  content: string;
  variant?: "default" | "error";
  className?: string;
};

export function Badge({ content, variant = "default", className }: Props) {
  return (
    <span
      className={clsx(
        "rounded-xl w-max px-2.5 py-0.5 text-[0.67rem] align-middle text-center font-semibold",
        {
          "bg-error text-white": variant === "error",
          "bg-grey-200 text-black": variant === "default",
        },
        className
      )}
    >
      {content}
    </span>
  );
}
