"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryDB = void 0;
const Mongo = require("mongodb");
let mongoClient;
let collection;
var MemoryDB;
(function (MemoryDB) {
    async function connectToDB(_url) {
        mongoClient = new Mongo.MongoClient(_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await mongoClient.connect();
        collection = mongoClient.db("dbname").collection("collname");
        console.log("Database connection", collection != undefined);
    }
    MemoryDB.connectToDB = connectToDB;
    async function findAll() {
        console.log("findAll");
        let cursor = await collection.find();
        return cursor.toArray();
    }
    MemoryDB.findAll = findAll;
    // tslint:disable-next-line: no-any
    async function insert(_fb) {
        console.log("insert " + _fb.name + "'s feedback.");
        return await collection.insertOne(_fb);
    }
    MemoryDB.insert = insert;
    async function removeOne(_query) {
        let id = _query["id"];
        let objID = new Mongo.ObjectId(id);
        console.log("remove", id);
        return await collection.deleteOne({ _id: objID });
    }
    MemoryDB.removeOne = removeOne;
})(MemoryDB = exports.MemoryDB || (exports.MemoryDB = {}));
//# sourceMappingURL=database.js.map