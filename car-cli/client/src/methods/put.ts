import extensions from "../extensions";
import config from "../config";
import helper from "../helper";

helper.addMethod("PUT",
    "Создает новый документ автомобиля, либо заменяет " +
    "существующий, если находит его по name & brand.\n" +
    "Фильтры: name, brand, year, price.",

    "--arguments",

    "name = название автомобиля\n" +
    "brand = бренд автомобиля\n" +
    "year = год выпуска автомобиля\n" +
    "price = цена автомобиля в {неизвестной} валюте",

    "node ... --login=example --password=pwd --method=put " +
    "--arguments=name=test,brand=example,year=2000,price=10000"
);

const run = async () => {
    const bearer = await extensions.checkAuth();

    console.log("───────── ⋆⋅ ⌞ PUT ⌝ ⋅⋆ ─────────");

    const resp = await fetch(config.web + "api/car", {
        method: "PUT",
        headers: {
            Authorization: bearer,
            "Content-Type": "application/json"
        },
        body: extensions.safeGetArgs()
    });

    if (resp.status != 200) {
        console.log("Произошла ошибка при создании или замене автомобиля:");
        console.log(await resp.text());
        return;
    }

    console.log("Новый автомобиль успешно создан или заменен.");
}

export default run;