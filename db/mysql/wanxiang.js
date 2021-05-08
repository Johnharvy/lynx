const  mysql=require("mysql");

//换成连接池，避免单个连接之间冲突
const mqlConnect=mysql.createPool({
    host:"127.0.0.1",
    port:3306,
    database:"wanxiang",
    multipleStatement:true, //允许同时执行多条sql语句
    user:"root",
    password:"root",
    charset:"utf8_unicode_ci"
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
