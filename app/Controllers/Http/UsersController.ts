import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuidv4 } from 'uuid'

export default class UsersController {
  public async generateTelegramVerificationCode({ auth, response }: HttpContextContract) {
    const telegramVerificationCode = uuidv4()
    auth.user?.merge({ telegramVerificationCode })
    await auth.user?.save()

    return response.json({ code: telegramVerificationCode })
  }
}
