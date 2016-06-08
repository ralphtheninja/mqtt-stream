const Mqtt = require('.')
const mqtt = Mqtt('tcp://localhost', { port: '1883' })

mqtt.client.on('connect', function () {
  const interval = setInterval(function () {
    const rnd = Math.random()
    mqtt.client.publish('foo/' + rnd, 'foobar')
    mqtt.client.publish('bar/' + rnd + '/foo/' + rnd, 'bar123fooabc')
  }, 2000)
  setTimeout(function () {
    stream.destroy()
    clearInterval(interval)
    mqtt.client.end()
  }, 10000)
})

const stream = mqtt.createReadStream([ 'foo/+', 'bar/+/foo/+' ])
  .on('data', function (data) {
    console.log(JSON.stringify(data))
  })
  .on('end', function () {
    console.log('Bye.')
  })
