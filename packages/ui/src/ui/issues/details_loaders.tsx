import { Skeleton } from "@ui/skeleton";
import clsx from "clsx";

export function DetailsHeaderLoader() {
  return (
    <>
      <div className="flex justify-between">
        <div className="grow pr-3 sm:pr-0">
          <Skeleton className="w-64 h-9" />
        </div>

        <Skeleton className="w-32 h-12" containerClassName="rounded-xl" />
      </div>

      <div className="text-[0.82rem] flex mt-4 sm:-mt-1">
        <Skeleton className="w-48 h-4" containerClassName="mt-4" />
      </div>

      <div className="flex mt-5">
        {[1, 2].map((num) => (
          <Skeleton key={num} className="w-20 h-6" containerClassName="mr-3" />
        ))}
      </div>

      <div className="mt-5">
        <Skeleton className="w-28 h-6" containerClassName="mr-3" />
      </div>
    </>
  );
}

const normalPadding = "py-4 px-5";
export function OccurrenceCardLoader() {
  return (
    <div className="custom-rule">
      <div
        className={clsx(
          normalPadding,
          "z-10 bg-pane-background flex justify-between items-center"
        )}
      >
        <div>
          <Skeleton className="w-44 h-6" />
          <Skeleton className="w-56 h-3" containerClassName="mt-3" />
        </div>

        <Skeleton className="w-4 h-4" containerClassName="w-4 h-4" />
      </div>
    </div>
  );
}

export function TotalOccurrencesLoader() {
  return <Skeleton className="w-12 h-7" />;
}
