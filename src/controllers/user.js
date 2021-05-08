
const {setJson, model} = require('../utils/index.js')
const  { encode, decode } =  require('js-base64');


class User{
    constructor(app){
        this.app = app
		this.init()
	}

	/**
	 * 初始化
	 */
	init() {
		this.routes()
	}

	/**
	 * 注册路由
	 */
	routes() {
		this.app.post('/api/user/sign/up', this.logon)
		this.app.post('/api/user/sign/in', this.login)
		this.app.post('/api/user/sign/out', this.logOut)
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
		 * @api {post} /user/sign/up 后台用户注册
		 * @apiDescription 用户注册
		 * @apiName signUp
		 * @apiGroup user
		 *
		 * @apiParam {String} username 用户名,必填
		 * @apiParam {String} password 密码,必填
		 * @apiParam {Int} type 类型（type默认为1，如果传2即为超级管理员）,必填
		 * @apiParam {String} ref_origin 渠道标识 (默认为wanxiang)
		 * @apiParam {Int} time 时间戳
		 * @apiParam {String} avator 头像
		 * 
		 * 
		 *
		 * @apiPermission none
		 * @apiSampleRequest /user/sign/up
		 * 
		 * @apiUse Success
		 *
		 * @apiSuccessExample Success-Response:
		 *     HTTP/1.1 200 OK
		 *     {
		 *       "meta": {
		 *       	"code": 0,
		 *       	"message": "注册成功"
		 *       },
		 *       "data": null
		 *     }
	*/

	async logon (req, rep, next){
		let { username,
			password, 
			type = 1, 
			ref_origin = 'wanxiang'
		} = req.body, result = setJson(0, '')

		let time = Date.now()
		type = type || 1 , device = device || 0, origin_type = origin_type || 0

		if(!username || !password){
			result = setJson(0, '注册失败，缺少用户名或密码参数！')
			rep.send(result)
			return;
		}

		if(ref_origin = 'wanxiang'){   //万相渠道（主渠道）
			if( !(password.length < 9 && /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,30}/.test(password)) ){
			result = setJson(0, '注册失败，密码格式不符合要求！')
			rep.send(result)
			return;
			}
		}

		try{
			let data = {
				username,
				password, 
				type, 
				ref_origin, 
				time, 
				avator
				
			}
			let res = await model.add('USER', data )
			
			if(res){
				result = setJson(1, '注册成功！')
			}	
		}catch(err){
			console.log(err, '注册出错！')
		}

		rep.send(result)
	}


    /**
		 * @api {post} /user/sign/in 后台用户登录
		 * @apiDescription 后台用户登录
		 * @apiName signIn
		 * @apiGroup user
		 *
		 * @apiParam {String} username 用户名,必填
		 * @apiParam {String} password 密码,必填
		 * 
		 * 
		 *
		 * @apiPermission none
		 * @apiSampleRequest /user/sign/in
		 * 
		 * @apiUse Success
		 *
		 * @apiSuccessExample Success-Response:
		 *     HTTP/1.1 200 OK
		 *     {
		 *       "meta": {
		 *       	"code": 1,
		 *       	"message": "登录成功!"
		 *       },
		 *       "data": {
		 *            "token" : "xxxx"
		 *        }
		 *     }
	*/

	async login (req, rep, next){
           let {username, password} = req.body, result = setJson(0, '')
		   if(!username || !password) { result = setJson(0, '缺少用户名或密码！'); rep.send(result); return;}
		   try{
			   let res = await model.find('USER',`username = '${username}' and password = '${password}'`)
			   if(res.length > 0){
					 let user_token =  encode(`${username},${Date.now()}`) //username,timestamp组成token, 后续接口都要验证唯一性和有效时间
				     //2hours useful_time
					 req.session.username =  user_token ;
					 result = setJson(1, '登录成功！', {token : user_token, userId : res[0].id },); rep.send(result); return;
			   }else{
				     result = setJson(0, '账号密码错误！'); rep.send(result); return;
			   }
		   }catch(err){
			   console.log(err, '报错')
		   }
	}


	/**
		 * @api {post} /user/sign/out 后台用户登出
		 * @apiDescription 后台用户登出
		 * @apiName signOut
		 * @apiGroup user
		 *
		 * @apiHeader {String} token  用户TOKEN
		 * 
		 *
		 * @apiPermission none
		 * @apiSampleRequest /user/sign/out
		 * 
		 * @apiUse Success
		 *
		 * @apiSuccessExample Success-Response:
		 *     HTTP/1.1 200 OK
		 *     {
		 *       "meta": {
		 *       	"code": 1,
		 *       	"message": "登出成功!"
		 *       },
		 *       "data": {
		 *        }
		 *     }
	*/

	async logOut (req, rep, next){
		let  result = setJson(0, ''), {token} = req.headers
		
		if(!token){
			result = setJson(0, '缺少token!退出失败！')
			rep.send(result)
			return
		}
		try{
		   token = decode(token).split(',')
		   let  username = token[0]
		   req.session[username] = undefined
		   result = setJson(1, '登出成功！'); rep.send(result); return;
		}catch(err){
			console.log(err, '报错')
			result = setJson(0, '登出错误！'); rep.send(result); return;
		}
    }


	/**
		 * @api {post} /user/info/update 用户信息编辑
		 * @apiDescription 用户信息编辑
		 * @apiName /user/info/update
		 * @apiGroup user
		 *
		 * @apiHeader {String} token  用户TOKEN
		 * @apiParam  {String} userId  用户Id
		 * 
		 *
		 * @apiPermission none
		 * @apiSampleRequest /user/info/update
		 * 
		 * @apiUse Success
		 *
		 * @apiSuccessExample Success-Response:
		 *     HTTP/1.1 200 OK
		 *     {
		 *       "meta": {
		 *       	"code": 1,
		 *       	"message": "操作成功!"
		 *       },
		 *       "data": {
		 *        }
		 *     }
	*/

	async user_info_emit (req, rep, next){
		let  result = setJson(0, ''), {token} = req.headers
		
		if(!token){
			result = setJson(0, '缺少token!退出失败！')
			rep.send(result)
			return
		}
		try{
		   token = decode(token).split(',')
		   let {username, password, avator} = req.body
		   result = setJson(1, '修改成功！'); rep.send(result); return;
		}catch(err){
			console.log(err, '报错')
			result = setJson(0, '修改失败！'); rep.send(result); return;
		}
    }




}



module.exports = User