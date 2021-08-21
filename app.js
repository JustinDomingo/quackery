const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const app = express()
const userController = require('./controllers/userController')
let username
let User = require('./models/User')
var path = require('path')
const sanitizeHTML = require('sanitize-html')

let sessionOptions = session({
    secret: "Anything",
    store: MongoStore.create({client: require('./db')}),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 100 * 60 * 60 * 24, httpOnly: true}
})

app.use(sessionOptions)

app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.get('/', function(req, res) {
    /*if (req.session.username) {
        res.sendFile(path.resolve('public/chatroom.html'))
    } else {
        res.sendFile(path.resolve('public/main-home.html'))
    }*/
    res.sendFile(path.resolve('public/main-home.html'))
})

app.get('/home-guest', function(req, res) {
    res.sendFile(path.resolve('public/home-guest.html'))
})

app.post('/submit', function(req, res) {
    let user = new User(req.body.username)
    user.create().then(function(item) {
        console.log(item)
        req.session.username = item
        req.session.save(function() {
            username = req.session.username
            res.sendFile(path.resolve('public/chatroom.html'))
        })        
    }).catch(function(error) {
        console.log(error)
        res.sendFile(path.resolve('public/home-guest.html'))
    })
})

const server = require('http').createServer(app)
const io = require('socket.io')(server)

io.use(function(socket, next) {
    sessionOptions(socket.request, socket.request.res, next)
})

io.on('connection', (socket) => {
    let username = socket.request.session.username
    socket.emit('Username', {username: username})
    io.emit('MessageFromServer', {joinMessage: username})
    socket.on('MessageFromBrowser', function(data) {
        socket.broadcast.emit('ResponseFromServer', {text: sanitizeHTML(data.text, {allowedTags: [], allowedAttributes: {}}), username: username, date: data.date})
    })
})



module.exports = server