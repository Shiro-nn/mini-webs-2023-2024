import extensions from "../extensions";
import config from "../config";
import helper from "../helper";

helper.addMethod("DELETE",
    "Удаляет автомобили по указанному названию и/или бренду.\n" +
    "Фильтры: name и/или brand.",

    "--arguments",

    "name = название автомобиля\n" +
    "brand = бренд автомобиля",

    "node ... --login=example --password=pwd --method=delete " +
    "--arguments=name=test"
);

const run = async () => {
    const bearer = await extensions.checkAuth();

    console.log("───────── ⋆⋅ ⌞ DELETE ⌝ ⋅⋆ ─────────");

    const resp = await fetch(config.web + "api/car", {
        method: "DELETE",
        headers: {
            Authorization: bearer,
            "Content-Type": "application/json"
        },
        body: extensions.safeGetArgs()
    });

    if (resp.status != 200) {
        console.log("Произошла ошибка при удалении автомобиля:");
    } else {
        console.log("Ответ от сервера:");
    }

    console.log(await resp.text());
}

export default run;