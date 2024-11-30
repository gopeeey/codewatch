import SearchIcon from "@assets/search.svg";
import SortIcon from "@assets/sort.svg";
import { useDebounce } from "@hooks/use_debounce";
import { ConfirmationDialogContext } from "@lib/contexts";
import {
  archiveIssues,
  deleteIssues,
  getIssues,
  getIssuesTotal,
  resolveIssues,
  unarchiveIssues,
  unresolveIssues,
} from "@lib/data";
import { generateRange } from "@lib/utils";
import { AppPage } from "@ui/app_page";
import { ActionButton } from "@ui/buttons";
import { EmptyState } from "@ui/empty_state";
import { Checkbox, Select, TextField, useDateRange } from "@ui/inputs";
import { IssueCard, IssueCardSkeleton, IssuesTabs } from "@ui/issues";
import { Pagination } from "@ui/pagination";
import {
  GetIssuesFilters,
  GetPaginatedIssuesFilters,
  Issue,
  IssueTab,
} from "codewatch-core/dist/types";
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";

export default function IssuesRoute() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [searchParams, setSearchParams] = useSearchParams({});
  const { startDate, endDate, dateRangeElement } = useDateRange({
    initialStartDate: searchParams.get("startDate"),
    initialEndDate: searchParams.get("endDate"),
    selectClassName: "sm:col-span-7 xl:col-auto",
  });
  const [currentTab, setCurrentTab] = useState<IssueTab>(
    (searchParams.get("tab") as IssueTab) || "unresolved"
  );
  const [searchString, setSearchString] = useState(
    searchParams.get("searchString") ?? ""
  );
  const [sort, setSort] = useState<GetPaginatedIssuesFilters["sort"]>(
    (searchParams.get("sort") as GetPaginatedIssuesFilters["sort"]) ??
      "created-at"
  );
  const [order, setOrder] = useState<GetPaginatedIssuesFilters["order"]>(
    (searchParams.get("order") as GetPaginatedIssuesFilters["order"]) ?? "desc"
  );
  const [page, setPage] = useState(Number(searchParams.get("page") ?? 1));
  const [perPage] = useState(Number(searchParams.get("perPage") ?? 15));
  const [resolvedCount, setResolvedCount] = useState(0);
  const [unresolvedCount, setUnresolvedCount] = useState(0);
  const [archivedCount, setArchivedCount] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Issue["id"][]>([]);
  const [loading, setLoading] = useState(true);
  const prevFilterStr = useRef("");
  const { dispatchConfirmation } = useContext(ConfirmationDialogContext);

  const submit = useCallback(() => {
    if (
      (searchParams.get("searchString") !== searchString ||
        searchParams.get("startDate") !== startDate ||
        searchParams.get("endDate") !== endDate ||
        searchParams.get("sort") !== sort ||
        searchParams.get("order") !== order ||
        searchParams.get("tab") !== currentTab) &&
      page !== 1
    ) {
      return setPage(1);
    }
    setSelectedIds([]);
    setSearchParams({
      searchString,
      page: page.toString(),
      perPage: perPage.toString(),
      startDate,
      endDate,
      sort,
      order,
      tab: currentTab,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchString,
    page,
    perPage,
    startDate,
    endDate,
    currentTab,
    searchParams,
    sort,
    order,
  ]);

  useEffect(() => {
    submit();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchString,
    page,
    perPage,
    startDate,
    endDate,
    currentTab,
    sort,
    order,
  ]);

  const fetchIssues = useCallback(async () => {
    const startDate = searchParams.get("startDate") ?? "";
    const endDate = searchParams.get("endDate") ?? "";
    if (!startDate || !endDate) return;

    setLoading(true);
    const filters: GetIssuesFilters = {
      searchString: searchParams.get("searchString") ?? "",
      startDate,
      endDate,
      tab: currentTab,
    };

    const currentFilterStr = JSON.stringify(filters);
    if (currentFilterStr !== prevFilterStr.current) {
      const newTotal = await getIssuesTotal(filters);
      if (newTotal != null) {
        const setter =
          currentTab === "resolved"
            ? setResolvedCount
            : currentTab === "unresolved"
            ? setUnresolvedCount
            : setArchivedCount;
        setter(newTotal);
      }

      if (currentTab !== "unresolved") {
        // also fetch unresolved total
        const uTotal = await getIssuesTotal({ ...filters, tab: "unresolved" });
        if (uTotal != null) setUnresolvedCount(uTotal);
      }
      prevFilterStr.current = currentFilterStr;
    }

    const newIssues = await getIssues({
      ...filters,
      page: Number(searchParams.get("page")) ?? 1,
      perPage: Number(searchParams.get("perPage")) ?? 15,
      sort:
        (searchParams.get("sort") as GetPaginatedIssuesFilters["sort"]) ??
        "created-at",
      order:
        (searchParams.get("order") as GetPaginatedIssuesFilters["order"]) ??
        "desc",
    });
    if (newIssues != null) setIssues(newIssues);
    setLoading(false);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const debouncedSearchStringChange = useDebounce(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchString(e.target.value);
    },
    1000
  );

  const handleDeleteClick = useCallback(() => {
    if (!selectedIds.length) return;
    dispatchConfirmation({
      title: "Delete Issues",
      message: "Are you sure you want to delete the selected issues?",
      onConfirm: async () => {
        const deleted = await deleteIssues(selectedIds);
        if (deleted) {
          prevFilterStr.current = "";
          await fetchIssues();
        }
        setSelectedIds([]);
      },
      confirmButtonText: "Delete",
      confirmButtonColor: "red",
    });
  }, [selectedIds, fetchIssues, dispatchConfirmation]);

  const handleResolveClick = useCallback(async () => {
    if (!selectedIds.length) return;
    dispatchConfirmation({
      title: "Resolve Issues",
      message: "Are you sure you want to resolve the selected issues?",
      onConfirm: async () => {
        const successful = await resolveIssues(selectedIds);
        if (successful && currentTab === "unresolved") {
          prevFilterStr.current = "";
          await fetchIssues();
        }
        setSelectedIds([]);
      },
      confirmButtonText: "Resolve",
    });
  }, [selectedIds, currentTab, fetchIssues, dispatchConfirmation]);

  const handleUnresolveClick = useCallback(async () => {
    if (!selectedIds.length) return;
    dispatchConfirmation({
      title: "Unresolve Issues",
      message: "Are you sure you want to unresolve the selected issues?",
      onConfirm: async () => {
        const successful = await unresolveIssues(selectedIds);
        if (successful && currentTab === "resolved") {
          prevFilterStr.current = "";
          await fetchIssues();
        }
        setSelectedIds([]);
      },
      confirmButtonText: "Unresolve",
    });
  }, [selectedIds, currentTab, fetchIssues, dispatchConfirmation]);

  const handleArchiveClick = useCallback(async () => {
    if (!selectedIds.length) return;
    dispatchConfirmation({
      title: "Archive Issues",
      message:
        "This will stop occurrence logging for the selected issues. Are you sure you want to archive these issues?",
      confirmButtonText: "Archive",
      onConfirm: async () => {
        const archived = await archiveIssues(selectedIds);
        if (archived && currentTab !== "archived") {
          prevFilterStr.current = "";
          await fetchIssues();
        }
        setSelectedIds([]);
      },
    });
  }, [selectedIds, currentTab, fetchIssues, dispatchConfirmation]);

  const handleUnarchiveClick = useCallback(async () => {
    if (!selectedIds.length) return;
    dispatchConfirmation({
      title: "Unarchive Issues",
      message:
        "This will resume occurrence logging for the selected issues. Are you sure you want to unarchive these issues?",
      confirmButtonText: "Unarchive",
      onConfirm: async () => {
        const unarchived = await unarchiveIssues(selectedIds);
        if (unarchived && currentTab === "archived") {
          prevFilterStr.current = "";
          await fetchIssues();
        }
        setSelectedIds([]);
      },
    });
  }, [selectedIds, currentTab, fetchIssues, dispatchConfirmation]);

  const handleSortSelect = (val: string) => {
    const valArr = val.split(" ");
    setSort(valArr[0] as GetPaginatedIssuesFilters["sort"]);
    setOrder(valArr[1] as GetPaginatedIssuesFilters["order"]);
  };

  return (
    <AppPage title="Issues" cardClassName="px-0 py-0">
      {/* Filters and Tabs */}
      <div className="px-5 py-6 sm:pr-8 custom-rule flex flex-col justify-start ">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 xl:flex">
          <TextField
            inputProps={{
              placeholder: "Search issues",
              onChange: debouncedSearchStringChange,
              defaultValue: searchString,
            }}
            startAdornment={<img src={SearchIcon} alt="search" width={14} />}
            // className="w-full sm:w-1/2 xl:w-auto"
            className="sm:col-span-12 xl:col-auto"
          />

          {dateRangeElement}

          <Select
            onChange={(val) => handleSortSelect(val)}
            options={[
              { display: "Oldest", value: "created-at asc" },
              { display: "Latest", value: "created-at desc" },
              {
                display: "Most recent occurrence",
                value: "last-seen desc",
              },
              { display: "Least recent occurrence", value: "last-seen asc" },
              { display: "Most recurring", value: "total-occurrences desc" },
              { display: "Least recurring", value: "total-occurrences asc" },
              ...(searchString.length > 0
                ? [
                    {
                      display: "Most relevant (search)",
                      value: "relevance desc",
                    },
                    {
                      display: "Least relevant (search)",
                      value: "relevance asc",
                    },
                  ]
                : []),
            ]}
            value={`${sort} ${order}`}
            className="sm:col-span-5 xl:col-auto"
            valueContainerClassName="truncate"
            // className="mt-4 sm:mt-0 sm:ml-5 sm:w-1/2 xl:w-auto"
            startAdornment={<img src={SortIcon} alt="search" width={14} />}
          />
        </div>

        <IssuesTabs
          currentTab={currentTab}
          onChange={setCurrentTab}
          resolvedCount={0}
          unresolvedCount={unresolvedCount}
          archivedCount={0}
          className="mt-6 -mb-[1.547rem] "
        />
      </div>

      <div className="px-5 py-5 custom-rule flex justify-between pr-8">
        {/* Actions */}
        <div className="flex items-center">
          <Checkbox
            label=""
            checked={
              Boolean(issues.length) &&
              issues.every((issue) => selectedIds.includes(issue.id))
            }
            onClick={() => {
              if (issues.every((issue) => selectedIds.includes(issue.id))) {
                setSelectedIds([]);
              } else {
                setSelectedIds(issues.map((issue) => issue.id));
              }
            }}
            disabled={loading}
          />

          {currentTab === "unresolved" || currentTab === "archived" ? (
            <ActionButton onClick={handleResolveClick} disabled={loading}>
              Resolve
            </ActionButton>
          ) : null}

          {currentTab === "resolved" || currentTab === "archived" ? (
            <ActionButton
              onClick={handleUnresolveClick}
              disabled={loading}
              className={currentTab === "archived" ? "ml-3" : ""}
            >
              Unresolve
            </ActionButton>
          ) : null}

          {currentTab !== "archived" ? (
            <ActionButton
              onClick={handleArchiveClick}
              className="ml-3"
              disabled={loading}
            >
              Archive
            </ActionButton>
          ) : null}

          {currentTab === "archived" ? (
            <ActionButton
              onClick={handleUnarchiveClick}
              className="ml-3"
              disabled={loading}
            >
              Unarchive
            </ActionButton>
          ) : null}

          <ActionButton
            onClick={handleDeleteClick}
            className="ml-3"
            disabled={loading}
          >
            Delete
          </ActionButton>
        </div>

        {/* Table Header */}
        <span className="text-grey-600 text-[0.8rem]">Occurences</span>
      </div>

      {/* Issues */}
      {loading ? (
        generateRange(1, 4).map((num) => <IssueCardSkeleton key={num} />)
      ) : issues.length ? (
        issues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            selected={selectedIds.includes(issue.id)}
            onSelect={() => {
              setSelectedIds((prev) => {
                if (prev.includes(issue.id)) {
                  return prev.filter((id) => id !== issue.id);
                } else {
                  return [...prev, issue.id];
                }
              });
            }}
          />
        ))
      ) : (
        <EmptyState message="Couldn't find any issues for those filters" />
      )}

      <div className="py-10 pr-8 flex justify-end">
        <Pagination
          page={page}
          perPage={perPage}
          totalRows={
            currentTab === "resolved"
              ? resolvedCount
              : currentTab === "unresolved"
              ? unresolvedCount
              : archivedCount
          }
          onChange={setPage}
        />
      </div>
    </AppPage>
  );
}
