import ArchiveIcon from "@assets/archive-tiny.svg";
import ChevronDownIcon from "@assets/chevron-down.svg";
import ClockIcon from "@assets/clock.svg";
import DeleteIcon from "@assets/delete-tiny.svg";
import ErrorRedIcon from "@assets/error-red.svg";
import { GetPaginatedOccurrencesFilters, Issue } from "@codewatch/types";
import { ConfirmationDialogContext } from "@lib/contexts";
import {
  OccurrenceWithId,
  archiveIssues,
  deleteIssues,
  getIssue,
  getOccurrences,
  resolveIssues,
  unarchiveIssues,
  unresolveIssues,
} from "@lib/data";
import { quantifyNumber } from "@lib/utils";
import { AppPage } from "@ui/app_page";
import { ActionButton, Button, ButtonBase } from "@ui/buttons";
import { EmptyState } from "@ui/empty_state";
import { useDateRange } from "@ui/inputs";
import {
  DetailsHeaderLoader,
  OccurrenceCardLoader,
  OccurrenceDetails,
  TotalOccurrencesLoader,
} from "@ui/issues";
import { Pagination } from "@ui/pagination";
import clsx from "clsx";
import moment from "moment";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 15;

export default function IssueDetails() {
  const [searchParams, setSearchParams] = useSearchParams({});
  const { dispatchConfirmation } = useContext(ConfirmationDialogContext);
  const urlParams = useParams<{ issueId: string }>();
  const {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    setDatePreset,
    dateRangeElement,
  } = useDateRange({
    initialStartDate: searchParams.get("startDate"),
    initialEndDate: searchParams.get("endDate"),
    selectClassName: "max-w-[70%]",
  });
  const [page, setPage] = useState(
    Number(searchParams.get("page") ?? DEFAULT_PAGE)
  );
  const [perPage] = useState(
    Number(searchParams.get("perPage") ?? DEFAULT_PAGE_SIZE)
  );
  const [stackOpen, setStackOpen] = useState(false);
  const [issue, setIssue] = useState<Issue | null>(null);
  const [occurrences, setOccurrences] = useState<OccurrenceWithId[]>([]);
  const [loadingIssue, setLoadingIssue] = useState(false);
  const [resolveLoading, setResolveLoading] = useState(false);
  const [loadingOccurrences, setLoadingOccurrences] = useState(false);
  const occurrencesRef = useRef<string | null>(null);
  const urlParamsRef = useRef<string | null>(null);
  const referrer = useRef<string>("");

  const fetchIssue = useCallback(async () => {
    if (!urlParams.issueId || urlParamsRef.current == urlParams.issueId) return;
    setLoadingIssue(true);
    urlParamsRef.current = urlParams.issueId;
    const issue = await getIssue(urlParams.issueId);
    setLoadingIssue(false);
    if (!issue) {
      urlParamsRef.current = null;
      return;
    }
    setIssue(issue);
  }, [urlParams]);

  const fetchOccurrences = useCallback(async () => {
    if (!issue) return;

    const filterStartDate = searchParams.get("startDate") ?? issue.createdAt;
    const filterEndDate =
      searchParams.get("endDate") ?? new Date().toISOString();
    const page = Number(searchParams.get("page")) ?? DEFAULT_PAGE;
    const perPage = Number(searchParams.get("perPage")) ?? DEFAULT_PAGE_SIZE;

    const filters: GetPaginatedOccurrencesFilters = {
      issueId: issue.id,
      startDate: filterStartDate,
      endDate: filterEndDate,
      page,
      perPage,
    };

    const serialized = JSON.stringify(filters);
    if (serialized === occurrencesRef.current) return;

    setLoadingOccurrences(true);
    const resOccurrences = await getOccurrences(filters);
    setLoadingOccurrences(false);
    if (resOccurrences == null) return;
    setOccurrences(resOccurrences);
    occurrencesRef.current = serialized;
  }, [issue, searchParams]);

  const submit = useCallback(() => {
    if (!issue) return;
    if (
      (searchParams.get("startDate") !== startDate ||
        searchParams.get("endDate") !== endDate) &&
      page !== 1
    ) {
      return setPage(1);
    }

    setSearchParams(
      {
        page: page.toString(),
        perPage: perPage.toString(),
        startDate,
        endDate,
      },
      { replace: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, startDate, endDate, searchParams, issue]);

  useEffect(() => {
    submit();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, startDate, endDate]);

  useEffect(() => {
    if (!issue) return;
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    if (!startDateParam || !endDateParam) {
      setDatePreset("4");
      setStartDate(`${new Date(issue.createdAt).getTime()}`);
      setEndDate(`${Date.now()}`);
    } else {
      fetchOccurrences();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, issue]);

  useEffect(() => {
    referrer.current = document.referrer;
    console.log(referrer.current);
  }, []);

  useEffect(() => {
    fetchIssue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlParams]);

  const updateIssue = useCallback(
    (update: Partial<Issue>) => {
      if (!issue) return;
      setIssue((prev) => {
        if (!prev) return prev;
        return { ...prev, ...update };
      });
    },
    [issue]
  );

  const handleBackClick = useCallback(() => {
    window.history.back();
  }, []);

  const handleDeleteClick = useCallback(() => {
    if (!issue) return;
    dispatchConfirmation({
      title: "Delete Issue",
      message: `Are you sure you want to delete this issue?`,
      confirmButtonText: "Delete",
      onConfirm: async () => {
        const deleted = await deleteIssues([issue.id]);
        if (deleted) handleBackClick();
      },
      confirmButtonColor: "red",
    });
  }, [dispatchConfirmation, handleBackClick, issue]);

  const handleArchiveClick = useCallback(async () => {
    if (!issue) return;
    dispatchConfirmation({
      title: "Archive Issue",
      message: `This will stop occurrence logging for this issue. Are you sure you want to archive this issue?`,
      confirmButtonText: "Archive",
      onConfirm: async () => {
        const archived = await archiveIssues([issue.id]);
        if (archived) updateIssue({ archived: true });
      },
    });
  }, [issue, updateIssue, dispatchConfirmation]);

  const handleUnarchiveClick = useCallback(async () => {
    if (!issue) return;
    dispatchConfirmation({
      title: "Unarchive Issue",
      message: `This will resume occurrence logging for this issue. Are you sure you want to unarchive this issue?`,
      confirmButtonText: "Unarchive",
      onConfirm: async () => {
        const unarchived = await unarchiveIssues([issue.id]);
        if (unarchived) updateIssue({ archived: false });
      },
    });
  }, [issue, updateIssue, dispatchConfirmation]);

  const handleResolveIssue = useCallback(async () => {
    if (!issue) return;

    setResolveLoading(true);
    const resolved = await resolveIssues([issue.id]);
    if (resolved) updateIssue({ resolved: true });
    setResolveLoading(false);
  }, [issue, updateIssue]);

  const handleUnresolveIssue = useCallback(async () => {
    if (!issue) return;

    setResolveLoading(true);
    const unresolved = await unresolveIssues([issue.id]);
    if (unresolved) updateIssue({ resolved: false });
    setResolveLoading(false);
  }, [issue, updateIssue]);

  if (!loadingIssue && !issue) return null; // Change this to a 404
  return (
    <AppPage
      title="Issues"
      dimAppBar
      header={
        <div className="px-5 sm:px-0">
          <ButtonBase
            className="text-primary-400 font-medium text-[0.9rem]"
            onClick={handleBackClick}
          >
            &#60; Back to list
          </ButtonBase>

          {loadingIssue ? (
            <DetailsHeaderLoader />
          ) : issue ? (
            <>
              <div className="flex justify-between">
                <div className="grow pr-3 sm:pr-0">
                  <h5 className="text-[1.75rem] font-medium m-0 p-0 leading-none">
                    {issue.name}
                  </h5>
                </div>

                <Button
                  className={clsx(
                    "px-5 py-3 sm:px-9 sm:py-3 h-fit rounded-xl text-[0.9rem]",
                    {
                      ["!bg-error hover:!bg-error-dark"]: issue.resolved,
                    }
                  )}
                  onClick={
                    issue.resolved ? handleUnresolveIssue : handleResolveIssue
                  }
                  loading={resolveLoading}
                >
                  {issue.resolved ? "Unresolve" : "Resolve"}
                </Button>
              </div>

              <div className="text-[0.82rem] flex mt-4 sm:-mt-1">
                <span className="flex text-grey-800">
                  <img
                    src={ClockIcon}
                    alt="clock"
                    width={11}
                    className="mr-1"
                  />
                  {moment(issue.lastOccurrenceTimestamp).fromNow()} |{" "}
                  {moment(issue.createdAt).fromNow(true)} old
                </span>

                {issue.unhandled ? (
                  <span className="flex ml-3 text-error-bright">
                    <img
                      src={ErrorRedIcon}
                      alt="error"
                      width={11}
                      className="mr-1"
                    />
                    Unhandled
                  </span>
                ) : null}
              </div>

              <div className="flex mt-4">
                {[
                  {
                    name: "Delete",
                    icon: DeleteIcon,
                    action: handleDeleteClick,
                  },
                  {
                    name: issue.archived ? "Unarchive" : "Archive",
                    icon: ArchiveIcon,
                    action: issue.archived
                      ? handleUnarchiveClick
                      : handleArchiveClick,
                  },
                ].map((action) => (
                  <ActionButton
                    key={action.name}
                    onClick={action.action}
                    className="mr-3 !px-2.5 text-[0.74rem]"
                  >
                    <img
                      src={action.icon}
                      alt={action.name}
                      className="mr-[0.45em] -mt-[0.2em]"
                    />{" "}
                    {action.name}
                  </ActionButton>
                ))}
              </div>

              <div className="mt-4">
                <ButtonBase onClick={() => setStackOpen((prev) => !prev)}>
                  <span className="flex items-center">
                    Stack Trace{" "}
                    <img
                      src={ChevronDownIcon}
                      alt="chevron-down"
                      className={clsx("ml-2 transition-everything", {
                        "rotate-180": stackOpen,
                      })}
                    />
                  </span>
                </ButtonBase>

                <div
                  className={clsx(
                    "scale-y-0 max-h-0 origin-top transition-everything text-grey-700 text-[0.9rem] border-l-2 pl-5",
                    {
                      ["scale-y-100 max-h-[50rem] overflow-auto"]: stackOpen,
                    }
                  )}
                >
                  {issue.stack.split("\n").map((line, index) => (
                    <div key={index} className="mb-1">
                      {line.replace(/\s/g, "\u00A0")}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      }
      cardClassName="!p-0"
    >
      <div className="py-4 px-5 flex justify-between items-center custom-rule">
        {dateRangeElement}
        <div className="text-grey-600 flex flex-col items-center ml-6 sm:ml-0">
          <span className="text-sm mb-1">Occurrences</span>{" "}
          {loadingIssue ? (
            <TotalOccurrencesLoader />
          ) : issue ? (
            <span className="text-xl">
              {quantifyNumber(issue.totalOccurrences)}
            </span>
          ) : null}
        </div>
      </div>

      {loadingOccurrences ? (
        [1, 2, 3].map((num) => <OccurrenceCardLoader key={num} />)
      ) : issue ? (
        occurrences.length ? (
          occurrences.map((occurrence) => (
            <OccurrenceDetails key={occurrence.id} occurrence={occurrence} />
          ))
        ) : (
          <EmptyState message="Couldn't find any occurrences for those filters" />
        )
      ) : null}

      <div className="py-7 px-5 flex justify-end">
        <Pagination
          page={page}
          perPage={perPage}
          totalRows={issue ? issue.totalOccurrences : 0}
          onChange={setPage}
        />
      </div>
    </AppPage>
  );
}
