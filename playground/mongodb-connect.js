// Object destructring
// var user = {name: 'Vimal'};
// var {name} = user;
//
// console.log(`Name: ${name}`);
// console.log(`User: ${JSON.stringify(user, undefined, 2)}`);

// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MonngoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos')
  //   .insertOne({
  //       text: 'Some todo item',
  //       completed: false
  //   }, (err, result) => {
  //     if(err) {
  //       return console.log('Unable to insert document', err);
  //     }
  //     console.log(`Inserted: ${JSON.stringify(result.ops, undefined, 2)}`);
  //   });

  // db.collection('Users')
  //   .insertOne({
  //     name: 'Vimal Niroshan',
  //     age: 31,
  //     location: 'Richmond Pkwy Richmond CA 94806'
  //   }, (err, result) => {
  //     if(err) {
  //       return console.log('Unable to insert document', err);
  //     }
  //     console.log(result.ops[0]._id.getTimestamp());
  //   });

  db.close();
});
