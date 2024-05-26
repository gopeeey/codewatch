import ArchiveIcon from "@assets/archive-tiny.svg";
import ChevronDownIcon from "@assets/chevron-down.svg";
import ClockIcon from "@assets/clock.svg";
import DeleteIcon from "@assets/delete-tiny.svg";
import ErrorRedIcon from "@assets/error-red.svg";
import { GetPaginatedOccurrencesFilters, Issue } from "@codewatch/types";
import { OccurrenceWithId, getIssue, getOccurrences } from "@lib/data";
import { quantifyNumber } from "@lib/utils";
import { AppPage } from "@ui/app_page";
import { ActionButton, Button, ButtonBase } from "@ui/buttons";
import { useDateRange } from "@ui/inputs";
import { OccurrenceDetails } from "@ui/issues";
import { Pagination } from "@ui/pagination";
import clsx from "clsx";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 15;

export default function IssueDetails() {
  const [searchParams, setSearchParams] = useSearchParams({});
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
  const occurrencesRef = useRef<string | null>(null);
  const issueRef = useRef<string | null>(null);

  const fetchIssue = useCallback(async () => {
    if (!urlParams.issueId || issueRef.current == urlParams.issueId) return;
    const issue = await getIssue(urlParams.issueId);
    if (!issue) return;
    setIssue(issue);
    issueRef.current = urlParams.issueId;
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    if (!startDateParam || !endDateParam) {
      setDatePreset("4");
      setStartDate(`${new Date(issue.createdAt).getTime()}`);
      setEndDate(`${Date.now()}`);
    }
  }, [urlParams, searchParams, setStartDate, setEndDate, setDatePreset]);

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

    const resOccurrences = await getOccurrences(filters);
    if (resOccurrences == null) return;
    setOccurrences(resOccurrences);
    occurrencesRef.current = serialized;
  }, [issue, searchParams]);

  const submit = useCallback(() => {
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
  }, [page, perPage, startDate, endDate, searchParams]);

  useEffect(() => {
    submit();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, startDate, endDate]);

  useEffect(() => {
    console.log("fetching occurrences");
    fetchOccurrences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, issue]);

  useEffect(() => {
    fetchIssue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlParams]);
  if (!issue) return null;
  return (
    <AppPage
      title="Issues"
      dimAppBar
      header={
        <div>
          <div className="flex justify-between">
            <div className="grow">
              <ButtonBase
                className="text-primary-400 font-medium text-[0.9rem]"
                onClick={() => window.history.back()}
              >
                &#60; Back to list
              </ButtonBase>
              <h5 className="text-[1.75rem] font-medium m-0 p-0 leading-none">
                {issue.name}
              </h5>
            </div>

            <Button className="px-9 py-3 h-fit rounded-xl text-[0.9rem]">
              Resolve
            </Button>
          </div>

          <div className="text-[0.76rem] flex mt-3">
            <span className="flex text-grey-800">
              <img src={ClockIcon} alt="clock" width={11} className="mr-1" />
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
                action: () => console.log("delete"),
              },
              {
                name: "Archive",
                icon: ArchiveIcon,
                action: () => console.log("archive"),
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
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      }
      cardClassName="!p-0"
    >
      <div className="py-4 px-5 flex justify-between custom-rule">
        {dateRangeElement}{" "}
        <div className="text-grey-600 flex flex-col items-center">
          <span className="text-sm">Occurrences</span>{" "}
          <span className="text-xl mt-1">
            {quantifyNumber(issue.totalOccurrences)}
          </span>
        </div>
      </div>

      {occurrences.map((occurrence) => (
        <OccurrenceDetails key={occurrence.id} occurrence={occurrence} />
      ))}

      <div className="py-7 px-5 flex justify-end">
        <Pagination
          page={page}
          perPage={perPage}
          totalRows={issue.totalOccurrences}
          onChange={setPage}
        />
      </div>
    </AppPage>
  );
}
