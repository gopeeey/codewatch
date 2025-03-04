export const PAGINATION_MIDPOINT = ">|<";

export function generatePagination(currentPage: number, totalPages: number) {
  // If the total number of pages is 7 or less,
  // display all pages without any midpoints.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, a midpoint, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, PAGINATION_MIDPOINT, totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, a midpoint, and the last 3 pages.
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
  // show the first page, a midpoint, the current page and its neighbors,
  // another midpoint, and the last page.
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

export function displayMemory(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function displayDuration(seconds: number) {
  if (seconds < 60)
    return `${Math.floor(seconds)} second${
      Math.floor(seconds) === 1 ? "" : "s"
    }`;

  if (seconds < 60 * 60) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins} minute${mins === 1 ? "" : "s"} ${
      secs ? `${secs} second${secs === 1 ? "" : "s"}` : ""
    }`;
  }

  const hrs = Math.floor(seconds / 60 / 60);
  const mins = Math.floor(seconds / 60) % 60;
  return `${hrs} hour${hrs === 1 ? "" : "s"} ${
    mins ? `${mins} minute${mins === 1 ? "" : "s"}` : ""
  }`;
}

export function getIsDev() {
  return (
    import.meta.env.VERCEL_TARGET_ENV === "production" ||
    import.meta.env.MODE === "development"
  );
}
