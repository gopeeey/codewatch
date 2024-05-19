import SearchIcon from "@assets/search.svg";
import { GetIssuesFilters, Issue } from "@codewatch/types";
import { useDebounce } from "@hooks/use_debounce";
import {
  deleteIssues,
  getIssues,
  getIssuesTotal,
  resolveIssues,
  unresolveIssues,
} from "@lib/data";
import { generateRange } from "@lib/utils";
import { AppPage } from "@ui/app_page";
import { ActionButton } from "@ui/buttons";
import { Checkbox, TextField, useDateRange } from "@ui/inputs";
import { IssueCard, IssueCardSkeleton, IssuesTabs } from "@ui/issues";
import { Pagination } from "@ui/pagination";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function IssuesRoute() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [searchParams, setSearchParams] = useSearchParams({});
  const { startDate, endDate, dateRangeElement } = useDateRange({
    initialStartDate: searchParams.get("startDate"),
    initialEndDate: searchParams.get("endDate"),
    selectClassName: "mt-4 sm:mt-0 sm:ml-5 sm:w-1/2 xl:w-auto",
  });
  const [resolved, setResolved] = useState<Issue["resolved"]>(
    searchParams.get("resolved") == "true"
  );
  const [searchString, setSearchString] = useState(
    searchParams.get("searchString") ?? ""
  );
  const [page, setPage] = useState(Number(searchParams.get("page") ?? 1));
  const [perPage] = useState(Number(searchParams.get("perPage") ?? 15));
  const [resolvedCount, setResolvedCount] = useState(0);
  const [unresolvedCount, setUnresolvedCount] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Issue["id"][]>([]);
  const [loading, setLoading] = useState(true);
  const prevFilterStr = useRef("");

  const submit = useCallback(() => {
    if (
      (searchParams.get("searchString") !== searchString ||
        searchParams.get("startDate") !== startDate ||
        searchParams.get("endDate") !== endDate ||
        searchParams.get("resolved") !== `${resolved}`) &&
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
      resolved: `${resolved}`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchString, page, perPage, startDate, endDate, resolved, searchParams]);

  useEffect(() => {
    submit();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchString, page, perPage, startDate, endDate, resolved]);

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
      resolved,
    };

    const currentFilterStr = JSON.stringify(filters);
    if (currentFilterStr !== prevFilterStr.current) {
      const newTotal = await getIssuesTotal(filters);
      if (newTotal != null) {
        const setter = resolved ? setResolvedCount : setUnresolvedCount;
        setter(newTotal);
      }

      if (resolved) {
        // also fetch unresolved total
        const uTotal = await getIssuesTotal({ ...filters, resolved: false });
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

  const delIssues = useCallback(async () => {
    if (!selectedIds.length) return;

    const deleted = await deleteIssues(selectedIds);
    if (deleted) {
      prevFilterStr.current = "";
      await fetchIssues();
    }
    setSelectedIds([]);
  }, [selectedIds, fetchIssues]);

  const resIssues = useCallback(async () => {
    if (!selectedIds.length) return;

    const successful = await resolveIssues(selectedIds);
    if (successful && !resolved) {
      prevFilterStr.current = "";
      await fetchIssues();
    }
    setSelectedIds([]);
  }, [selectedIds, resolved, fetchIssues]);

  const unResIssues = useCallback(async () => {
    if (!selectedIds.length) return;

    const successful = await unresolveIssues(selectedIds);
    if (successful && resolved) {
      prevFilterStr.current = "";
      await fetchIssues();
    }
    setSelectedIds([]);
  }, [selectedIds, resolved, fetchIssues]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  return (
    <AppPage title="Issues" cardClassName="px-0 py-0">
      {/* Filters and Tabs */}
      <div className="px-5 py-6 sm:pr-8 custom-rule flex flex-col justify-start xl:flex-row xl:justify-between">
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
          resolved={resolved}
          onChange={setResolved}
          resolvedCount={0}
          unresolvedCount={unresolvedCount}
          className="mt-6 -mb-[1.547rem] xl:mt-0 xl:-mb-[3.54rem]"
        />
      </div>

      <div className="px-5 py-5 xl:py-3 custom-rule flex justify-between pr-8">
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

          {resolved ? (
            <ActionButton onClick={unResIssues} disabled={loading}>
              Unresolve
            </ActionButton>
          ) : (
            <ActionButton onClick={resIssues} disabled={loading}>
              Resolve
            </ActionButton>
          )}

          <ActionButton onClick={delIssues} className="ml-3" disabled={loading}>
            Delete
          </ActionButton>
        </div>

        {/* Table Header */}
        <span className="text-grey-600 text-[0.8rem]">Occurences</span>
      </div>

      {/* Issues */}
      {loading
        ? generateRange(1, 4).map((num) => <IssueCardSkeleton key={num} />)
        : issues.map((issue) => (
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
          ))}

      <div className="py-10 pr-8 flex justify-end">
        <Pagination
          page={page}
          perPage={perPage}
          totalRows={resolved ? resolvedCount : unresolvedCount}
          onChange={setPage}
        />
      </div>
    </AppPage>
  );
}
