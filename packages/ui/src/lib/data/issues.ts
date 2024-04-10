import { ErrorData } from "@codewatch/core";
import { LoaderFunctionArgs } from "react-router-dom";
import { z } from "zod";

const GetIssuesSchema = z.object({
  searchString: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  page: z.number().default(1),
  perPage: z.number().default(15),
  resolved: z.boolean().default(false),
});
export async function getIssues({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const filters = GetIssuesSchema.parse({
    searchString: url.searchParams.get("searchString"),
    startDate: url.searchParams.get("startDate"),
    endDate: url.searchParams.get("endDate"),
    page: Number(url.searchParams.get("page")) || 1,
    perPage: Number(url.searchParams.get("perPage")) || 15,
    resolved: url.searchParams.get("resolved") === "true",
  });
  if (!filters.startDate || !filters.endDate) return { issues: [] };
  console.log("Filters", filters);
  const issues: ErrorData[] = [
    {
      fingerprint: "123456789",
      id: "123456789",
      lastOccurrenceTimestamp: "2024-04-10T13:59:33.021Z",
      lastOccurrenceMessage:
        "It went terribly wrong, I don't even know what happened.",
      muted: false,
      name: "Something went wrong",
      stack:
        "Error: Something went wrong\n    at Object.<anonymous> (/home/codewatch)",
      totalOccurrences: 3245,
      unhandled: false,
      createdAt: "2024-04-10T13:59:33.021Z",
    },
    {
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
    },
    {
      fingerprint: "34567890",
      id: "34567890",
      lastOccurrenceTimestamp: "2024-04-10T13:59:33.021Z",
      lastOccurrenceMessage: "You'll find what it is though",
      muted: false,
      name: "Something went really wrong",
      stack:
        "Error: Something went wrong\n    at Object.<anonymous> (/home/codewatch)",
      totalOccurrences: 234,
      unhandled: false,
      createdAt: "2024-04-10T13:59:33.021Z",
    },
  ];
  return { issues };
}
