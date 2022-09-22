import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'

export default class AuthApiToken {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const token = request.header('Authorization')
    if (!token || token !== Env.get('APP_API_TOKEN')) return response.unauthorized()

    await next()
  }
}
