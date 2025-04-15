const sendMessage = async (senderId: any, text: any) => {
  fetch(`https://graph.facebook.com/v22.0/${process.env.FACEBOOK_PAGE_ID}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "recipient": {'id': senderId},
      "messaging_type": "RESPONSE",
      "message": {'text': text},
      "access_token": process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
    }),
  });
};

const getUser = async (senderId: any) => {
  const response = await fetch(`https://graph.facebook.com/v22.0/${senderId}?fields=name&access_token=${process.env.FACEBOOK_PAGE_ACCESS_TOKEN}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  return await response.json();
};

export const FacebookService = {
  sendMessage,
  getUser,
};
