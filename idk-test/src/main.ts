import knex from "knex";
import config from "./config";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import http from "http";
import https from "https";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
    console.log(`Application is running on: ${await app.getUrl()}`);

    http.createServer(app.getHttpServer()).listen(config.http.port, () => {
        console.log("Http server is running on port: " + config.http.port);
    });

    if (config.https.enabled) {
        https.createServer({
            key: config.https.key,
            cert: config.https.cert
        }, app.getHttpServer()).listen(config.https.port, () => {
            console.log("HttpS server is running on port: " + config.https.port);
        });
    }
    //#region 
}

bootstrap().catch(err => console.error(err));