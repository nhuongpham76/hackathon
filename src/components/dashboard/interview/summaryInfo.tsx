"use client";

import { Interview } from "@/types/interview";
import { Response } from "@/types/response";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import DataTable, {
  TableData,
} from "@/components/dashboard/interview/dataTable";
import { ScrollArea } from "@/components/ui/scroll-area";

type SummaryProps = {
  responses: Response[];
  interview: Interview | undefined;
};

function SummaryInfo({ responses, interview }: SummaryProps) {

  const [tableData, setTableData] = useState<TableData[]>([]);

  const prepareTableData = (responses: Response[]): TableData[] => {
    return responses.map((response) => ({
      response_id: response.id,
      name: response.name || "Anonymous",
      candidate_status: response.candidate_status || 'COLD',
      fit_score: response.analytics?.fit_score || 0,
      fit_feedback: response.analytics?.fit_feedback || null,
      lead_sentiment: response.analytics?.lead_sentiment || '',
      engagement_score: response.analytics?.engagement_score || 0,
      engagement_feedback: response.analytics?.engagement_feedback || null,
      summary: response.analytics?.summary || "No summary available",
    }));
  };

  useEffect(() => {
    if (!responses) {
      return;
    }

    const preparedData = prepareTableData(responses);
    setTableData(preparedData);
  }, [responses]);

  return (
    <div className="z-[10] mx-2">
      {responses.length > 0 ? (
        <div className="bg-slate-200 rounded-2xl min-h-[120px] p-2 ">
          <div className="flex flex-row gap-2 justify-between items-center mx-2">
            <div className="flex flex-row gap-2 items-center">
              <p className="font-semibold my-2">Overall Analysis</p>
            </div>
          </div>
          <div className="flex flex-col gap-1 my-2 mt-4 mx-2 p-4 rounded-2xl bg-slate-50 shadow-md">
            <ScrollArea className="h-[250px]">
              <DataTable data={tableData} interviewId={interview?.id || ""} />
            </ScrollArea>
          </div>
        </div>
      ) : (
        <div className="w-[85%] h-[60%] flex flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            <Image
              src="/no-responses.png"
              alt="logo"
              width={270}
              height={270}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default SummaryInfo;
