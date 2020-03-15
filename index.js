#!/usr/bin/env node
const readline = require('readline');
const fs = require('fs');
const HOME_DIRECTORY = require('os').homedir();
const HOST = 'http://localhost:3000';
const argv = require('yargs').argv
let toAddress = 'GENERAL';
let userConfig = {};
const socketClient = require('socket.io-client')
let socket;

// argv 1 :  chat 
if(argv._.length == 1 && argv._[0]){
  chatInit();
}

// argv 1 :  setusername 
if(argv.user && typeof argv.user == 'object') {
  userConfig.username = argv.user.name;
  setConfig(userConfig)
  .finally(() => {
    process.exit();
  })
}

if(argv.host && argv.host !== '') {
  getConfig()
  .then(userConfig => {
    userConfig.host = argv.host;
    return setConfig(userConfig);
  })
  .finally(() => {
    process.exit();
  })
}

function chatInit(){
  toAddress = argv._[0];
  console.log('You are talking to', toAddress);

  getConfig()
  .then(configData => {
    userConfig = makeConfigDefaults(configData);
    socket = socketClient(userConfig.host);
  })
  .catch(error => {})
  .finally(() => {
    console.log("You are " + userConfig.username + '.'); 
    socket.on(userConfig.username, function(data){
      console.log(`\x1b[33m${data.fromAddress}: ${data.text}\x1b[0m`);
    });
    socket.on('connect', function(){
      console.log('You are online.');
    });
  })

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.on('line', function(line){
    console.log('\033[1A' + `\x1b[32mYou: ${line}\x1b[0m`);
    socket.emit('MESSAGE', { toAddress, fromAddress: userConfig.username, text: line });
  });
}

function setConfig(data){
  return new Promise((resolve, reject) => {
    fs.writeFile(`${HOME_DIRECTORY}/.talkto-config`, JSON.stringify(data), function (err) {
      if (err) {
        reject(err.message); 
      }
      resolve();
    });
  })
}

function getConfig(){
  return new Promise((resolve, reject) => {
    fs.readFile(`${HOME_DIRECTORY}/.talkto-config`, (err, data) => {
      if(err){
        resolve({});
      }
      else{
        resolve(JSON.parse(data));
      }
    })  
  })
}

function makeConfigDefaults(configData){
  if(!configData.username || configData.username == ''){
    configData.username = Date.now()
  }
  if(!configData.host || configData.host == ''){
    configData.host = "https://talkto.glitch.me";
  }
  return configData;
}
