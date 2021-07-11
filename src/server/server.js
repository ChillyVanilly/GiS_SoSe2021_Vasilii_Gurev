"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Datenbankanbindung = void 0;
const Http = require("http");
const Url = require("url");
const Mongo = require("mongodb");
var Datenbankanbindung;
(function (Datenbankanbindung) {
    let mongoClient;
    let port = process.env.PORT;
    if (port == undefined) {
        port = 5001;
    }
    let databaseUrl = "mongodb+srv://VasjiderBoss:shishaistgeil@gisgoodvibes.cvlu9.mongodb.net/VasisDatabase?retryWrites=true&w=majority";
    startServer(port);
    connectToDatabase(databaseUrl);
    function startServer(_port) {
        let server = Http.createServer();
        console.log("Server starting on port:" + _port);
        server.listen(_port);
        server.addListener("request", handleRequest);
    }
    async function connectToDatabase(_url) {
        let options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        mongoClient = new Mongo.MongoClient(databaseUrl, options);
        await mongoClient.connect();
        console.log("Database succesfully connected");
    }
    async function handleRequest(_request, _response) {
        console.log("What's up?");
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        console.log("Request-URL:  " + _request.url);
        if (_request.url) {
            let url = Url.parse(_request.url, true);
            console.log(url.query);
            if (_request.url == "/?getOrder=yes") {
                console.log("THIS WORKS");
                let orders = mongoClient
                    .db("VasisDatabase")
                    .collection("Bilder");
                let cursor = await orders.find();
                let data = await cursor.toArray();
                _response.write(JSON.stringify(data));
                _response.end();
            }
            else if (_request.url == "/?saveHighscore=yes") {
                let highScore = mongoClient
                    .db("VasisDatabase")
                    .collection("Highscores");
                let body = "";
                _request.on("data", (data) => {
                    body += data;
                });
                _request.on("end", async () => {
                    let post = JSON.parse(body);
                    await highScore.insertOne({ name: post.name, score: post.score });
                });
                _response.end();
            }
            else if (_request.url == "/?getHighScore") {
                let highScore = mongoClient
                    .db("VasisDatabase")
                    .collection("Highscores");
                let all = highScore.find();
                let data = await all.toArray();
                // sort descending
                data.sort((a, b) => a.score - b.score);
                let stringified = JSON.stringify(data);
                _response.write(stringified);
                _response.end();
            }
            else if (_request.url == "/?deletePicture") {
                console.log("delete picture");
                let pictures = mongoClient
                    .db("VasisDatabase")
                    .collection("Bilder");
                let body = "";
                _request.on("data", (data) => {
                    body += data;
                });
                _request.on("end", async () => {
                    let post = JSON.parse(body);
                    await pictures.deleteOne({ _id: new Mongo.ObjectID(post) });
                    _response.write("Erfolgreich das Bild gelöscht!");
                    _response.end();
                });
            }
            else if (_request.url == "/?addPicture") {
                console.log("delete picture");
                let pictures = mongoClient
                    .db("VasisDatabase")
                    .collection("Bilder");
                let body = "";
                _request.on("data", (data) => {
                    body += data;
                });
                _request.on("end", async () => {
                    let post = JSON.parse(body);
                    await pictures.insertOne({ url: post });
                    _response.write("Erfolgreich das Bild hinzugefügt!");
                    _response.end();
                });
            }
            else {
                _response.write("ROUTE NOT FOUND");
                _response.end();
            }
        }
    }
})(Datenbankanbindung = exports.Datenbankanbindung || (exports.Datenbankanbindung = {}));
//# sourceMappingURL=server.js.map