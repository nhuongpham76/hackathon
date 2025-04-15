import { NextRequest, NextResponse } from "next/server";
// eslint-disable-next-line import/no-extraneous-dependencies
import {get, isEmpty} from "lodash";
import {InterviewService} from "@/services/interviews.service";
import {ConversationService} from "@/services/conversations.service";
import {FacebookService} from "@/services/facebook.service";
import {ResponseService} from "@/services/responses.service";
import {v4 as uuidv4} from "uuid";
import {AIService} from "@/services/ai.service";

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const body = await req.json();

  const ref = get(body, 'entry.0.messaging.0.postback.referral.ref') || get(body, 'entry.0.messaging.0.referral.ref');
  const text = get(body, 'entry.0.messaging.0.message.text');
  const isEcho = get(body, 'entry.0.messaging.0.message.is_echo');
  const senderId = get(body, 'entry.0.messaging.0.sender.id');
  const user = await FacebookService.getUser(senderId);

  if (isEcho) {
    return NextResponse.json({}, { status: 200 });
  }

  if (ref) {
    const interview = await InterviewService.getInterviewById(ref);
    const question = interview?.questions[0] || '';
    const conversationId = await ConversationService.createConversation({
      interview_id: interview?.id,
      fb_id: senderId,
      fb_name: user.name,
      current_index: 0,
      status: 'start',
      started_at: new Date(),
      updated_at: new Date(),
    });

    const conversationQuestionId = await ConversationService.createConversationQuestion({
      conversation_id: conversationId,
      question_text: question?.question,
      answer_text: null,
      asked_at: new Date(),
      answered_at: null,
      reminder_sent: false,
    });

    reminderConversationQuestion(conversationQuestionId, senderId);

    const startMessage = await AIService.getStartMessage(user.name, interview?.description);
    await FacebookService.sendMessage(senderId, startMessage.replace(/^"|"$/g, ''));
    await new Promise(resolve => setTimeout(resolve, 2000));
    await FacebookService.sendMessage(senderId, question?.question)

    return NextResponse.json({}, { status: 200 });
  } else if (text) {
    switch (text) {
      case "start":
        const interview = await InterviewService.getInterviewRandom();
        const question = interview?.questions[0] || '';
        const conversationId = await ConversationService.createConversation({
          interview_id: interview?.id,
          fb_id: senderId,
          fb_name: user.name,
          current_index: 0,
          status: 'start',
          started_at: new Date(),
          updated_at: new Date(),
        });

        const conversationQuestionId = await ConversationService.createConversationQuestion({
          conversation_id: conversationId,
          question_text: question?.question,
          answer_text: null,
          asked_at: new Date(),
          answered_at: null,
          reminder_sent: false,
        });

        reminderConversationQuestion(conversationQuestionId, senderId);

        const startMessage = await AIService.getStartMessage(user.name, interview?.description);
        await FacebookService.sendMessage(senderId, startMessage.replace(/^"|"$/g, ''));
        await new Promise(resolve => setTimeout(resolve, 2000));
        await FacebookService.sendMessage(senderId, question?.question)
        break;
      default:
        const conversation = await ConversationService.getCurrentConversation(senderId);
        const currentInterview = await InterviewService.getInterviewById(conversation?.interview_id);
        const nextIndex = parseInt(conversation?.current_index || 0) + 1;
        const nextQuestion = currentInterview?.questions[nextIndex];

        if (!conversation || conversation.status !== 'start') {
          FacebookService.sendMessage(senderId, 'No conversation.')

          return NextResponse.json({}, { status: 200 });
        }

        const conversationQuestion = await ConversationService.getCurrentConversationQuestion(conversation.id);

        if (!conversationQuestion) {
          FacebookService.sendMessage(senderId, 'Conversation was completed.')

          return NextResponse.json({}, { status: 200 });
        }

        await ConversationService.updateConversationQuestion({
          answer_text: text,
          answered_at:new Date(),
          reminder_sent: false,
        }, conversationQuestion.id);

        ConversationService.updateConversation({
          current_index: nextIndex,
          status: nextIndex === currentInterview.questions.length ? 'completed' : 'start',
        }, conversation.id);

        if (nextIndex === currentInterview.questions.length) {
          const conversationText = await ConversationService.getAllConversationQuestion(conversation.id)
          // @ts-ignore
          const transcript = conversationText.map(item => {
            return `Agent: ${item.agent}\nLead: ${item.lead}`;
          }).join("\n");

          const endMessage = await AIService.getEndMessage(user.name, transcript);
          FacebookService.sendMessage(senderId, endMessage.replace(/^"|"$/g, ''));

          let mainQuestions = currentInterview?.questions.map((item: { question: any; }) => {
            return `${item.question}`;
          }).join("\n");
          console.log(transcript, currentInterview?.description, mainQuestions)

          const analytics = await ResponseService.getAnalytics(transcript, currentInterview?.description, mainQuestions);
          console.log(analytics)
          const analyticsObj = await JSON.parse(analytics);

          await ResponseService.createResponse({
            created_at: new Date(),
            name: user.name || '',
            interview_id: conversation.interview_id,
            duration: 0,
            call_id: uuidv4(),
            details: conversationText,
            is_analysed: true,
            email: '',
            is_ended: true,
            is_viewed: false,
            analytics: analyticsObj,
            candidate_status: analyticsObj.level,
            tab_switch_count: 0,
          });

          return NextResponse.json({}, { status: 200 });
        }

        const newCQId = await ConversationService.createConversationQuestion({
          conversation_id: conversation.id,
          question_text: nextQuestion?.question,
          answer_text: null,
          asked_at: new Date(),
          answered_at: null,
          reminder_sent: false,
        });

        reminderConversationQuestion(newCQId, senderId);

        FacebookService.sendMessage(senderId, nextQuestion?.question)
    }
  }

  return NextResponse.json({}, { status: 200 });
}

const reminderConversationQuestion = (conversationQuestionId: any, senderId: any) => {
  setTimeout(async () => {
    try {
      const conversationQuestion = await ConversationService.getConversationQuestionById(conversationQuestionId);
      if (isEmpty(conversationQuestion?.answer_text)) {
        const endMessage = await AIService.getRemindMessage();
        FacebookService.sendMessage(senderId, endMessage.replace(/^"|"$/g, ''));
      }
    } catch (err) {
      console.error("Error checking/reminding:", err);
    }
  }, 60000);
};

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  return new Response(challenge, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
}
