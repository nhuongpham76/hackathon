"use client";

import React, { useState, useEffect } from "react";
import { useOrganization } from "@clerk/nextjs";
import InterviewCard from "@/components/dashboard/interview/interviewCard";
import CreateInterviewCard from "@/components/dashboard/interview/createInterviewCard";
import { InterviewService } from "@/services/interviews.service";
import { ResponseService } from "@/services/responses.service";
import { useInterviews } from "@/contexts/interviews.context";

function Interviews() {
  const { interviews, interviewsLoading } = useInterviews();
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPlan, setCurrentPlan] = useState<string>("");
  const [allowedResponsesCount] =
    useState<number>(10);

  function InterviewsLoader() {
    return (
      <>
        <div className="flex flex-row">
          <div className="h-60 w-56 ml-1 mr-3 mt-3 flex-none animate-pulse rounded-xl bg-gray-300" />
          <div className="h-60 w-56 ml-1 mr-3  mt-3 flex-none animate-pulse rounded-xl bg-gray-300" />
          <div className="h-60 w-56 ml-1 mr-3 mt-3 flex-none animate-pulse rounded-xl bg-gray-300" />
        </div>
      </>
    );
  }

  useEffect(() => {
    const fetchResponsesCount = async () => {
      if (interviews) {
        setLoading(true);
        try {
          let totalResponses = 0;
          if (currentPlan != "free_trial_over") {
            for (const interview of interviews) {
              const responses = await ResponseService.getAllResponses(
                interview.id,
              );
              totalResponses += responses.length;
            }
          }

          if (
            totalResponses >= allowedResponsesCount &&
            currentPlan === "free"
          ) {
            setCurrentPlan("free_trial_over");
            try {
              for (const interview of interviews) {
                await InterviewService.updateInterview(
                  { is_active: false },
                  interview.id,
                );
              }
            } catch (error) {
              console.error("Error disabling active interviews", error);
            }
          }
        } catch (error) {
          console.error("Error fetching responses:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchResponsesCount();
  }, [interviews, currentPlan, allowedResponsesCount]);

  return (
    <main className="p-8 pt-0 ml-12 mr-auto rounded-md">
      <div className="flex flex-col items-left">
        <h2 className="mr-2 text-2xl font-semibold tracking-tight mt-8">
          Lead Agents
        </h2>
        <div className="relative flex items-center mt-1 flex-wrap">
          { <CreateInterviewCard /> }
          {interviewsLoading || loading ? (
            <InterviewsLoader />
          ) : (
            <>
              {interviews.map((item) => (
                <InterviewCard
                  id={item.id}
                  key={item.id}
                  name={item.name}
                  url={item.url ?? ""}
                  readableSlug={item.readable_slug}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default Interviews;
