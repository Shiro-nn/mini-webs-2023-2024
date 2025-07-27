import { Injectable } from '@nestjs/common';
import knex from "knex";
import config from "./config";

const pg = knex({
    client: "pg",
    connection: config.postgres,
    searchPath: ['knex', 'public'],
});

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!';
    }
}
