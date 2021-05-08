
const  app = require('./app.config')
const config = require('./config')
const ip = require('ip')

app.listen( config.app.port, () => {
	console.log(`------ server listening on   http://${ip.address()}:${config.app.port} ------`)
})

