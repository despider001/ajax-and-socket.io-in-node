var express      = require('express');
var app          = express();
var path         = require('path');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var server       = require('http').createServer(app);
var io           = require('socket.io')(server);
var ejs          = require('ejs');

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get('/', function(req, res) {
    res.render('index');
});


/**
 * 1. when connection is established a new socket is made 
 * 2. evry socket has an id that is stored in an array io.sockets.connected
 * 3. 
 * 
 */

io.on('connection', function(socket) {
    console.log(socket.id);
    socket.emit('session_id', {session_id: socket.id})
});

app.post('/', function(req, res) {
    console.log(req.body.data + ' \n' + req.body.session_id);
    let socket = io.sockets.sockets[req.body.session_id];
    if(socket) {
        socket.emit('data', req.body.data);
    } 

    //res.send('index');
    res.render('test');
    //io.local.emit('data', req.body.data);
});


app.get('/test', function(req, res) {
    res.render('test');
});


let port = process.env.PORT || 3000;
server.listen(port, function(){
    console.log('app running on ' + port);
});

/** SOCKET ONLY */
let postArr = [];
// io.on('connection', function(socket) {
//     socket.on('submit', function(data) {
//         postArr.push(data);
//     });

//     socket.on('retrieve', function(data) {
//         socket.emit('recData', postArr);
//     });
// });
