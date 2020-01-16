const request = require('request')
const mqtt = require('mqtt')
const dotenv = require("dotenv")
const fs = require('fs')
const openpgp = require('openpgp')

const privkey = fs.readFileSync('./privkey', 'utf-8').toString()

// Load env
dotenv.config()

// Define decryption function
const decrypt = async(payload) => {
  const privKeyObj = (await openpgp.key.readArmored(privkey)).keys[0]
  await privKeyObj.decrypt('super long and hard to guess secret')

  const options = {
    message: await openpgp.message.readArmored(payload.data),
    privateKeys: [privKeyObj]
  }

  return openpgp.decrypt(options)
}
 
// Get JSONBOX data
const jsonbox_fetch_url = 'https://jsonbox.io/' + process.env.demo_irrigation_jsonbox + '?limit=1&sort=_createdOn'
request(jsonbox_fetch_url, { json: true }, (jsonbox_fetch_err, jsonbox_fetch_res, jsonbox_fetch_body) => {

  // If there's a result
  if (jsonbox_fetch_body.length>0) {

    // Decrypt the result
    decrypt(jsonbox_fetch_body[0]).then(plaintext => {

      // Delete from JSONBOX
      const jsonbox_delete_url = 'https://jsonbox.io/' + process.env.demo_irrigation_jsonbox + '/' + jsonbox_fetch_body[0]._id
      request.del(jsonbox_delete_url)

      // Send to MQTT
      const client  = mqtt.connect('mqtt://192.168.43.110', { 'username': 'bendechrai', 'password': 'iW6klcildCjDPSmVJno]}Upkn0mwHuqg}wIzb.<+' })
      client.on('connect', function () {
        client.subscribe('irrigation/valves', function (err) {
          if (!err) {
            client.publish('irrigation/valves', plaintext.data)
          }
          client.end()
        })
      })

    })


  }

})
