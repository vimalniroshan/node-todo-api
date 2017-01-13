const {SHA256} = require('crypto-js');
var jwt = require('jsonwebtoken');

var msg = 'I am vimal';
var hash = SHA256(msg).toString();

console.log(`Message: ${msg}`);
console.log(`Hash: ${hash}`);

var data = {
  id: 4
};

var token = {
  data,
  hash: SHA256(JSON.stringify(data) + 'abc12345').toString()
};

token.data.id = 5

var resultHash = SHA256(JSON.stringify(token.data) + 'abc12345').toString();

if(resultHash === token.hash) {
  console.log('Data was not changed');
} else {
  console.log('Data was changed. Do not trust!');
}

var token = jwt.sign(data, 'abc123');
var decoded = jwt.verify(token, 'abc123');

console.log('Signature:', token);
console.log('Verify:', decoded);
