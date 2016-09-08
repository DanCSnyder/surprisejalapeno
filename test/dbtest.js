const knex = require('knex');
const expect = require('chai').expect;

describe('MySQL DB', () => {
  var db;
  const model = {
    fetchAll() {
      return db.select().from('news')
      .catch(err => console.log(`Error fetching data from "news" table ${err}`));
    },
    getByTitle(title) {
      return db('news').where('title', title)
      .catch(err => console.log(`Error getting record by title ${err}`));
    },
    getByLocation(loc) {
      return db('news').where('location', loc).orderBy('rating', 'desc')
      .catch(err => console.log(`Error getting records by location ${err}`));
    },
    add(data) {
      return db('news').insert(data, 'id')
      .catch(err => console.log(`Error inserting into "news" table ${err}`));
    }
  };
  const data1 = {
    title: 'Test',
    rating: 9000,
    location: 'Nowhere, Kansas',
    category: 'Fake',
    description: '...it\'s a test',
    source: 'Al Jazeera',
    url: 'www.test.com',
    published: '2016-09-07T21:59:00'
  };
  const data2 = {
    title: 'Another test',
    rating: 9001,
    location: 'Somewhere, Oregon',
    category: 'Fake',
    description: 'yet another test',
    source: 'The Onion',
    url: 'www.test123.com',
    published: '2016-09-07T22:16:00',
  };

  beforeEach(done => {
    db = knex({
      client: 'mysql',
      connection: {
        host: '104.131.138.11', // using a remote server
        user: 'app',
        password: 'surprisejalapeno',
        database: 'app'
      }
    });

    db.schema.hasTable('news').then(result => {
      if (!result) {
        return db.schema.createTable('news', table => {
          table.increments();
          table.string('title');
          table.integer('rating');
          table.string('location');
          table.string('category');
          table.string('description');
          table.string('source');
          table.string('url');
          table.dateTime('published');
          table.timestamp('created_at');
        });
      }
      return 0;
    })
    .then(() => done());
  });

  afterEach(() => db.schema.dropTable('news'));

  after(done => db.destroy(() => done()));

  it('should take data and insert it into a table', done => {
    model.add(data1).then(id => {
      expect(id).to.be.above(0);
      done();
    });
  });

  it('should return all data in a table', done => {
    model.add([data1, data2])
    .then(() => model.fetchAll())
    .then(result => {
      expect(result).to.have.lengthOf(2);
      done();
    });
  });
});
