// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MonngoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos')
  //   .find({
  //     _id: new ObjectID('5869d21c3ae62f2bbaffbdb9')
  //   })
  //   .toArray()
  //   .then((res) => {
  //     console.log('TODOs:');
  //     console.log(JSON.stringify(res, undefined, 2));
  //   }, (err) => {
  //     console.log('Unabled to fetch todos', err);
  //   } );

  // db.collection('Todos')
  //   .find()
  //   .count()
  //   .then((count) => {
  //     console.log(`Todos count: ${count}`);
  //   }, (err) => {
  //     console.log('Unabled to fetch todos', err);
  //   } );

  db.collection('Users')
    .find({name:'Vimal Niroshan'})
    .toArray()
    .then((res) => {
      console.log('Users with name Vimal Niroshan');
      console.log(JSON.stringify(res, undefined, 2));
    }, (err) => {
      console.log('Unabled to fetch todos', err);
    });

  //db.close();
});
