"use client";

import { Interview, Question } from "@/types/interview";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {Pencil} from "lucide-react";
import QuestionCard from "@/components/dashboard/interview/create-popup/questionCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";

type EditQuestionsProps = {
  interview: Interview | undefined;
};

function ShowQuestions({ interview }: EditQuestionsProps) {

  const [objective, setObjective] = useState<string>(
    interview?.objective || "",
  );
  const [interviewId, setInterviewId] = useState<string>(
    interview?.id || '',
  );
  const [numQuestions, setNumQuestions] = useState<number>(
    interview?.question_count || 1,
  );
  const [duration, setDuration] = useState<Number>(
    Number(interview?.time_duration),
  );
  const [questions, setQuestions] = useState<Question[]>(
    interview?.questions || [],
  );

  const endOfListRef = useRef<HTMLDivElement>(null);
  const prevQuestionLengthRef = useRef(questions.length);
  const router = useRouter();

  const handleInputChange = (id: string, newQuestion: Question) => {
    setQuestions(
      questions.map((question) =>
        question.id === id ? { ...question, ...newQuestion } : question,
      ),
    );
  };

  const handleDeleteQuestion = (id: string) => {
    if (questions.length === 1) {
      setQuestions(
        questions.map((question) => ({
          ...question,
          question: "",
          follow_up_count: 1,
        })),
      );

      return;
    }
    setQuestions(questions.filter((question) => question.id !== id));
    setNumQuestions(numQuestions - 1);
  };

  const handleAddQuestion = () => {
    if (questions.length < numQuestions) {
      setQuestions([
        ...questions,
        { id: uuidv4(), question: "", follow_up_count: 1 },
      ]);
    }
  };

  useEffect(() => {
    if (questions.length > prevQuestionLengthRef.current) {
      endOfListRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevQuestionLengthRef.current = questions.length;
  }, [questions.length]);

  return (
    <div className="z-[10] mx-2 my-2">
      <div className="bg-slate-200 rounded-2xl min-h-[120px] p-2 ">
        <div className="flex flex-row gap-2 justify-between items-center mx-2">
          <div className="flex flex-row gap-2 items-center">
            <p className="font-semibold my-2">Agent</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="bg-transparent shadow-none text-xs text-indigo-600 px-0 h-7 hover:scale-110 relative"
                  onClick={(event) => {
                    router.push(
                      `/lead/${interview?.id}?edit=true`,
                    );
                  }}
                >
                  <Pencil size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                className="bg-zinc-300"
                side="bottom"
                sideOffset={4}
              >
                <span className="text-black flex flex-row gap-4">Edit</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="mt-3 mb-1 ml-2 font-medium">Objective</p>
        <textarea
          disabled={true}
          value={objective}
          className="h-fit mt-3 pt-1 border-2 rounded-md w-full px-2 border-gray-400"
          placeholder="Enter your interview objective here."
          rows={3}
          onBlur={(e) => setObjective(e.target.value.trim())}
        />
        <div className="flex flex-row justify-between w-[75%] gap-3 ml-2">
          <div className="flex flex-row justify-center items-center mt-5 ">
            <h3 className="font-medium ">No. of Questions:</h3>
            <input
              type="number"
              min={questions.length.toString()}
              className="border-2 text-center focus:outline-none  bg-slate-100 rounded-md border-gray-500 w-14 px-2 py-0.5 ml-3"
              value={numQuestions}
              disabled={true}
            />
          </div>
          {/*<div className="flex flex-row items-center mt-5">*/}
          {/*  <h3 className="font-medium ">Duration (mins):</h3>*/}
          {/*  <input*/}
          {/*    type="number"*/}
          {/*    className="border-2 text-center focus:outline-none bg-slate-100 rounded-md border-gray-500 w-14 px-2 py-0.5 ml-3"*/}
          {/*    value={Number(duration)}*/}
          {/*    disabled={true}*/}
          {/*  />*/}
          {/*</div>*/}
        </div>
        <p className="mt-3 mb-1 ml-2 font-medium">Questions</p>
        <ScrollArea className="flex ml-2 p-2 pr-4 mb-4 flex-col justify-center items-center max-h-[500px] bg-slate-100 rounded-md text-sm mt-3">
          {questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              questionNumber={index + 1}
              questionData={question}
              disabled={true}
            />
          ))}
          <div ref={endOfListRef} />
          {/*{questions.length < numQuestions ? (*/}
          {/*  <div*/}
          {/*    className="border-indigo-600 opacity-75 hover:opacity-100 w-fit text-center rounded-full mx-auto"*/}
          {/*    onClick={handleAddQuestion}*/}
          {/*  >*/}
          {/*    <Plus*/}
          {/*      size={45}*/}
          {/*      strokeWidth={2.2}*/}
          {/*      className="text-indigo-600 text-center cursor-pointer"*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*) : (*/}
          {/*  <></>*/}
          {/*)}*/}
        </ScrollArea>
      </div>
    </div>
  );
}

export default ShowQuestions;
