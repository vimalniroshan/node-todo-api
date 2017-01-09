const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//Todo.remove({}).then((result) => console.log(result));

Todo.findOneAndRemove({_id: '5872fbf8bbb52d04d144de71'}).then((todo) => {
  console.log(todo);
});

Todo.findByIdAndRemove('5872fb8cbbb52d04d144de4b').then((todo) => {
  console.log(todo);
});
