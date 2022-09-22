/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import Event from '@ioc:Adonis/Core/Event'

import ApplicationReportsController from 'App/Controllers/Http/ApplicationReportsController'
import Application from 'App/Models/Application'

Event.on('new:application', (application: Application) =>
  ApplicationReportsController.refreshApplication(application)
)

Event.on('notify:application:shutdown', (application) => {
  console.log('Application shutdown', application)
})
