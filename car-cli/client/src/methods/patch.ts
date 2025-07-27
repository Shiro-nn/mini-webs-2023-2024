import extensions from "../extensions";
import config from "../config";
import helper from "../helper";

helper.addMethod("PATCH",
    "Находит и изменяет существующий автомобиль.\n" +
    "Фильтры \"search\": name и/или brand.\n" +
    "Фильтры \"update\": name, brand, year, price.",

    "--search\n" +
    "--update",

    "name = название автомобиля\n" +
    "brand = бренд автомобиля\n" +
    "year = год выпуска автомобиля\n" +
    "price = цена автомобиля в {неизвестной} валюте",

    "node ... --login=example --password=pwd --method=patch " +
    "--search=name=oldName --update=name=test,brand=example,year=2000,price=10000"
);

const run = async () => {
    const bearer = await extensions.checkAuth();

    console.log("───────── ⋆⋅ ⌞ PATCH ⌝ ⋅⋆ ─────────");

    const resp = await fetch(config.web + "api/car", {
        method: "PATCH",
        headers: {
            Authorization: bearer,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            search: extensions.safeGetArgs("search"),
            update: extensions.safeGetArgs("update"),
        })
    });

    if (resp.status != 200) {
        console.log("Произошла ошибка при модификации автомобиля:");
        console.log(await resp.text());
        return;
    }

    console.log("Автомобиль успешно модифицирован.");
}

export default run;