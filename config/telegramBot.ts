import Env from '@ioc:Adonis/Core/Env'

export const telegramBotConfig = {
  enabled: Env.get('TELEGRAM_BOT_ENABLED'),
  token: Env.get('TELEGRAM_BOT_TOKEN'),
}
