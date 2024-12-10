import { getStats } from "@lib/data";
import { quantifyNumber } from "@lib/utils";
import { AppPage } from "@ui/app_page";
import { Card } from "@ui/card";
import { DatePreset, Select, useDateRange } from "@ui/inputs";
import { IssueCard, TotalOccurrencesLoader } from "@ui/issues";
import "chart.js/auto";
import clsx from "clsx";
import { GetStats, GetStatsResponse } from "codewatch-core/dist/types";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { useSearchParams } from "react-router-dom";

type StatsData = GetStatsResponse["data"]["stats"];
type RateUnit = "seconds" | "minutes" | "hours" | "days";

const defaultData: StatsData = {
  totalIssues: 0,
  totalOccurrences: 0,
  dailyOccurrenceCount: [],
  dailyUnhandledOccurrenceCount: [],
  totalManuallyCapturedOccurrences: 0,
  totalUnhandledOccurrences: 0,
  totalLoggedData: 0,
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

const generalCardClasses = "!rounded-none sm:!rounded-xl text-grey-600 h-fit";

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
  const [rateUnit, setRateUnit] = useState<RateUnit>("days");

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
      timezoneOffset: new Date().getTimezoneOffset(),
    };

    const newStatsData = await getStats(filters);
    if (newStatsData != null) setData(newStatsData);
    setLoading(false);
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getRate = useCallback(
    (count: number) => {
      const duration = moment(Number(endDate)).diff(
        moment(Number(startDate)),
        "seconds"
      );

      let rate = 0;

      switch (rateUnit) {
        case "seconds":
          rate = count / duration;
          break;
        case "minutes":
          rate = count / (duration / 60);
          break;
        case "hours":
          rate = count / (duration / (60 * 60));
          break;
        case "days":
          rate = count / (duration / (24 * 60 * 60));
          break;
        default:
          rate = 0;
          break;
      }

      return Math.round(rate);
    },
    [rateUnit, startDate, endDate]
  );

  return (
    <AppPage
      title="Statistics"
      cardless={true}
      className="grid grid-cols-2 gap-12 pb-12"
    >
      <Card className={clsx(generalCardClasses, "col-span-2 -mt-12")}>
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
      </Card>

      <TitledCard
        className={clsx(generalCardClasses, "col-span-2 sm:col-span-1")}
        title="Breakdown"
      >
        <Doughnut
          // options={{ plugins: { legend: { position: "right" } } }}
          options={{ radius: "70%" }}
          data={{
            labels: [
              "Unhandled errors",
              "Manually captured errors",
              "Manually logged data",
            ],
            datasets: [
              {
                data: [
                  data.totalUnhandledOccurrences,
                  data.totalManuallyCapturedOccurrences,
                  data.totalLoggedData,
                ],
                backgroundColor: ["#AD3D35", "#6FB4ED", "#EDED49"],
                hoverOffset: 10,
                borderColor: "#1D232C",
              },
            ],
          }}
        />
      </TitledCard>

      <TitledCard
        className={clsx(generalCardClasses, "col-span-2 sm:col-span-1")}
        title="Rates"
      >
        <Select
          options={[
            { display: "Per second", value: "seconds" },
            { display: "Per minute", value: "minutes" },
            { display: "Per hour", value: "hours" },
            { display: "Per day", value: "days" },
          ]}
          onChange={(val) => setRateUnit(val as RateUnit)}
          value={rateUnit}
          className="mb-10"
        />
        {[
          {
            label: "Unhandled errors",
            value: getRate(data.totalUnhandledOccurrences),
          },
          {
            label: "Manually captured errors",
            value: getRate(data.totalManuallyCapturedOccurrences),
          },
          {
            label: "Manually logged data",
            value: getRate(data.totalLoggedData),
          },
        ].map((item) => (
          <div className="flex flex-col mb-6" key={item.label}>
            <span className="text-sm mb-1">{item.label}</span>{" "}
            {loading ? (
              <TotalOccurrencesLoader />
            ) : (
              <span className="text-xl">{quantifyNumber(item.value)}</span>
            )}
          </div>
        ))}
      </TitledCard>

      <TitledCard
        className={clsx(generalCardClasses, "col-span-2")}
        title="Most recurring issues"
      >
        {data.mostRecurringIssues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            selectable={false}
            className="-mx-5"
          />
        ))}
      </TitledCard>
    </AppPage>
  );
}

function TitledCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className: string;
}) {
  return (
    <Card className={clsx(generalCardClasses, className)}>
      <div className="text-lg mb-10">{title}</div>
      {children}
    </Card>
  );
}
