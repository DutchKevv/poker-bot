const express = require('express');
const router = express.Router();
const screenshot = require('screenshot-desktop');
const { join } = require('path');
const { mkdirSync } = require('fs');
const { create } = require('./game/game.js')
var Stomp = require('stompjs');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const engine = require('./engine/engine')
const io = new Server(server);

const FILE_DIR = join(__dirname, '../data/screenshots')

mkdirSync(FILE_DIR, { recursive: true })

async function getScreenshot() {
  const now = Date.now()
  const filename = join(FILE_DIR, `${now}.png`)
  const displays = await screenshot.listDisplays()
  const img = await screenshot({format: 'png', filename, screen: displays[displays.length - 1].id })
  const file = require('fs').readFileSync(filename)
  return file
}

setInterval(async () => {
  const img = await getScreenshot()
  engine.predictFromImg(img)
}, 1000)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/api/game/start', (req, res) => {
  create()
  res.send({})
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

module.exports.io = io
