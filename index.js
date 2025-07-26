require('dotenv').config();
const venom = require('venom-bot');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

venom
  .create({
    session: 'bot',
    multidevice: true,
    headless: true,
    folderNameToken: 'tokens', // Reutiliza a sessão salva
  })
  .then((client) => {
    client.onMessage(async (message) => {
      if (!message.isGroupMsg && message.body) {
        try {
          const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'user', content: message.body },
            ],
          });

          const reply = response.choices[0].message.content;
          await client.sendText(message.from, reply);
        } catch (error) {
          console.error('Erro ao responder:', error.message);
        }
      }
    });
  })
  .catch((erro) => {
    console.error('Erro ao iniciar o Venom:', erro);
  });
