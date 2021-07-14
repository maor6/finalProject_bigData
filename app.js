const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require("socket.io")(server);
const port = 3000;

//------------ kafka------------
// const kafka = require('./Controller/kafkaProduce');

//-----------redis--------------
const redis = require('./model/RedisForArielReciver');

//-----------bigML--------------
const bigML = require('./bigMLController');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.send("<a href='/send'>Send</a> <br/><a href=''>View</a>");
});

app.get('/send', (req, res) => {
    res.render('./pages/sender');
});

app.get('/table', (req, res) => {
    res.render('./pages/predictTable');
});

app.get('/dashboard', (req, res) => {
    const cardData = {
        id: "totalSum",
        title: "אריאל",
        totalSum: 5,
        percent: 0.8,
        icon: "work"
    };
    const cards = ["Borrowed", "Annual Profit", "Lead Conversion", "Average Income",];
    res.render("./pages/index",{card:cardData});
});

//------------ Socket.io ----------------
io.on("connection", (socket) => {
    console.log("new user connected");
    socket.on("totalWaitingCalls", (msg) => { console.log(msg.totalWaiting); });
    socket.on("callDetails", (msg) => { console.log(msg);kafka.publish(msg); });
    socket.on('train', (msg) => { bigML.createModel();});
    socket.on('predict', (msg) => {});  // TODO start/stop predict every car that entered with the local model
});


server.listen(port, () => {
    console.log(`Ariel app listening at http://localhost:${port}`);
});
