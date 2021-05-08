const {setJson, model, time} = require('../utils/index.js')
const  { encode, decode } =  require('js-base64');

class Orders{
    constructor(app){
        this.app = app
		this.routes()
	}
    routes(){
        /* this.app.post('/api/goods/add', this.addGood)  //新增商品 */
    }
   /**
	 * @apiDefine Header
	 * @apiHeader {String} Authorization jsonwebtoken
	*/

	/**
	 * @apiDefine Success
	 * @apiSuccess {Object} meta 状态描述
	 * @apiSuccess {Number} meta.code 标识码，0表示成功，1表示失败
	 * @apiSuccess {String} meta.message 标识信息
	 * @apiSuccess {Object} data 数据内容
	*/


    
}