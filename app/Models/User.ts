import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

import Application from './Application'
import TelegramChat from './TelegramChat'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public picture: string

  @column()
  public provider: 'auth0'

  @column()
  public emailNotifications: boolean

  @column()
  public telegramConnected: boolean

  @column()
  public telegramNotifications: boolean

  @column()
  public telegramVerificationCode: string | null

  @hasMany(() => Application)
  public applications: HasMany<typeof Application>

  @hasMany(() => TelegramChat)
  public telegramChats: HasMany<typeof TelegramChat>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
