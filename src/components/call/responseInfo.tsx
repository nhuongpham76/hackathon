"use client";

import React, { useEffect, useState } from "react";
import { Analytics, CallData, Response } from "@/types/response";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ResponseService } from "@/services/responses.service";
import { useRouter } from "next/navigation";
import LoaderWithText from "@/components/loaders/loader-with-text/loaderWithText";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { CircularProgress } from "@nextui-org/react";
import QuestionAnswerCard from "@/components/dashboard/interview/questionAnswerCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CandidateStatus } from "@/lib/enum";
import { ArrowLeft } from "lucide-react";

type CallProps = {
  response_id: any;
  onDeleteResponse: (deletedCallId: string) => void;
  onCandidateStatusChange: (callId: string, newStatus: string) => void;
};

function ResponseInfo({
  response_id,
  onDeleteResponse,
  onCandidateStatusChange,
}: CallProps) {
  const [call, setCall] = useState<CallData>();
  const [response, setResponse] = useState<Response>();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [candidateStatus, setCandidateStatus] = useState<string>("");
  const [interviewId, setInterviewId] = useState<string>("");

  useEffect(() => {
    const fetchEmail = async () => {
      setIsLoading(true);
      try {
        const response = await ResponseService.getResponseById(response_id);
        setEmail(response.email);
        setName(response.name);
        setResponse(response);
        setAnalytics(response.analytics);
        setCandidateStatus(response.candidate_status);
        setInterviewId(response.interview_id);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response_id]);

  useEffect(() => {
    const replaceAgentAndUser = (transcript: string, name: string): string => {
      const agentReplacement = "**AI interviewer:**";
      const userReplacement = `**${name}:**`;

      // Replace "Agent:" with "AI interviewer:" and "User:" with the variable `${name}:`
      let updatedTranscript = transcript
        .replace(/Agent:/g, agentReplacement)
        .replace(/User:/g, userReplacement);

      // Add space between the dialogues
      updatedTranscript = updatedTranscript.replace(/(?:\r\n|\r|\n)/g, "\n\n");

      return updatedTranscript;
    };
  }, [call, name]);

  return (
    <div className="h-screen z-[10] mx-2 mb-[100px] overflow-y-scroll">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[75%] w-full">
          <LoaderWithText />
        </div>
      ) : (
        <>
          <div className="bg-slate-200 rounded-2xl min-h-[120px] p-4 px-5 y-3">
            <div className="flex flex-col justify-between bt-2">
              <div>
                <div className="flex justify-between items-center pb-4 pr-2">
                  <div
                    className=" inline-flex items-center text-indigo-600 hover:cursor-pointer"
                    onClick={() => {
                      router.push(`/lead/${interviewId}`);
                      router.refresh();
                    }}
                  >
                    <ArrowLeft className="mr-2" />
                    <p className="text-sm font-semibold">Back to Summary</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between gap-3 w-full">
                <div className="flex flex-row justify-between">
                  <div className="flex flex-row gap-3">
                    <Avatar>
                      <AvatarFallback>{name ? name[0] : "A"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      {name && (
                        <p className="text-sm font-semibold px-2">{name}</p>
                      )}
                      {email && <p className="text-sm px-2">{email}</p>}
                    </div>
                  </div>
                  <div className="flex flex-row mr-2 items-center gap-3">
                    <Select
                      value={candidateStatus}
                      onValueChange={async (newValue: string) => {
                        setCandidateStatus(newValue);
                        await ResponseService.updateResponse(
                          { candidate_status: newValue },
                          response_id,
                        );
                        onCandidateStatusChange(response_id, newValue);
                      }}
                    >
                      <SelectTrigger className="w-[180px]  bg-slate-50 rounded-2xl">
                        <SelectValue placeholder="Not Selected" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={CandidateStatus.COLD}>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                            Cold
                          </div>
                        </SelectItem>
                        <SelectItem value={CandidateStatus.WARM}>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
                            Warm
                          </div>
                        </SelectItem>
                        <SelectItem value={CandidateStatus.HOT}>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                            Hot
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-200 rounded-2xl min-h-[120px] p-4 px-5 my-3">
            <p className="font-semibold my-2">General Summary</p>

            <div className="grid grid-cols-3 gap-4 my-2 mt-4 ">
              {analytics?.fit_score !== undefined && (
                <div className="flex flex-col gap-3 text-sm p-4 rounded-2xl bg-slate-50">
                  <div className="flex flex-row gap-2 align-middle">
                    <CircularProgress
                      classNames={{
                        svg: "w-28 h-28 drop-shadow-md",
                        indicator: "stroke-indigo-600",
                        track: "stroke-indigo-600/10",
                        value: "text-3xl font-semibold text-indigo-600",
                      }}
                      value={analytics?.fit_score}
                      strokeWidth={4}
                      showValueLabel={true}
                      formatOptions={{ signDisplay: "never" }}
                    />
                    <p className="font-medium my-auto text-xl">
                      Fit Score
                    </p>
                  </div>
                  <div className="">
                    <div className="font-medium ">
                      <span className="font-bold">Feedback: </span>
                      <span className="font-normal">
                        {analytics?.fit_feedback === undefined ? (
                          <Skeleton className="w-[200px] h-[20px]" />
                        ) : (
                          analytics?.fit_feedback
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {analytics?.engagement_score !== undefined && (
                <div className="flex flex-col gap-3 text-sm p-4 rounded-2xl bg-slate-50">
                  <div className="flex flex-row gap-2 align-middle">
                    <CircularProgress
                      classNames={{
                        svg: "w-28 h-28 drop-shadow-md",
                        indicator: "stroke-indigo-600",
                        track: "stroke-indigo-600/10",
                        value: "text-3xl font-semibold text-indigo-600",
                      }}
                      value={analytics?.engagement_score}
                      strokeWidth={4}
                      showValueLabel={true}
                      formatOptions={{ signDisplay: "never" }}
                    />
                    <p className="font-medium my-auto text-xl">
                      Engagement Score
                    </p>
                  </div>
                  <div className="">
                    <div className="font-medium ">
                      <span className="font-bold">Feedback: </span>
                      <span className="font-normal">
                        {analytics?.engagement_feedback === undefined ? (
                          <Skeleton className="w-[200px] h-[20px] font-normal" />
                        ) : (
                          analytics?.engagement_feedback
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-3 text-sm p-4 rounded-2xl bg-slate-50">
                <div className="flex flex-row gap-2  align-middle">
                  <p className="my-auto font-bold">Lead Sentiment: </p>
                  <div
                    className={`${
                      analytics?.lead_sentiment == "Neutral"
                        ? "text-yellow-500"
                        : analytics?.lead_sentiment == "Negative"
                          ? "text-red-500"
                          : analytics?.lead_sentiment == "Positive"
                            ? "text-green-500"
                            : "text-transparent"
                    } text-xl`}
                  >
                    {analytics?.lead_sentiment}
                  </div>
                </div>
                <div className="">
                  <div className="font-medium  ">
                    <span className="font-bold">Summary: </span>
                    <span className="font-normal">
                      {analytics?.summary === undefined ? (
                        <Skeleton className="w-[200px] h-[20px] font-normal" />
                      ) : (
                        analytics?.summary
                      )}
                    </span>
                  </div>
                </div>
                <p className="font-medium ">
                  {call?.call_analysis?.call_completion_rating_reason}
                </p>
              </div>
            </div>
          </div>
          {response &&
            response.details &&
            response.details.length > 0 && (
              <div className="bg-slate-200 rounded-2xl min-h-[120px] p-4 px-5 my-3">
                <p className="font-semibold my-2 mb-4">Question Summary</p>
                <ScrollArea className="rounded-md h-72 text-sm mt-3 py-3 leading-6 overflow-y-scroll whitespace-pre-line px-2">
                  {response?.details.map((question: any, index: number) => (
                    <QuestionAnswerCard
                      key={question.agent}
                      questionNumber={index + 1}
                      question={question.agent}
                      answer={question.lead}
                    />
                  ))}
                </ScrollArea>
              </div>
            )}
        </>
      )}
    </div>
  );
}

export default ResponseInfo;
