import ArchiveIcon from "@assets/archive-tiny.svg";
import ChevronDownIcon from "@assets/chevron-down.svg";
import ClockIcon from "@assets/clock.svg";
import DeleteIcon from "@assets/delete-tiny.svg";
import ErrorRedIcon from "@assets/error-red.svg";
import { Occurrence } from "@codewatch/types";
import { AppPage } from "@ui/app_page";
import { ActionButton, Button, ButtonBase } from "@ui/buttons";
import { useDateRange } from "@ui/inputs";
import { OccurrenceDetails } from "@ui/issues";
import { Pagination } from "@ui/pagination";
import clsx from "clsx";
import moment from "moment";
import { nanoid } from "nanoid";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const testIssue = {
  fingerprint: "2345678",
  id: "2345678",
  lastOccurrenceTimestamp: "2024-04-10T13:59:33.021Z",
  lastOccurrenceMessage: "That's why this dashboard exists",
  muted: false,
  name: "It has crashed oooo!!!",
  stack:
    "Error: Something went wrong\n    at Object.<anonymous> (/home/codewatch)\n at main (c:\\Users\\Me\\Documents\\MyApp\\app.js:9:15)\n at Object. (c:\\Users\\Me\\Documents\\MyApp\\app.js:17:1)\n at Module._compile (module.js:460:26)\n at Object.Module._extensions..js (module.js:478:10)\n at Module.load (module.js:355:32)\n at Function.Module._load (module.js:310:12)\n at Function.Module.runMain (module.js:501:10)\n at startup (node.js:129:16)\n at node.js:814:3",
  totalOccurrences: 230,
  unhandled: true,
  createdAt: "2024-04-10T13:59:33.021Z",
  resolved: false,
};

interface UiOccurrence extends Occurrence {
  id: string;
}

const testOccurrences: UiOccurrence[] = [
  {
    id: nanoid(),
    issueId: "1",
    message: "Something went wrong",
    stderrLogs: [],
    stdoutLogs: [],
    timestamp: "2024-04-10T13:59:33.021Z",
    extraData: { foo: "bar" },
    systemInfo: {
      appMemoryUsage: 1234,
      appUptime: 1234,
      deviceMemory: 1234,
      deviceUptime: 1234,
      freeMemory: 1234,
    },
  },
  {
    id: nanoid(),
    issueId: "1",
    message: "Another thing went right though",
    stderrLogs: [],
    stdoutLogs: [],
    timestamp: "2024-04-10T13:59:33.021Z",
    extraData: { foo: "bar" },
    systemInfo: {
      appMemoryUsage: 1234,
      appUptime: 1234,
      deviceMemory: 1234,
      deviceUptime: 1234,
      freeMemory: 1234,
    },
  },
];

export default function IssueDetails() {
  const [searchParams] = useSearchParams({});
  const { dateRangeElement } = useDateRange({
    initialStartDate: searchParams.get("startDate"),
    initialEndDate: searchParams.get("endDate"),
  });
  const [page, setPage] = useState(Number(searchParams.get("page") ?? 1));
  const [perPage] = useState(Number(searchParams.get("perPage") ?? 15));
  const [stackOpen, setStackOpen] = useState(false);
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
                Unhandled Promise Rejection. This is an issue
              </h5>
            </div>

            <Button className="px-9 py-3 h-fit rounded-xl text-[0.9rem]">
              Resolve
            </Button>
          </div>

          <div className="text-[0.76rem] flex mt-3">
            <span className="flex text-grey-800">
              <img src={ClockIcon} alt="clock" width={11} className="mr-1" />
              {moment(testIssue.lastOccurrenceTimestamp).fromNow()} |{" "}
              {moment(testIssue.createdAt).fromNow(true)} old
            </span>

            {testIssue.unhandled ? (
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
              {testIssue.stack.split("\n").map((line, index) => (
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
          <span className="text-xl mt-1">3k</span>
        </div>
      </div>

      {testOccurrences.map((occurrence) => (
        <OccurrenceDetails key={occurrence.id} occurrence={occurrence} />
      ))}

      <div className="py-7 px-5 flex justify-end">
        <Pagination
          page={page}
          perPage={perPage}
          totalRows={343}
          onChange={setPage}
        />
      </div>
    </AppPage>
  );
}
