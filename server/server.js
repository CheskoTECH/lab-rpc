var WebSocketServer = require("rpc-websockets").Server;

const PORT = process.env.PORT || "7070";

var express = require('express');
var path = require('path');

// instantiate Server and start listening for requests
var server = new WebSocketServer({
  port: PORT,
  host: '127.0.0.1',
});

// console.log("server: ", server);

let i = 0;

let rooms = [];

// register an RPC method
server.register("sum", function (params) {
  console.log(params[0] + params[1]);
  i += 1;
  return params[0] + params[1];
});

server.register("hello", function (params) {
  // emit an event to subscribers
  console.log("world");
  return "world";
});

server.register("getdata", function (params) {
  return i;
});

server.register("getLobbyInfo", function (params) {
  // console.log("logged in, rooms: ", rooms);
  rooms.forEach((room) => {
    // console.log(room.amountOfPlayers, " ", room.users.length);
    if (room.amountOfPlayers + "" === room.users.length + "") {
      room.statusOfGame = "started"
      // room.users[0].turn = true;
    }
  })
  return rooms;
});

server.register("createLobby", function (params) {
  // console.log("creating lobby: ", params);
  const newRoom = {
    roomTitle: params.lobbyTitle,
    users: [],
    statusOfGame: "waiting",
    wasAnswered: [],
    amountOfPlayers: params.lobbyPlayersNum,
  };
  rooms.push(newRoom);
  console.log("new room: ", newRoom);
  // console.log("rooms: ", rooms);
  return 123;
});

server.register("addAnswer", function(params) {
  console.log("params: ", params);
  console.log(rooms[params.index]);
  rooms[params.index].wasAnswered.push(params.city)
  // сделать чтобы true в очереди следующему перевешивалась
  // тогда клиент поймет как ходить
  // и очки соперника можно выводить
  // а валидация городов на клиенте
})

server.register("joinRoom", function (params) {
  // console.log("users: ", rooms[params.index])
  rooms[params.index].users.push({
    nameOfPlayer: params.nameOfPlayer,
    score: 0,
  });
  return 123;
});

app = express();
// app.use(express.static(__dirname + "/dist"));
var hostname = '127.0.0.2';


// Handle production
if (process.env.NODE_ENV) {
  // Static folder
  app.use(express.static(__dirname + '/dist/'));
  
  // Handle SPA
  app.get(/.*/, (req, res, next) =>{
    res.sendFile(__dirname + '/dist/index.html');
    next();
  });
}


console.log(__dirname + "/dist");

app.listen(PORT, hostname, () => {
   console.log(`Server running at http://${hostname}:${PORT}/`);
 });

// server.register("getRoomInfo", function(params) {
//   return rooms[params.index];
// });

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
//     wasAnswered: [],
//     amountOfPlayers: 3
//   }
// ]
