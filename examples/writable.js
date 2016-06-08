const Mqtt = require('../')
const mqtt = Mqtt('tcp://localhost', { port: '1883' })
const fs = require('fs')
const path = require('path')

mqtt.client.on('connect', function () {
  const interval = setInterval(function () {
    mqtt.client.subscribe('packages')
    mqtt.client.on('message', function (topic, payload) {
      console.log(payload.toString())
    })
  }, 2000)
  setTimeout(function () {
    stream.destroy()
    clearInterval(interval)
    mqtt.client.end()
  }, 10000)
})

const stream = mqtt.createWriteStream('packages')
fs.createReadStream(path.resolve(__dirname, '../package.json')).pipe(stream)
