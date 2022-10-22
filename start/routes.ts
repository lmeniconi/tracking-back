/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/login', 'AuthController.auth0')
Route.get('/authorized', 'AuthController.auth0Callback')
Route.get('/logout', 'AuthController.logout').middleware('auth')
Route.get('/logout/callback', 'AuthController.logoutCallback')

Route.group(() => {
  Route.get('/me', 'AuthController.me')
  Route.post('/me/:type/notifications', 'UsersController.toggleNotifications')
  Route.post('/me/telegram/verification-code', 'UsersController.generateTelegramVerificationCode')

  Route.resource('/applications', 'ApplicationsController').apiOnly()
}).middleware('auth')

Route.group(() => {
  Route.post('/applications/reports/refresh', 'ApplicationReportsController.refresh')
}).middleware('authApiToken')
