import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {getCommunicationAnalysisPrompt, SYSTEM_PROMPT} from "@/lib/prompts/communication-analysis";

const supabase = createClientComponentClient();

const createResponse = async (payload: any) => {
  const { error, data } = await supabase
    .from("response")
    .insert({ ...payload })
    .select("id");

  if (error) {
    console.log(error);

    return [];
  }

  return data[0]?.id;
};

const saveResponse = async (payload: any, call_id: string) => {
  const { error, data } = await supabase
    .from("response")
    .update({ ...payload })
    .eq("call_id", call_id);
  if (error) {
    console.log(error);

    return [];
  }

  return data;
};

const saveResponseById = async (payload: any, id: any) => {
  const { error, data } = await supabase
    .from("response")
    .update({ ...payload })
    .eq("id", id);
  if (error) {
    console.log(error);

    return [];
  }

  return data;
};

const getAllResponses = async (interviewId: string) => {
  try {
    const { data, error } = await supabase
      .from("response")
      .select(`*`)
      .eq("interview_id", interviewId)
      // .or(`details.is.null, details->call_analysis.not.is.null`)
      .eq("is_ended", true)
      .order("created_at", { ascending: false });

    return data || [];
  } catch (error) {
    console.log(error);

    return [];
  }
};

const getAllEmailAddressesForInterview = async (interviewId: string) => {
  try {
    const { data, error } = await supabase
      .from("response")
      .select(`email`)
      .eq("interview_id", interviewId);

    return data || [];
  } catch (error) {
    console.log(error);

    return [];
  }
};

const getResponseByCallId = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("response")
      .select(`*`)
      .filter("call_id", "eq", id);

    return data ? data[0] : null;
  } catch (error) {
    console.log(error);

    return [];
  }
};

const getResponseById = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("response")
      .select(`*`)
      .filter("id", "eq", id);

    return data ? data[0] : null;
  } catch (error) {
    console.log(error);

    return [];
  }
};

const deleteResponse = async (id: string) => {
  const { error, data } = await supabase
    .from("response")
    .delete()
    .eq("call_id", id);
  if (error) {
    console.log(error);

    return [];
  }

  return data;
};

const deleteResponseById = async (id: number) => {
  const { error, data } = await supabase
    .from("response")
    .delete()
    .eq("id", id);
  if (error) {
    console.log(error);

    return [];
  }

  return data;
};

const updateResponse = async (payload: any, call_id: string) => {
  const { error, data } = await supabase
    .from("response")
    .update({ ...payload })
    .eq("call_id", call_id);
  if (error) {
    console.log(error);

    return [];
  }

  return data;
};

const updateResponseById = async (payload: any, id: number) => {
  const { error, data } = await supabase
    .from("response")
    .update({ ...payload })
    .eq("id", id);
  if (error) {
    console.log(error);

    return [];
  }

  return data;
};

const getAnalytics = async (body: any, description: any | null, mainQuestions: any | null) => {
  try {
    const data  = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.OPENROUTER,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "model": "meta-llama/llama-3.1-70b-instruct",
        "messages": [
          {
            "role": "system",
            "content": SYSTEM_PROMPT,
          },
          {
            "role": "user",
            "content": getCommunicationAnalysisPrompt(body, description, mainQuestions)
          }
        ],
        "response_format": {
          "type": "json_object"
        }
      }),
    });
    const baseCompletion = await data.json();

    const basePromptOutput = baseCompletion?.choices[0] || {};

    return basePromptOutput.message?.content;
  } catch (error) {
    console.error("Error analyzing communication skills", error);

    return null;
  }
};

export const ResponseService = {
  createResponse,
  saveResponse,
  saveResponseById,
  updateResponse,
  updateResponseById,
  getAllResponses,
  getResponseByCallId,
  getResponseById,
  deleteResponse,
  deleteResponseById,
  getAllEmails: getAllEmailAddressesForInterview,
  getAnalytics,
};
