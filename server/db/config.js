const config = require('../../env/config');
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'app_test'
  },
  pool: {
    min: 1,
    max: 5
  }
});

knex.schema.hasTable('news').then(result => {
  if (!result) {
    return knex.schema.createTable('news', table => {
      // TODO: Make increments UUID from watson
      table.string('articleId').primary().unique();
      table.string('title');
      table.integer('rating');
      table.decimal('lat', 10, 8);
      table.decimal('lng', 11, 8);
      table.string('category');
      table.string('description');
      table.string('source');
      table.string('url');
      table.dateTime('published');
      table.timestamp('created_at');
    });
  }
  return 0;
});

module.exports = knex;
