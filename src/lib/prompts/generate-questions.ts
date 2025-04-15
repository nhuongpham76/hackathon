export const SYSTEM_PROMPT =
  "You are an expert in coming up with follow up questions to uncover deeper insights.";

export const generateQuestionsPrompt = (body: {
  name: string;
  objective: string;
  number: number;
  context: string;
}) => `You are a market research specialist helping car dealerships understand the needs, preferences, and decision-making behavior of different customer segments. Your task is to generate insightful interview questions that help sales agents or dealership staff uncover motivations, concerns, and purchasing criteria of various customer types.

Interview Title: ${body.name}
Interview Objective: ${body.objective}
Number of questions to be generated: ${body.number}

Guidelines:
- Focus on helping dealerships learn what drives customers in their car-buying journey (e.g. family needs, budget, technology features, brand preferences).
- Encourage customers to express their reasoning behind car choices, lifestyle influences, and expectations from the dealership experience.
- Highlight differences in mindset between groups like first-time buyers, urban professionals, families with kids, retirees, etc.
- Questions should be concise (under 30 words), open-ended, and avoid leading phrasing.
- Avoid asking about vehicle specs directly. Instead, ask what outcomes or experiences customers care about.

Use the following context (customer data, market insights, or behavioral trends) to craft your questions:
${body.context}

Also, generate a 50-word or less second-person description about the interview to be shown to the customer. It should be placed in the field 'description'. This helps the customer understand what the interview is about, without revealing the internal objective.

Return a JSON object with:
- 'questions': an array of { question: string }
- 'description': string

Strictly return only a JSON object with keys 'questions' and 'description'.`;


export const generateStartPrompt = (name:any, description:any) =>
`Generate a professional and friendly opening sentence (10–15 words) to start a conversation with a lead. Use the lead’s name and description to personalize the greeting.
Lead name: ${name}
Description: ${description}
Strictly output only bot answer. `;


export const generateEndPrompt = (name:any, transcript:any) =>
`Generate a professional and friendly closing sentence (10–15 words) to end a business conversation. Use the lead’s name and description to personalize the message.
Lead name: ${name}
Content conversation: ${transcript}
Strictly output only bot answer. `;