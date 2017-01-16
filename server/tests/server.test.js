const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed.js');

beforeEach(populateTodos);
beforeEach(populateUsers);

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
    var id = new ObjectID().toHexString();
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

describe('DELTE /todo/:id', () => {
  it('should delete todo doc', (done) => {
    request(app)
      .delete(`/todo/${todos[1]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(todos[1]._id.toHexString());
        expect(res.body.todo.text).toBe(todos[1].text);
      }).end((err, res) => {
        if(err) {
          return done(err);
        }

        Todo
          .findById(todos[1]._id.toHexString())
          .then((todo) => {
            expect(todo).toNotExist();
            done();
          }).catch((err) => done(err));
      });
  });

  it('should not delete a todo doc.', (done) => {
    var id = new ObjectID().toHexString();
    request(app)
      .delete(`/todo/${id}`)
      .expect(404)
      .end(done);
  });

  it('should return bad request', (done) => {
    var id = '111'
    request(app)
      .delete(`/todo/${id}`)
      .expect(400)
      .end(done);
  });
});

describe('PATCH /todo/:id', ()=> {
  it('should update the todo', (done) => {
      var id = todos[0]._id.toHexString();

      var body = {
        text : "Some text to be updated for true",
        completed: true
      }

      request(app)
        .patch(`/todo/${id}`)
        .send(body)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(body.text);
          expect(res.body.todo.completed).toBe(body.completed);
          expect(res.body.todo.completedAt).toBeA('number');
        })
        .end((err, res) => {
            if(err) {
              return done(err);
            }

            Todo
              .findById(id)
              .then((todo) => {
                expect(todo.text).toBe(body.text);
                expect(todo.completed).toBe(body.completed);
                expect(todo.completedAt).toBeA('number');
                done();
              }).catch((e) => done(e));
        });
  });

  it('should clear complatedAt when todo is not completed', (done) => {
    var id = todos[1]._id.toHexString();

    var body = {
      text : "Some text to be updated for flase",
      completed: false
    }

    request(app)
      .patch(`/todo/${id}`)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(body.text);
        expect(res.body.todo.completed).toBe(body.completed);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end((err, res) => {
          if(err) {
            done(err);
          }

          Todo
            .findById(id)
            .then((todo) => {
              expect(todo.text).toBe(body.text);
              expect(todo.completed).toBe(body.completed);
              expect(todo.completedAt).toNotExist();
              done();
            }).catch((e) => done(e));
      });
  });
});

describe('GET /user/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/user/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/user/me')
      //.set('x-auth', users[0].tokens[0].token + '1')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});


describe('POST /user', () => {
  it('should create a user', (done) => {
    var email = 'test@example.com';
    var password = 'testpass';

    request(app)
      .post('/user')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err) {
          return done(err);
        }

        User.findOne({email})
          .then((user) => {
            expect(user).toExist();
            expect(user.password).toNotBe(password);
            done();
          }).catch((err) => done(err));
      });
  });

  it('should return validation error if request invalid', (done) => {
    var email = 'test@example';
    var password = '1';

    request(app)
      .post('/user')
      .send({email, password})
      .expect(400)
      .expect((res) => {
        expect(res.body.name).toBe('ValidationError');
      }).end(done);
  });

  it('should not create user if email in use', (done) => {
    var email = users[0].email;
    var password = 'testPasswords';

    request(app)
      .post('/user')
      .send({email, password})
      .expect(400)
      .end(done);
  });
});
