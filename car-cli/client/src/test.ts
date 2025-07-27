import * as crypto from "node:crypto";
import config from "./config";

(async () => {
    const resp1 = await fetch(config.web + "auth/publicKey");
    const text1 = await resp1.text();
    const token = encryptString("example" + ":" + "pwd", text1);

    const resp2 = await fetch(config.web + "auth/checkAuth", {
        headers: {
            Authorization: token
        }
    });
    const text2 = await resp2.text();

    console.log(text2);

    const resp3 = await fetch(config.web + "api/car", {
        method: 'POST',
        headers: {
            Authorization: token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: "some name",
            brand: "some brand",
            year: 2000,
            price: 1337
        })
    });

    console.log(resp3.status);
    console.log(await resp3.text());

    const resp4 = await fetch(config.web + "api/car", {
        method: "PATCH",
        headers: {
            Authorization: token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            search: {
                name: "some name",
            },
            update: {
                name: "nm",
                brand: "brand 2",
                year: 887,
                price: 999
            }
        })
    });

    console.log(resp4.status);
    console.log(await resp4.text());

    const resp5 = await fetch(config.web + "api/car?name=zxc", {
        method: "GET",
        headers: {
            Authorization: token,
        },
    });

    console.log(resp5.status);
    console.log(await resp5.json());
})();

function encryptString(text: string, publicKey: string): string {
    const encrypted = crypto.publicEncrypt({key: publicKey, oaepHash: "SHA512", padding: 4}, Buffer.from(text));
    return encrypted.toString("base64");
}