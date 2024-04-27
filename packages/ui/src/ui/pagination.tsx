import ChevronLeftIcon from "@assets/chevron-left.svg";
import ChevronRightIcon from "@assets/chevron-right.svg";
import { generatePagination } from "@lib/utils";
import { PaginationButton } from "./buttons";

type Props = {
  page: number;
  perPage: number;
  totalRows: number;
  onChange: (page: number) => void;
  disabled?: boolean;
};

export function Pagination({
  page,
  perPage,
  totalRows,
  onChange,
  disabled,
}: Props) {
  const totalPages = Math.ceil(totalRows / perPage);
  const pages = generatePagination(page, totalPages);
  return (
    <div className="flex items-center justify-center w-fit">
      <PaginationButton
        label={<img src={ChevronLeftIcon} alt="chevron left" width={7} />}
        onClick={() => {
          onChange(page - 1);
        }}
        position="edge"
        className="mr-3"
        disabled={page === 1 || disabled}
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
          disabled={disabled}
        />
      ))}
      <PaginationButton
        label={<img src={ChevronRightIcon} alt="chevron right" width={7} />}
        onClick={() => {
          onChange(page + 1);
        }}
        position="edge"
        className="ml-3"
        disabled={page === Number(pages[pages.length - 1]) || disabled}
      />
    </div>
  );
}
