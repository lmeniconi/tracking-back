import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuidv4 } from 'uuid'

export default class UsersController {
  public async toggleNotifications({ auth, params, response }: HttpContextContract) {
    const { type } = params

    const user = auth.user
    if (!user) return response.unauthorized()

    if (type === 'email') user.emailNotifications = !user.emailNotifications
    else if (type === 'telegram') user.telegramNotifications = !user.telegramNotifications

    await user.save()
  }

  public async generateTelegramVerificationCode({ auth, response }: HttpContextContract) {
    const telegramVerificationCode = uuidv4()
    auth.user?.merge({ telegramVerificationCode })
    await auth.user?.save()

    return response.json({ code: telegramVerificationCode })
  }
}
