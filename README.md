# mqtt-stream

**WIP**

Creates a streaming interface around [`mqtt.js`](https://github.com/mqttjs/MQTT.js).

### Usage

```js
const Mqtt = require('mqtt-stream')
const mqtt = Mqtt('tcp://localhost', { port: '1883' })
const stream = mqtt.createReadStream([ 'foo/+', 'bar/+/foo/+' ])
stream.on('data', function (data) {
  console.log(data)
})
```

### Api

#### `const mqtt = Mqtt([url], options)`

Wraps a [`mqtt.Client`](https://github.com/mqttjs/MQTT.js#client) and exposes it on the public `.client` property. Parameters are passed on to [`mqtt.connect`](https://github.com/mqttjs/MQTT.js#connect).

#### `const readable = mqtt.createReadStream(topic, [options])`

Create a readable object stream that subscribes to `topic`. Parameters are passed on to [`mqtt.Client#subscribe`](https://github.com/mqttjs/MQTT.js#mqttclientsubscribetopictopic-arraytopic-object-options-callback).

Stream data has `.topic`, `.payload` and `.package` properties, which correspond to the parameters in the [`'message'`](https://github.com/mqttjs/MQTT.js#event-message) event.

Call `readable.destroy()` to end the stream.

### License
MIT
