<template>
  <div>
    <!-- <button @click="onClickButton">test</button>
    <button @click="sayHelloIfWorld">hello world</button> -->
    <div v-if="ifLogin">
      <p>Ваше имя: {{ nameOfPlayer }}</p>
      <div v-if="inLobby">
        <p>Вы в комнате: {{ gamesList[lobbyIndex].roomTitle }}</p>
        <p>Игроков: {{ gamesList[lobbyIndex].users.length }}</p>
      </div>
      <div v-if="!inLobby">
        <div>
          <input type="text" v-model="lobbyTitle" placeholder="Название" />
          <input
            type="number"
            v-model="lobbyPlayersNum"
            placeholder="Кол-во игроков"
          />
          <button @click="createLobby">Создать лобби</button>
        </div>
        <button @click="getLobbyList">Обновить информацию</button>
        <div class="rooms">
          <div
            class="rooms-block"
            v-for="(game, index) in gamesList"
            :key="index"
          >
            <p>{{ game.roomTitle }}</p>
            <button @click="joinRoom(index)">join</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!ifLogin">
      <p>Имя игрока</p>
      <input type="text" placeholder="name" v-model="nameOfPlayer" />
      <button @click="getLobbyList">Войти в игру</button>
    </div>
  </div>
</template>

<script>
const WebSocket = require("rpc-websockets").Client;

export default {
  name: "HelloWorld",
  data: function() {
    return {
      nameOfPlayer: "",
      ifLogin: false,
      inLobby: false,
      inGame: false,
      lobbyTitle: "",
      lobbyPlayersNum: null,
      gamesList: [],
      test: null,
      lobbyIndex: null,
      choosedRoomInfo: null
    };
  },
  methods: {
    logGamesList() {
      console.log(this.gamesList);
    },
    onClickButton() {
      this.gamesList = [{ roomTitle: "first" }, { roomTitle: "second" }];
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
      const ws = new WebSocket("ws://localhost:7070");
      ws.on("open", function() {
        ws.call("hello", { num: 5 })
          .then(function(result) {
            console.log(result);
            return result;
          })
          .catch((e) => {
            console.log(e);
          });
      });
    },
    // getDataInInterval() {
    //   const ws = new WebSocket("ws://localhost:7070");

    //   ws.on("open", function() {
    //     ws.call("getdata", { num: 5 })
    //       .then(function(result) {
    //         console.log("updated data: ", result);
    //       })
    //       .catch((e) => {
    //         console.log(e);
    //       });
    //   });
    // },
    getLobbyList() {
      this.ifLogin = true;
      console.log("login");
      const ws = new WebSocket("ws://localhost:7070");
      ws.on("open", () => {
        ws.call("getLobbyInfo")
          .then(function(result) {
            return result;
          })
          .then((result) => {
            this.gamesList = result;
          });
      });
    },
    createLobby() {
      const ws = new WebSocket("ws://localhost:7070");
      const data = {
        lobbyTitle: this.lobbyTitle,
        nameOfPlayer: this.nameOfPlayer,
        lobbyPlayersNum: this.lobbyPlayersNum,
      };
      console.log("data for creating lobby: ", data);
      ws.on("open", () => {
        ws.call("createLobby", data)
          .then((result) => {
            this.gamesList.push(data);
            console.log("resultOfCreating: ", result);
          })
          .catch((e) => {
            console.log(e);
          });
      });
    },
    getRoomInfo(index) {
      const ws = new WebSocket("ws://localhost:7070");
      console.log('index param: ', index);
      ws.on("open", () => {
        ws.call("getRoomInfo", index).then((result) => {
          this.choosedRoomInfo = result;
        });
      });
      console.log("choosedRoom: ", this.choosedRoomInfo);
    },
    joinRoom(index) {
      console.log(this.gamesList[index]);
      this.lobbyIndex = index;
      this.inLobby = true;

      const ws = new WebSocket("ws://localhost:7070");
      const data = {
        nameOfPlayer: this.nameOfPlayer,
        index: index,
      };
      ws.on("open", () => {
        ws.call("joinRoom", data).then((result) => {
          console.log(result);
        });
      });

      setInterval(() => {
        this.getLobbyList();
      }, 5000);
    },
  },
  created() {
    console.log("gamesList: ", this.gamesList);

    // console.log("created");
    // setInterval(() => {
    //   this.getDataInInterval()
    // }, 5000);

    // console.log("created");
    // setInterval(() => {
    //   console.log("gamesList: ", this.gamesList);

    //   this.getLobbyList();
    // }, 1000);
  },
};
</script>

<style>
.rooms-block {
  margin: 0 auto;
  width: 200px;
  padding: 1rem;
  border: 1px solid red;
}
</style>
