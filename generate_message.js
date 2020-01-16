const fs = require('fs')
const openpgp = require('openpgp')

const pubkey = fs.readFileSync('./pubkey', 'utf-8').toString()
const message = { "valve": "splash zone", "status": 0 }

const encrypt = async() => {

  const options = {
      message: openpgp.message.fromText(JSON.stringify(message)),
      publicKeys: (await openpgp.key.readArmored(pubkey)).keys
  }

  openpgp.encrypt(options).then(ciphertext => {
      encrypted = ciphertext.data
      result = { "data": encrypted }
      console.log(JSON.stringify(result))
  })

}

encrypt()
