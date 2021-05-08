const Model = require('./sql')
const Time = require('./time')

const common = {
	model : new  Model(),  
    time : new Time(), 
    /**
	 * API接口调用返回JSON格式内容
	 * @param {Number} code    
	 * @param {String} message 
	 * @param {Objext} data    
	 */
	setJson(code, message, data) {
		return {
			meta: {
				code: code || 0,
				message: message || null
			},
			data: data || null
		}
	} 
}


module.exports = common