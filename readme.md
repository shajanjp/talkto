# Talk to
`talkto` is simple command line tool for real-time one to one text chats.

## Features
  * Light weight
  * Real-time
  * Configurable server
  * Platform independent

## Installation
Install talkto globally, so that you can use it from anywhere.

`npm install talkto -g`

or

`yarn global add talkto`

## Configuration
Just tell your name to talkto, and it remember. This name will be shown to the recipient user.

`talkto --user.name john`

Talkto uses its server by default for communication, but you can setup a talkto server your own if you want to. 
The source code for talkto-server is available at https://github.com/shajanjp/talkto-server. 
To use your own server, use --host params to override default server.

`talkto --host http://yourhostname.com`

or 

`talkto --host http://localhost:3000`


## Usage
`talkto` is simple and straight forward to use.
Just one easy command to get talking.

`talkto peter`

## Use cases
