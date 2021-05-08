
/**
 *   从配置里拿环境和参数
 *  */  

const  mysql=require("mysql");

const {db : {db_main}, _env} = require('../../config.js')


const {host,port,database, multipleStatement,user, password,charset} =  db_main[_env]

//换成连接池，避免单个连接之间冲突
const mqlConnect=mysql.createPool({
    host,
    port,
    database,
    multipleStatement,
    user,
    password,
    charset
});

const  query = function(sql,options,callback){ 
    return new Promise( (resolve, reject) => {
        mqlConnect.getConnection( (conerr,conn) => {
            if(conerr)  reject(conerr,'sql connect has error!',null);  
            else {
                conn.query(sql,options,function(err,results,fields){  
                    //释放连接  
                    conn.release();  
                    if(err){
                        reject(err, 'sql搜索出错!')
                    }else{
                        resolve(results,fields)
                    }
                })
            }
        })
    })
}


module.exports = {
    query, //数据库连接对象
};
