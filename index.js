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
  folderNameToken: '/app/storage'
})
  .then((client) => {
    client.onMessage(async (message) => {
      if (!message.isGroupMsg && message.body) {
        try {
          const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'user',
                content: message.body,
              },
            ],
          });

          const reply = response.choices[0].message.content;
          await client.sendText(message.from, reply);
        } catch (error) {
          console.error('Erro ao consultar OpenAI:', error.message);
          await client.sendText(
            message.from,
            '⚠️ Ocorreu um erro ao gerar a resposta da IA.'
          );
        }
      }
    });
  })
  .catch((erro) => {
    console.error('Erro ao iniciar o Venom:', erro);
  });
