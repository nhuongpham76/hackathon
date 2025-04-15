import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

const updateConversation = async (payload: any, id: any) => {
  const { error, data } = await supabase
    .from("conversations")
    .update({ ...payload })
    .eq("id", id);
  if (error) {
    console.error("Error update conversation:", error);

    return [];
  }

  return data;
};

const updateConversationQuestion = async (payload: any, id: any) => {
  const { error, data } = await supabase
    .from("conversation_questions")
    .update({ ...payload })
    .eq("id", id);
  if (error) {
    console.error("Error update conversation question:", error);

    return [];
  }

  return data;
};

const createConversation = async (payload: any) => {
  const { error, data } = await supabase
    .from("conversations")
    .insert({ ...payload })
    .select("id");

  if (error) {
    console.error("Error create conversation:", error);

    return [];
  }

  return data[0]?.id;
};

const createConversationQuestion = async (payload: any) => {
  const { error, data } = await supabase
    .from("conversation_questions")
    .insert({ ...payload })
    .select("id");

  if (error) {
    console.error("Error create conversation question:", error);

    return null;
  }

  return data[0]?.id;
};

const getCurrentConversation = async (senderId: any) => {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq('fb_id', senderId)
    .eq('status', 'start')
    .order("id", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching conversation:", error);

    return null;
  }

  return data;
};

const getCurrentConversationQuestion = async (conversationId: any) => {
  const { data, error } = await supabase
    .from("conversation_questions")
    .select("*")
    .eq('conversation_id', conversationId)
    .is('answer_text', null)
    .order("id", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching conversation question:", error);

    return null;
  }

  return data;
};

const getConversationQuestionById = async (conversationQuestionId: any) => {
  const { data, error } = await supabase
    .from("conversation_questions")
    .select("*")
    .eq('id', conversationQuestionId)
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching conversation question:", error);

    return null;
  }

  return data;
};

const getAllConversationQuestion = async (conversationId: any) => {
  const { data, error } = await supabase
    .from("conversation_questions")
    .select("*")
    .eq('conversation_id', conversationId)
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching conversation:", error);

    return null;
  }

  return data.map((item) => ({
    agent: item.question_text,
    lead: item.answer_text,
  }));
};

export const ConversationService = {
  updateConversation,
  updateConversationQuestion,
  createConversationQuestion,
  createConversation,
  getCurrentConversation,
  getCurrentConversationQuestion,
  getAllConversationQuestion,
  getConversationQuestionById,
};
