import { GetStats, GetStatsResponse } from "@codewatch/types";
import { getStats } from "@lib/data";
import { quantifyNumber } from "@lib/utils";
import { AppPage } from "@ui/app_page";
import { DatePreset, useDateRange } from "@ui/inputs";
import { TotalOccurrencesLoader } from "@ui/issues";
import "chart.js/auto";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { useSearchParams } from "react-router-dom";

type StatsData = GetStatsResponse["data"]["stats"];

const defaultData: StatsData = {
  totalIssues: 0,
  totalOccurrences: 0,
  dailyOccurrenceCount: [],
  dailyUnhandledOccurrenceCount: [],
  totalManuallyCapturedOccurrences: 0,
  totalUnhandledOccurrences: 0,
  mostRecurringIssues: [],
};

const datePresets: DatePreset[] = [
  {
    code: "1",
    default: true,
    display: "Last 7 days",
    value: 7 * 24 * 60 * 60 * 1000,
  },
  {
    code: "2",
    default: false,
    display: "Last 30 days",
    value: 30 * 24 * 60 * 60 * 1000,
  },
  {
    code: "3",
    default: false,
    display: "Last 90 days",
    value: 90 * 24 * 60 * 60 * 1000,
  },
];

export default function StatisticsRoute() {
  const [searchParams, setSearchParams] = useSearchParams({});
  const { startDate, endDate, dateRangeElement } = useDateRange({
    datePresets,
    initialStartDate: searchParams.get("startDate"),
    initialEndDate: searchParams.get("endDate"),
    selectClassName: "w-full sm:w-auto",
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<StatsData>(defaultData);

  useEffect(() => {
    setSearchParams({
      startDate,
      endDate,
    });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const fetchData = useCallback(async () => {
    const startDate = searchParams.get("startDate") ?? "";
    const endDate = searchParams.get("endDate") ?? "";
    if (!startDate || !endDate) return;

    setLoading(true);
    const filters: GetStats = {
      startDate,
      endDate,
    };

    const newStatsData = await getStats(filters);
    if (newStatsData != null) setData(newStatsData);
    setLoading(false);
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <AppPage title="Statistics">
      <div className="py-1 flex lg:px-1 flex-col sm:flex-row sm:items-start justify-between items-center">
        {/* <div className="py-4 px-5 flex-col justify-between items-center"> */}
        {dateRangeElement}

        <div className="flex mt-8 mb-8 sm:mt-0 justify-center gap-7">
          {[
            {
              label: "Issues",
              value: data.totalIssues,
            },
            {
              label: "Occurrences",
              value: data.totalOccurrences,
            },
          ].map((item) => (
            <div
              className="text-grey-600 flex flex-col items-center ml-6 sm:ml-0"
              key={item.label}
            >
              <span className="text-sm mb-1">{item.label}</span>{" "}
              {loading ? (
                <TotalOccurrencesLoader />
              ) : (
                <span className="text-xl">{quantifyNumber(item.value)}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <Bar
          data={{
            labels: data.dailyOccurrenceCount.map((day) =>
              moment(day.date).format("MMM D")
            ),
            datasets: [
              {
                data: data.dailyUnhandledOccurrenceCount.map(
                  (day) => day.count
                ),
                borderRadius: 15,
                backgroundColor: "#AD3D35",
                label: "Unhandled occurrences",
              },
              {
                data: data.dailyOccurrenceCount.map((day) => day.count),
                borderRadius: 15,
                backgroundColor: "#67985F",
                label: "Total occurrences",
              },
            ],
          }}
          className="max-h-[28rem]"
        />
      </div>

      <div className="mt-24 flex">
        <div className="w-1/2">
          <Doughnut
            options={{ plugins: { legend: { position: "right" } } }}
            data={{
              labels: [
                "Unhandled occurrences",
                "Manually captured occurrences",
              ],
              datasets: [
                {
                  data: [
                    data.totalUnhandledOccurrences,
                    data.totalManuallyCapturedOccurrences,
                  ],
                  backgroundColor: ["#AD3D35", "#6FB4ED"],
                  hoverOffset: 10,
                  borderColor: "#1D232C",
                },
              ],
            }}
          />
        </div>

        <div className="w-24">Hi</div>
      </div>
    </AppPage>
  );
}
