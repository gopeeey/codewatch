import ChevronDownIcon from "@assets/chevron-down.svg";
import ClockIcon from "@assets/clock.svg";
import { Occurrence } from "@codewatch/types";
import { OccurrenceWithId } from "@lib/data";
import { displayDuration, displayMemory } from "@lib/utils";
import clsx from "clsx";
import moment from "moment";
import { useState } from "react";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
import stripAnsi from "strip-ansi";
import { InfoCard } from "./info_card";

type Props = {
  occurrence: OccurrenceWithId;
};

const normalPadding = "py-4 px-5";

export function OccurrenceDetails({ occurrence }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="custom-rule">
      <div
        className={clsx(
          normalPadding,
          "sticky top-0 z-10 bg-pane-background flex justify-between cursor-pointer hover:bg-input-background-dark transition-everything",
          {
            ["custom-shadow !bg-input-background-dark"]: open,
          }
        )}
        onClick={() => setOpen((prev) => !prev)}
      >
        <div>
          <h4 className="font-medium text-base">{occurrence.message}</h4>
          <span className="flex text-grey-800 text-[0.82rem] mt-[0.1rem]">
            <img src={ClockIcon} alt="clock" width={11} className="mr-1" />
            {moment(occurrence.timestamp).format("ddd MMM Do YYYY, h:mm:ss A")}
          </span>
        </div>

        <img
          src={ChevronDownIcon}
          alt="chevron"
          className={clsx("transition-everything", { ["rotate-180"]: open })}
        />
      </div>

      <div
        className={clsx("scale-y-0 max-h-0 origin-top transition-everything", {
          ["scale-y-100 max-h-[500em] overflow-auto"]: open,
        })}
      >
        <div className="p-5">
          {occurrence.extraData ? (
            <InfoCard title="Manually Captured Data" className="mb-12">
              <JsonView src={occurrence.extraData} />
            </InfoCard>
          ) : null}

          {occurrence.stdoutLogs.length > 0 ? (
            <InfoCard title="Stdout logs" className="mb-12">
              <div className="mt-2">
                {occurrence.stdoutLogs.map((log) => (
                  <div key={log.id} className="mb-8">
                    <LogBlock log={log} />
                  </div>
                ))}
              </div>
            </InfoCard>
          ) : null}

          {occurrence.stderrLogs.length > 0 ? (
            <InfoCard title="Stderr logs" className="mb-12">
              <div className="mt-2">
                {occurrence.stderrLogs.map((log) => (
                  <div key={log.id} className="mb-8">
                    <LogBlock log={log} />
                  </div>
                ))}
              </div>
            </InfoCard>
          ) : null}

          {occurrence.systemInfo ? (
            <InfoCard title="System Info">
              <div className="py-1">
                {[
                  {
                    name: "Device Memory",
                    value: displayMemory(occurrence.systemInfo.deviceMemory),
                  },
                  {
                    name: "Free Memory",
                    value: displayMemory(occurrence.systemInfo.freeMemory),
                  },
                  {
                    name: "App Memory Usage",
                    value: displayMemory(occurrence.systemInfo.appMemoryUsage),
                  },
                  {
                    name: "Device Uptime",
                    value: displayDuration(occurrence.systemInfo.deviceUptime),
                  },
                  {
                    name: "App Uptime",
                    value: displayDuration(occurrence.systemInfo.appUptime),
                  },
                ].map((info) => (
                  <div key={info.name} className="mb-2">
                    <span className="text-grey-600">{info.name}</span>
                    <span className="pl-2 text-white">{info.value}</span>
                  </div>
                ))}
              </div>
            </InfoCard>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function LogBlock({ log }: { log: Occurrence["stderrLogs"][number] }) {
  const lines = log.message.split("\n");
  return (
    <>
      <div>
        <span className="text-primary-400">
          [{moment(log.timestamp).format("ddd MMM DD, YYYY. hh:mm:ss:SSS A")}]
        </span>

        <span className="pl-2 text-grey-600">{stripAnsi(lines[0])}</span>
      </div>

      {lines.slice(1).map((line, index) => (
        <div key={index} className="mt-2 text-grey-600">
          {stripAnsi(line.replace(/\s/g, "\u00A0\u00A0"))}
        </div>
      ))}
    </>
  );
}
