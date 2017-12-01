const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const should = chai.should();

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage with text', () => {
    return chai.request(server)
      .get('/')
      .then((response) => {
        response.should.have.status(200);
        response.should.be.html;
        response.res.text.includes('Palette Picker');
      })
      .catch((error) => {
        console.log(error);
      });
  });

  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
    .get('/whodis')
      .then((response) => {
        response.should.have.status(404);
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

describe('API Routes', () => {

  before((done) => {
    database.migrate.latest()
      .then(() => done())
      .catch((error) => {
        throw error;
      });
  });

  beforeEach((done) => {
    database.seed.run()
      .then(() => done())
      .catch((error) => {
        throw error;
      });
  });

  describe('GET /api/v1/projects', () => {
    it('should return all of the projects', (done) => {
      chai.request(server)
        .get('/api/v1/projects')
        .then((response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('Star Wars');
          response.body[0].should.have.property('created_at');
          response.body[0].should.have.property('updated_at');
          done();
        })
        .catch((error) => {
          throw error;
        });
    });
  });

  describe('GET /api/v1/projects/:id', () => {
    it('should return a specific project', (done) => {
      chai.request(server)
        .get('/api/v1/projects/1')
        .then((response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('Star Wars');
          response.body[0].should.have.property('created_at');
          response.body[0].should.have.property('updated_at');
          done();
        })
        .catch((error) => {
          throw error;
        });
    });
  });

  describe('GET /api/v1/projects/:id/palettes', () => {
    it('should return all palettes for a specific project', (done) => {
      chai.request(server)
        .get('/api/v1/projects/1/palettes')
        .then((response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          response.body[1].should.have.property('id');
          response.body[1].id.should.equal(2);
          response.body[1].should.have.property('name');
          response.body[1].name.should.equal('Rebel Alliance');
          response.body[1].should.have.property('color1');
          response.body[1].color1.should.equal('#ae0000');
          response.body[1].should.have.property('color2');
          response.body[1].color2.should.equal('#007ce6');
          response.body[1].should.have.property('color3');
          response.body[1].color3.should.equal('#2de3a2');
          response.body[1].should.have.property('color4');
          response.body[1].color4.should.equal('#a36520');
          response.body[1].should.have.property('color5');
          response.body[1].color5.should.equal('#494949');
          response.body[1].should.have.property('projectId');
          response.body[1].projectId.should.equal(1);
          response.body[1].should.have.property('created_at');
          response.body[1].should.have.property('updated_at');
          done();
        })
        .catch((error) => {
          throw error;
        });
    });
  });

  describe('GET /api/v1/palettes/:id', () => {
    it('should return a specific palette', (done) => {
      chai.request(server)
        .get('/api/v1/palettes/1')
        .then((response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('Lightsabers');
          response.body[0].should.have.property('color1');
          response.body[0].color1.should.equal('#2ff923');
          response.body[0].should.have.property('color2');
          response.body[0].color2.should.equal('#dd0048');
          response.body[0].should.have.property('color3');
          response.body[0].color3.should.equal('#551a8b');
          response.body[0].should.have.property('color4');
          response.body[0].color4.should.equal('#2719c7');
          response.body[0].should.have.property('color5');
          response.body[0].color5.should.equal('#ff9933');
          response.body[0].should.have.property('projectId');
          response.body[0].projectId.should.equal(1);
          response.body[0].should.have.property('created_at');
          response.body[0].should.have.property('updated_at');
          done();
        })
        .catch((error) => {
          throw error;
        });
    });
  });

  describe('POST /api/v1/projects/', () => {
    it('should send a new project to database', (done) => {
      chai.request(server)
        .post('/api/v1/projects')
        .send({
          id: 2,
          name: 'The Legend of Zelda'
        })
        .then((response) => {
          response.should.have.status(201);
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(2);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('The Legend of Zelda');
          response.body[0].should.have.property('created_at');
          response.body[0].should.have.property('updated_at');

          chai.request(server)
            .get('/api/v1/projects')
            .then((getResponse) => {
              getResponse.should.have.status(200);
              getResponse.should.be.json;
              getResponse.body.should.be.a('array');
              getResponse.body.length.should.equal(2);
              done();
            })
            .catch((error) => {
              throw error;
            });
        });
    });
  });

  describe('POST /api/v1/projects/:id/palettes/', () => {
    it('should send a new palette to database', (done) => {
      chai.request(server)
        .post('/api/v1/projects/1/palettes')
        .send({
          id: 3,
          name: 'Link\'s Tunics',
          color1: '#00cc00',
          color2: '#6E1D15',
          color3: '#403E7B',
          color4: '#AA8CDA',
          color5: '#38b6f1',
          projectId: 1
        })
        .then((response) => {
          response.should.have.status(201);
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(3);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('Link\'s Tunics');

          chai.request(server)
            .get('/api/v1/projects/1/palettes')
            .then((getResponse) => {
              getResponse.should.have.status(200);
              getResponse.should.be.json;
              getResponse.body.should.be.a('array');
              getResponse.body.length.should.equal(3);
              getResponse.body[2].should.have.property('id');
              getResponse.body[2].id.should.equal(3);
              getResponse.body[2].should.have.property('name');
              getResponse.body[2].name.should.equal('Link\'s Tunics');
              getResponse.body[2].should.have.property('color1');
              getResponse.body[2].color1.should.equal('#00cc00');
              getResponse.body[2].should.have.property('color2');
              getResponse.body[2].color2.should.equal('#6E1D15');
              getResponse.body[2].should.have.property('color3');
              getResponse.body[2].color3.should.equal('#403E7B');
              getResponse.body[2].should.have.property('color4');
              getResponse.body[2].color4.should.equal('#AA8CDA');
              getResponse.body[2].should.have.property('color5');
              getResponse.body[2].color5.should.equal('#38b6f1');
              getResponse.body[2].should.have.property('projectId');
              getResponse.body[2].projectId.should.equal(1);
              getResponse.body[2].should.have.property('created_at');
              getResponse.body[2].should.have.property('updated_at');
              done();
            })
            .catch((error) => {
              throw error;
            });
        });
    });
  });

  describe('DELETE /api/v1/palettes/:id/', () => {
    it('remove a palette from the database', (done) => {
      chai.request(server)
        .delete('/api/v1/palettes/1')
        .then((response) => {
          response.should.have.status(204);
          done();
        })
        .catch((error) => {
          throw error;
        });
    });

    it('remove a return a 422 if there is not palette to remove', (done) => {
      chai.request(server)
        .delete('/api/v1/palettes/4')
        .then((response) => {
          response.should.have.status(422);
          done();
        })
        .catch((error) => {
          throw error;
        });
    });
  });
});
