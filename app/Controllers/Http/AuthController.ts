import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'

import User from 'App/Models/User'

export default class AuthController {
  public async me({ auth, response }) {
    if (!auth.user) return response.unauthorized()
    return auth.user
  }

  public auth0({ request, response, session }: HttpContextContract) {
    const state = uuidv4()
    const redirectUri = request.input('redirectUri')

    session.put('state', state)
    session.put('redirectUri', redirectUri)

    return response.redirect(
      Env.get('AUTH0_DOMAIN') +
        '/authorize' +
        '?' +
        new URLSearchParams({
          client_id: Env.get('AUTH0_CLIENT_ID'),
          redirect_uri: Env.get('APP_URL') + '/authorized',
          response_type: 'code',
          scope: 'openid profile email',
          state,
        }).toString()
    )
  }

  public async auth0Callback({ auth, request, response, session }: HttpContextContract) {
    // const state = request.input('state')
    // const sessionState = session.get('state')

    // if (state !== sessionState) return response.badRequest('Invalid state')

    const code = request.input('code')
    let res = await axios.post(Env.get('AUTH0_DOMAIN') + '/oauth/token', {
      client_id: Env.get('AUTH0_CLIENT_ID'),
      client_secret: Env.get('AUTH0_CLIENT_SECRET'),
      code,
      grant_type: 'authorization_code',
      redirect_uri: Env.get('APP_URL') + '/authorized',
    })

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { access_token } = res.data

    res = await axios.get(Env.get('AUTH0_DOMAIN') + '/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    const { data } = res

    let user = await User.findBy('email', data.email)
    if (!user) user = new User()
    user.email = data.email
    user.picture = data.picture
    user.provider = 'auth0'
    await user.save()

    await auth.login(user)

    return response.redirect(session.get('redirectUri') || Env.get('FRONTEND_URL'))
  }

  public async logout({ response }) {
    return response.redirect(
      Env.get('AUTH0_DOMAIN') +
        '/v2/logout?' +
        new URLSearchParams({
          client_id: Env.get('AUTH0_CLIENT_ID'),
          returnTo: Env.get('APP_URL') + '/logout/callback',
        }).toString()
    )
  }

  public async logoutCallback({ auth, response }) {
    await auth.logout()
    return response.redirect(Env.get('FRONTEND_URL'))
  }
}
