"use client";

import React, { useState, useEffect } from "react";
import { useInterviews } from "@/contexts/interviews.context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { ResponseService } from "@/services/responses.service";
import { Interview } from "@/types/interview";
import { Response } from "@/types/response";
import { formatTimestampToDateHHMM } from "@/lib/utils";
import ResponseInfo from "@/components/call/responseInfo";
import EditInterview from "@/components/dashboard/interview/editInterview";
import LoaderWithText from "@/components/loaders/loader-with-text/loaderWithText";
import ShowQuestions from "@/components/dashboard/interview/showQuestions";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {HomeIcon} from "lucide-react";

interface Props {
  params: {
    interviewId: string;
  };
  searchParams: {
    response_id: any;
    edit: boolean;
  };
}

function InterviewHome({ params, searchParams }: Props) {
  const [interview, setInterview] = useState<Interview>();
  const [responses, setResponses] = useState<Response[]>([]);
  const { getInterviewById } = useInterviews();
  const router = useRouter();
  const [isViewed, setIsViewed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [iconColor, seticonColor] = useState<string>("#4F46E5");

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await getInterviewById(params.interviewId);
        setInterview(response);
        setLoading(true);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (!interview) {
      fetchInterview();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getInterviewById, params.interviewId]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const responses = await ResponseService.getAllResponses(
          params.interviewId,
        );
        setResponses(responses);
        setLoading(true);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteResponse = (deletedCallId: any) => {
    if (responses) {
      setResponses(
        responses.filter((response) => response.id !== deletedCallId),
      );
      if (searchParams.response_id === deletedCallId) {
        router.push(`/lead/${params.interviewId}`);
      }
    }
  };

  const handleResponseClick = async (response: Response) => {
    try {
      await ResponseService.saveResponseById({ is_viewed: true }, response.id);
      searchParams.response_id = response.id;
      if (responses) {
        const updatedResponses = responses.map((r) =>
          r.id === response.id ? { ...r, is_viewed: true } : r,
        );
        setResponses(updatedResponses);
      }
      setIsViewed(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCandidateStatusChange = (callId: string, newStatus: string) => {
    setResponses((prevResponses) => {
      return prevResponses?.map((response) =>
        response.call_id === callId
          ? { ...response, candidate_status: newStatus }
          : response,
      );
    });
  };

  // @ts-ignore
  return (
    <div className="flex flex-col w-full h-full m-2 bg-white">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-[80%] w-full">
          <LoaderWithText />
        </div>
      ) : (
        <>
          <div className="flex flex-row p-3 pt-4 justify-center gap-6 items-center sticky top-2 bg-white">
            <a
              href={`/dashboard`}
            >
              <HomeIcon size={24} className="" />
            </a>

            <div className="font-bold text-md">{interview?.name}</div>
            <div
              className="w-5 h-5 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: iconColor }}
            />

            <div className="flex flex-row gap-3 my-auto">
              Leads:{" "}
              {String(responses?.length)}
            </div>

          </div>
          <div className="flex flex-row w-full p-2 h-[85%] gap-1 ">
            <div className="w-[20%] flex flex-col p-2 divide-y-2 rounded-sm border-2 border-slate-100">
              <ScrollArea className="h-full p-1 rounded-md border-none">
                {responses.length > 0 ? (
                  responses?.map((response) => (
                    <div
                      className={`p-2 rounded-md hover:bg-indigo-100 border-2 my-1 text-left text-xs ${
                        searchParams.response_id == response.id
                          ? "bg-indigo-200"
                          : "border-indigo-100"
                      } flex flex-row justify-between cursor-pointer w-full`}
                      key={response?.id}
                      onClick={() => {
                        router.push(
                          `/lead/${params.interviewId}?response_id=${response.id}`,
                        );
                        handleResponseClick(response);
                      }}
                    >
                      <div className="flex flex-row gap-1 items-center w-full">
                        {response.candidate_status === "COLD" ? (
                          <div className="w-[5%] h-full bg-red-500 rounded-sm" />
                        ) : response.candidate_status === "WARM" ? (
                          <div className="w-[5%] h-full bg-yellow-500 rounded-sm" />
                        ) : response.candidate_status === "HOT" ? (
                          <div className="w-[5%] h-full bg-green-500 rounded-sm" />
                        ) : (
                          <div className="w-[5%] h-full bg-gray-400 rounded-sm" />
                        )}
                        <div className="flex items-center justify-between w-full">
                          <div className={`flex flex-col my-auto  ${
                            searchParams.response_id == response.id
                              ? "text-white"
                              : "text-black"
                          }`}>
                            <p className="font-medium mb-[2px]">
                              {response?.name
                                ? `${response?.name}`
                                : "Anonymous"}
                            </p>
                            <p className="">
                              {formatTimestampToDateHHMM(
                                String(response?.created_at),
                              )}
                            </p>
                          </div>
                          <div className="flex flex-col items-center justify-center ml-auto flex-shrink-0">
                            {!response.is_viewed && (
                              <div className="w-4 h-4 flex items-center justify-center mb-1">
                                <div className="text-indigo-500 text-xl leading-none">
                                  ●
                                </div>
                              </div>
                            )}
                            <div
                              className={`w-6 h-6 flex items-center justify-center ${
                                response.is_viewed ? "h-full" : ""
                              }`}
                            >
                              {response.analytics !== 'undefined' &&
                                response.analytics.fit_score !==
                                undefined && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="w-6 h-6 rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center">
                                          <span className="text-indigo-500 text-xs font-semibold">
                                            {response.analytics.fit_score}
                                          </span>
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent
                                        className="bg-gray-500"
                                        side="bottom"
                                        sideOffset={4}
                                      >
                                        <span className="text-white font-normal flex flex-row gap-4">
                                          Fit Score
                                        </span>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    No responses to display
                  </p>
                )}
              </ScrollArea>
            </div>
            {responses && (
              <div className="w-[85%] rounded-md h-screen">
                {searchParams.response_id ? (
                  <ResponseInfo
                    response_id={searchParams.response_id}
                    onDeleteResponse={handleDeleteResponse}
                    onCandidateStatusChange={handleCandidateStatusChange}
                  />
                ) : searchParams.edit ? (
                  <EditInterview interview={interview} />
                ) : (
                  <>
                    {/*<SummaryInfo responses={responses} interview={interview} />*/}
                    <ShowQuestions interview={interview} />
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default InterviewHome;
