import {generateStartPrompt, generateEndPrompt} from "@/lib/prompts/generate-questions";

const getStartMessage = async (name: any, description: any) => {
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
            "role": "user",
            "content": generateStartPrompt(name, description)
          }
        ]
      }),
    });
    const baseCompletion = await data.json();
    const basePromptOutput = baseCompletion?.choices[0] || {};

    return basePromptOutput.message?.content;
  } catch (err) {
    return '';
  }
};

const getEndMessage = async (name: any, transcript: any) => {
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
            "role": "user",
            "content": generateEndPrompt(name, transcript)
          }
        ]
      }),
    });
    const baseCompletion = await data.json();
    const basePromptOutput = baseCompletion?.choices[0] || {};

    return basePromptOutput.message?.content;
  } catch (err) {
    return '';
  }
};

const getRemindMessage = async () => {
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
            "role": "user",
            "content": `Output only the reminder message comeback conversation, 10–15 words, friendly and natural tone.`
          }
        ]
      }),
    });
    const baseCompletion = await data.json();
    const basePromptOutput = baseCompletion?.choices[0] || {};

    return basePromptOutput.message?.content;
  } catch (err) {
    return '';
  }
};

export const AIService = {
  getStartMessage,
  getEndMessage,
  getRemindMessage,
};
