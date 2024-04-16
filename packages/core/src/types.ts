export interface Issue {
  id: string;
  fingerprint: string;
  stack: string;
  name: string;
  totalOccurrences: number;
  lastOccurrenceTimestamp: string;
  lastOccurrenceMessage: string;
  muted: boolean;
  unhandled: boolean;
  createdAt: string;
  resolved: boolean;
}

export type StdChannelLog = { timestamp: number; message: string };
export interface Occurrence {
  issueId: Issue["id"];
  message: string;
  timestamp: string;
  stdoutLogs: StdChannelLog[];
  stderrLogs: StdChannelLog[];
}

export type GetIssuesFilters = {
  searchString: string;
  startDate?: string;
  endDate?: string;
  resolved: boolean;
};

export interface GetPaginatedIssuesFilters extends GetIssuesFilters {
  page: number;
  perPage: number;
}

export interface Storage {
  ready: boolean;
  init: () => Promise<void>;
  createIssue: (data: Omit<Issue, "id" | "resolved">) => Promise<Issue["id"]>;
  addOccurrence: (data: Occurrence) => Promise<void>;
  updateLastOccurrenceOnIssue: (
    data: Pick<Occurrence, "issueId" | "timestamp" | "message">
  ) => Promise<void>;
  findIssueIdByFingerprint: (
    fingerprint: Issue["fingerprint"]
  ) => Promise<Issue["id"] | null>;
  close: () => Promise<void>;
  getPaginatedIssues: (filters: GetPaginatedIssuesFilters) => Promise<Issue[]>;
  getIssuesTotal: (filters: GetIssuesFilters) => Promise<number>;
  deleteIssues: (issueIds: Issue["id"][]) => Promise<void>;
  resolveIssues: (issueIds: Issue["id"][]) => Promise<void>;
}

export interface ApiRequest {
  body: Record<any, any>;
  query: Record<string, string>;
  params: Record<string, string>;
}

export interface ApiResponse {
  status: number;
  body?: {
    message?: string;
    data?: Record<string, unknown>;
  };
}

export type ControllerDependencies = {
  storage: Storage;
};

export type Controller = (
  req: ApiRequest,
  deps: ControllerDependencies
) => Promise<ApiResponse>;

export type ViewController = (basePath: string) => {
  name: string;
  params: Record<string, string>;
};

export type ErrorHandler = (error: unknown) => ApiResponse;

export interface ApiRoute {
  route: string | string[];
  method: "get" | "post" | "put" | "delete";
  handler: Controller;
}

export interface ViewRoute {
  route: string[];
  method: "get";
  handler: ViewController;
}

export interface AppRoutes {
  entry: ViewRoute;
  api: ApiRoute[];
}

export interface ServerAdapter {
  setBasePath: (basePath: string) => ServerAdapter;
  setViewsPath: (viewsPath: string) => ServerAdapter;
  setStaticPath: (staticsPath: string, staticsRoute: string) => ServerAdapter;
  setEntryRoute: (entryRoute: ViewRoute) => ServerAdapter;
  setErrorHandler: (errorHandler: ErrorHandler) => ServerAdapter;
  setApiRoutes: (
    routes: ApiRoute[],
    deps: ControllerDependencies
  ) => ServerAdapter;
}
