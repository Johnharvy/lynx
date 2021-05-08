const express = require('express')
const app = express()
const path = require('path');
const session = require("express-session");
const logger = require("morgan");
const methodOverride = require("method-override");
const bodyParser = require('body-parser');
const cors = require('cors')
const errorhandler = require("errorhandler");
const routes = require('./src/routes')


app.use(session({secret:"wanxiang",cookie:{maxAge: 3600 * 1000 * 2}}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, '/public'))); //set public is static resource  default root
app.use(cors())  //允许跨域







// 加载路由
routes(app)





module.exports = app

