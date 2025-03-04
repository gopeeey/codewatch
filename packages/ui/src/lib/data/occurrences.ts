import { HttpClient } from "@lib/http_client";
import { getIsDev } from "@lib/utils";
import {
  GetPaginatedOccurrencesFilters,
  GetPaginatedOccurrencesResponse,
} from "codewatch-core/dist/types";
import { nanoid } from "nanoid";
import { occurrences as testOccurrences } from "./examples";
import { OccurrenceWithId } from "./types";

const client = new HttpClient({ baseUrl: "/occurrences" });
const isDev = getIsDev();

export async function getOccurrences(filters: GetPaginatedOccurrencesFilters) {
  if (isDev) {
    console.log("Fetching occurrences");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    //     const superLongText =
    //       "just adding nonsense to the end of this____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________";

    //     const superWeirdText = `┌───────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
    // │ (index)                   │ Values                                                                                                                                    │
    // ├───────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
    // │ host                      │ [32m'localhost:3000'[39m                                                                                                                          │
    // │ connection                │ [32m'keep-alive'[39m                                                                                                                              │
    // │ cache-control             │ [32m'max-age=0'[39m                                                                                                                               │
    // │ sec-ch-ua                 │ [32m'"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"'[39m                                                                       │
    // │ sec-ch-ua-mobile          │ [32m'?0'[39m                                                                                                                                      │
    // │ sec-ch-ua-platform        │ [32m'"Windows"'[39m                                                                                                                               │
    // │ upgrade-insecure-requests │ [32m'1'[39m                                                                                                                                       │
    // │ user-agent                │ [32m'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'[39m                         │
    // │ accept                    │ [32m'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'[39m │
    // │ sec-fetch-site            │ [32m'none'[39m                                                                                                                                    │
    // │ sec-fetch-mode            │ [32m'navigate'[39m                                                                                                                                │
    // │ sec-fetch-user            │ [32m'?1'[39m                                                                                                                                      │
    // │ sec-fetch-dest            │ [32m'document'[39m                                                                                                                                │
    // │ accept-encoding           │ [32m'gzip, deflate, br, zstd'[39m                                                                                                                 │
    // │ accept-language           │ [32m'en-US,en;q=0.9'[39m                                                                                                                          │
    // │ if-none-match             │ [32m'W/"12-howcZO2GSVRL1FSAZM9fSlQ6ZB0"'[39m                                                                                                      │
    // └───────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘`;
    //     const exampleLogs: StdChannelLogWithId[] = [
    //       {
    //         id: "1",
    //         timestamp: 1716627173037,
    //         message: `INTERNAL ERROR: Something went wrong\n at main (c:\\Users\\Me\\Documents\\MyApp\\app.js:9:15) ${superLongText}\n at Object. (c:\\Users\\Me\\Documents\\MyApp\\app.js:17:1)\n at Module._compile (module.js:460:26)\n at Object.Module._extensions..js (module.js:478:10)\n at Module.load (module.js:355:32)\n at Function.Module._load (module.js:310:12)\n at Function.Module.runMain (module.js:501:10)\n at startup (node.js:129:16)\n at node.js:814:3`,
    //       },
    //       {
    //         id: "2",
    //         timestamp: 1716627175089,
    //         message: superWeirdText,
    //       },
    //     ];

    //     const exampleSysInfo: SystemInfo = {
    //       appMemoryUsage: 1234,
    //       appUptime: 1234,
    //       deviceMemory: 789879,
    //       deviceUptime: 1,
    //       freeMemory: 1234,
    //     };

    //     const occurrences: OccurrenceWithId[] = [
    //       {
    //         id: nanoid(),
    //         issueId: "1",
    //         message: "Something went wrong",
    //         stderrLogs: exampleLogs,
    //         stdoutLogs: exampleLogs,
    //         timestamp: "2024-04-10T13:59:33.021Z",
    //         stack: `Error: Something went wrong\n    at Object.<anonymous> (/home/codewatch) ${superLongText}`,
    //         extraData: {
    //           name: "example",
    //           version: "1.0.0",
    //           description: superLongText,
    //           number: 123,
    //           main: "index.js",
    //           scripts: {
    //             test: 'echo "Error: no test specified" && exit 1',
    //           },
    //           keywords: ["dog", "cat", "cow"],
    //           author: "",
    //           license: "ISC",
    //         },
    //         context: [
    //           ["foo", "bar"],
    //           ["monty", "python"],
    //           ["hello", "world"],
    //           [superLongText, superLongText],
    //         ],
    //         systemInfo: exampleSysInfo,
    //       },
    //       {
    //         id: nanoid(),
    //         issueId: "1",
    //         message: "Another thing went right though",
    //         stderrLogs: [],
    //         stdoutLogs: [],
    //         stack:
    //           "Error: Something went wrong\n    at Object.<anonymous> (/home/codewatch)",
    //         timestamp: "2024-04-10T13:59:33.021Z",
    //         extraData: { foo: "bar" },
    //         context: [
    //           ["foo", "bar"],
    //           ["monty", "python"],
    //           ["hello", "world"],
    //         ],
    //         systemInfo: exampleSysInfo,
    //       },
    //     ];

    //     const empty: OccurrenceWithId[] = [];
    // if (filters.page > 1) return empty;
    return testOccurrences[filters.issueId];
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
