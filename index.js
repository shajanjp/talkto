const readline = require('readline');
const fs = require('fs');
const HOST = 'https://talkto.glitch.me';
const socket = require('socket.io-client')(HOST);
const argv = require('yargs').argv
let toAddress = 'GENERAL';
let username = Date.now();

if (argv.username && argv.username != '') {
  setConfig({ username: argv.username })
  .finally(() => {
    process.exit();
  })  
}

getConfig()
.then(configData => {
  if(configData.username && configData.username != ''){
    username = configData.username;
  }
})
.catch(error => {})
.finally(() => {
  console.log("You are " + username + '.'); 
  socket.on(username, function(data){
    console.log('\033[1A' + `\x1b[33mlaa: ${data.text}\x1b[0m`);
  });
})

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

socket.on('connect', function(){
  console.log('You are online.');
});

rl.on('line', function(line){
  console.log('\033[1A' + `\x1b[32mYou: ${line}\x1b[0m`);
  socket.emit('MESSAGE', { toAddress: 'laa', text: line });
});


if(argv._[0]){
  toAddress = argv._[0];
  console.log('You are talking to', toAddress);
}

function setConfig(data){
  return new Promise((resolve, reject) => {
    fs.writeFile('./talkto-config.json', JSON.stringify(data), function (err) {
      if (err) {
        reject(err.message); 
      }
      resolve();
    });
  })
}

function getConfig(){
  return new Promise((resolve, reject) => {
    fs.readFile('./talkto-config.json', (err, data) => {
      if(err){
        reject({});
      }
      else{
        resolve(JSON.parse(data));
      }
    })  
  })
}
