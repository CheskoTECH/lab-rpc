<template>
  <div>
    <button @click="onClickButton">test</button>
    <button @click="sayHelloIfWorld">hello world</button>
    hello
  </div>
</template>

<script>
const WebSocket = require('rpc-websockets').Client;

  
// subscribe to receive an event
// setTimeout(() => {
//   ws.subscribe('feedUpdated')
    
//   ws.on('connection', function() {
//     console.log("update!")
//   })

// }, 1500)

// ws.onopen = () => console.log("ONLINE");


export default {
  name: 'HelloWorld',
  methods: {
    onClickButton() {
      const ws = new WebSocket('ws://localhost:5050');
      ws.on('open', function() {
        // call an RPC method with parameters
        ws.call('sum', [5, 3]).then(function(result) {
          // return result;
          // alert("1");
          console.log(result);

          // require('assert').equal(result, 8)
        })
      })
      // ws.close()
    },
    sayHelloIfWorld() {
      const ws = new WebSocket('ws://localhost:5050');
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
      const ws = new WebSocket('ws://localhost:5050');

      ws.on('open', function() {
      ws.call('getdata', {num: 5})
        .then(function(result) {
          console.log(result);
        })
        .catch(e => {
          console.log(e);
        })
      })
    }
  },
  created() {

    console.log("created");
    setInterval(() => {
      this.getDataInInterval()
    }, 1000);


  }
}
</script>
