export const SYSTEM_PROMPT = `You are an expert in analyzing communication skills from agent transcripts. Your task is to:
1. Analyze the communication skills demonstrated in the transcript
2. Identify specific quotes that support your analysis
3. Provide a detailed breakdown of strengths and areas for improvement`;

export const getCommunicationAnalysisPrompt = (
  transcript: string,
  description: string | null,
  mainQuestions: string | null,
) => `You are an expert in analyzing customer agent transcripts for car dealerships.

Your task is to evaluate the following transcript using the provided main questions and compare it with the target customer segment description. You must only use the main questions provided -- do NOT generate or infer any additional questions.

### Transcript:
${transcript}

Main Agent Questions:
${mainQuestions}

Based on this data, return a JSON object with the following structure:

{
 "lead_sentiment": string, // Based on the overall tone and content of the transcript, select one of: "Positive", "Neutral", or "Negative"
 
 "fit_score": number, // 0-100 score based on how well the lead's answers reflect alignment with the target customer segment
 "fit_feedback": string, // Explain in 3-4 sentences how the potential customer's needs, preferences, and answers align with the target segment. Based on their responses, recommend the most suitable car type (e.g., Sedan, Hatchback, SUV, Crossover, MPV/Minivan, Coupe, Convertible/Cabriolet, Pickup, Limousine) and suggest an ideal color option for the customer.
 "engagement_score": number, // 0-100 score based on the enthusiasm, clarity, and level of interest shown in responses
 "engagement_feedback": string, // 2-3 sentence summary of how engaged and responsive the lead was during the conversation
 "summary": string, // A short 2-3 sentence summary describing how closely this lead aligns with the customer segment described in ${description}
 
 "level": string, // Based on the above analysis, categorize the lead into one of three levels:
   - "HOT" if highly aligned and enthusiastic
   - "WARM" if moderately aligned or uncertain
   - "COLD" if poorly aligned or disengaged
}

### Fit Score Calculation Guidelines:

- **HOT**: A **fit_score** between 70-100 is given when the lead's answers closely align with the target customer segment. This indicates strong interest and a clear need that matches the segment's key features (e.g., a family prioritizing safety and space, or a high-end buyer valuing technology).
- **WARM**: A **fit_score** between 40-69 is given when the lead's answers show partial alignment but also indicate uncertainty or mixed preferences. This segment may need more information or support to decide.
- **COLD**: A **fit_score** between 0-39 is given when the lead's responses do not align with the target segment's key needs. This may indicate that the lead is not fully engaged or is focused on factors irrelevant to the target segment.

---
### Engagement Score Calculation Guidelines:

- **Low Engagement (0-30)**: The customer gives short, unclear, or uninterested responses. There is little to no enthusiasm or effort to engage with the conversation. Example: "I'm just here to look at prices," or "Not interested in the details."
- **Medium Engagement (31-70)**: The customer participates moderately. They provide responses with some detail but may not show significant enthusiasm. Example: "I'm interested in fuel efficiency, but also looking for a family car," or "I need a car with some tech features, but not a top priority."
- **High Engagement (71-100)**: The customer is actively participating with enthusiasm, asking clarifying questions or providing detailed, thoughtful responses. Example: "I'm looking for a car with great safety features for my family, and I need a hybrid option. Can you tell me more about fuel economy?" or "I'm considering this car because of its advanced tech. Does it support Apple CarPlay?"

---

**Notes for fit_score and engagement_score calculation**:
- **fit_score**: Measures how well the lead's answers align with the target customer segment's needs and preferences (e.g., safety, budget, brand).
- **engagement_score**: Measures how actively and enthusiastically the customer participates in the conversation, which helps in evaluating their readiness to make a decision.

Strictly return only a valid JSON object with the following keys: lead_sentiment, fit_score, fit_feedback, engagement_score, engagement_feedback, summary, and level.
Do not include any explanation, comments, or extra text. The output must be a raw, valid JSON object that can be safely parsed using JSON.parse() in JavaScript
`;
