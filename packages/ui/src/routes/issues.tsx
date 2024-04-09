import CalendarIcon from "@assets/calendar.svg";
import SearchIcon from "@assets/search.svg";
import { AppPage } from "@ui/app_page";
import { Button } from "@ui/buttons";
import { Checkbox, Select, TextField } from "@ui/inputs";
import { IssueCard, IssuesTabs, TabType } from "@ui/issues";
import { Pagination } from "@ui/pagination";
import { useState } from "react";

export default function IssuesRoute() {
  const [datePreset, setDatePreset] = useState("1");
  const [currentTab, setCurrentTab] = useState<TabType>("unresolved");

  return (
    <AppPage title="Issues" cardClassName="px-0 py-0">
      {/* Filters and Tabs */}
      <div className="px-5 py-6 pr-8 flex justify-between custom-rule">
        <div className="flex">
          <TextField
            inputProps={{ placeholder: "Search issues" }}
            startAdornment={<img src={SearchIcon} alt="search" width={14} />}
          />

          <Select
            onChange={setDatePreset}
            options={[
              { display: "Person", value: "1" },
              { display: "Goat", value: "2" },
              { display: "The Manufacturer", value: "4" },
              {
                display: "The Creator",
                value: "3",
                onSelect: () => console.log("onSelect"),
              },
            ]}
            value={datePreset}
            className="ml-5"
            startAdornment={<img src={CalendarIcon} alt="search" width={14} />}
          />
        </div>

        <IssuesTabs
          current={currentTab}
          onChange={setCurrentTab}
          resolvedCount={0}
          unresolvedCount={12}
          className="-mb-[3.54rem]"
        />
      </div>

      <div className="px-5 py-3 custom-rule flex justify-between pr-8">
        {/* Actions */}
        <div className="flex items-center">
          <Checkbox label="" />
          <Button label="Resolve" onClick={() => {}} />
          <Button label="Delete" onClick={() => {}} className="ml-3" />
        </div>

        {/* Table Header */}
        <span className="text-grey-600 text-[0.8rem]">Occurences</span>
      </div>

      {/* Issues */}
      <IssueCard />

      <div className="py-10 pr-8 flex justify-end">
        <Pagination
          page={1}
          perPage={10}
          totalRows={200}
          onChange={(page) => console.log(page)}
        />
      </div>
    </AppPage>
  );
}
