import { generatePagination } from "@/lib/utils";
import ChevronLeftIcon from "@public/chevron-left.svg";
import ChevronRightIcon from "@public/chevron-right.svg";
import clsx from "clsx";
import Image from "next/image";

type Props = {
  page: number;
  perPage: number;
  totalRows: number;
  onChange: (page: number) => void;
};

export function Pagination({ page, perPage, totalRows, onChange }: Props) {
  const totalPages = Math.ceil(totalRows / perPage);
  const pages = generatePagination(page, totalPages);
  return (
    <div className="flex items-center justify-center w-fit">
      <PaginationButton
        label={<Image src={ChevronLeftIcon} alt="chevron left" width={7} />}
        onClick={() => console.log("prev")}
        position="edge"
        className="mr-3"
      />
      {pages.map((cPage, index) => (
        <PaginationButton
          key={cPage + index.toString()}
          label={cPage.toString()}
          onClick={() => {
            let aPage = 0;
            if (typeof cPage === "string") {
              aPage = Math.floor(
                ((pages[index - 1] as number) + (pages[index + 1] as number)) /
                  2
              );
            } else {
              aPage = cPage;
            }
            onChange(aPage);
          }}
          position={
            index === 0
              ? "first"
              : index === pages.length - 1
              ? "last"
              : "middle"
          }
          active={cPage === page}
        />
      ))}
      <PaginationButton
        label={<Image src={ChevronRightIcon} alt="chevron right" width={7} />}
        onClick={() => console.log("next")}
        position="edge"
        className="ml-3"
      />
    </div>
  );
}

type ButtonProps = {
  label: string | React.ReactNode;
  onClick: () => void;
  className?: string;
  position: "first" | "last" | "middle" | "edge";
  active?: boolean;
};
function PaginationButton({
  label,
  onClick,
  className,
  position,
  active,
}: ButtonProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "text-center  min-w-8 py-1.5 bg-background mx-[0.5px] cursor-pointer hover:bg-primary-400 transition-all duration-200",
        {
          "rounded-l-xl": position === "first",
          "rounded-r-xl": position === "last",
          "bg-primary-400": active,
          "rounded-xl flex justify-center py-[0.68rem]": position === "edge",
        },
        className
      )}
    >
      {label}
    </div>
  );
}
