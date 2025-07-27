import {Collection, MongoClient} from "mongodb";

class Car {
    brand: string = "";
    name: string = "";
    /* Year of manufacture */
    year: number = 0;
    price: number = 0;

    static Verify(car: Car): [boolean, string] {
        if (car.brand == "") {
            return [false, "Invalid \"Brand\""];
        }

        if (car.name == "") {
            return [false, "Invalid \"Name\""];
        }

        if (car.price == 0) {
            return [false, "Invalid \"Price\""];
        }

        if (car.year == 0) {
            return [false, "Invalid \"Year\""];
        }

        return [true, "OK"];
    }
}

let collection: Collection<Car>;

const getCarCollection = (): Collection<Car> => collection;

const init = async (client: MongoClient) => {
    await client.connect();
    const db = client.db("cars")
    collection = db.collection<Car>("cars");
}

export default {
    Car, getCarCollection, init
};