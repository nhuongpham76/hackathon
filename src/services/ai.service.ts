import {generateStartPrompt, generateEndPrompt} from "@/lib/prompts/generate-questions";
import OpenAI from "openai";

const getStartMessage = async (name: any, description: any) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      maxRetries: 5,
      dangerouslyAllowBrowser: true,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: generateStartPrompt(name, description),
        },
      ],
    });

    return completion.choices[0]?.message?.content;

    // const data  = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': 'Bearer ' + process.env.OPENROUTER,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     "model": "meta-llama/llama-3.1-70b-instruct",
    //     "messages": [
    //       {
    //         "role": "user",
    //         "content": generateStartPrompt(name, description)
    //       }
    //     ]
    //   }),
    // });
    // const baseCompletion = await data.json();
    // const basePromptOutput = baseCompletion?.choices[0] || {};
    //
    // return basePromptOutput.message?.content;
  } catch (err) {
    return '';
  }
};

const getEndMessage = async (name: any, transcript: any) => {
  try {

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      maxRetries: 5,
      dangerouslyAllowBrowser: true,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: generateEndPrompt(name, transcript)
        },
      ],
    });

    return completion.choices[0]?.message?.content;

    // const data  = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': 'Bearer ' + process.env.OPENROUTER,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     "model": "meta-llama/llama-3.1-70b-instruct",
    //     "messages": [
    //       {
    //         "role": "user",
    //         "content": generateEndPrompt(name, transcript)
    //       }
    //     ]
    //   }),
    // });
    // const baseCompletion = await data.json();
    // const basePromptOutput = baseCompletion?.choices[0] || {};
    //
    // return basePromptOutput.message?.content;
  } catch (err) {
    return '';
  }
};

const getRemindMessage = async () => {
  try {

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      maxRetries: 5,
      dangerouslyAllowBrowser: true,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: 'Output only the reminder message comeback conversation, 10–15 words, friendly and natural tone.'
        },
      ],
    });

    return completion.choices[0]?.message?.content;

    // const data  = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': 'Bearer ' + process.env.OPENROUTER,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     "model": "meta-llama/llama-3.1-70b-instruct",
    //     "messages": [
    //       {
    //         "role": "user",
    //         "content": `Output only the reminder message comeback conversation, 10–15 words, friendly and natural tone.`
    //       }
    //     ]
    //   }),
    // });
    // const baseCompletion = await data.json();
    // const basePromptOutput = baseCompletion?.choices[0] || {};
    //
    // return basePromptOutput.message?.content;
  } catch (err) {
    return '';
  }
};

const getStopConversationMessage = async () => {
  try {

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      maxRetries: 5,
      dangerouslyAllowBrowser: true,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: 'Output only the message for stop conversation, 10–15 words, friendly and natural tone.'
        },
      ],
    });

    return completion.choices[0]?.message?.content;

    // const data  = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': 'Bearer ' + process.env.OPENROUTER,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     "model": "meta-llama/llama-3.1-70b-instruct",
    //     "messages": [
    //       {
    //         "role": "user",
    //         "content": `Output only the message for stop conversation, 10–15 words, friendly and natural tone.`
    //       }
    //     ]
    //   }),
    // });
    // const baseCompletion = await data.json();
    // const basePromptOutput = baseCompletion?.choices[0] || {};
    //
    // return basePromptOutput.message?.content;
  } catch (err) {
    return '';
  }
};

export const AIService = {
  getStartMessage,
  getEndMessage,
  getRemindMessage,
  getStopConversationMessage,
};
