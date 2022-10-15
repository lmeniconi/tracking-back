import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { CamelCaseNamingStrategy } from './CamelCaseNamingStrategy'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings

    // Telegram Bot Provider
    this.app.container.singleton('Bot/Telegram', () => {
      const { telegramBotConfig } = this.app.config.get('telegramBot')
      if (!telegramBotConfig.enabled) return null

      const TelegramBot = require('./TelegramBotProvider').default
      return new TelegramBot(telegramBotConfig)
    })
  }

  public async boot() {
    // IoC container is ready
    const { BaseModel } = await import('@ioc:Adonis/Lucid/Orm')
    BaseModel.namingStrategy = new CamelCaseNamingStrategy()
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
