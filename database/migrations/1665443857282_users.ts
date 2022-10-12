import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('email_notifications').defaultTo(true)
      table.boolean('telegram_connected').defaultTo(false)
      table.boolean('telegram_notifications').defaultTo(false)
      table.string('telegram_verification_code').nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('email_notifications')
      table.dropColumn('telegram_connected')
      table.dropColumn('telegram_notifications')
      table.dropColumn('telegram_verification_code')
    })
  }
}
