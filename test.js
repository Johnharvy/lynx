const  { encode, decode } =  require('js-base64');

let a =  encode('诸葛小亮3,' + Date.now())
console.log(a)