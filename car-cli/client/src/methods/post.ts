import extensions from "../extensions";
import config from "../config";
import helper from "../helper";

helper.addMethod("POST",
    "Создает новый документ автомобиля, если не находит " +
    "автомобиля по указанному name & brand.\n" +
    "Фильтры: name, brand, year, price.",

    "--arguments",

    "name = название автомобиля\n" +
    "brand = бренд автомобиля\n" +
    "year = год выпуска автомобиля\n" +
    "price = цена автомобиля в {неизвестной} валюте",

    "node ... --login=example --password=pwd --method=post " +
    "--arguments=name=test,brand=example,year=2000,price=10000"
);

const run = async () => {
    const bearer = await extensions.checkAuth();

    console.log("───────── ⋆⋅ ⌞ POST ⌝ ⋅⋆ ─────────");

    const resp = await fetch(config.web + "api/car", {
        method: "POST",
        headers: {
            Authorization: bearer,
            "Content-Type": "application/json"
        },
        body: extensions.safeGetArgs()
    });

    if (resp.status != 200) {
        console.log("Произошла ошибка при создании нового автомобиля:");
        console.log(await resp.text());
        return;
    }

    console.log("Новый автомобиль успешно создан.");
}

export default run;