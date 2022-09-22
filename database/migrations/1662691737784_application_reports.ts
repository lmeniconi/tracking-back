import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'application_reports'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('status').notNullable()
      table.string('status_text').notNullable()
      table.timestamp('request_time', { useTz: true }).notNullable()
      table.timestamp('response_time', { useTz: true }).notNullable()
      table.integer('response_time_ms').notNullable()

      table
        .integer('application_id')
        .unsigned()
        .references('id')
        .inTable('applications')
        .onDelete('CASCADE')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
