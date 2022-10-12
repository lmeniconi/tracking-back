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

import ApplicationReportsController from 'App/Controllers/Http/ApplicationReportsController'
import Application from 'App/Models/Application'

import { useBot } from 'App/Utils/telegraf'

Event.on('new:application', (application: Application) => {
  const controller = new ApplicationReportsController()
  controller.refreshApplication(application)
})

Event.on('notify:application:shutdown', async (appToQuery: Application) => {
  const application = await Application.query()
    .where('id', appToQuery.id)
    .preload('user', (userQuery) => {
      userQuery.preload('telegramChats')
    })
    .firstOrFail()

  if (!application || !application.user) return

  const user = application.user

  if (user.emailNotifications) {
    await Mail.send((message) => {
      message
        .from('no-reply@riporter.com')
        .to(user.email)
        .subject(`Servicio ${application.name} Caido!`)
        .htmlView('emails/applicationShutdown', { application })
    })
  }

  if (user.telegramNotifications) {
    const bot = useBot()
    for (const chat of application.user.telegramChats) {
      bot.telegram.sendMessage(
        chat.telegramChatId,
        `La aplicacion ${application.name} ha dejado de responder.`
      )
    }
  }
})
