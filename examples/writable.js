const Mqtt = require('../')
const mqtt = Mqtt('tcp://localhost', { port: '1883' })
const fs = require('fs')
const path = require('path')
const split = require('split2')

mqtt.client.on('connect', function () {
  mqtt.client.subscribe('data')
  mqtt.client.on('message', function (topic, payload) {
    console.log(payload.toString())
  })

  const stream = mqtt.createWriteStream('data')
  const data = path.join(__dirname, '/data.txt')
  fs.createReadStream(data, 'utf-8').pipe(split()).pipe(stream)
})
