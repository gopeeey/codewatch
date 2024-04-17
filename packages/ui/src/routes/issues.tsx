import CalendarIcon from "@assets/calendar.svg";
import SearchIcon from "@assets/search.svg";
import { GetIssuesFilters, Issue } from "@codewatch/core";
import { useDebounce } from "@hooks/use_debounce";
import { getIssues, getIssuesTotal } from "@lib/data";
import { AppPage } from "@ui/app_page";
import { ActionButton } from "@ui/buttons";
import { Checkbox, Select, TextField } from "@ui/inputs";
import { IssueCard, IssuesTabs } from "@ui/issues";
import { Pagination } from "@ui/pagination";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

type DatePreset = "1" | "2" | "3" | "4";

export default function IssuesRoute() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [searchParams, setSearchParams] = useSearchParams({});
  const [datePreset, setDatePreset] = useState<DatePreset>(
    dateToPreset(searchParams.get("startDate"), searchParams.get("endDate"))
  );
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
  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") ??
      (Date.now() - 3 * 24 * 60 * 60 * 1000).toString()
  );
  const [endDate, setEndDate] = useState(
    searchParams.get("endDate") ?? Date.now().toString()
  );
  const [selectedIds, setSelectedIds] = useState<Issue["id"][]>([]);
  const prevFilterStr = useRef("");

  useEffect(() => {
    if (datePreset !== "4") {
      setStartDate(presetToDate(datePreset));
      setEndDate(Date.now().toString());
    }
  }, [datePreset]);

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

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  return (
    <AppPage title="Issues" cardClassName="px-0 py-0">
      {/* Filters and Tabs */}
      <div className="px-5 py-6 pr-8 flex justify-between custom-rule">
        <div className="flex">
          <TextField
            inputProps={{
              placeholder: "Search issues",
              onChange: debouncedSearchStringChange,
              defaultValue: searchString,
            }}
            startAdornment={<img src={SearchIcon} alt="search" width={14} />}
          />

          <Select
            onChange={(val) => setDatePreset(val as DatePreset)}
            options={[
              { display: "Last 24 hours", value: "1" },
              { display: "Last 3 days", value: "2" },
              { display: "Last 7 days", value: "3" },
              {
                display: "Custom",
                value: "4",
                onSelect: () => console.log("onSelect"),
              },
            ]}
            value={datePreset}
            className="ml-5"
            startAdornment={<img src={CalendarIcon} alt="search" width={14} />}
          />
        </div>

        <IssuesTabs
          resolved={resolved}
          onChange={setResolved}
          resolvedCount={0}
          unresolvedCount={unresolvedCount}
          className="-mb-[3.54rem]"
        />
      </div>

      <div className="px-5 py-3 custom-rule flex justify-between pr-8">
        {/* Actions */}
        <div className="flex items-center">
          <Checkbox
            label=""
            checked={issues.every((issue) => selectedIds.includes(issue.id))}
            onClick={() => {
              if (issues.every((issue) => selectedIds.includes(issue.id))) {
                setSelectedIds([]);
              } else {
                setSelectedIds(issues.map((issue) => issue.id));
              }
            }}
          />
          <ActionButton label="Resolve" onClick={() => {}} />
          <ActionButton label="Delete" onClick={() => {}} className="ml-3" />
        </div>

        {/* Table Header */}
        <span className="text-grey-600 text-[0.8rem]">Occurences</span>
      </div>

      {/* Issues */}
      {issues.map((issue) => (
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

function dateToPreset(startDate?: string | null, endDate?: string | null) {
  if (!startDate) return "2";
  const now = Date.now();
  if (endDate && Number(endDate) !== now) return "4";
  const diff = now - new Date(startDate).getTime();

  switch (diff) {
    case 24 * 60 * 60 * 1000:
      return "1";
    case 3 * 24 * 60 * 60 * 1000:
      return "2";
    case 7 * 24 * 60 * 60 * 1000:
      return "3";
    default:
      return "4";
  }
}

function presetToDate(preset: ReturnType<typeof dateToPreset>) {
  const now = Date.now();

  switch (preset) {
    case "1":
      return new Date(now - 24 * 60 * 60 * 1000).getTime().toString();
    case "2":
      return new Date(now - 3 * 24 * 60 * 60 * 1000).getTime().toString();
    case "3":
      return new Date(now - 7 * 24 * 60 * 60 * 1000).getTime().toString();
    default:
      return new Date(now - 24 * 60 * 60 * 1000).getTime().toString();
  }
}
