var WebSocketServer = require('rpc-websockets').Server

// instantiate Server and start listening for requests
var server = new WebSocketServer({
  port: 5050,
  host: 'localhost'
})

let i = 0;
// register an RPC method
server.register('sum', function(params) {
  console.log(params[0] + params[1])
  i += 1;
  return params[0] + params[1]
})



server.register('hello', function(params) {
  // emit an event to subscribers
  console.log("world")

  return "world"
})

server.register("getdata", function(params) {
  return i;
})

// server.register('sayHelloIfWorld', function(params) {
//   console.log(params);
//   return "world!";
// });


// Структура приложения:

// Сеансы игры будут формировать путем создания комнат
// К комнатам могут присоеденяться участники

// Комнаты будут представлять собой массив объектов, в каждом объекте будет 
// вся необходимая информация про игроков, сеанс и счет

// let rooms = [
//   {
//     roomTitle: "roomTitle",
//     users: [
//       {
//         name: "user1",
//         score: 0
//       }, 
//       {
//         name: "user2",
//         score: 0
//       },
//       {
//         name: "user3",
//         score: 0
//       },
//     ],
//     statusOfGame: "started",
//     wasAnswered: []
//   }
// ]