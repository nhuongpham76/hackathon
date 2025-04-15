import { NextResponse } from "next/server";
import {
  SYSTEM_PROMPT,
  generateQuestionsPrompt,
} from "@/lib/prompts/generate-questions";
import { logger } from "@/lib/logger";

export const maxDuration = 60;

export async function POST(req: Request, res: Response) {
  logger.info("generate-agent-questions request received");
  const body = await req.json();


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
            "content": generateQuestionsPrompt(body)
          }
        ],
        "response_format": {
          "type": "json_object"
        }
      }),
    });
    const baseCompletion = await data.json();

    const basePromptOutput = baseCompletion?.choices[0] || {};
    const content = basePromptOutput.message?.content;

    logger.info("Agent questions generated successfully");

    return NextResponse.json(
      {
        response: content,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Error generating agent questions");

    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 },
    );
  }
}
