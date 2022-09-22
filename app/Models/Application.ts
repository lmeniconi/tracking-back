import { DateTime } from 'luxon'
import {
  afterFetch,
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  computed,
  HasMany,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Env from '@ioc:Adonis/Core/Env'
import Drive from '@ioc:Adonis/Core/Drive'

import User from './User'
import ApplicationReport from './ApplicationReport'

export default class Application extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public url: string

  @column()
  public picture: string

  @column()
  public active: boolean = true

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => ApplicationReport)
  public reports: HasMany<typeof ApplicationReport>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public previewUrl: string

  @afterFetch()
  public static async afterFetchHook(applications: Application[]) {
    for (const application of applications) {
      const url = Env.get('APP_URL') + (await Drive.getSignedUrl(application.picture))
      application.previewUrl = url
    }
  }
}
