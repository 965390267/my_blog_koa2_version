Promise = require('bluebird')
var express = require('express')
var mongoose = require('mongoose')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var acl = require('acl')

var app = express()

/*
 * ------------------------------------------------
 * 数据库
 */
mongoose.Promise = Promise
mongoose.connect('mongodb://47.97.123.194:27017/blog')// 连接你自己的数据库
.then(() => {// 这里要注意，一定要在连接数据库之后进行权限的操作，否则不生效
    roles()// 权限
    routes()// 路由
})

app.use(session({
    secret: 'sign',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
}))

/*
 * --------------------------------------------------
 * 权限
 */
function roles() {
    acl = new acl(new acl.mongodbBackend(mongoose.connection.db, 'acl_'))
    // 为guest、user、admin角色添加权限
    acl.allow([
        {
            roles: 'guest',
            allows: [
                {resources: '/article/get', permissions: '*'},
            ],
        },
        {
            roles: 'user',
            allows: [
                {resources: '/article/edit', permissions: '*'},
            ],
        },
        {
            roles: 'admin',
            allows: [
                {resources: '/article/del', permissions: '*'},
            ],
        }
    ])
    acl.addRoleParents('user', 'guest')// user角色拥有guest角色所有的权限
    acl.addRoleParents('admin', 'user')// admin角色拥有user角色所有的权限
}

/*
 * --------------------------------------------------
 * 路由
 */
function routes() {
    // 渲染主页面
    app.all('/', (req, res, next) => {
        var html = `
            <div>
                <input class="name" type="text" placeholder="输入用户名" value="${Date.now()}" autocomplete="off">
                <button class="add">创建用户</button>
                <p>guest角色可以访问/article/get，user角色可以访问/article/edit，admin角色可以访问/article/del</p>
                <p>默认情况下，访问1、2、3都会被拒绝</p>
                <p>创建用户后，会自动给新创建的用户添加guest和 user角色，所以允许访问1、2</p>
                <p>点击4后，删除了用户的user角色，只能访问1了</p>
                <p>
                    <span>1.</span>
                    <a href="/article/get" target="_blank">访问/article/get</a>
                </p>
                <p>
                    <span>2.</span>
                    <a href="/article/edit" target="_blank">访问/article/edit</a>
                </p>
                <p>
                    <span>3.</span>
                    <a href="/article/del" target="_blank">访问/article/del</a>
                </p>
                <p>
                    <span>4.</span>
                    <a href="/user/del" target="_blank">删除用户的user角色</a>
                </p>
            </div>
            <script>
                window.onload = function() {
                    document.querySelector('.add').onclick = function() {
                        window.open('/user/add?name='+ document.querySelector('.name').value)
                    }
                }
            </script>
        `
        res.send(html)
    })


    var User = schema()// 获取用户模型实例
    // 添加角色
    app.all('/user/add', (req, res, next) => {
        User.add(req.query)
        .then((user) => {
            var _id = user._id.toString()// 注意_id默认是object类型
            req.session.userId = _id// 写入session，标识该用户
            acl.addUserRoles(_id, ['guest', 'user'])// 为用户添加guest和user的角色(那么用户就拥有了guest和user的权限)
            res.send({message: '添加用户角色成功'})
        })
        .catch((e) => {
            res.send({message: e.message})
        })
    })
    // 删除角色 
    app.all('/user/del', (req, res, next) => {
        acl.removeUserRoles(req.session.userId, 'user')
        res.send({message: '删除用户角色成功'})
    })
    // 访问article
    app.all('/article/get', authentication, (req, res, next) => {
        res.send({message: '/article/get'})
    })
    // 编辑article
    app.all('/article/edit', authentication, (req, res, next) => {
        res.send({message: '/article/edit'})
    })
    // 删除article
    app.all('/article/del', authentication, (req, res, next) => {
        res.send({message: '/article/del'})
    })
    app.use(errorhandler)
}

/*
 * --------------------------------------------------
 * schema
 */
function schema() {
    var schema = new mongoose.Schema({
        name: {
            type: String,
        },
    })

    schema.statics = {
        add: function(obj) {
            return this
            .create(obj)
        },
    }

    return mongoose.model('User', schema);
}

/*
 * --------------------------------------------------
 * 中间件
 */
// 认证中间件
var authentication = (req, res, next) => {
    var userId =req.session.userId || ''

    if(userId) {
        acl.isAllowed(userId, req.path, '*')
        .then(allowed => {
            if(allowed) {
                next()
            }else {
                next('权限不足')
            }
        })
        .catch((e) => {
            next(e.message)
        })
    }else {
        next('请登录')
    }

}
// 错误中间件
var errorhandler = (e, req, res, next) => {
    res.send({message: e})
}

/*
 * --------------------------------------------------
 * 开启服务
 */
app.listen(3001, () => {
    console.log('server...')
})
