import ArchiveIcon from "@assets/archive-tiny.svg";
import ClockIcon from "@assets/clock.svg";
import DeleteIcon from "@assets/delete-tiny.svg";
import ErrorRedIcon from "@assets/error-red.svg";
import { AppPage } from "@ui/app_page";
import { ActionButton, Button, ButtonBase } from "@ui/buttons";
import moment from "moment";

const issue = {
  fingerprint: "2345678",
  id: "2345678",
  lastOccurrenceTimestamp: "2024-04-10T13:59:33.021Z",
  lastOccurrenceMessage: "That's why this dashboard exists",
  muted: false,
  name: "It has crashed oooo!!!",
  stack:
    "Error: Something went wrong\n    at Object.<anonymous> (/home/codewatch)",
  totalOccurrences: 230,
  unhandled: true,
  createdAt: "2024-04-10T13:59:33.021Z",
  resolved: false,
};

export default function IssueDetails() {
  return (
    <AppPage
      title="Issues"
      dimAppBar
      header={
        <div>
          <div className="flex justify-between">
            <div className="grow">
              <ButtonBase
                className="text-primary-400 font-medium"
                onClick={() => window.history.back()}
              >
                &#60; Back to list
              </ButtonBase>
              <h5 className="text-[1.75rem] font-medium m-0 p-0 leading-none">
                Unhandled Promise Rejection. This is an issue
              </h5>
            </div>

            <Button className="px-9 py-3 h-fit rounded-[0.9em] text-[0.9rem]">
              Resolve
            </Button>
          </div>

          <div className="text-[0.72rem] flex mt-3">
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

          <div className="flex mt-6">
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
        </div>
      }
    >
      Hello
    </AppPage>
  );
}
