const request = require('request')
const mqtt = require('mqtt')
const dotenv = require("dotenv")

// Load env
dotenv.config()
 
// Get JSONBOX data
jsonbox_fetch_url = 'https://jsonbox.io/' + process.env.demo_irrigation_jsonbox + '?limit=1&sort=_createdOn'
request(jsonbox_fetch_url, { json: true }, (jsonbox_fetch_err, jsonbox_fetch_res, jsonbox_fetch_body) => {

  // If there's a result
  if (jsonbox_fetch_body.length>0) {

    // Extract the result
    payload = jsonbox_fetch_body[0]

    // Delete from JSONBOX
    jsonbox_delete_url = 'https://jsonbox.io/' + process.env.demo_irrigation_jsonbox + '/' + payload._id
    request.del(jsonbox_delete_url);

    // Send to MQTT
    var client  = mqtt.connect('mqtt://192.168.43.110', { 'username': 'bendechrai', 'password': 'iW6klcildCjDPSmVJno]}Upkn0mwHuqg}wIzb.<+' })
    client.on('connect', function () {
      client.subscribe('irrigation/valves', function (err) {
        if (!err) {
          client.publish('irrigation/valves', JSON.stringify(payload))
        }
        client.end()
      })
    })

  }

})
