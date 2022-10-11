// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { performance } from 'perf_hooks'
import { DateTime } from 'luxon'
import Event from '@ioc:Adonis/Core/Event'

import axios from 'axios'

import Application from 'App/Models/Application'
import ApplicationReport from 'App/Models/ApplicationReport'

export default class ApplicationReportsController {
  public async refresh() {
    const applications = await Application.query()

    const promises = []
    // @ts-ignore
    for (const application of applications) promises.push(this.refreshApplication(application))

    await Promise.all(promises)
  }

  public async refreshApplication(application: Application) {
    const report = new ApplicationReport()
    report.applicationId = application.id

    let res
    const startTime = performance.now()
    try {
      report.requestTime = DateTime.local()

      res = await axios.get(application.url)
      application.active = true
    } catch (e) {
      res = e.response
      application.active = false
      Event.emit('notify:application:shutdown', application)
    } finally {
      const endTime = performance.now()

      report.responseTime = DateTime.local()
      report.responseTimeMs = Math.round(endTime - startTime)
    }

    report.status = res.status
    report.statusText = res.statusText

    await application.save()
    await report.save()
  }
}
