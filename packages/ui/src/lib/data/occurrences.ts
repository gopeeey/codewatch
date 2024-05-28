import {
  GetPaginatedOccurrencesFilters,
  GetPaginatedOccurrencesResponse,
  SystemInfo,
} from "@codewatch/types";
import { HttpClient } from "@lib/http_client";
import { nanoid } from "nanoid";
import { OccurrenceWithId, StdChannelLogWithId } from "./types";

const client = new HttpClient({ baseUrl: "/occurrences" });
const isDev = import.meta.env.MODE === "development";

export async function getOccurrences(filters: GetPaginatedOccurrencesFilters) {
  if (isDev) {
    console.log("Fetching occurrences");
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

    const occurrences: OccurrenceWithId[] = [
      {
        id: nanoid(),
        issueId: "1",
        message: "Something went wrong",
        stderrLogs: exampleLogs,
        stdoutLogs: exampleLogs,
        timestamp: "2024-04-10T13:59:33.021Z",
        extraData: {
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
        },
        systemInfo: exampleSysInfo,
      },
      {
        id: nanoid(),
        issueId: "1",
        message: "Another thing went right though",
        stderrLogs: [],
        stdoutLogs: [],
        timestamp: "2024-04-10T13:59:33.021Z",
        extraData: { foo: "bar" },
        systemInfo: exampleSysInfo,
      },
    ];

    return occurrences;
  } else {
    const res = await client.post<
      GetPaginatedOccurrencesResponse["data"],
      GetPaginatedOccurrencesFilters
    >({
      body: {
        ...filters,
        startDate: new Date(Number(filters.startDate)).toISOString(),
        endDate: new Date(Number(filters.endDate)).toISOString(),
      },
      url: "",
    });

    if (res.error) return null;
    const occurrences: OccurrenceWithId[] = res.data.occurrences.map((occ) => {
      occ.stderrLogs.reverse();
      occ.stdoutLogs.reverse();
      return {
        ...occ,
        id: nanoid(),
        stderrLogs: occ.stderrLogs.map((log) => ({ ...log, id: nanoid() })),
        stdoutLogs: occ.stdoutLogs.map((log) => ({ ...log, id: nanoid() })),
      };
    });
    return occurrences;
  }
}
