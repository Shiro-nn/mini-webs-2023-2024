import extensions from "../extensions";
import config from "../config";
import helper from "../helper";

helper.addMethod("GET",
    "Получает список автомобилей.\n" +
    "Фильтры: name и/или brand, либо ничего.",

    "--arguments",

    "name = название автомобиля\n" +
    "brand = бренд автомобиля",

    "node ... --login=example --password=pwd --method=get " +
    "--arguments=name=Camaro,brand=test"
);

const run = async () => {
    const bearer = await extensions.checkAuth();

    console.log("───────── ⋆⋅ ⌞ GET ⌝ ⋅⋆ ─────────");

    let search = {};
    const arg = extensions.getArg("arguments");
    if (arg) {
        search = extensions.rawArgsToObject(arg);
    }

    let searchString = "";

    for (let key in search) {
        searchString += encodeURIComponent(key);
        searchString += "=";
        // @ts-ignore 😊
        searchString += encodeURIComponent(search[key]);
        searchString += "&";
    }

    console.log("Поиск по фильтрам: " + JSON.stringify(search));

    const resp = await fetch(config.web + "api/car?" + searchString, {
        method: "GET",
        headers: {
            Authorization: bearer,
        },
    });

    if (resp.status != 200) {
        console.log("Произошла ошибка при получении автомобилей:");
        console.log(await resp.text());
        return;
    }

    console.log("Ответ от сервера:");
    console.log(await resp.json());
}

export default run;