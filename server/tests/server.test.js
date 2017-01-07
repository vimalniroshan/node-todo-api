const expect = require('expect');
const request = require('supertest');

var {app} = require('./../server');
var {Todo} = require('./../models/todo');

beforeEach((done) => {
  Todo.remove({}).then(() => done());
});

describe('POST /todo', () => {
  var text = 'Some to todo item';
  it('should save todo item', (done) => {
    request(app)
      .post('/todo')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      }).end((err, res) => {
        if(err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((err) => done(err));
      });
  });

  it('should not create a todo item', (done) => {
    var text = '';
    request(app)
      .post('/todo')
      .send({text})
      .expect(400)
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(0);
          done();
        }).catch((err) => done(err));
      });
  });
});

describe('GET /todo', () => {

  var text = 'Some to todo item';

  it('should get all todo items', (done) => {

    request(app)
      .post('/todo')
      .send({text})
      .end();

      request(app)
        .get('/todo')
        .expect(200)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          console.log(res.body.todos);
          Todo.find().then((todos) => {
            expect(todos.length).toBe(res.body.todos.length);
            expect(todos).toInclude(res.body.todos);
            done();
          }).catch((err) => done(err));
        });
  });
});
