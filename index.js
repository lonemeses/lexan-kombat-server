const TelegramBot = require('node-telegram-bot-api');
const process = require('process')
const dotenv = require('dotenv')
dotenv.config()
const sequelize = require('./db')
const fs = require('fs');
const token = process.env.TOKEN
const PORT = process.env.PORT || 3000;
const express = require('express');
const router = require('./routes/index')
const cors = require('cors');
const FILE_PATH = './chat_ids.json';
const webAppUrl = 'https://magnificent-kashata-7bb32c.netlify.app/'
const bot = new TelegramBot(token, {polling: true});
let chatArray = []

const app = express()
app.use(cors({
    origin: "https://deluxe-faloodeh-cc924f.netlify.app", // Разрешаем запросы с фронта
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
}));
app.use(express.json());

app.use('/api', router)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

if (fs.existsSync(FILE_PATH)) {
    const data = fs.readFileSync(FILE_PATH, 'utf8');
    chatArray = JSON.parse(data); // Загружаем chatId из файла
}

function addChatId(chatId) {
    if (!chatArray.includes(chatId)) {
        chatArray.push(chatId); // Добавляем chatId в массив

        // Сохраняем массив в файл
        fs.writeFileSync(FILE_PATH, JSON.stringify(chatArray, null, 2), 'utf8');
        console.log(`Добавлен chatId: ${chatId}`);
    } else {
        console.log(`chatId ${chatId} уже существует.`);
    }
}

function broadcastMessage(message) {
    chatArray.forEach((chatId) => {
        bot.sendMessage(chatId, message, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Играть в LexanKombat', web_app: {url: webAppUrl}}]
                ]
            }
        }).catch((err) => {
            console.error(`Не удалось отправить сообщение пользователю ${chatId}:`, err);
        });
    });


}

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    addChatId(chatId)
    const text = msg.text;

    if (text === '/start') {
        await bot.sendMessage(chatId, 'Играй по кнопке ниже', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Играть в LexanKombat', web_app: {url: webAppUrl}}]
                ]
            }
        })
    }

});

start()

