/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import Mail from '@ioc:Adonis/Addons/Mail'
import Event from '@ioc:Adonis/Core/Event'
import TelegramBot from '@ioc:Bot/Telegram'

import Application from 'App/Models/Application'

// Notifications
Event.on(
  'notify:application:shutdown',
  async ({ appToQuery, errorStatusCode }: { appToQuery: Application; errorStatusCode: number }) => {
    const application = await Application.query()
      .where('id', appToQuery.id)
      .preload('user', (userQuery) => {
        userQuery.preload('telegramChats')
      })
      .firstOrFail()

    if (!application || !application.user) return

    const user = application.user

    if (user.emailNotifications)
      await Mail.send((message) => {
        message
          .from('no-reply@riporter.com')
          .to(user.email)
          .subject(`Servicio ${application.name} Caido!`)
          .htmlView('emails/application_shutdown', { application, errorStatusCode })
      })

    if (user.telegramNotifications) {
      for (const chat of application.user.telegramChats) {
        TelegramBot.sendMessage(
          chat.telegramChatId.toString(),
          `La aplicacion ${application.name} ha dejado de responder con el codigo de error: ${errorStatusCode} - Ir a servicio: ${application.url}`
        )
      }
    }
  }
)
