export const PAGINATION_MIDPOINT = ">|<";

export function generatePagination(currentPage: number, totalPages: number) {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, PAGINATION_MIDPOINT, totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [
      1,
      2,
      PAGINATION_MIDPOINT,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    PAGINATION_MIDPOINT,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    PAGINATION_MIDPOINT,
    totalPages,
  ];
}

export function quantifyNumber(number: number) {
  if (number < 1000) return number.toString();
  if (number >= 1000000) return `${Math.floor((number / 1000000) * 10) / 10}M`;
  return `${Math.floor((number / 1000) * 10) / 10}K`;
}

export function generateRange(start: number, end: number) {
  const range = [];
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  return range;
}
