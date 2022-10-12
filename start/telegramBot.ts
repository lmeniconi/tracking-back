/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import { useBot } from 'App/Utils/telegraf'

import User from 'App/Models/User'
import TelegramChat from 'App/Models/TelegramChat'

const bot = useBot()

// Asked Logic memory (use redis probably)
const wasAsked = {}

bot.start((ctx) => {
  ctx.reply('Hola, soy Riporter Bot!')
  ctx.reply('Para comenzar a usar el bot, escribe /register y sigue las instrucciones.')
})

bot.command('register', (ctx) => {
  const chatId = ctx.message.chat.id
  ctx.reply('Escribe el codigo de verificacion de tu cuenta Riporter:')
  wasAsked[chatId] = 'register_verification_code'
})

bot.on('message', async (ctx) => {
  const chatId = ctx.message.chat.id

  if (wasAsked[chatId]) {
    // @ts-ignore
    const answer = ctx.message.text

    if (wasAsked[chatId] === 'register_verification_code') {
      const user = await User.findBy('telegramVerificationCode', answer)
      if (!user) {
        ctx.reply('El codigo de verificacion es incorrecto, intenta de nuevo.')
        return
      }

      const telegramChat = new TelegramChat()
      telegramChat.telegramChatId = chatId
      telegramChat.userId = user.id
      await telegramChat.save()

      user.telegramConnected = true
      user.telegramNotifications = true
      user.telegramVerificationCode = null
      await user.save()

      ctx.reply('Tu cuenta ha sido vinculada con exito!')
    }

    delete wasAsked[chatId]
  }
})

// bot.on('message', async (ctx) => {
//   // pipe url content
//   await ctx.replyWithPhoto({
//     url: 'https://picsum.photos/200/300/?random',
//     filename: 'kitten.jpg',
//   })
// })

// bot.telegram.sendMessage(Env.get('TELEGRAM_CHAT_ID'), 'Hello world')

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
