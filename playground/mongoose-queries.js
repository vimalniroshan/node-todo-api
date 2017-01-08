const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '58717803087ab52d1349a9ca';
//
// if(!ObjectID.isValid(id)) {
//   console.log('ID not valid');
// }

// Todo
//   .find({_id: id})
//   .then((todos) => {
//     console.log('Todos: ', todos);
//   });
//
// Todo
//   .findOne({_id: id})
//   .then((todo) => {
//     console.log('Todo: ', todo);
//   });

// Todo
//   .findById(id)
//   .then((todo) => {
//     if(!todo) {
//       return console.log('Id not found');
//     }
//     console.log('Todo: ', todo);
//   }).catch((e) => console.log(e));

var id = '586b42a3049a50cf05b99e1f';

User
  .findById(id)
  .then((user) => {
    if(!user) {
      return console.log('User not found');
    }
    console.log('User : ', user);
  }).catch((e) => console.log(e));
