let express = require('express')
let fs = require('fs');
let path = require('path');
var bodyParser = require('body-parser')
let crypto = require('crypto')

let clientHTML = fs.readFileSync(path.join(__dirname, 'public/index.html'))
let clientJS = fs.readFileSync(path.join(__dirname, 'public/index.js'))
let clientCSS = fs.readFileSync(path.join(__dirname, 'public/index.css'))

let clientApp = express();

let userPass = {}
//ONLY FOR SERVER
function addUser(USERDATA){}

//ONLY FOR CLIENT
function checkUser(USERDATA){
    if(userPass[USERDATA['u']])
}

clientApp.use(bodyParser.json());

clientApp.use((req, res) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    // The path req._parsedUrl.pathname
    // The Queries req.query
    req.next()
})
//The testing path
clientApp.get("/test/*",(req, res) => {
    res.send({'query':query,'path':data});
})

//The atcuall application
clientApp.get("/app/index.html",(req,res) => {
    res.contentType('text/html')
    res.send(clientHTML.toString('utf8'))
})

clientApp.get("/app/",(req,res) => {
    res.contentType('text/html')
    res.send(clientHTML.toString('utf8'))
})

clientApp.get("/app/index.js",(req,res) => {
    res.contentType('text/javascript')
    res.send(clientJS.toString('utf8'))
})

clientApp.get("/app/index.css",(req,res) => {
    res.contentType('text/css')
    res.send(clientCSS.toString('utf8'))
})

clientApp.get("/CS/getImage", (req, res) => {
    res.contentType('png')
    let image = fs.readFileSync(path.join(__dirname, `./image${crypto.randomInt(0, 3)}.png`))
    res.send(image.toString('base64'))
})

clientApp.post("/CS/mousemove", async (req, res) => {
    console.log("Movement:")
    data = req.body
    console.log(data)
    res.send('recived')
})

clientApp.post("/CS/mousedown", async (req, res) => {
    console.log("Click:")
    data = req.body
    console.log(data)
    res.send('recived')
})

clientApp.post("/CS/keys", (req, res) => {
    console.log("Keys:")
    data = req.body
    console.log(data)
    res.send('recived')
})

clientApp.listen(8000)

var serverApp = express()