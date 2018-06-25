const IPFS = require('ipfs')
const series = require('async/series')
const node = new IPFS()

series([
  (cb) => node.on('ready', cb),
  (cb) => node.version((err, version) => {
    if (err) { return cb(err) }
    console.log('Version:', version.version)
    cb()
  })
])
