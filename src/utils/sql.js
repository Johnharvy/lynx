const {query} = require('../../db/mysql/wanxiang.js')

class Sql{
    constructor(){}
    /**
     *  sql通用增操作
     *  @param {string} tabel 表
     *  */  
    async add(tabel, data = {}){
         const keys = Object.keys(data).join(', ')
         let values = Object.values(data), valStr = ''
         values.map( (val, index) => {
              if(typeof val === 'string'){
                valStr += (index === values.length - 1)? `'${val}'` : `'${val}',`
              }else{
                valStr += (index === values.length - 1)? `${val}` : `${val},`
              }
         })
         try{
             let res = await query(`INSERT INTO ${tabel} (${keys}) VALUES (${valStr});`) 
             return res
         }catch(err){
             console.warn(err)
             return null
         }
    }

    /**
     *  sql通用删除操作
     *  @param {string} tabel 表
     *  @param {string} sqlStr sql语句
     *  @example del( 'USER', 'id <= 10')
     *  */  
    async del(tabel, sqlStr=""){
        try{
            let res = await query(`DELETE FROM ${tabel} WHERE ${sqlStr};`) 
            return res
        }catch(err){
            console.warn(err)
            return null
        }
   }

   /**
     *  sql通用改操作
     *  @param {string} tabel 表
     *  @param {string} sqlStr sql语句
     *  @example update( 'USER', {username : 'zxy'}, 'id == 11')
     *  */  
    async update(tabel, data = {}, sqlStr=""){
        let keys = Object.keys(data)
        keys.map( ( key , index) => {
             let val = data[key]
             if(typeof  data[key] === 'string'){
               valStr += (index === keys.length - 1)? `${key} = '${val}'` : `${key} = '${val}',`
             }else{
               valStr += (index === keys.length - 1)? `${key} = ${val}` : `${key} = ${val},`
             }
        })
        try{
            let res = await query(`UPDATE  ${tabel} SET (${keys}) WHERE ${sqlStr};`) 
            return res
        }catch(err){
            console.warn(err)
            return null
        }
   }

   /**
     *  sql通用查找操作
     *  @param {string} tabel 表
     *  @param {string} sqlStr sql语句
     *  @example find('USER', 'id > 10')
     *  */  
    async find(tabel, sqlStr=""){
        try{
            console.log(`SELECT * FROM ${tabel} WHERE ${sqlStr};`, '0000')
            let res = await query(`SELECT * FROM ${tabel} WHERE ${sqlStr};`) 
            return res
        }catch(err){
            console.warn(err)
            return null
        }
   }

}

module.exports = Sql