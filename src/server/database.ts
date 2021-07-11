import * as Mongo from "mongodb";
import { Feedback } from "./feedback";
import { ParsedUrlQuery } from "querystring";

let mongoClient: Mongo.MongoClient;
let collection: Mongo.Collection;

export namespace MemoryDB {
  export async function connectToDB(_url: string): Promise<void> {
    mongoClient = new Mongo.MongoClient(_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await mongoClient.connect();
    collection = mongoClient.db("dbname").collection("collname");
    console.log("Database connection", collection != undefined);
  }

  export async function findAll(): Promise<Feedback[]> {
    console.log("findAll");
    let cursor: Mongo.Cursor<Feedback> = await collection.find();
    return cursor.toArray();
  }

  // tslint:disable-next-line: no-any
  export async function insert(
    _fb: ParsedUrlQuery
  ): Promise<Mongo.InsertOneWriteOpResult<any>> {
    console.log("insert " + _fb.name + "'s feedback.");
    return await collection.insertOne(_fb);
  }

  export async function removeOne(
    _query: ParsedUrlQuery
  ): Promise<Mongo.DeleteWriteOpResultObject> {
    let id: string = <string>_query["id"];
    let objID: Mongo.ObjectId = new Mongo.ObjectId(id);
    console.log("remove", id);
    return await collection.deleteOne({ _id: objID });
  }
}
