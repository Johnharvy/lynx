const {setJson, model, time} = require('../utils/index.js')
const  { encode, decode } =  require('js-base64');

class Goods{
    constructor(app){
        this.app = app
		this.routes()
	}
    routes(){
        this.app.post('/api/goods/add', this.addGood)  //新增商品
        this.app.post('/api/goods/emit', this.emitGood)  //编辑商品
        this.app.post('/api/goods/list', this.getGoodsList)  //查询商品列表
        this.app.post('/api/goods/info', this.getGoodInfo) //查询商品
		this.app.post('/api/goods/onSale', this.setGoodSale)  //查询商品列表
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
		 * @api {post} /goods/add  添加商品
		 * @apiDescription 添加商品
		 * @apiName add
		 * @apiGroup goods
		 *
		 * @apiParam {String} ifSale  售卖状态  1-上架, 0-下架
		 * @apiParam {String} img 商品图片 
		 * @apiParam {Number} num 库存数量
		 * @apiParam {String} onSaleDate 上架时间
		 * @apiParam {Number} price 价格
		 * @apiParam {Nunber} saleNum 销售数量 
		 * @apiParam {String} title 标题
		 * @apiParam {Number} type 商品类型   1-美食，默认为1
		 * 
		 *
		 * @apiPermission none
		 * @apiSampleRequest /goods/add
		 * 
		 * @apiUse Success
		 *
		 * @apiSuccessExample Success-Response:
		 *     HTTP/1.1 200 OK
		 *     {
		 *       "meta": {
		 *       	"code": 0,
		 *       	"message": "添加成功"
		 *       },
		 *       "data": {
         *          "id" : 1
         *       }
		 *     }
	*/

   async  addGood(req, rep, next){
	let result = setJson(0, '添加失败')
	try{
	   const {
			ifSale,
			img = "",
			num,
			price,
			saleNum,
			title,
			type,
			onSaleDate = "",
	   } = req.body
	   
	   const  createDate =  time.getFormat(new Date())
	   const  params = {
				ifSale,
				img : "",
				num,
				price,
				saleNum,
				title,
				type,
				createDate,
				onSaleDate,
	   }
	 
		 let res = await model.add('GOODS', params)
		 result = setJson(1, '添加成功！')
	   }catch(err){
		 console.log(err, 'err')
	   }
	   rep.send(result)
    }


    /**
		 * @api {post} /goods/emit  编辑商品
		 * @apiDescription 编辑商品
		 * @apiName emit
		 * @apiGroup goods
		 *
		 * @apiParam {Number} id 商品ID  
		 * @apiParam {Number} num 库存数量
		 * @apiParam {Number} price 价格
		 * @apiParam {Number} saleNum 销售数量 
		 * @apiParam {Number} type 商品类型   1-美食，默认为1
		 * @apiParam {String} ifSale  售卖状态  1-上架, 0-下架
		 * @apiParam {String} img 商品图片 
		 * @apiParam {String} onSaleDate 上架时间
		 * @apiParam {String} title 标题
		 * 
		 *
		 * @apiPermission none
		 * @apiSampleRequest /goods/emit
		 * 
		 * @apiUse Success
		 *
		 * @apiSuccessExample Success-Response:
		 *     HTTP/1.1 200 OK
		 *     {
		 *       "meta": {
		 *       	"code": 1,
		 *       	"message": "编辑成功"
		 *       },
		 *       "data": {
         *         
         *       }
		 *     }
	*/
  async  emitGood(req, rep, next){
		let result = setJson(0, '修改失败')
		try{
		const {
				id,
				ifSale,
				img= "",
				num,
				price,
				saleNum,
				title,
				type,
				onSaleDate = "",
		} = req.body
		
		const  createDate =  time.getFormat(new Date())
		const  params = {
					ifSale,
					img : "",
					num,
					price,
					saleNum,
					title,
					type,
					createDate,
					onSaleDate,
		}
		
			let res = await model.update('GOODS', params, `id == ${id}`)
			result = setJson(1, '修改成功！')
		}catch(err){
			console.log(err, 'err')
		}
		rep.send(result)
    }

     /**
		 * @api {post} /goods/list 获取商品列表
		 * @apiDescription 获取商品列表
		 * @apiName list
		 * @apiGroup goods
		 * 
		 * @apiParam {Number} id 商品ID  
		 * @apiParam {Number} type 商品类型   1-美食，默认为1
		 * @apiParam {String} ifSale  售卖状态  1-上架, 0-下架
		 * @apiParam {String} title 标题
		 * @apiParam {Number} currentPage 当前页
		 * 
		 * 
		 *
		 * @apiPermission none
		 * @apiSampleRequest /goods/list
		 * 
		 * @apiUse Success
		 *
		 * @apiSuccessExample Success-Response:
		 *     HTTP/1.1 200 OK
		 *     {
		 *       "meta": {
		 *       	"code": 1,
		 *       	"message": "请求成功！"
		 *       },
		 *       "data": {
         *           "goods" : [
         *              {
         *                "id" : 0,
		 *                "title" : "商品1", 
		 *                "imgUrl" : '',  //图片链接           
         *                 
         *              }
         *            ]
         *       }
		 *     }
	*/
	async getGoodsList(req, rep, next){
		let result = setJson(0, '查询失败')
		try{
			let {
				id,
				ifSale,
				pageIndex,
				title,
				type,
				pageIndex : currentPage,
				pageSize,
		    } = req.body
			 currentPage =  currentPage || 1
			 pageSize =  pageSize || 10

			let sqlStr  = `id > 0 `
			if(id){  //id
				sqlStr += `and id = ${id} `
			}
			if(ifSale || ifSale === 0){  //上架状态
                sqlStr += `and  ifSale = ${ifSale} `
			}
			if(title){  //标题
				sqlStr += `and  title LIKE '%${title}%' `
			}
			if(type || type === 0){  //类型
				sqlStr += `and  type = ${type} `
			}
			console.log(`${sqlStr} limit ${(currentPage - 1) * pageSize}, ${currentPage  * pageSize}`, 'sql')

			let res = await model.find('GOODS',`${sqlStr} limit ${(currentPage - 1) * pageSize}, ${currentPage  * pageSize}`)
			let {length} = await model.find('GOODS', 'id > 0')
			result = setJson(1, '查询成功！', {goodList : res, total : length})
		}catch(err){
			console.log(err, 'err')
		}
		rep.send(result)
    }


    /**
		 * @api {post} /goods/info   获取商品信息
		 * @apiDescription 获取商品信息
		 * @apiName info
		 * @apiGroup goods
		 *
		 * @apiParam {String} id  商品id,必填
		 * 
		 * @apiPermission none
		 * @apiSampleRequest /goods/info
		 * 
		 * @apiUse Success
		 *
		 * @apiSuccessExample Success-Response:
		 *     HTTP/1.1 200 OK
		 *     {
		 *       "meta": {
		 *       	"code": 1,
		 *       	"message": "请求成功！"
		 *       },
		 *       "data": {
         *                "id" : 0, title : "商品1", imgUrl : '',                
         *       }
		 *     }
	*/
    async  getGoodInfo(req, rep, next){
		let result = setJson(0, '查询失败')
		try{
		const {
				id,
		} = req.body
		
		const  params = {
			    id
		}
		
		let res = await model.find('GOODS',`id == ${id}`)
		result = setJson(1, '查询成功！', res[0])
		}catch(err){
			console.log(err, 'err')
		}
		rep.send(result)
    }


	/**
		 * @api {post} /goods/onSale 上下架商品
		 * @apiDescription  上下架商品
		 * @apiName onSale
		 * @apiGroup goods
		 *
		 * @apiParam {String} id  商品id,必填
		 * @apiParam {String} ifSale  售卖状态  1-上架, 0-下架
		 * 
		 * @apiPermission none
		 * @apiSampleRequest /goods/onSale
		 * 
		 * @apiUse Success
		 *
		 * @apiSuccessExample Success-Response:
		 *     HTTP/1.1 200 OK
		 *     {
		 *       "meta": {
		 *       	"code": 1,
		 *       	"message": "请求成功！"
		 *       },
		 *       "data": {
         *                           
         *       }
		 *     }
	*/
    async  setGoodSale(req, rep, next){
		let result = setJson(0, '设置失败')
		try{
			const {
					id,
					ifSale
			} = req.body
			
			const  params = {
				   ifSale
			}
			
			let res = await model.update('GOODS', params, `id == ${id}`)
			result = setJson(1, '设置成功！', res[0])
		}catch(err){
			console.log(err, 'err')
		}
		rep.send(result)
    }
}

module.exports = Goods