import { telegramBotConfig } from 'Config/telegramBot'
import { Telegraf } from 'telegraf'

import User from 'App/Models/User'
import TelegramChat from 'App/Models/TelegramChat'

export default class TelegramBotProvider {
  protected bot: Telegraf
  protected wasAsked: { [index: string]: string } = {}

  constructor(config: typeof telegramBotConfig) {
    this.bot = new Telegraf(config.token)
    this.init()
  }

  private init() {
    this.bot.start((ctx) => {
      ctx.reply('Hola, soy Riporter Bot!')
      ctx.reply('Para comenzar a usar el bot, escribe /register y sigue las instrucciones.')
    })

    this.bot.command('register', (ctx) => {
      const chatId = ctx.message.chat.id
      ctx.reply('Escribe el codigo de verificacion de tu cuenta Riporter:')
      this.wasAsked[chatId] = 'register_verification_code'
    })

    this.bot.on('message', async (ctx) => {
      const chatId = ctx.message.chat.id

      if (this.wasAsked[chatId]) {
        // @ts-ignore
        const answer = ctx.message.text

        if (this.wasAsked[chatId] === 'register_verification_code') {
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

        delete this.wasAsked[chatId]
      }
    })

    this.bot.launch()

    // Enable graceful stop
    process.once('SIGINT', () => this.bot.stop('SIGINT'))
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'))
  }

  public sendMessage(chatId: string, text: string): void {
    this.bot.telegram.sendMessage(chatId, text)
  }
}
