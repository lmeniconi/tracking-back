import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'

import { kebabCase } from 'lodash'

import Application from 'App/Models/Application'

import axios from 'axios'
export default class ApplicationsController {
  public async index({ auth, response }: HttpContextContract) {
    const user = auth.user
    if (!user) return response.unauthorized()

    return await Application.query().where('userId', user.id)
  }

  public async store({ auth, request, response }: HttpContextContract) {
    const user = auth.user
    if (!user) return response.unauthorized()

    // TODO: validate request

    const { name, url } = request.all()

    try {
      await axios.get(url)
    } catch {
      return response.abort({ message: 'Invalid URL or service is down' })
    }

    const puppeteer = require('puppeteer')
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    await page.waitForTimeout(500)
    const sc = await page.screenshot({
      encoding: 'binary',
      type: 'png',
    })
    await browser.close()

    const picture = kebabCase(`${user.id} ${name}`) + '.png'
    await Drive.put(picture, sc, {
      visibility: 'private',
      contentType: 'image/png',
    })

    return await Application.create({
      name,
      url,
      picture,
      userId: user.id,
    })
  }
}
