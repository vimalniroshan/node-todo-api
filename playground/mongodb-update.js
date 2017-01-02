// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MonngoDB server');
  }
  console.log('Connected to MongoDB server');

  //findOneAndUpdate
  // db.collection('Todos')
  //   .findOneAndUpdate({
  //     _id: new ObjectID('5869dbbe3ae62f2bbaffc135')
  //   }, {
  //     $set: {
  //       completed: true
  //     }
  //   }, {
  //     returnOriginal: false
  //   }).then((res) => {
  //     console.log(res);
  //   });

  db.collection('Users')
    .findOneAndUpdate({
      _id: new ObjectID('5869c965752ef204a45f0ec7')
    }, {
      $set: {
        name: 'Nirosh'
      },
      $inc: {
        age: 1
      }
    }, {
      returnOriginal: false
    }).then((res) => {
      console.log(res);
    });

  //db.close();
});
