let reply = "Общие аргументы:" + "\n" +
    "--login - логин авторизации" + "\n" +
    "--password - пароль авторизации" + "\n" +
    "--method - метод REST API" + "\n" +
    "\n" +
    "Аргумент указывается в формате:\n" +
    "key1=value1,key2=value2";

const addMethod = (
    method: string,
    desc: string,
    args: string,
    objects: string,
    example: string
) => {
    reply += "\n";
    reply += "───────── ⋆⋅ ⌞ " + method + " ⌝ ⋅⋆ ─────────" + "\n";
    reply += desc + "\n\n";

    reply += "Аргументы:" + "\n";
    reply += args + "\n\n";

    reply += "Объекты:" + "\n";
    reply += objects + "\n\n";

    reply += "Пример команды:" + "\n";
    reply += example + "\n";
}

const checkRun = () => {
    for (let index in process.argv) {
        const arg = process.argv[index];

        if (arg == "--help") {
            printHelp();
            return;
        }

    }
}


export default {
    addMethod,
    checkRun
}


function printHelp() {
    console.log("───────── ⋆⋅ ⌞ HELP ⌝ ⋅⋆ ─────────");
    console.log(reply);
    console.log("───────── ⋆⋅ ⌞ HELP ⌝ ⋅⋆ ─────────");
}

/*
----------- Help -----------
Общие аргументы:
--login - логин авторизации
--password - пароль авторизации
--method - метод REST API

Аргумент указывается в формате:
key1=value1,key2=value2

----------- GET -----------
Получает список автомобилей.
Фильтры: name и/или brand

Аргументы:
--arguments

Объекты:
name = название автомобиля
brand = бренд автомобиля

Пример команды:
node ... --login=example --password=pwd --method=get --arguments=name=Camaro,brand=test

----------- DELETE -----------
Удаляет автомобили по указанному названию и/или бренду.
Фильтры: name и/или brand.

Аргументы:
--arguments

Объекты:
name = название автомобиля
brand = бренд автомобиля

Пример команды:
node ... --login=example --password=pwd --method=delete --arguments=name=test

----------- POST -----------
Создает новый документ автомобиля, если не находит автомобиля по указанному name & brand.
Фильтры: name, brand, year, price.

Аргументы:
--arguments

Объекты:
name = название автомобиля
brand = бренд автомобиля
year = год выпуска автомобиля
price = цена автомобиля в {неизвестной} валюте

Пример команды:
node ... --login=example --password=pwd --method=post --arguments=name=test,brand=example,year=2000,price=10000

----------- PUT -----------
Создает новый документ автомобиля, либо заменяет существующий, если находит его по name & brand.
Фильтры: name, brand, year, price.

Аргументы:
--arguments

Объекты:
name = название автомобиля
brand = бренд автомобиля
year = год выпуска автомобиля
price = цена автомобиля в {неизвестной} валюте

Пример команды:
node ... --login=example --password=pwd --method=put --arguments=name=test,brand=example,year=2000,price=10000

----------- PATCH -----------
Находит и изменяет существующий документ автомобиля.
Фильтры "search": name и/или brand.
Фильтры "update": name, brand, year, price.

Аргументы:
--search
--update

Объекты:
name = название автомобиля
brand = бренд автомобиля
year = год выпуска автомобиля
price = цена автомобиля в {неизвестной} валюте

Пример команды:
node ... --login=example --password=pwd --method=patch --search=name=oldName --update=name=test,brand=example,year=2000,price=10000
 */