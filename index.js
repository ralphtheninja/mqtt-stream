'use strict'

const mqtt = require('mqtt')
const match = require('mqtt-match')
const streams = require('vintage-streams')

function Mqtt (url, options) {
  if (!(this instanceof Mqtt)) {
    return new Mqtt(url, options)
  }
  this.client = mqtt.connect(url, options)
  this.client.setMaxListeners(Infinity)
}

Mqtt.prototype.createReadStream = function (topic, options) {
  const client = this.client

  const readable = streams.Readable({
    read: function (cb) {
      client.subscribe(topic, options, function (err) {
        if (err) readable.emit('error', err)
      })

      client.on('message', onMessage)

      client.once('error', function (err) {
        client.removeListener('message', onMessage)
        readable.emit('error', err)
      })
    },
    destroy: function () {
      client.removeListener('message', onMessage)
      readable.emit('end')
    }
  })

  const onMessage = function (t, payload, packet) {
    if (matchesTopic(topic, t) === true) {
      readable.push({ topic: t, payload: payload, packet: packet })
    }
  }

  function matchesTopic (left, right) {
    if (Array.isArray(left)) {
      return left.some(function (i) {
        return match(i, right)
      })
    } else if (typeof left === 'string') {
      return matchesTopic([ left ], right)
    } else if (typeof left === 'object') {
      return matchesTopic(Object.keys(left), right)
    }
  }

  return readable
}

Mqtt.prototype.createWriteStream = function (topic, options) {
  const client = this.client

  const writable = streams.Writable({
    write: function (data, cb) {
      if (!Buffer.isBuffer(data) && typeof data !== 'string') {
        data = JSON.stringify(data)
      }
      client.publish(topic, data, options, function (err) {
        if (err) return writable.emit('error', err)
        cb()
      })
    }
  })

  return writable
}

module.exports = Mqtt
