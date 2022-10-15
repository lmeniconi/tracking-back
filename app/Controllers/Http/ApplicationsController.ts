import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'

import { kebabCase } from 'lodash'
import axios from 'axios'

import Application from 'App/Models/Application'
import ApplicationReportsController from 'App/Controllers/Http/ApplicationReportsController'

export default class ApplicationsController {
  public async index({ auth, response }: HttpContextContract) {
    const user = auth.user
    if (!user) return response.unauthorized()

    return await Application.query().where('userId', user.id).preload('reports')
  }

  public async show({ auth, params, response }: HttpContextContract) {
    const user = auth.user
    if (!user) return response.unauthorized()

    const { id } = params

    return await Application.query().where('id', id).where('userId', user.id).preload('reports')
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

    const application = await Application.create({
      name,
      url,
      picture,
      userId: user.id,
    })

    const applicationReportsController = new ApplicationReportsController()
    applicationReportsController.refreshApplication(application)

    return response.created()
  }

  public async destroy({ auth, response, params }: HttpContextContract) {
    const user = auth.user
    if (!user) return response.unauthorized()

    const { id } = params
    const application = await Application.findOrFail(id)

    if (application.userId !== user.id) return response.unauthorized()

    await Drive.delete(application.picture)
    await application.delete()
  }
}
