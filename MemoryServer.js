"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Datenbankanbindung = void 0;
const Http = require("http");
const Url = require("url");
const Mongo = require("mongodb");
var Datenbankanbindung;
(function (Datenbankanbindung) {
    let allOrders = [];
    let orders;
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
        let options = { useNewUrlParser: true, useUnifiedTopology: true };
        let mongoClient = new Mongo.MongoClient(_url, options);
        await mongoClient.connect();
        orders = mongoClient.db("VasisDatabase").collection("Bilder");
        console.log("Database connection ", orders != undefined);
    }
    async function handleRequest(_request, _response) {
        console.log("What's up?");
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        console.log("Request-URL:  " + _request.url);
        if (_request.url) {
            let url = Url.parse(_request.url, true);
            /* for (let key in url.query) {
                switch (key) {
                case "product":
                break;
                default:
                _response.write(key + ":  " + url.query[key] + "\n");
                break;
                }
            } */
            console.log(url.query);
            if (_request.url == "/?getOrder=yes") {
                console.log("THIS WORKS");
                //showData(_response); 
                let options = { useNewUrlParser: true, useUnifiedTopology: true };
                let mongoClient = new Mongo.MongoClient(databaseUrl, options);
                await mongoClient.connect();
                let orders = mongoClient.db("VasisDatabase").collection("Bilder");
                let cursor = await orders.find();
                await cursor.forEach(showOrders);
                let jsonString = JSON.stringify(allOrders);
                let answer = jsonString.toString();
                _response.write(answer);
                allOrders = [];
            }
            else {
                let jsonString = JSON.stringify((url.query), null, 2);
                _response.write(jsonString);
                storeOrder(url.query);
            }
        }
        _response.end();
    }
    /* async function showData(_response: Http.ServerResponse): Promise<any> {
        console.log("ShowData called");
        let options: Mongo.MongoClientOptions = {useNewUrlParser: true, useUnifiedTopology: true};
        let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(databaseUrl, options);
        await mongoClient.connect();
        let orders: Mongo.Collection = mongoClient.db("Household").collection("Orders")
        let cursor: Mongo.Cursor<any> = await orders.find();
        await cursor.forEach(showOrders);
        console.log("Cursor " + cursor);
        console.log("AllOrders in Show Data" + allOrders);
        return allOrders
    } */
    function storeOrder(_order) {
        orders.insert(_order);
    }
    function showOrders(_item) {
        //for (let entry in _item) {
        //JSON.stringify(entry);
        let jsonString = JSON.stringify(_item);
        allOrders.push(jsonString);
        //console.log(entry); 
        //}
    }
})(Datenbankanbindung = exports.Datenbankanbindung || (exports.Datenbankanbindung = {}));
//# sourceMappingURL=MemoryServer.js.map