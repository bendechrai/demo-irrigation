const openpgp = require('openpgp'); // use as CommonJS, AMD, ES6 module or via window.openpgp

openpgp.initWorker({ path:'openpgp.worker.js' }) // set the relative web worker path

const options = {
  userIds: [{ name:'Jon Smith', email:'jon@example.com' }], // multiple user IDs
  rsaBits: 4096,                                            // RSA key size
  passphrase: 'super long and hard to guess secret'         // protects the private key
};

openpgp.generateKey(options).then(function(key) {
  const privkey = key.privateKeyArmored; // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
  const pubkey = key.publicKeyArmored;   // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
  const revocationCertificate = key.revocationCertificate; // '-----BEGIN PGP PUBLIC KEY BLOCK ... '

  const fs = require('fs')
  fs.writeFile('./privkey', privkey, err => {
    if (err) {
      console.error(err)
      return
    }
  })
  fs.writeFile('./pubkey', pubkey, err => {
    if (err) {
      console.error(err)
      return
    }
  })

});

