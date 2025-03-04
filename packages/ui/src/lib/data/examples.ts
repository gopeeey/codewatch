import { Issue, Occurrence } from "codewatch-core/dist/types";
import { nanoid } from "nanoid";
import { OccurrenceWithId } from "./types";

export const issues: Issue[] = [
  {
    id: "19",
    fingerprint:
      "59b641780a88f90268e27f6853cfa5c1a2c78290af693b129a8a2a9e18cd640f",
    name: "TypeError",
    totalOccurrences: 2,
    lastOccurrenceTimestamp: "2025-03-04T21:45:44.436Z",
    lastOccurrenceMessage:
      "something.somefunctionthatdoesntexist is not a function",
    archived: false,
    unhandled: true,
    createdAt: "2025-03-04T21:44:16.071Z",
    resolved: false,
    isLog: false,
  },
  {
    id: "18",
    fingerprint:
      "cfe94c813e90b722c3ddb4ef9e11f009db9ee300eda2d617c63db2ff07c73d7b",
    name: "error",
    totalOccurrences: 4,
    lastOccurrenceTimestamp: "2025-03-04T20:48:01.390Z",
    lastOccurrenceMessage: 'relation "books" does not exist',
    archived: false,
    unhandled: false,
    createdAt: "2025-03-04T20:47:59.543Z",
    resolved: false,
    isLog: false,
  },
  {
    id: "17",
    fingerprint:
      "6791e0fee3c1e36ade55dbe73902d5d61a419ee06f10be903ee88ba54d79e7c9",
    name: "Captured Request Headers",
    totalOccurrences: 11,
    lastOccurrenceTimestamp: "2025-03-04T20:47:45.623Z",
    lastOccurrenceMessage: "Some request headers I captured",
    archived: false,
    unhandled: false,
    createdAt: "2025-03-04T20:47:39.520Z",
    resolved: false,
    isLog: true,
  },
  {
    id: "16",
    fingerprint:
      "dcc5c755bc76b68c91637349f02a30843d7f10840506889e1d86de9411a97553",
    name: "SyntaxError",
    totalOccurrences: 9,
    lastOccurrenceTimestamp: "2025-03-04T20:47:31.530Z",
    lastOccurrenceMessage:
      "Unexpected token 'H', \"Hello world\" is not valid JSON",
    archived: false,
    unhandled: false,
    createdAt: "2025-03-04T20:47:20.384Z",
    resolved: false,
    isLog: false,
  },
  {
    id: "15",
    fingerprint:
      "83c7d5c42c22486bc0db6b9d6d1debade5d19bd411d9226d5858baa7645bf12c",
    name: "CustomError",
    totalOccurrences: 1,
    lastOccurrenceTimestamp: "2025-03-04T20:47:07.424Z",
    lastOccurrenceMessage: "Another custom error that has a code",
    archived: false,
    unhandled: false,
    createdAt: "2025-03-04T20:47:07.469Z",
    resolved: false,
    isLog: false,
  },
  {
    id: "14",
    fingerprint:
      "e4c9ced485783938f8a38c1ad61901f2a9752953ae30b1808f9e1ddc5461fe56",
    name: "CustomError",
    totalOccurrences: 1,
    lastOccurrenceTimestamp: "2025-03-04T20:46:57.157Z",
    lastOccurrenceMessage: "This custom error has a code",
    archived: false,
    unhandled: false,
    createdAt: "2025-03-04T20:46:57.197Z",
    resolved: false,
    isLog: false,
  },
  {
    id: "13",
    fingerprint:
      "1af5065cf4a063daf4dc035c87d2370270c52ba6f5768ee05e170c457740ccdf",
    name: "Error",
    totalOccurrences: 4,
    lastOccurrenceTimestamp: "2025-03-04T20:54:48.524Z",
    lastOccurrenceMessage: "This one is not inside a try-catch block",
    archived: false,
    unhandled: false,
    createdAt: "2025-03-04T20:46:36.404Z",
    resolved: false,
    isLog: false,
  },
  {
    id: "12",
    fingerprint:
      "9d28835ef9e3d60b8981f385280b107677de36e93fd892b49a27e34ac4126930",
    name: "Error",
    totalOccurrences: 9,
    lastOccurrenceTimestamp: "2025-03-04T20:46:29.262Z",
    lastOccurrenceMessage: "This is an error with extra data",
    archived: false,
    unhandled: false,
    createdAt: "2025-03-04T20:46:24.733Z",
    resolved: false,
    isLog: false,
  },
  {
    id: "11",
    fingerprint:
      "36c16bc9f6107c42be42e314ad7650c367cf35daf2bd0181b469f2072c8c0ddb",
    name: "Error",
    totalOccurrences: 4,
    lastOccurrenceTimestamp: "2025-03-04T20:46:20.424Z",
    lastOccurrenceMessage: "This is just some normal error",
    archived: false,
    unhandled: false,
    createdAt: "2025-03-04T20:46:13.871Z",
    resolved: false,
    isLog: false,
  },
  {
    id: "10",
    fingerprint:
      "cde0b3649ecf54298def4030efa65306da32c0e6c4af2e52339e97a490764379",
    name: "Error",
    totalOccurrences: 1,
    lastOccurrenceTimestamp: "2025-03-04T20:44:47.703Z",
    lastOccurrenceMessage: "Something went terribly wrong",
    archived: false,
    unhandled: true,
    createdAt: "2025-03-04T20:44:47.705Z",
    resolved: false,
    isLog: false,
  },
];

const superLongText =
  "just adding nonsense to the end of this____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________";

const superWeirdText = `┌───────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ (index)                   │ Values                                                                                                                                    │
├───────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ host                      │ [32m'localhost:3000'[39m                                                                                                                          │
│ connection                │ [32m'keep-alive'[39m                                                                                                                              │
│ cache-control             │ [32m'max-age=0'[39m                                                                                                                               │
│ sec-ch-ua                 │ [32m'"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"'[39m                                                                       │
│ sec-ch-ua-mobile          │ [32m'?0'[39m                                                                                                                                      │
│ sec-ch-ua-platform        │ [32m'"Windows"'[39m                                                                                                                               │
│ upgrade-insecure-requests │ [32m'1'[39m                                                                                                                                       │
│ user-agent                │ [32m'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'[39m                         │
│ accept                    │ [32m'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'[39m │
│ sec-fetch-site            │ [32m'none'[39m                                                                                                                                    │
│ sec-fetch-mode            │ [32m'navigate'[39m                                                                                                                                │
│ sec-fetch-user            │ [32m'?1'[39m                                                                                                                                      │
│ sec-fetch-dest            │ [32m'document'[39m                                                                                                                                │
│ accept-encoding           │ [32m'gzip, deflate, br, zstd'[39m                                                                                                                 │
│ accept-language           │ [32m'en-US,en;q=0.9'[39m                                                                                                                          │
│ if-none-match             │ [32m'W/"12-howcZO2GSVRL1FSAZM9fSlQ6ZB0"'[39m                                                                                                      │
└───────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘`;

const tOccurrences: { [key: string]: Occurrence[] } = {
  10: [
    {
      issueId: "10",

      message: "Something went terribly wrong",
      timestamp: "2025-03-04T20:44:47.703Z",
      stdoutLogs: [
        {
          message: superLongText,
          timestamp: 1741121082733,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121083746,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121084758,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121085760,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121086764,
        },
      ],
      stderrLogs: [
        {
          message:
            "Error: Something went terribly wrong\n    at Timeout._onTimeout \u001b[90m(C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\\u001b[39msrc\\index.ts:68:9\u001b[90m)\u001b[39m\n\u001b[90m    at listOnTimeout (node:internal/timers:573:17)\u001b[39m\n\u001b[90m    at process.processTimers (node:internal/timers:514:7)\u001b[39m",
          timestamp: 1741121087702,
        },
      ],
      stack:
        "Error: Something went terribly wrong\n    at Timeout._onTimeout (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\index.ts:68:9)\n    at listOnTimeout (node:internal/timers:573:17)\n    at process.processTimers (node:internal/timers:514:7)",

      systemInfo: {
        appUptime: 10.5111889,
        freeMemory: 5753573376,
        deviceMemory: 16309932032,
        deviceUptime: 4255.5,
        appMemoryUsage: 57065472,
      },
    },
  ],
  11: [
    {
      issueId: "11",

      message: "This is just some normal error",
      timestamp: "2025-03-04T20:46:20.424Z",
      stdoutLogs: [
        {
          message: superWeirdText,
          timestamp: 1741121176306,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121177322,
        },
        {
          message:
            "\u001b[0mGET /manually-captured \u001b[36m304\u001b[0m 0.782 ms - -\u001b[0m",
          timestamp: 1741121178235,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121178336,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121179351,
        },
        {
          message:
            "\u001b[0mGET /manually-captured \u001b[36m304\u001b[0m 1.238 ms - -\u001b[0m",
          timestamp: 1741121180010,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121180365,
        },
        {
          message:
            "\u001b[0mGET /manually-captured \u001b[36m304\u001b[0m 0.570 ms - -\u001b[0m",
          timestamp: 1741121180425,
        },
      ],
      stderrLogs: [],
      stack:
        "Error: This is just some normal error\n    at manuallyCaptured (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:56:13)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:280:10)\n    at Function.handle (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:175:3)",

      systemInfo: {
        appUptime: 46.9928892,
        freeMemory: 5628612608,
        deviceMemory: 16309932032,
        deviceUptime: 4348.203,
        appMemoryUsage: 58814464,
      },
    },
    {
      issueId: "11",

      message: "This is just some normal error",
      timestamp: "2025-03-04T20:46:20.009Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121175293,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121176306,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121177322,
        },
        {
          message:
            "\u001b[0mGET /manually-captured \u001b[36m304\u001b[0m 0.782 ms - -\u001b[0m",
          timestamp: 1741121178235,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121178336,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121179351,
        },
        {
          message:
            "\u001b[0mGET /manually-captured \u001b[36m304\u001b[0m 1.238 ms - -\u001b[0m",
          timestamp: 1741121180010,
        },
      ],
      stderrLogs: [],
      stack:
        "Error: This is just some normal error\n    at manuallyCaptured (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:56:13)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:280:10)\n    at Function.handle (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:175:3)",

      systemInfo: {
        appUptime: 46.5785641,
        freeMemory: 5640073216,
        deviceMemory: 16309932032,
        deviceUptime: 4347.781,
        appMemoryUsage: 58617856,
      },
    },
    {
      issueId: "11",

      message: "This is just some normal error",
      timestamp: "2025-03-04T20:46:18.234Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121173265,
        },
        {
          message:
            "\u001b[0mGET /manually-captured \u001b[32m200\u001b[0m 5.576 ms - 18\u001b[0m",
          timestamp: 1741121173827,
        },
        {
          message:
            "\u001b[0mGET /favicon.ico \u001b[33m404\u001b[0m 2.042 ms - 150\u001b[0m",
          timestamp: 1741121173876,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121174280,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121175293,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121176306,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121177322,
        },
        {
          message:
            "\u001b[0mGET /manually-captured \u001b[36m304\u001b[0m 0.782 ms - -\u001b[0m",
          timestamp: 1741121178235,
        },
      ],
      stderrLogs: [],
      stack:
        "Error: This is just some normal error\n    at manuallyCaptured (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:56:13)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:280:10)\n    at Function.handle (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:175:3)",

      systemInfo: {
        appUptime: 44.8034936,
        freeMemory: 5590327296,
        deviceMemory: 16309932032,
        deviceUptime: 4346.015,
        appMemoryUsage: 58089472,
      },
    },
    {
      issueId: "11",

      message: "This is just some normal error",
      timestamp: "2025-03-04T20:46:13.821Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121169225,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121170238,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121171239,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121172252,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121173265,
        },
        {
          message:
            "\u001b[0mGET /manually-captured \u001b[32m200\u001b[0m 5.576 ms - 18\u001b[0m",
          timestamp: 1741121173827,
        },
        {
          message:
            "\u001b[0mGET /favicon.ico \u001b[33m404\u001b[0m 2.042 ms - 150\u001b[0m",
          timestamp: 1741121173876,
        },
      ],
      stderrLogs: [],
      stack:
        "Error: This is just some normal error\n    at manuallyCaptured (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:56:13)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:280:10)\n    at Function.handle (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:175:3)",

      systemInfo: {
        appUptime: 40.4511498,
        freeMemory: 5576228864,
        deviceMemory: 16309932032,
        deviceUptime: 4341.656,
        appMemoryUsage: 57864192,
      },
    },
  ],
  12: [
    {
      issueId: "12",

      message: "This is an error with extra data",
      timestamp: "2025-03-04T20:46:29.262Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121184393,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[32m200\u001b[0m 1.147 ms - 18\u001b[0m",
          timestamp: 1741121184733,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121185403,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.763 ms - -\u001b[0m",
          timestamp: 1741121186395,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121186417,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.588 ms - -\u001b[0m",
          timestamp: 1741121187063,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.572 ms - -\u001b[0m",
          timestamp: 1741121187379,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121187424,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.689 ms - -\u001b[0m",
          timestamp: 1741121187613,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 1.054 ms - -\u001b[0m",
          timestamp: 1741121187773,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.906 ms - -\u001b[0m",
          timestamp: 1741121187945,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.587 ms - -\u001b[0m",
          timestamp: 1741121188115,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121188439,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.695 ms - -\u001b[0m",
          timestamp: 1741121189263,
        },
      ],
      stderrLogs: [],
      stack:
        "Error: This is an error with extra data\n    at withExtraData (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:66:13)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:280:10)\n    at Function.handle (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:175:3)",
      extraData: {
        foo: "bar",
        requestUrl: "/with-extra-data",
      },
      systemInfo: {
        appUptime: 55.8310622,
        freeMemory: 5648257024,
        deviceMemory: 16309932032,
        deviceUptime: 4357.031,
        appMemoryUsage: 58298368,
      },
    },
    {
      issueId: "12",

      message: "This is an error with extra data",
      timestamp: "2025-03-04T20:46:28.114Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121183389,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121184393,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[32m200\u001b[0m 1.147 ms - 18\u001b[0m",
          timestamp: 1741121184733,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121185403,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.763 ms - -\u001b[0m",
          timestamp: 1741121186395,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121186417,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.588 ms - -\u001b[0m",
          timestamp: 1741121187063,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.572 ms - -\u001b[0m",
          timestamp: 1741121187379,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121187424,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.689 ms - -\u001b[0m",
          timestamp: 1741121187613,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 1.054 ms - -\u001b[0m",
          timestamp: 1741121187773,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.906 ms - -\u001b[0m",
          timestamp: 1741121187945,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.587 ms - -\u001b[0m",
          timestamp: 1741121188115,
        },
      ],
      stderrLogs: [],
      stack:
        "Error: This is an error with extra data\n    at withExtraData (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:66:13)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:280:10)\n    at Function.handle (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:175:3)",
      extraData: {
        foo: "bar",
        requestUrl: "/with-extra-data",
      },
      systemInfo: {
        appUptime: 54.6834606,
        freeMemory: 5665222656,
        deviceMemory: 16309932032,
        deviceUptime: 4355.89,
        appMemoryUsage: 58073088,
      },
    },
    {
      issueId: "12",

      message: "This is an error with extra data",
      timestamp: "2025-03-04T20:46:27.944Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121183389,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121184393,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[32m200\u001b[0m 1.147 ms - 18\u001b[0m",
          timestamp: 1741121184733,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121185403,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.763 ms - -\u001b[0m",
          timestamp: 1741121186395,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121186417,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.588 ms - -\u001b[0m",
          timestamp: 1741121187063,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.572 ms - -\u001b[0m",
          timestamp: 1741121187379,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121187424,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.689 ms - -\u001b[0m",
          timestamp: 1741121187613,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 1.054 ms - -\u001b[0m",
          timestamp: 1741121187773,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.906 ms - -\u001b[0m",
          timestamp: 1741121187945,
        },
      ],
      stderrLogs: [],
      stack:
        "Error: This is an error with extra data\n    at withExtraData (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:66:13)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:280:10)\n    at Function.handle (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:175:3)",
      extraData: {
        foo: "bar",
        requestUrl: "/with-extra-data",
      },
      systemInfo: {
        appUptime: 54.5132049,
        freeMemory: 5665861632,
        deviceMemory: 16309932032,
        deviceUptime: 4355.718,
        appMemoryUsage: 57921536,
      },
    },
    {
      issueId: "12",

      message: "This is an error with extra data",
      timestamp: "2025-03-04T20:46:27.772Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121183389,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121184393,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[32m200\u001b[0m 1.147 ms - 18\u001b[0m",
          timestamp: 1741121184733,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121185403,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.763 ms - -\u001b[0m",
          timestamp: 1741121186395,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121186417,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.588 ms - -\u001b[0m",
          timestamp: 1741121187063,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.572 ms - -\u001b[0m",
          timestamp: 1741121187379,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121187424,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.689 ms - -\u001b[0m",
          timestamp: 1741121187613,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 1.054 ms - -\u001b[0m",
          timestamp: 1741121187773,
        },
      ],
      stderrLogs: [],
      stack:
        "Error: This is an error with extra data\n    at withExtraData (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:66:13)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:280:10)\n    at Function.handle (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:175:3)",
      extraData: {
        foo: "bar",
        requestUrl: "/with-extra-data",
      },
      systemInfo: {
        appUptime: 54.341009,
        freeMemory: 5666418688,
        deviceMemory: 16309932032,
        deviceUptime: 4355.546,
        appMemoryUsage: 58675200,
      },
    },
    {
      issueId: "12",

      message: "This is an error with extra data",
      timestamp: "2025-03-04T20:46:27.613Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121183389,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121184393,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[32m200\u001b[0m 1.147 ms - 18\u001b[0m",
          timestamp: 1741121184733,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121185403,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.763 ms - -\u001b[0m",
          timestamp: 1741121186395,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121186417,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.588 ms - -\u001b[0m",
          timestamp: 1741121187063,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.572 ms - -\u001b[0m",
          timestamp: 1741121187379,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121187424,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.689 ms - -\u001b[0m",
          timestamp: 1741121187613,
        },
      ],
      stderrLogs: [],
      stack:
        "Error: This is an error with extra data\n    at withExtraData (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:66:13)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:280:10)\n    at Function.handle (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:175:3)",
      extraData: {
        foo: "bar",
        requestUrl: "/with-extra-data",
      },
      systemInfo: {
        appUptime: 54.1815947,
        freeMemory: 5663768576,
        deviceMemory: 16309932032,
        deviceUptime: 4355.39,
        appMemoryUsage: 58658816,
      },
    },
    {
      issueId: "12",

      message: "This is an error with extra data",
      timestamp: "2025-03-04T20:46:27.378Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121183389,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121184393,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[32m200\u001b[0m 1.147 ms - 18\u001b[0m",
          timestamp: 1741121184733,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121185403,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.763 ms - -\u001b[0m",
          timestamp: 1741121186395,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121186417,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.588 ms - -\u001b[0m",
          timestamp: 1741121187063,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.572 ms - -\u001b[0m",
          timestamp: 1741121187379,
        },
      ],
      stderrLogs: [],
      stack:
        "Error: This is an error with extra data\n    at withExtraData (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:66:13)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:280:10)\n    at Function.handle (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:175:3)",
      extraData: {
        foo: "bar",
        requestUrl: "/with-extra-data",
      },
      systemInfo: {
        appUptime: 53.9470551,
        freeMemory: 5678874624,
        deviceMemory: 16309932032,
        deviceUptime: 4355.156,
        appMemoryUsage: 58638336,
      },
    },
    {
      issueId: "12",

      message: "This is an error with extra data",
      timestamp: "2025-03-04T20:46:27.062Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121182376,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121183389,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121184393,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[32m200\u001b[0m 1.147 ms - 18\u001b[0m",
          timestamp: 1741121184733,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121185403,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.763 ms - -\u001b[0m",
          timestamp: 1741121186395,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121186417,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.588 ms - -\u001b[0m",
          timestamp: 1741121187063,
        },
      ],
      stderrLogs: [],
      stack:
        "Error: This is an error with extra data\n    at withExtraData (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:66:13)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:280:10)\n    at Function.handle (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:175:3)",
      extraData: {
        foo: "bar",
        requestUrl: "/with-extra-data",
      },
      systemInfo: {
        appUptime: 53.6309872,
        freeMemory: 5661396992,
        deviceMemory: 16309932032,
        deviceUptime: 4354.843,
        appMemoryUsage: 58621952,
      },
    },
    {
      issueId: "12",

      message: "This is an error with extra data",
      timestamp: "2025-03-04T20:46:26.394Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121182376,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121183389,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121184393,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[32m200\u001b[0m 1.147 ms - 18\u001b[0m",
          timestamp: 1741121184733,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121185403,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[36m304\u001b[0m 0.763 ms - -\u001b[0m",
          timestamp: 1741121186395,
        },
      ],
      stderrLogs: [],
      stack:
        "Error: This is an error with extra data\n    at withExtraData (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:66:13)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:280:10)\n    at Function.handle (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:175:3)",
      extraData: {
        foo: "bar",
        requestUrl: "/with-extra-data",
      },
      systemInfo: {
        appUptime: 52.963857,
        freeMemory: 5677346816,
        deviceMemory: 16309932032,
        deviceUptime: 4354.171,
        appMemoryUsage: 58613760,
      },
    },
    {
      issueId: "12",

      message: "This is an error with extra data",
      timestamp: "2025-03-04T20:46:24.731Z",
      stdoutLogs: [
        {
          message:
            "\u001b[0mGET /manually-captured \u001b[36m304\u001b[0m 1.238 ms - -\u001b[0m",
          timestamp: 1741121180010,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121180365,
        },
        {
          message:
            "\u001b[0mGET /manually-captured \u001b[36m304\u001b[0m 0.570 ms - -\u001b[0m",
          timestamp: 1741121180425,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121181375,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121182376,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121183389,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121184393,
        },
        {
          message:
            "\u001b[0mGET /with-extra-data \u001b[32m200\u001b[0m 1.147 ms - 18\u001b[0m",
          timestamp: 1741121184733,
        },
      ],
      stderrLogs: [],
      stack:
        "Error: This is an error with extra data\n    at withExtraData (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:66:13)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:280:10)\n    at Function.handle (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:175:3)",
      extraData: {
        foo: "bar",
        requestUrl: "/with-extra-data",
      },
      systemInfo: {
        appUptime: 51.3016856,
        freeMemory: 5666213888,
        deviceMemory: 16309932032,
        deviceUptime: 4352.515,
        appMemoryUsage: 59002880,
      },
    },
  ],
  13: [
    {
      issueId: "13",

      message:
        "This one is not inside a try-catch block but is captured by custom middleware",
      timestamp: "2025-03-04T21:27:34.566Z",
      stdoutLogs: [
        {
          message:
            "\u001b[0mGET /unhandled \u001b[32m200\u001b[0m 4.441 ms - 77\u001b[0m",
          timestamp: 1741123654570,
        },
      ],
      stderrLogs: [],
      stack:
        "Error: This one is not inside a try-catch block but is captured by custom middleware\n    at unhandled (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:75:11)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:280:10)\n    at Function.handle (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:175:3)",

      systemInfo: {
        appUptime: 7.878613,
        freeMemory: 3647954944,
        deviceMemory: 16309932032,
        deviceUptime: 6822.343,
        appMemoryUsage: 72540160,
      },
      context: [
        ["req.method", "GET"],
        ["req.originalUrl", "/unhandled"],
        ["req.hostname", "localhost"],
        ["req.path", "/unhandled"],
        ["req.protocol", "http"],
        ["req.ip", "::1"],
      ],
    },
    {
      issueId: "13",

      message: "This one is not inside a try-catch block",
      timestamp: "2025-03-04T20:54:48.524Z",
      stdoutLogs: [
        {
          message: "Server listening on port 3000",
          timestamp: 1741121685544,
        },
        {
          message:
            "\u001b[0mGET /unhandled \u001b[32m200\u001b[0m 4.246 ms - 40\u001b[0m",
          timestamp: 1741121686027,
        },
        {
          message:
            "\u001b[0mGET /unhandled \u001b[36m304\u001b[0m 1.584 ms - -\u001b[0m",
          timestamp: 1741121688526,
        },
      ],
      stderrLogs: [],
      stack:
        "Error: This one is not inside a try-catch block\n    at unhandled (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:75:11)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:280:10)\n    at Function.handle (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:175:3)",

      systemInfo: {
        appUptime: 3.4562722,
        freeMemory: 5659230208,
        deviceMemory: 16309932032,
        deviceUptime: 4856.296,
        appMemoryUsage: 73031680,
      },
      context: [
        ["req.method", "GET"],
        ["req.originalUrl", "/unhandled"],
        ["req.hostname", "localhost"],
        ["req.path", "/unhandled"],
        ["req.protocol", "http"],
        ["req.ip", "::1"],
      ],
    },
    {
      issueId: "13",

      message: "This one is not inside a try-catch block",
      timestamp: "2025-03-04T20:54:46.023Z",
      stdoutLogs: [
        {
          message: "Server listening on port 3000",
          timestamp: 1741121685544,
        },
        {
          message:
            "\u001b[0mGET /unhandled \u001b[32m200\u001b[0m 4.246 ms - 40\u001b[0m",
          timestamp: 1741121686027,
        },
      ],
      stderrLogs: [],
      stack:
        "Error: This one is not inside a try-catch block\n    at unhandled (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:75:11)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:280:10)\n    at Function.handle (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:175:3)",

      systemInfo: {
        appUptime: 0.964112,
        freeMemory: 5657067520,
        deviceMemory: 16309932032,
        deviceUptime: 4853.812,
        appMemoryUsage: 72880128,
      },
      context: [
        ["req.method", "GET"],
        ["req.originalUrl", "/unhandled"],
        ["req.hostname", "localhost"],
        ["req.path", "/unhandled"],
        ["req.protocol", "http"],
        ["req.ip", "::1"],
      ],
    },
    {
      issueId: "13",

      message: "This one is not inside a try-catch block",
      timestamp: "2025-03-04T20:46:43.504Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121198516,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121199520,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121200526,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121201525,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121202538,
        },
        {
          message:
            "\u001b[0mGET /unhandled \u001b[36m304\u001b[0m 0.729 ms - -\u001b[0m",
          timestamp: 1741121203505,
        },
      ],
      stderrLogs: [],
      stack:
        "Error: This one is not inside a try-catch block\n    at unhandled (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:75:11)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:280:10)\n    at Function.handle (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:175:3)",

      systemInfo: {
        appUptime: 70.0737685,
        freeMemory: 5745512448,
        deviceMemory: 16309932032,
        deviceUptime: 4371.281,
        appMemoryUsage: 58064896,
      },
      context: [
        ["req.method", "GET"],
        ["req.originalUrl", "/unhandled"],
        ["req.hostname", "localhost"],
        ["req.path", "/unhandled"],
        ["req.protocol", "http"],
        ["req.ip", "::1"],
      ],
    },
    {
      issueId: "13",

      message: "This one is not inside a try-catch block",
      timestamp: "2025-03-04T20:46:36.403Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121190454,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121191457,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121192457,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121193459,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121194473,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121195487,
        },
        {
          message:
            "\u001b[0mGET /unhandled \u001b[32m200\u001b[0m 1.243 ms - 40\u001b[0m",
          timestamp: 1741121196404,
        },
      ],
      stderrLogs: [],
      stack:
        "Error: This one is not inside a try-catch block\n    at unhandled (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:75:11)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:280:10)\n    at Function.handle (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:175:3)",

      systemInfo: {
        appUptime: 62.9722987,
        freeMemory: 5703270400,
        deviceMemory: 16309932032,
        deviceUptime: 4364.171,
        appMemoryUsage: 58486784,
      },
      context: [
        ["req.method", "GET"],
        ["req.originalUrl", "/unhandled"],
        ["req.hostname", "localhost"],
        ["req.path", "/unhandled"],
        ["req.protocol", "http"],
        ["req.ip", "::1"],
      ],
    },
  ],
  14: [
    {
      issueId: "14",

      message: "This custom error has a code",
      timestamp: "2025-03-04T20:46:57.157Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121212598,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121213602,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121214617,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121215618,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121216630,
        },
        {
          message: "[0mGET /custom-error [32m200[0m 1.035 ms - 28[0m",
          timestamp: 1741121217159,
        },
      ],
      stderrLogs: [],
      stack:
        "CustomError: This custom error has a code\n    at customError (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:80:11)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:280:10)\n    at Function.handle (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:175:3)",
      extraData: {
        customErrorProps: {
          code: 401,
          devMessage: "Use this to solve the error",
        },
      },
      systemInfo: {
        appUptime: 83.7754398,
        freeMemory: 5858639872,
        deviceMemory: 16309932032,
        deviceUptime: 4384.984,
        appMemoryUsage: 58544128,
      },
      context: [
        ["req.method", "GET"],
        ["req.originalUrl", "/custom-error"],
        ["req.hostname", "localhost"],
        ["req.path", "/custom-error"],
        ["req.protocol", "http"],
        ["req.ip", "::1"],
      ],
    },
  ],
  15: [
    {
      issueId: "15",

      message: "Another custom error that has a code",
      timestamp: "2025-03-04T20:47:07.424Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121222672,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121223674,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121224682,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121225696,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121226698,
        },
        {
          message: "[0mGET /custom-error-handled [32m200[0m 1.007 ms - 18[0m",
          timestamp: 1741121227426,
        },
      ],
      stderrLogs: [],
      stack:
        "CustomError: Another custom error that has a code\n    at customErrorHandled (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:90:13)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:280:10)\n    at Function.handle (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:175:3)",
      extraData: {
        customErrorProps: {
          code: 500,
          devMessage:
            "Special message to the person looking at this for solving the error",
        },
      },
      systemInfo: {
        appUptime: 94.0472009,
        freeMemory: 5868269568,
        deviceMemory: 16309932032,
        deviceUptime: 4395.25,
        appMemoryUsage: 57901056,
      },
    },
  ],
  16: [
    {
      issueId: "16",

      message: "Unexpected token 'H', \"Hello world\" is not valid JSON",
      timestamp: "2025-03-04T20:47:31.530Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121246864,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121247864,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121248868,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.976 ms - -[0m",
          timestamp: 1741121249261,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.855 ms - -[0m",
          timestamp: 1741121249833,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121249869,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.764 ms - -[0m",
          timestamp: 1741121250030,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.763 ms - -[0m",
          timestamp: 1741121250205,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.902 ms - -[0m",
          timestamp: 1741121250361,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121250881,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.862 ms - -[0m",
          timestamp: 1741121251201,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.707 ms - -[0m",
          timestamp: 1741121251352,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.709 ms - -[0m",
          timestamp: 1741121251531,
        },
      ],
      stderrLogs: [],
      stack:
        "SyntaxError: Unexpected token 'H', \"Hello world\" is not valid JSON\n    at JSON.parse (<anonymous>)\n    at parseJson (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\utils.ts:2:15)\n    at errorFromAnotherPlanet (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:103:14)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)",

      systemInfo: {
        appUptime: 118.0990775,
        freeMemory: 5891596288,
        deviceMemory: 16309932032,
        deviceUptime: 4419.312,
        appMemoryUsage: 59113472,
      },
      context: [
        ["req.method", "GET"],
        ["req.originalUrl", "/error-from-another-planet"],
        ["req.hostname", "localhost"],
        ["req.path", "/error-from-another-planet"],
        ["req.protocol", "http"],
        ["req.ip", "::1"],
      ],
    },
    {
      issueId: "16",

      message: "Unexpected token 'H', \"Hello world\" is not valid JSON",
      timestamp: "2025-03-04T20:47:31.352Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121246864,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121247864,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121248868,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.976 ms - -[0m",
          timestamp: 1741121249261,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.855 ms - -[0m",
          timestamp: 1741121249833,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121249869,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.764 ms - -[0m",
          timestamp: 1741121250030,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.763 ms - -[0m",
          timestamp: 1741121250205,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.902 ms - -[0m",
          timestamp: 1741121250361,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121250881,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.862 ms - -[0m",
          timestamp: 1741121251201,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.707 ms - -[0m",
          timestamp: 1741121251352,
        },
      ],
      stderrLogs: [],
      stack:
        "SyntaxError: Unexpected token 'H', \"Hello world\" is not valid JSON\n    at JSON.parse (<anonymous>)\n    at parseJson (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\utils.ts:2:15)\n    at errorFromAnotherPlanet (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:103:14)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)",

      systemInfo: {
        appUptime: 117.9205067,
        freeMemory: 5894995968,
        deviceMemory: 16309932032,
        deviceUptime: 4419.125,
        appMemoryUsage: 59113472,
      },
      context: [
        ["req.method", "GET"],
        ["req.originalUrl", "/error-from-another-planet"],
        ["req.hostname", "localhost"],
        ["req.path", "/error-from-another-planet"],
        ["req.protocol", "http"],
        ["req.ip", "::1"],
      ],
    },
    {
      issueId: "16",

      message: "Unexpected token 'H', \"Hello world\" is not valid JSON",
      timestamp: "2025-03-04T20:47:31.201Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121246864,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121247864,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121248868,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.976 ms - -[0m",
          timestamp: 1741121249261,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.855 ms - -[0m",
          timestamp: 1741121249833,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121249869,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.764 ms - -[0m",
          timestamp: 1741121250030,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.763 ms - -[0m",
          timestamp: 1741121250205,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.902 ms - -[0m",
          timestamp: 1741121250361,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121250881,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.862 ms - -[0m",
          timestamp: 1741121251201,
        },
      ],
      stderrLogs: [],
      stack:
        "SyntaxError: Unexpected token 'H', \"Hello world\" is not valid JSON\n    at JSON.parse (<anonymous>)\n    at parseJson (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\utils.ts:2:15)\n    at errorFromAnotherPlanet (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:103:14)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)",

      systemInfo: {
        appUptime: 117.7695152,
        freeMemory: 5877514240,
        deviceMemory: 16309932032,
        deviceUptime: 4418.968,
        appMemoryUsage: 59863040,
      },
      context: [
        ["req.method", "GET"],
        ["req.originalUrl", "/error-from-another-planet"],
        ["req.hostname", "localhost"],
        ["req.path", "/error-from-another-planet"],
        ["req.protocol", "http"],
        ["req.ip", "::1"],
      ],
    },
    {
      issueId: "16",

      message: "Unexpected token 'H', \"Hello world\" is not valid JSON",
      timestamp: "2025-03-04T20:47:30.360Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121245855,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121246864,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121247864,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121248868,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.976 ms - -[0m",
          timestamp: 1741121249261,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.855 ms - -[0m",
          timestamp: 1741121249833,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121249869,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.764 ms - -[0m",
          timestamp: 1741121250030,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.763 ms - -[0m",
          timestamp: 1741121250205,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.902 ms - -[0m",
          timestamp: 1741121250361,
        },
      ],
      stderrLogs: [],
      stack:
        "SyntaxError: Unexpected token 'H', \"Hello world\" is not valid JSON\n    at JSON.parse (<anonymous>)\n    at parseJson (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\utils.ts:2:15)\n    at errorFromAnotherPlanet (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:103:14)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)",

      systemInfo: {
        appUptime: 116.9294834,
        freeMemory: 5891272704,
        deviceMemory: 16309932032,
        deviceUptime: 4418.14,
        appMemoryUsage: 59703296,
      },
      context: [
        ["req.method", "GET"],
        ["req.originalUrl", "/error-from-another-planet"],
        ["req.hostname", "localhost"],
        ["req.path", "/error-from-another-planet"],
        ["req.protocol", "http"],
        ["req.ip", "::1"],
      ],
    },
    {
      issueId: "16",

      message: "Unexpected token 'H', \"Hello world\" is not valid JSON",
      timestamp: "2025-03-04T20:47:30.204Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121245855,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121246864,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121247864,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121248868,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.976 ms - -[0m",
          timestamp: 1741121249261,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.855 ms - -[0m",
          timestamp: 1741121249833,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121249869,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.764 ms - -[0m",
          timestamp: 1741121250030,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.763 ms - -[0m",
          timestamp: 1741121250205,
        },
      ],
      stderrLogs: [],
      stack:
        "SyntaxError: Unexpected token 'H', \"Hello world\" is not valid JSON\n    at JSON.parse (<anonymous>)\n    at parseJson (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\utils.ts:2:15)\n    at errorFromAnotherPlanet (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:103:14)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)",

      systemInfo: {
        appUptime: 116.7729151,
        freeMemory: 5891633152,
        deviceMemory: 16309932032,
        deviceUptime: 4417.984,
        appMemoryUsage: 59514880,
      },
      context: [
        ["req.method", "GET"],
        ["req.originalUrl", "/error-from-another-planet"],
        ["req.hostname", "localhost"],
        ["req.path", "/error-from-another-planet"],
        ["req.protocol", "http"],
        ["req.ip", "::1"],
      ],
    },
    {
      issueId: "16",

      message: "Unexpected token 'H', \"Hello world\" is not valid JSON",
      timestamp: "2025-03-04T20:47:30.029Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121245855,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121246864,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121247864,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121248868,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.976 ms - -[0m",
          timestamp: 1741121249261,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.855 ms - -[0m",
          timestamp: 1741121249833,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121249869,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.764 ms - -[0m",
          timestamp: 1741121250030,
        },
      ],
      stderrLogs: [],
      stack:
        "SyntaxError: Unexpected token 'H', \"Hello world\" is not valid JSON\n    at JSON.parse (<anonymous>)\n    at parseJson (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\utils.ts:2:15)\n    at errorFromAnotherPlanet (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:103:14)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)",

      systemInfo: {
        appUptime: 116.5980678,
        freeMemory: 5890973696,
        deviceMemory: 16309932032,
        deviceUptime: 4417.812,
        appMemoryUsage: 59318272,
      },
      context: [
        ["req.method", "GET"],
        ["req.originalUrl", "/error-from-another-planet"],
        ["req.hostname", "localhost"],
        ["req.path", "/error-from-another-planet"],
        ["req.protocol", "http"],
        ["req.ip", "::1"],
      ],
    },
    {
      issueId: "16",

      message: "Unexpected token 'H', \"Hello world\" is not valid JSON",
      timestamp: "2025-03-04T20:47:29.832Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121244853,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121245855,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121246864,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121247864,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121248868,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.976 ms - -[0m",
          timestamp: 1741121249261,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.855 ms - -[0m",
          timestamp: 1741121249833,
        },
      ],
      stderrLogs: [],
      stack:
        "SyntaxError: Unexpected token 'H', \"Hello world\" is not valid JSON\n    at JSON.parse (<anonymous>)\n    at parseJson (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\utils.ts:2:15)\n    at errorFromAnotherPlanet (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:103:14)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)",

      systemInfo: {
        appUptime: 116.4015797,
        freeMemory: 5891702784,
        deviceMemory: 16309932032,
        deviceUptime: 4417.609,
        appMemoryUsage: 59162624,
      },
      context: [
        ["req.method", "GET"],
        ["req.originalUrl", "/error-from-another-planet"],
        ["req.hostname", "localhost"],
        ["req.path", "/error-from-another-planet"],
        ["req.protocol", "http"],
        ["req.ip", "::1"],
      ],
    },
    {
      issueId: "16",

      message: "Unexpected token 'H', \"Hello world\" is not valid JSON",
      timestamp: "2025-03-04T20:47:29.260Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121244853,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121245855,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121246864,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121247864,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121248868,
        },
        {
          message: "[0mGET /error-from-another-planet [36m304[0m 0.976 ms - -[0m",
          timestamp: 1741121249261,
        },
      ],
      stderrLogs: [],
      stack:
        "SyntaxError: Unexpected token 'H', \"Hello world\" is not valid JSON\n    at JSON.parse (<anonymous>)\n    at parseJson (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\utils.ts:2:15)\n    at errorFromAnotherPlanet (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:103:14)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)",

      systemInfo: {
        appUptime: 115.8292676,
        freeMemory: 5891125248,
        deviceMemory: 16309932032,
        deviceUptime: 4417.031,
        appMemoryUsage: 58761216,
      },
      context: [
        ["req.method", "GET"],
        ["req.originalUrl", "/error-from-another-planet"],
        ["req.hostname", "localhost"],
        ["req.path", "/error-from-another-planet"],
        ["req.protocol", "http"],
        ["req.ip", "::1"],
      ],
    },
    {
      issueId: "16",

      message: "Unexpected token 'H', \"Hello world\" is not valid JSON",
      timestamp: "2025-03-04T20:47:20.343Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121235781,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121236794,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121237800,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121238810,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121239812,
        },
        {
          message: "[0mGET /error-from-another-planet [32m200[0m 1.274 ms - 53[0m",
          timestamp: 1741121240344,
        },
      ],
      stderrLogs: [],
      stack:
        "SyntaxError: Unexpected token 'H', \"Hello world\" is not valid JSON\n    at JSON.parse (<anonymous>)\n    at parseJson (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\utils.ts:2:15)\n    at errorFromAnotherPlanet (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:103:14)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)",

      systemInfo: {
        appUptime: 106.9612254,
        freeMemory: 5862952960,
        deviceMemory: 16309932032,
        deviceUptime: 4408.171,
        appMemoryUsage: 58384384,
      },
      context: [
        ["req.method", "GET"],
        ["req.originalUrl", "/error-from-another-planet"],
        ["req.hostname", "localhost"],
        ["req.path", "/error-from-another-planet"],
        ["req.protocol", "http"],
        ["req.ip", "::1"],
      ],
    },
  ],
  17: [
    {
      issueId: "17",

      message: "Some request headers I captured",
      timestamp: "2025-03-04T20:47:45.623Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121260972,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.670 ms - -[0m",
          timestamp: 1741121261191,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121261986,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.679 ms - -[0m",
          timestamp: 1741121262046,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 1.098 ms - -[0m",
          timestamp: 1741121262193,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.628 ms - -[0m",
          timestamp: 1741121262357,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.654 ms - -[0m",
          timestamp: 1741121262555,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121262989,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.625 ms - -[0m",
          timestamp: 1741121263632,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121264003,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.639 ms - -[0m",
          timestamp: 1741121264614,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.820 ms - -[0m",
          timestamp: 1741121264800,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.656 ms - -[0m",
          timestamp: 1741121264986,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121265016,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.768 ms - -[0m",
          timestamp: 1741121265624,
        },
      ],
      stderrLogs: [],
      stack:
        "Captured Request Headers: Some request headers I captured\n    at capturedData (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:108:5)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)",
      extraData: {
        host: "localhost:3000",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "sec-ch-ua":
          '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        connection: "keep-alive",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        "cache-control": "max-age=0",
        "if-none-match": 'W/"12-howcZO2GSVRL1FSAZM9fSlQ6ZB0"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "upgrade-insecure-requests": "1",
      },
      systemInfo: {
        appUptime: 132.1926557,
        freeMemory: 5827719168,
        deviceMemory: 16309932032,
        deviceUptime: 4433.39,
        appMemoryUsage: 60489728,
      },
    },
    {
      issueId: "17",

      message: "Some request headers I captured",
      timestamp: "2025-03-04T20:47:44.985Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121260972,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.670 ms - -[0m",
          timestamp: 1741121261191,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121261986,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.679 ms - -[0m",
          timestamp: 1741121262046,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 1.098 ms - -[0m",
          timestamp: 1741121262193,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.628 ms - -[0m",
          timestamp: 1741121262357,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.654 ms - -[0m",
          timestamp: 1741121262555,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121262989,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.625 ms - -[0m",
          timestamp: 1741121263632,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121264003,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.639 ms - -[0m",
          timestamp: 1741121264614,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.820 ms - -[0m",
          timestamp: 1741121264800,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.656 ms - -[0m",
          timestamp: 1741121264986,
        },
      ],
      stderrLogs: [],
      stack:
        "Captured Request Headers: Some request headers I captured\n    at capturedData (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:108:5)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)",
      extraData: {
        host: "localhost:3000",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "sec-ch-ua":
          '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        connection: "keep-alive",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        "cache-control": "max-age=0",
        "if-none-match": 'W/"12-howcZO2GSVRL1FSAZM9fSlQ6ZB0"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "upgrade-insecure-requests": "1",
      },
      systemInfo: {
        appUptime: 131.5543007,
        freeMemory: 5842706432,
        deviceMemory: 16309932032,
        deviceUptime: 4432.765,
        appMemoryUsage: 60235776,
      },
    },
    {
      issueId: "17",

      message: "Some request headers I captured",
      timestamp: "2025-03-04T20:47:44.799Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121259957,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121260972,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.670 ms - -[0m",
          timestamp: 1741121261191,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121261986,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.679 ms - -[0m",
          timestamp: 1741121262046,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 1.098 ms - -[0m",
          timestamp: 1741121262193,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.628 ms - -[0m",
          timestamp: 1741121262357,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.654 ms - -[0m",
          timestamp: 1741121262555,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121262989,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.625 ms - -[0m",
          timestamp: 1741121263632,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121264003,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.639 ms - -[0m",
          timestamp: 1741121264614,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.820 ms - -[0m",
          timestamp: 1741121264800,
        },
      ],
      stderrLogs: [],
      stack:
        "Captured Request Headers: Some request headers I captured\n    at capturedData (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:108:5)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)",
      extraData: {
        host: "localhost:3000",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "sec-ch-ua":
          '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        connection: "keep-alive",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        "cache-control": "max-age=0",
        "if-none-match": 'W/"12-howcZO2GSVRL1FSAZM9fSlQ6ZB0"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "upgrade-insecure-requests": "1",
      },
      systemInfo: {
        appUptime: 131.3686194,
        freeMemory: 5865852928,
        deviceMemory: 16309932032,
        deviceUptime: 4432.578,
        appMemoryUsage: 59772928,
      },
    },
    {
      issueId: "17",

      message: "Some request headers I captured",
      timestamp: "2025-03-04T20:47:44.614Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121259957,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121260972,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.670 ms - -[0m",
          timestamp: 1741121261191,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121261986,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.679 ms - -[0m",
          timestamp: 1741121262046,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 1.098 ms - -[0m",
          timestamp: 1741121262193,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.628 ms - -[0m",
          timestamp: 1741121262357,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.654 ms - -[0m",
          timestamp: 1741121262555,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121262989,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.625 ms - -[0m",
          timestamp: 1741121263632,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121264003,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.639 ms - -[0m",
          timestamp: 1741121264614,
        },
      ],
      stderrLogs: [],
      stack:
        "Captured Request Headers: Some request headers I captured\n    at capturedData (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:108:5)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)",
      extraData: {
        host: "localhost:3000",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "sec-ch-ua":
          '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        connection: "keep-alive",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        "cache-control": "max-age=0",
        "if-none-match": 'W/"12-howcZO2GSVRL1FSAZM9fSlQ6ZB0"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "upgrade-insecure-requests": "1",
      },
      systemInfo: {
        appUptime: 131.1823696,
        freeMemory: 5867319296,
        deviceMemory: 16309932032,
        deviceUptime: 4432.39,
        appMemoryUsage: 59613184,
      },
    },
    {
      issueId: "17",

      message: "Some request headers I captured",
      timestamp: "2025-03-04T20:47:43.632Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121258955,
        },
        {
          message: "[0mGET /captured-data [32m200[0m 3.193 ms - 18[0m",
          timestamp: 1741121259519,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121259957,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121260972,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.670 ms - -[0m",
          timestamp: 1741121261191,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121261986,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.679 ms - -[0m",
          timestamp: 1741121262046,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 1.098 ms - -[0m",
          timestamp: 1741121262193,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.628 ms - -[0m",
          timestamp: 1741121262357,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.654 ms - -[0m",
          timestamp: 1741121262555,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121262989,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.625 ms - -[0m",
          timestamp: 1741121263632,
        },
      ],
      stderrLogs: [],
      stack:
        "Captured Request Headers: Some request headers I captured\n    at capturedData (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:108:5)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)",
      extraData: {
        host: "localhost:3000",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "sec-ch-ua":
          '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        connection: "keep-alive",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        "cache-control": "max-age=0",
        "if-none-match": 'W/"12-howcZO2GSVRL1FSAZM9fSlQ6ZB0"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "upgrade-insecure-requests": "1",
      },
      systemInfo: {
        appUptime: 130.20044,
        freeMemory: 5876125696,
        deviceMemory: 16309932032,
        deviceUptime: 4431.406,
        appMemoryUsage: 59486208,
      },
    },
    {
      issueId: "17",

      message: "Some request headers I captured",
      timestamp: "2025-03-04T20:47:42.554Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121257952,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121258955,
        },
        {
          message: "[0mGET /captured-data [32m200[0m 3.193 ms - 18[0m",
          timestamp: 1741121259519,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121259957,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121260972,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.670 ms - -[0m",
          timestamp: 1741121261191,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121261986,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.679 ms - -[0m",
          timestamp: 1741121262046,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 1.098 ms - -[0m",
          timestamp: 1741121262193,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.628 ms - -[0m",
          timestamp: 1741121262357,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.654 ms - -[0m",
          timestamp: 1741121262555,
        },
      ],
      stderrLogs: [],
      stack:
        "Captured Request Headers: Some request headers I captured\n    at capturedData (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:108:5)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)",
      extraData: {
        host: "localhost:3000",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "sec-ch-ua":
          '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        connection: "keep-alive",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        "cache-control": "max-age=0",
        "if-none-match": 'W/"12-howcZO2GSVRL1FSAZM9fSlQ6ZB0"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "upgrade-insecure-requests": "1",
      },
      systemInfo: {
        appUptime: 129.1233498,
        freeMemory: 5882986496,
        deviceMemory: 16309932032,
        deviceUptime: 4430.328,
        appMemoryUsage: 59265024,
      },
    },
    {
      issueId: "17",

      message: "Some request headers I captured",
      timestamp: "2025-03-04T20:47:42.356Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121257952,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121258955,
        },
        {
          message: "[0mGET /captured-data [32m200[0m 3.193 ms - 18[0m",
          timestamp: 1741121259519,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121259957,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121260972,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.670 ms - -[0m",
          timestamp: 1741121261191,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121261986,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.679 ms - -[0m",
          timestamp: 1741121262046,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 1.098 ms - -[0m",
          timestamp: 1741121262193,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.628 ms - -[0m",
          timestamp: 1741121262357,
        },
      ],
      stderrLogs: [],
      stack:
        "Captured Request Headers: Some request headers I captured\n    at capturedData (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:108:5)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)",
      extraData: {
        host: "localhost:3000",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "sec-ch-ua":
          '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        connection: "keep-alive",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        "cache-control": "max-age=0",
        "if-none-match": 'W/"12-howcZO2GSVRL1FSAZM9fSlQ6ZB0"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "upgrade-insecure-requests": "1",
      },
      systemInfo: {
        appUptime: 128.9260919,
        freeMemory: 5884133376,
        deviceMemory: 16309932032,
        deviceUptime: 4430.125,
        appMemoryUsage: 59166720,
      },
    },
    {
      issueId: "17",

      message: "Some request headers I captured",
      timestamp: "2025-03-04T20:47:42.192Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121257952,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121258955,
        },
        {
          message: "[0mGET /captured-data [32m200[0m 3.193 ms - 18[0m",
          timestamp: 1741121259519,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121259957,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121260972,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.670 ms - -[0m",
          timestamp: 1741121261191,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121261986,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.679 ms - -[0m",
          timestamp: 1741121262046,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 1.098 ms - -[0m",
          timestamp: 1741121262193,
        },
      ],
      stderrLogs: [],
      stack:
        "Captured Request Headers: Some request headers I captured\n    at capturedData (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:108:5)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)",
      extraData: {
        host: "localhost:3000",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "sec-ch-ua":
          '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        connection: "keep-alive",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        "cache-control": "max-age=0",
        "if-none-match": 'W/"12-howcZO2GSVRL1FSAZM9fSlQ6ZB0"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "upgrade-insecure-requests": "1",
      },
      systemInfo: {
        appUptime: 128.7606114,
        freeMemory: 5870399488,
        deviceMemory: 16309932032,
        deviceUptime: 4429.968,
        appMemoryUsage: 59490304,
      },
    },
    {
      issueId: "17",

      message: "Some request headers I captured",
      timestamp: "2025-03-04T20:47:42.045Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121257952,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121258955,
        },
        {
          message: "[0mGET /captured-data [32m200[0m 3.193 ms - 18[0m",
          timestamp: 1741121259519,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121259957,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121260972,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.670 ms - -[0m",
          timestamp: 1741121261191,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121261986,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.679 ms - -[0m",
          timestamp: 1741121262046,
        },
      ],
      stderrLogs: [],
      stack:
        "Captured Request Headers: Some request headers I captured\n    at capturedData (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:108:5)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)",
      extraData: {
        host: "localhost:3000",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "sec-ch-ua":
          '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        connection: "keep-alive",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        "cache-control": "max-age=0",
        "if-none-match": 'W/"12-howcZO2GSVRL1FSAZM9fSlQ6ZB0"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "upgrade-insecure-requests": "1",
      },
      systemInfo: {
        appUptime: 128.6145934,
        freeMemory: 5883056128,
        deviceMemory: 16309932032,
        deviceUptime: 4429.828,
        appMemoryUsage: 59342848,
      },
    },
    {
      issueId: "17",

      message: "Some request headers I captured",
      timestamp: "2025-03-04T20:47:41.190Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121256938,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121257952,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121258955,
        },
        {
          message: "[0mGET /captured-data [32m200[0m 3.193 ms - 18[0m",
          timestamp: 1741121259519,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121259957,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121260972,
        },
        {
          message: "[0mGET /captured-data [36m304[0m 0.670 ms - -[0m",
          timestamp: 1741121261191,
        },
      ],
      stderrLogs: [],
      stack:
        "Captured Request Headers: Some request headers I captured\n    at capturedData (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:108:5)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)",
      extraData: {
        host: "localhost:3000",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "sec-ch-ua":
          '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        connection: "keep-alive",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        "cache-control": "max-age=0",
        "if-none-match": 'W/"12-howcZO2GSVRL1FSAZM9fSlQ6ZB0"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "upgrade-insecure-requests": "1",
      },
      systemInfo: {
        appUptime: 127.7591999,
        freeMemory: 5889351680,
        deviceMemory: 16309932032,
        deviceUptime: 4428.968,
        appMemoryUsage: 59113472,
      },
    },
    {
      issueId: "17",

      message: "Some request headers I captured",
      timestamp: "2025-03-04T20:47:39.518Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121253912,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121254915,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121255930,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121256938,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121257952,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121258955,
        },
        {
          message: "[0mGET /captured-data [32m200[0m 3.193 ms - 18[0m",
          timestamp: 1741121259519,
        },
      ],
      stderrLogs: [],
      stack:
        "Captured Request Headers: Some request headers I captured\n    at capturedData (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:108:5)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:43)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\express\\lib\\router\\index.js:346:12)",
      extraData: {
        host: "localhost:3000",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "sec-ch-ua":
          '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        connection: "keep-alive",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "upgrade-insecure-requests": "1",
      },
      systemInfo: {
        appUptime: 126.0885095,
        freeMemory: 5889830912,
        deviceMemory: 16309932032,
        deviceUptime: 4427.296,
        appMemoryUsage: 59432960,
      },
    },
  ],
  18: [
    {
      issueId: "18",

      message: 'relation "books" does not exist',
      timestamp: "2025-03-04T20:48:01.390Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121277123,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121278124,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121279137,
        },
        {
          message: "[0mGET /get-book [32m200[0m 41.187 ms - 31[0m",
          timestamp: 1741121279497,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121280152,
        },
        {
          message: "[0mGET /get-book [36m304[0m 35.398 ms - -[0m",
          timestamp: 1741121280840,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121281163,
        },
        {
          message: "[0mGET /get-book [36m304[0m 35.778 ms - -[0m",
          timestamp: 1741121281200,
        },
        {
          message: "[0mGET /get-book [36m304[0m 36.263 ms - -[0m",
          timestamp: 1741121281390,
        },
      ],
      stderrLogs: [],
      stack:
        'error: relation "books" does not exist\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\pg-pool\\index.js:45:11\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at getBook (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:137:31)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:22)',
      extraData: {
        customErrorProps: {
          code: "42P01",
          file: "parse_relation.c",
          line: "1452",
          length: 104,
          routine: "parserOpenTable",
          position: "16",
          severity: "ERROR",
        },
      },
      systemInfo: {
        appUptime: 147.9583919,
        freeMemory: 5793554432,
        deviceMemory: 16309932032,
        deviceUptime: 4449.171,
        appMemoryUsage: 60022784,
      },
      context: [
        ["req.method", "GET"],
        ["req.originalUrl", "/get-book"],
        ["req.hostname", "localhost"],
        ["req.path", "/get-book"],
        ["req.protocol", "http"],
        ["req.ip", "::1"],
      ],
    },
    {
      issueId: "18",

      message: 'relation "books" does not exist',
      timestamp: "2025-03-04T20:48:01.199Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121277123,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121278124,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121279137,
        },
        {
          message: "[0mGET /get-book [32m200[0m 41.187 ms - 31[0m",
          timestamp: 1741121279497,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121280152,
        },
        {
          message: "[0mGET /get-book [36m304[0m 35.398 ms - -[0m",
          timestamp: 1741121280840,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121281163,
        },
        {
          message: "[0mGET /get-book [36m304[0m 35.778 ms - -[0m",
          timestamp: 1741121281200,
        },
      ],
      stderrLogs: [],
      stack:
        'error: relation "books" does not exist\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\pg-pool\\index.js:45:11\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at getBook (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:137:31)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:22)',
      extraData: {
        customErrorProps: {
          code: "42P01",
          file: "parse_relation.c",
          line: "1452",
          length: 104,
          routine: "parserOpenTable",
          position: "16",
          severity: "ERROR",
        },
      },
      systemInfo: {
        appUptime: 147.7687803,
        freeMemory: 5789966336,
        deviceMemory: 16309932032,
        deviceUptime: 4448.968,
        appMemoryUsage: 60223488,
      },
      context: [
        ["req.method", "GET"],
        ["req.originalUrl", "/get-book"],
        ["req.hostname", "localhost"],
        ["req.path", "/get-book"],
        ["req.protocol", "http"],
        ["req.ip", "::1"],
      ],
    },
    {
      issueId: "18",

      message: 'relation "books" does not exist',
      timestamp: "2025-03-04T20:48:00.839Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121276120,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121277123,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121278124,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121279137,
        },
        {
          message: "[0mGET /get-book [32m200[0m 41.187 ms - 31[0m",
          timestamp: 1741121279497,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121280152,
        },
        {
          message: "[0mGET /get-book [36m304[0m 35.398 ms - -[0m",
          timestamp: 1741121280840,
        },
      ],
      stderrLogs: [],
      stack:
        'error: relation "books" does not exist\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\pg-pool\\index.js:45:11\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at getBook (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:137:31)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:22)',
      extraData: {
        customErrorProps: {
          code: "42P01",
          file: "parse_relation.c",
          line: "1452",
          length: 104,
          routine: "parserOpenTable",
          position: "16",
          severity: "ERROR",
        },
      },
      systemInfo: {
        appUptime: 147.4079485,
        freeMemory: 5785677824,
        deviceMemory: 16309932032,
        deviceUptime: 4448.609,
        appMemoryUsage: 60194816,
      },
      context: [
        ["req.method", "GET"],
        ["req.originalUrl", "/get-book"],
        ["req.hostname", "localhost"],
        ["req.path", "/get-book"],
        ["req.protocol", "http"],
        ["req.ip", "::1"],
      ],
    },
    {
      issueId: "18",

      message: 'relation "books" does not exist',
      timestamp: "2025-03-04T20:47:59.496Z",
      stdoutLogs: [
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121275106,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121276120,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121277123,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121278124,
        },
        {
          message: "Memory usage data saved to memory.txt",
          timestamp: 1741121279137,
        },
        {
          message: "[0mGET /get-book [32m200[0m 41.187 ms - 31[0m",
          timestamp: 1741121279497,
        },
      ],
      stderrLogs: [],
      stack:
        'error: relation "books" does not exist\n    at C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\node_modules\\pg-pool\\index.js:45:11\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at getBook (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:137:31)\n    at descriptor.value (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\controllers.ts:44:22)',
      extraData: {
        customErrorProps: {
          code: "42P01",
          file: "parse_relation.c",
          line: "1452",
          length: 104,
          routine: "parserOpenTable",
          position: "16",
          severity: "ERROR",
        },
      },
      systemInfo: {
        appUptime: 146.1233105,
        freeMemory: 5792071680,
        deviceMemory: 16309932032,
        deviceUptime: 4447.328,
        appMemoryUsage: 60194816,
      },
      context: [
        ["req.method", "GET"],
        ["req.originalUrl", "/get-book"],
        ["req.hostname", "localhost"],
        ["req.path", "/get-book"],
        ["req.protocol", "http"],
        ["req.ip", "::1"],
      ],
    },
  ],
  19: [
    {
      issueId: "19",

      message: "something.somefunctionthatdoesntexist is not a function",
      timestamp: "2025-03-04T21:45:44.436Z",
      stdoutLogs: [
        {
          message: "Server listening on port 3000",
          timestamp: 1741124742414,
        },
      ],
      stderrLogs: [
        {
          message:
            "TypeError: something.somefunctionthatdoesntexist is not a function\n    at Timeout._onTimeout \u001b[90m(C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\\u001b[39msrc\\index.ts:71:13\u001b[90m)\u001b[39m\n\u001b[90m    at listOnTimeout (node:internal/timers:573:17)\u001b[39m\n\u001b[90m    at process.processTimers (node:internal/timers:514:7)\u001b[39m",
          timestamp: 1741124744435,
        },
      ],
      stack:
        "TypeError: something.somefunctionthatdoesntexist is not a function\n    at Timeout._onTimeout (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\index.ts:71:13)\n    at listOnTimeout (node:internal/timers:573:17)\n    at process.processTimers (node:internal/timers:514:7)",

      systemInfo: {
        appUptime: 2.8084971,
        freeMemory: 3189776384,
        deviceMemory: 16309932032,
        deviceUptime: 7912.218,
        appMemoryUsage: 72781824,
      },
    },
    {
      issueId: "19",

      message: "something.log is not a function",
      timestamp: "2025-03-04T21:44:16.069Z",
      stdoutLogs: [
        {
          message: "Server listening on port 3000",
          timestamp: 1741124654056,
        },
      ],
      stderrLogs: [
        {
          message:
            "TypeError: something.log is not a function\n    at Timeout._onTimeout \u001b[90m(C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\\u001b[39msrc\\index.ts:71:13\u001b[90m)\u001b[39m\n\u001b[90m    at listOnTimeout (node:internal/timers:573:17)\u001b[39m\n\u001b[90m    at process.processTimers (node:internal/timers:514:7)\u001b[39m",
          timestamp: 1741124656069,
        },
      ],
      stack:
        "TypeError: something.log is not a function\n    at Timeout._onTimeout (C:\\Users\\sammy\\Documents\\Projects\\codewatch_tests\\typescript_test\\src\\index.ts:71:13)\n    at listOnTimeout (node:internal/timers:573:17)\n    at process.processTimers (node:internal/timers:514:7)",

      systemInfo: {
        appUptime: 2.7998959,
        freeMemory: 2943205376,
        deviceMemory: 16309932032,
        deviceUptime: 7823.859,
        appMemoryUsage: 72269824,
      },
    },
  ],
};

type TestOccurrences = { [key: string]: OccurrenceWithId[] };
export const occurrences: TestOccurrences = Object.keys(tOccurrences).reduce(
  (acc, curr) => ({
    ...acc,
    [curr]: tOccurrences[curr].map((occurrence) => ({
      ...occurrence,
      id: nanoid(),
      stderrLogs: occurrence.stderrLogs.map((log) => ({
        ...log,
        id: nanoid(),
      })),
      stdoutLogs: occurrence.stdoutLogs.map((log) => ({
        ...log,
        id: nanoid(),
      })),
    })),
  }),
  {} as TestOccurrences
);
