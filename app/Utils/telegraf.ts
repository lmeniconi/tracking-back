import Env from '@ioc:Adonis/Core/Env'
import { Telegraf } from 'telegraf'

export function useBot() {
  return new Telegraf(Env.get('TELEGRAM_BOT_TOKEN'))
}
