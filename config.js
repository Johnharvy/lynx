const config = {
      _env : process.argv[2] === 'production'? 'product' : 'dev',
      app : {
          port : 4000
      },
      db : {
          db_main :  {   
              product : {
                    host:"127.0.0.1",
                    port:3306,
                    database:"wanxiang",
                    multipleStatement:true, //允许同时执行多条sql语句
                    user:"root",
                    password:"root",
                    charset:"utf8_unicode_ci"
              },
              dev : {
                    host:"127.0.0.1",
                    port:3306,
                    database:"wanxiang",
                    multipleStatement:true, //允许同时执行多条sql语句
                    user:"root",
                    password:"root",
                    charset:"utf8_unicode_ci"
               
              }
          },

      }
}

module.exports = config