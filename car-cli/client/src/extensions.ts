import * as crypto from "node:crypto";
import config from "./config";

const getArg = (name: string): string | undefined => {
    for (let index in process.argv) {
        const arg = process.argv[index];

        if (!arg.startsWith("--"))
            continue;

        if (!arg.includes("="))
            continue;

        const split = arg.split("=");
        if (split[0].substring(2) == name)
            return split.slice(1).join("=")
    }
}

const checkAuth = async (): Promise<string> => {
    const login = getArg("login");
    const pwd = getArg("password");

    if (!login) {
        console.log("Укажите аргумент \"login\"")
        process.exit(1);
    }

    if (!pwd) {
        console.log("Укажите аргумент \"password\"")
        process.exit(1);
    }

    console.log("Получение публичного ключа...");

    const respKey = await fetch(config.web + "auth/publicKey");
    const publicKey = await respKey.text();
    const token = encryptString(login + ":" + pwd, publicKey);
    const bearer = "Bearer " + token;

    console.log("Проверка авторизации...");

    const respCheck = await fetch(config.web + "auth/checkAuth", {
        headers: {
            Authorization: bearer
        }
    });

    if (respCheck.status != 200) {
        const textCheck = await respCheck.text();
        console.log(textCheck);
        process.exit(1);
    }

    console.log("Проверка прошла успешно");

    return bearer;
}

const safeGetArgs = (name: string = "arguments"): string => {
    const arg = getArg(name);

    if (!arg) {
        console.error("Не указан аргумент \"arguments\"");
        process.exit(1);
    }

    const reply = rawArgsToObject(arg);
    return JSON.stringify(reply);
}

const rawArgsToObject = (origin: string): any => {
    const arr = origin.trim().split(",");
    let reply: any = {};

    for (let key in arr) {
        let value = arr[key];

        if (!value.includes("="))
            continue;

        const arg = value.split("=");
        reply[arg[0].trim()] = arg[1].trim();
    }

    return reply;
}

export default {
    getArg,
    checkAuth,
    safeGetArgs,
    rawArgsToObject
}

function encryptString(text: string, publicKey: string): string {
    const key = {key: publicKey, oaepHash: "SHA512", padding: 4};
    const encrypted = crypto.publicEncrypt(key, Buffer.from(text));
    return encrypted.toString("base64");
}