import SearchIcon from "@assets/search.svg";
import { GetIssuesFilters, Issue, IssueTab } from "@codewatch/types";
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
import { Checkbox, TextField, useDateRange } from "@ui/inputs";
import { IssueCard, IssueCardSkeleton, IssuesTabs } from "@ui/issues";
import { Pagination } from "@ui/pagination";
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
    selectClassName: "mt-4 sm:mt-0 sm:ml-5 sm:w-1/2 xl:w-auto",
  });
  const [currentTab, setCurrentTab] = useState<IssueTab>(
    (searchParams.get("tab") as IssueTab) || "unresolved"
  );
  const [searchString, setSearchString] = useState(
    searchParams.get("searchString") ?? ""
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
  ]);

  useEffect(() => {
    submit();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchString, page, perPage, startDate, endDate, currentTab]);

  const debouncedSearchStringChange = useDebounce(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchString(e.target.value);
    },
    1000
  );

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
    });
    if (newIssues != null) setIssues(newIssues);
    setLoading(false);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  return (
    <AppPage title="Issues" cardClassName="px-0 py-0">
      {/* Filters and Tabs */}
      <div className="px-5 py-6 sm:pr-8 custom-rule flex flex-col justify-start ">
        <div className="flex flex-col sm:flex-row">
          <TextField
            inputProps={{
              placeholder: "Search issues",
              onChange: debouncedSearchStringChange,
              defaultValue: searchString,
            }}
            startAdornment={<img src={SearchIcon} alt="search" width={14} />}
            className="w-full sm:w-1/2 xl:w-auto"
          />

          {dateRangeElement}
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
