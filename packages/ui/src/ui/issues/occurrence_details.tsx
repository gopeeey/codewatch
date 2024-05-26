import ChevronDownIcon from "@assets/chevron-down.svg";
import ClockIcon from "@assets/clock.svg";
import { Occurrence, SystemInfo } from "@codewatch/types";
import { StdChannelLogWithId } from "@lib/data";
import { displayDuration, displayMemory } from "@lib/utils";
import clsx from "clsx";
import moment from "moment";
import { useState } from "react";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
import { InfoCard } from "./info_card";

type Props = {
  occurrence: Occurrence;
};

const exampleJson = {
  name: "example",
  version: "1.0.0",
  description: "Example",
  number: 123,
  main: "index.js",
  scripts: {
    test: 'echo "Error: no test specified" && exit 1',
  },
  keywords: ["dog", "cat", "cow"],
  author: "",
  license: "ISC",
};

const exampleLogs: StdChannelLogWithId[] = [
  {
    id: "1",
    timestamp: 1716627173037,
    message: `INTERNAL ERROR: Something went wrong\n at main (c:\\Users\\Me\\Documents\\MyApp\\app.js:9:15)\n at Object. (c:\\Users\\Me\\Documents\\MyApp\\app.js:17:1)\n at Module._compile (module.js:460:26)\n at Object.Module._extensions..js (module.js:478:10)\n at Module.load (module.js:355:32)\n at Function.Module._load (module.js:310:12)\n at Function.Module.runMain (module.js:501:10)\n at startup (node.js:129:16)\n at node.js:814:3`,
  },
  {
    id: "2",
    timestamp: 1716627175089,
    message: "Something went wrong just now",
  },
];

const exampleSysInfo: SystemInfo = {
  appMemoryUsage: 1234,
  appUptime: 1234,
  deviceMemory: 789879,
  deviceUptime: 1,
  freeMemory: 1234,
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
            ["custom-shadow"]: open,
          }
        )}
        onClick={() => setOpen((prev) => !prev)}
      >
        <div>
          <h4 className="font-medium text-base">{occurrence.message}</h4>
          <span className="flex text-grey-800 text-[0.76rem] mt-1">
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
          <InfoCard title="Manually Captured Data">
            <JsonView src={exampleJson} />
          </InfoCard>

          <InfoCard title="Stdout logs" className="mt-12">
            <div className="mt-2">
              {exampleLogs.map((log) => (
                <div key={log.id} className="mb-8">
                  <LogBlock log={log} />
                </div>
              ))}
            </div>
          </InfoCard>

          <InfoCard title="Stderr logs" className="mt-12">
            <div className="mt-2">
              {exampleLogs.map((log) => (
                <div key={log.id} className="mb-8">
                  <LogBlock log={log} />
                </div>
              ))}
            </div>
          </InfoCard>

          <InfoCard title="System Info" className="mt-12">
            <div className="py-1">
              {[
                {
                  name: "Device Memory",
                  value: displayMemory(exampleSysInfo.deviceMemory),
                },
                {
                  name: "Free Memory",
                  value: displayMemory(exampleSysInfo.freeMemory),
                },
                {
                  name: "App Memory Usage",
                  value: displayMemory(exampleSysInfo.appMemoryUsage),
                },
                {
                  name: "Device Uptime",
                  value: displayDuration(exampleSysInfo.deviceUptime),
                },
                {
                  name: "App Uptime",
                  value: displayDuration(exampleSysInfo.appUptime),
                },
              ].map((info) => (
                <div key={info.name} className="mb-2">
                  <span className="text-grey-600">{info.name}</span>
                  <span className="pl-2 text-white">{info.value}</span>
                </div>
              ))}
            </div>
          </InfoCard>
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

        <span className="pl-2 text-grey-600">{lines[0]}</span>
      </div>

      {lines.slice(1).map((line, index) => (
        <div key={index} className="pl-4 mt-2 text-grey-600">
          {line}
        </div>
      ))}
    </>
  );
}
