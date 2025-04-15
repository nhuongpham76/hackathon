export interface Conversation {
  id: bigint;
  interview_id: string;
  fb_id: string | null;
  fb_name: string | null;
  current_index: number | 0;
  status: string ;
  started_at: Date;
  updated_at: Date;
}

export interface ConversationQuestion {
  id: bigint;
  conversation_id: string;
  question_text: string | null;
  answer_text: string | null;
  asked_at: Date;
  answered_at: Date;
  reminder_sent: Boolean;
}
