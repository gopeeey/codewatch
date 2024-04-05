"use client";

import { AppPage, Select, TextField } from "@/ui";
import { IssuesTabs, TabType } from "@/ui/tabs";
import CalendarIcon from "@public/calendar.svg";
import SearchIcon from "@public/search.svg";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [datePreset, setDatePreset] = useState("1");
  const [currentTab, setCurrentTab] = useState<TabType>("unresolved");

  return (
    <AppPage title="Issues" cardClassName="px-0">
      <div className="px-5 pr-8 flex justify-between">
        <div className="flex">
          <TextField
            inputProps={{ placeholder: "Search issues" }}
            startAdornment={<Image src={SearchIcon} alt="search" width={13} />}
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
            startAdornment={
              <Image src={CalendarIcon} alt="search" width={13} />
            }
          />
        </div>

        {/* Tabs */}
        <IssuesTabs
          current={currentTab}
          onChange={setCurrentTab}
          resolvedCount={0}
          unresolvedCount={12}
          className="-mb-12"
        />
      </div>
    </AppPage>
  );
}
