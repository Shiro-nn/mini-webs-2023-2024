import express from "express";
import encrypt from "../extensions/encrypt";
import database from "../extensions/database";

const router = express.Router();

const postCar = async (req: express.Request, res: express.Response) => {
    if (!encrypt.Keys.authExpress(req, res))
        return;

    let car = Object.assign(new database.Car, req.body);
    let verify = database.Car.Verify(car);

    if (!verify[0]) {
        res.status(400).send(verify[1]);
        return;
    }

    let collection = database.getCarCollection();

    let query = {brand: car.brand, name: car.name};
    let options = {projection: {_id: 1}};
    const exists = await collection.findOne(query, options);

    if (exists) {
        res.status(400).send("Car already exists");
        return;
    }

    const result = await collection.insertOne(car);

    if (!result.insertedId) {
        res.status(500).send("Database error");
        return;
    }

    res.sendStatus(200);
}

const putCar = async (req: express.Request, res: express.Response) => {
    if (!encrypt.Keys.authExpress(req, res))
        return;

    let car = Object.assign(new database.Car, req.body);
    let verify = database.Car.Verify(car);

    if (!verify[0]) {
        res.status(400).send(verify[1]);
        return;
    }

    let collection = database.getCarCollection();

    const query = {brand: car.brand, name: car.name};
    const update = {$set: car};
    const options = {upsert: true};

    const result = await collection.updateOne(query, update, options);

    if (result.modifiedCount + result.upsertedCount == 0) {
        res.status(500).send("Database error");
        return;
    }

    res.sendStatus(200);
}

const patchCar = async (req: express.Request, res: express.Response) => {
    if (!encrypt.Keys.authExpress(req, res))
        return;

    //#region search
    const query = {};

    if (typeof req.body.search != "object") {
        res.status(400).send("Unknown \"search\" body");
        return;
    }

    if (typeof req.body.search.brand == "string") {
        // @ts-ignore
        query.brand = req.body.search.brand;
    }

    if (typeof req.body.search.name == "string") {
        // @ts-ignore
        query.name = req.body.search.name;
    }

    if (Object.keys(query).length == 0) {
        res.status(400).send("Unknown \"name\" or \"brand\"");
        return;
    }
    //#endregion

    //#region search
    const update: any = {};
    const updateArr: any = {
        'name': 'string',
        'brand': 'string',
        'year': 'number',
        'price': 'number',
    }

    if (typeof req.body.update != "object") {
        res.status(400).send("Unknown \"update\" body");
        return;
    }

    for (let key in updateArr) {
        if (typeof req.body.update[key] == updateArr[key]) {
            update[key] = req.body.update[key];
        }
    }

    if (Object.keys(update).length == 0) {
        res.status(400).send("Unknown \"update\" body");
        return;
    }
    //#endregion

    let collection = database.getCarCollection();

    let options = {projection: {_id: 1}};
    const exists = await collection.findOne(query, options);

    if (!exists) {
        res.status(400).send("Car not found");
        return;
    }

    const result = await collection.updateOne({_id: exists._id}, {$set: update});

    if (result.modifiedCount == 0) {
        res.status(500).send("Database error");
        return;
    }

    res.sendStatus(200);
}

const deleteCar = async (req: express.Request, res: express.Response) => {
    if (!encrypt.Keys.authExpress(req, res))
        return;

    const query: any = {};

    if (typeof req.body.brand == "string") {
        query.brand = req.body.brand;
    }

    if (typeof req.body.name == "string") {
        query.name = req.body.name;
    }

    if (Object.keys(query).length == 0) {
        res.status(400).send("Unknown \"name\" or \"brand\"");
        return;
    }

    let collection = database.getCarCollection();
    const result = await collection.deleteMany(query);

    res.send(`Deleted ${result.deletedCount} cars`);
}

const getCar = async (req: express.Request, res: express.Response) => {
    if (!encrypt.Keys.authExpress(req, res))
        return;

    const query: any = {};

    if (typeof req.query.brand == "string") {
        query.brand = req.query.brand;
    }

    if (typeof req.query.name == "string") {
        query.name = req.query.name;
    }

    let collection = database.getCarCollection();
    const cursor = collection.find(query).sort({brand: 1});

    let cars = [];

    for await (const document of cursor) {
        const car: any = Object.assign(new database.Car, document);
        delete car._id;

        cars.push(car);
    }

    res.status(200).json(cars);
}

const errorHandle = (err: any, _: express.Request, res: express.Response) => {
    res.sendStatus(500);
    console.error(err);
}


router.post("/car", postCar); // add
router.put("/car", putCar); // add or update
router.patch("/car", patchCar); // update specific fields
router.delete("/car", deleteCar); // delete
router.get("/car", getCar); // get

router.use(errorHandle);

export default router;