
const  User =  require('../controllers/user')
const  Goods =  require('../controllers/goods')
const  Orders =  require('../controllers/orders')

module.exports = function(app) {
	new User(app) 
	new Goods(app)
	new Orders(app)
}