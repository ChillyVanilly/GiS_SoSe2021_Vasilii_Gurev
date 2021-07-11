import * as Http from "http";
import * as Url from "url";
import * as Mongo from "mongodb";

export namespace Datenbankanbindung {
  let mongoClient: Mongo.MongoClient;

  let port: number | string | undefined = process.env.PORT;
  if (port == undefined) {
    port = 5001;
  }

  let databaseUrl: string =
    "mongodb+srv://VasjiderBoss:shishaistgeil@gisgoodvibes.cvlu9.mongodb.net/VasisDatabase?retryWrites=true&w=majority";

  startServer(port);
  connectToDatabase(databaseUrl);

  function startServer(_port: number | string): void {
    let server: Http.Server = Http.createServer();
    console.log("Server starting on port:" + _port);

    server.listen(_port);
    server.addListener("request", handleRequest);
  }

  async function connectToDatabase(_url: string): Promise<void> {
    let options: Mongo.MongoClientOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    mongoClient = new Mongo.MongoClient(databaseUrl, options);

    await mongoClient.connect();

    console.log("Database succesfully connected");
  }

  async function handleRequest(
    _request: Http.IncomingMessage,
    _response: Http.ServerResponse
  ): Promise<any> {
    console.log("What's up?");

    _response.setHeader("content-type", "text/html; charset=utf-8");
    _response.setHeader("Access-Control-Allow-Origin", "*");

    console.log("Request-URL:  " + _request.url);

    if (_request.url) {
      let url: Url.UrlWithParsedQuery = Url.parse(_request.url, true);

      console.log(url.query);

      if (_request.url == "/?getOrder=yes") {
        console.log("THIS WORKS");

        let orders: Mongo.Collection<Bilder> = mongoClient
          .db("VasisDatabase")
          .collection("Bilder");

        let cursor: Mongo.Cursor<Bilder> = await orders.find();

        let data = await cursor.toArray();

        _response.write(JSON.stringify(data));

        _response.end();
      } else if (_request.url == "/?saveHighscore=yes") {
        let highScore: Mongo.Collection<HighScore> = mongoClient
          .db("VasisDatabase")
          .collection("Highscores");

        let body = "";

        _request.on("data", (data) => {
          body += data;
        });
        _request.on("end", async () => {
          let post: any = JSON.parse(body);

          await highScore.insertOne({ name: post.name, score: post.score });
        });
        _response.end();
      } else if (_request.url == "/?getHighScore") {
        let highScore: Mongo.Collection<HighScore> = mongoClient
          .db("VasisDatabase")
          .collection("Highscores");

        let all = highScore.find();

        let data: HighScore[] = await all.toArray();

        // sort descending
        data.sort((a, b) => a.score - b.score);

        let stringified: string = JSON.stringify(data);

        _response.write(stringified);

        _response.end();
      } else if (_request.url == "/?deletePicture") {
        console.log("delete picture");
        let pictures: Mongo.Collection<Bilder> = mongoClient
          .db("VasisDatabase")
          .collection("Bilder");

        let body = "";

        _request.on("data", (data) => {
          body += data;
        });
        _request.on("end", async () => {
          let post: string = JSON.parse(body);

          await pictures.deleteOne({ _id: new Mongo.ObjectID(post) });

          _response.write("Erfolgreich das Bild gelöscht!");

          _response.end();
        });
      } else if (_request.url == "/?addPicture") {
        console.log("delete picture");
        let pictures: Mongo.Collection<Bilder> = mongoClient
          .db("VasisDatabase")
          .collection("Bilder");

        let body = "";

        _request.on("data", (data) => {
          body += data;
        });
        _request.on("end", async () => {
          let post: string = JSON.parse(body);

          await pictures.insertOne({ url: post });

          _response.write("Erfolgreich das Bild hinzugefügt!");

          _response.end();
        });
      } else {
        _response.write("ROUTE NOT FOUND");
        _response.end();
      }
    }
  }
}

interface HighScore {
  name: string;
  score: number;
}
interface Bilder {
  url: string;
}
