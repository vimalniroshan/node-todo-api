const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

var {app} = require('./../server');
var {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo'
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos);
  }).then(() => done());
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

        Todo.find({text}).then((todos) => {
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
          expect(todos.length).toBe(2);
          done();
        }).catch((err) => done(err));
      });
  });
});

describe('GET /todo', () => {

  it('should get all todo items', (done) => {
      request(app)
        .get('/todo')
        .expect(200)
        .end((err, res) => {
          if(err) {
            return done(err);
          }

          Todo.find().then((todos) => {
            expect(todos.length).toBe(res.body.todos.length);
            done();
          }).catch((err) => done(err));
        });
  });
});

describe('GET /todo/:id', () => {
  it('should return todo doc.', (done) => {
    request(app)
      .get(`/todo/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(todos[0]._id.toHexString());
        expect(res.body.todo.text).toBe(todos[0].text);
      }).end(done);
  });

  it('should not return todo doc.', (done) => {
    var id = '68717803087ab52d1349a9ca'
    request(app)
      .get(`/todo/${id}`)
      .expect(404)
      .end(done);
  });

  it('should return bad request', (done) => {
    var id = '111'
    request(app)
      .get(`/todo/${id}`)
      .expect(400)
      .end(done);
  });
});
