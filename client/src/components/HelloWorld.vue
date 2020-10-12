<template>
  <div>
    <button @click="onClickButton">test</button>
    <button @click="sayHelloIfWorld">hello world</button>
    <div v-if="ifLogin">
      <p>Ваше имя: {{ nameOfPlayer }}</p>
      <div v-if="!inLobby">
          <div>
            <input type="text" v-model="lobbyTitle" placeholder="Название">
            <input type="number" v-model="lobbyPlayersNum" placeholder="Кол-во игроков">
            <button @click="createLobby">Создать лобби</button>
          </div>
          <button @click="getLobbyList">Обновить информацию</button>
          <div class="rooms">
            <p v-for="(game, index) in reserveList" :key="index">{{game.roomTitle}}</p>
          </div>
      </div>
    </div>
    <div v-if="!ifLogin">
      <p>Имя игрока</p>
      <input type="text" placeholder="name" v-model="nameOfPlayer">
      <button @click="getLobbyList">Войти в игру</button>
    </div>
      <input type="text" name="" id="" v-model="test">
    <p>{{ test }}</p>
    <button @click="logGamesList">log</button>
  </div>
</template>

<script>
const WebSocket = require('rpc-websockets').Client;


export default {
  name: 'HelloWorld',
  data () {
    return {
      nameOfPlayer: "",
      ifLogin: false,
      inLobby: false,
      inGame: false,
      lobbyTitle: "",
      lobbyPlayersNum: null,
      gamesList: null,
      reserveList: null,
      test: null
    }
  },
  methods: {
    logGamesList() {
      console.log(this.reserveList);
    },
    onClickButton() {
      this.reserveList = [{roomTitle: "first"}, {roomTitle: "second"}]
      // const ws = new WebSocket('ws://localhost:7070');
      // ws.on('open', function() {
      //   // call an RPC method with parameters
      //   ws.call('sum', [5, 3]).then(function(result) {
      //     console.log(result);
      //   })
      // })
      // ws.close()
    },
    sayHelloIfWorld() {
      const ws = new WebSocket('ws://localhost:7070');
      ws.on('open', function() {
        ws.call('hello', {num: 5})
        .then(function(result) {
          console.log(result);
          return result;
        })
        .catch(e => {
          console.log(e);
        })
      })
    },
    getDataInInterval() {
      const ws = new WebSocket('ws://localhost:7070');

      ws.on('open', function() {
      ws.call('getdata', {num: 5})
        .then(function(result) {
          console.log("updated data: ", result);
        })
        .catch(e => {
          console.log(e);
        })
      })
    },
    getLobbyList: function() {
      this.ifLogin = true;
      console.log("login")

      const ws = new WebSocket('ws://localhost:7070');
      ws.on('open', function() {
      ws.call('getLobbyInfo')
        .then(function(result) {
          console.log(result);
          return result;
        })
        .then((result) => {
          this.gamesList = result;
          console.log("gamesList: ", this.gamesList);
          this.reserveList = this.gamesList.slice();
          console.log("reserveList: ", this.reserveList)
        })
      })
      console.log("gamesList2 :", this.gamesList);
    },
    createLobby() {
      let resTest;
      const ws = new WebSocket('ws://localhost:7070');
      const data = {lobbyTitle: this.lobbyTitle, nameOfPlayer: this.nameOfPlayer, lobbyPlayersNum: this.lobbyPlayersNum };
      console.log("data for creating lobby: ", data)
      ws.on('open', function() {
      ws.call('createLobby', data)
        .then(function(result) {
          console.log("then");
          this.gamesList.push(data);
          console.log(this.gamesList);
          resTest = result;
          console.log("resultOfCreating: ", result);
        })
        .catch(e => {
          console.log(e);
        })
      })
      console.log(resTest);
    }
  },
  created() {
          console.log("gamesList: ", this.gamesList);

    // console.log("created");
    // setInterval(() => {
    //   this.getDataInInterval()
    // }, 5000);


  }
}
</script>
