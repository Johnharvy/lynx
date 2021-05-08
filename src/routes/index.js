
const  User =  require('../controllers/user')

module.exports = function(app) {
	new User(app) 
}