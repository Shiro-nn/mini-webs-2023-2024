import {MongoClient} from "mongodb";
import express from "express";
import http from "http";
import https from "https";
import config from "./config";
import routes from "./routes";
import database from "./extensions/database";

const client = new MongoClient(config.mongodb);

const initMongo = async () => {
    await database.init(client);

    console.log("Connected to the MongoDB");

    await runWeb();
}

const runWeb = async () => {
    const web = express();

    routes(web);

    http.createServer(web).listen(config.web.http.port, () => {
        console.log("Http server is running on port: " + config.web.http.port);
    });

    if (config.web.https.enabled) {
        https.createServer({
            key: config.web.https.key,
            cert: config.web.https.cert
        }, web).listen(config.web.https.port, () => {
            console.log("HttpS server is running on port: " + config.web.https.port);
        });
    }

}

initMongo()
    .catch((err) => console.error(err));

process.on("unhandledRejection", (err) => console.error(err));
process.on("uncaughtException", (err) => console.error(err));