const {setJson, model, time} = require('../utils/index.js')
const  { encode, decode } =  require('js-base64');

class Orders{
    constructor(app){
        this.app = app
		this.routes()
	}
    routes(){
		//用户
        this.app.post('/api/orders/create', this.createOrder)  //新增订单
		this.app.post('/api/orders/user/list ', this.get_user_orders)  //查询用户订单列表

		//助手
		this.app.post('/api/orders/list', this.get_orders) //查询订单列表

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

    /**
		 * @api {post} /orders/create  创建订单
		 * @apiDescription 创建订单
		 * @apiName create
		 * @apiGroup orders
		 *
		 * @apiParam {Number}  price 单价 
		 * @apiParam {Number}  mount 数量 
		 * @apiParam {String}  userId 用户ID 
		 * @apiParam {String}  goodId 商品ID 
		 * 
		 *
		 * @apiPermission none
		 * @apiSampleRequest /orders/create
		 * 
		 * @apiUse Success
		 *
		 * @apiSuccessExample Success-Response:
		 *     HTTP/1.1 200 OK
		 *     {
		 *       "meta": {
		 *       	"code": 0,
		 *       	"message": "创建成功"
		 *       },
		 *       "data": {
         *          
         *       }
		 *     }
	*/

   async  createOrder(req, rep, next){
	let result = setJson(0, '创建失败')
	try{
	   const {
			price,
			mount,
			goodId,
			userId
	   } = req.body
	   const  createTime =  time.getFormat(new Date()) 

	   const totalPrice = Number(price) * Number(mount).toFixed(2)

	   const dataPros = {
			createTime,    
            status : 0,    //status : 0 - 未支付， 1 - 已支付， 2 - 支付失败 ， 3 - 已过期
			goodId, 
			userId,
			totalPrice
	   }
	 
		 let res = await model.add('Orders', dataPros)
		 result = setJson(1, '创建成功！')
	   }catch(err){
		 console.log(err, 'err')
	   }
	   rep.send(result)
    }

	/**
		 * @api {post} /orders/user/list  个人订单列表
		 * @apiDescription 个人订单列表
		 * @apiName list
		 * @apiGroup orders
		 *
		 * @apiParam {String}  userId 用户ID 
		 * 
		 *
		 * @apiPermission none
		 * @apiSampleRequest  /orders/user/list
		 * 
		 * @apiUse Success
		 *
		 * @apiSuccessExample Success-Response:
		 *     HTTP/1.1 200 OK
		 *     {
		 *       "meta": {
		 *       	"code": 0,
		 *       	"message": "查询成功"
		 *       },
		 *       "data": {
         *          
         *       }
		 *     }
	*/

	async  get_user_orders(req, rep, next){
		let result = setJson(0, '查询失败')
		try{
		   const {
				userId,
	            pageSize,
				currentPage
		   } = req.body
		   pageSize = pageSize || 10

			let res = await model.find('Orders', `userId = '${userId}' limit ${(currentPage - 1) * pageSize}, ${currentPage  * pageSize}`)
			result = setJson(1, '查询成功！', {data : res})
		   }catch(err){
			 console.log(err, 'err')
		   }
		   rep.send(result)
	}

	/**
		 * @api {post} /orders/list  所有订单列表
		 * @apiDescription 所有订单列表
		 * @apiName list
		 * @apiGroup orders
		 *
		 * @apiParam {Number}  pageSize 每页数量
		 * @apiParam {Number}  currentPage 当前页
		 * 
		 *
		 * @apiPermission none
		 * @apiSampleRequest  /orders/list
		 * 
		 * @apiUse Success
		 *
		 * @apiSuccessExample Success-Response:
		 *     HTTP/1.1 200 OK
		 *     {
		 *       "meta": {
		 *       	"code": 0,
		 *       	"message": "查询成功"
		 *       },
		 *       "data": {
         *          
         *       }
		 *     }
	*/

	async  get_orders(req, rep, next){
		let result = setJson(0, '查询失败')
		try{
		   const {
	            pageSize,
				currentPage
		   } = req.body
		   pageSize = pageSize || 10

			let res = await model.find('Orders', `limit ${(currentPage - 1) * pageSize}, ${currentPage  * pageSize}`)
            let {length} = await model.find('Orders')

			result = setJson(1, '查询成功！', {data : { orderList : res, total : length}})
		   }catch(err){
			 console.log(err, 'err')
		   }
		   rep.send(result)
	}


}

module.exports = Orders