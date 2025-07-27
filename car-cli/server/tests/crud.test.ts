import express from 'express';
import request from 'supertest';

import router from '../src/routes/api';

jest.mock("../src/extensions/database", () => {
    const originalModule = jest.requireActual("../src/extensions/database");
    let documents: any = [];

    return {
        Car: originalModule.default.Car,
        init: jest.fn(),

        getCarCollection: jest.fn(() => ({
            findOne: jest.fn((query: any, _: any|null)=> {
                for(let doc of documents) {
                    if (query.brand && query.brand != doc.brand)
                        continue;

                    if (query.name && query.name != doc.name)
                        continue;

                    return doc;
                }

                return null;
            }),

            insertOne: jest.fn((car: any) => {
                documents.push(car);
                return {
                    acknowledged: true,
                    insertedId: "TESTING"
                }
            }),

            updateOne: jest.fn((query: any, update: any, options: any|null)=> {
                let modifiedCount = 0;
                let upsertedCount = 0;

                const updateParsed = update["$set"];

                for(let doc of documents) {

                    let breaking = false;

                    for (let key in query) {
                        if (query[key] != doc[key]) {
                            breaking = true;
                            break;
                        }
                    }

                    if (breaking)
                        continue;

                    for (let key in updateParsed) {
                        doc[key] = updateParsed[key];
                    }

                    modifiedCount++;
                }

                if (modifiedCount == 0 && options?.upsert == true) {
                    documents.push(updateParsed);
                    upsertedCount++;
                }

                return {
                    acknowledged: true,
                    matchedCount: modifiedCount,
                    modifiedCount: modifiedCount,
                    upsertedCount: upsertedCount,
                    upsertedId: null
                };
            }),

            deleteMany: jest.fn((query: any)=> {
                const toDelDocs = [];
                for(let doc of documents) {
                    if (query.brand && query.brand != doc.brand)
                        continue;

                    if (query.name && query.name != doc.name)
                        continue;

                    toDelDocs.push(doc);
                }

                const deletedCount = toDelDocs.length;

                for (let doc of toDelDocs) {
                    const index = documents.indexOf(doc);
                    if (index == -1) continue;
                    documents.splice(index, 1);
                }

                return {
                    acknowledged: true,
                    deletedCount: deletedCount
                };
            }),

            find: jest.fn((_: any)=> {
                throw new Error("Unsupported, sorry :(")
            })
        }))
    }
});

jest.mock("../src/extensions/encrypt", () => {
    const originalModule = jest.requireActual("../src/extensions/encrypt");

    originalModule.default.Keys.authExpress = jest.fn().mockReturnValue(true);

    return originalModule;
});

describe("CRUD", () => {
    let web: express.Express;

    beforeAll(() => {
        web = express();
        web.use("/api", express.json());
        web.use("/api", router);
    })

    beforeEach(() => {
        jest.clearAllMocks();
    });


    describe("POST /api/car", () => {
        it("should create a new car", async() => {
            const newCar = { brand: "Toyota", name: "Corolla", year: 2020, price: 20000 };
            const response = await request(web).post("/api/car").send(newCar);
            expect(response.status).toBe(200);
        });

        it("should return 400 if car already exists", async() => {
            const existingCar = { brand: "Toyota", name: "Corolla", year: 2020, price: 20000 };
            const response = await request(web).post("/api/car").send(existingCar);
            expect(response.status).toBe(400);
            expect(response.text).toBe("Car already exists");
        });

        it("should return 400 for validation errors", async () => {
            const invalidCar = { brand: "Toyota" }; // Missing 'name'
            const response = await request(web).post("/api/car").send(invalidCar);
            expect(response.status).toBe(400);
        });
    });

    describe("PUT /api/car", () => {
        it("should update an existing car or create if doesnt exist", async () => {
            const carToUpdate = { brand: "Toyota", name: "Corolla", year: 2021, price: 21000 };
            const response = await request(web).put("/api/car").send(carToUpdate);
            expect(response.status).toBe(200);
        });

        it("should return 400 for validation errors", async () => {
            const carToUpdate = { brand: "Toyota", name: "Corolla" };
            const response = await request(web).put("/api/car").send(carToUpdate);
            expect(response.status).toBe(400);
        });
    });

    describe("PATCH /api/car", () => {
        it("should partially update an existing car", async () => {
            const updatePayload = { search: { brand: "Toyota", name: "Corolla" }, update: { price: 22000 } };
            const response = await request(web).patch("/api/car").send(updatePayload);
            expect(response.status).toBe(200);
        });

        it("should return 400 if car not found", async () => {
            const updatePayload = { search: { brand: "Chevrolet", name: "Camaro" }, update: { price: 22000 } };
            const response = await request(web).patch("/api/car").send(updatePayload);
            expect(response.status).toBe(400);
            expect(response.text).toBe("Car not found");
        });
    });

    describe("DELETE /api/car", () => {
        it("should delete cars based on query", async () => {
            const deletePayload = { brand: "Toyota" };
            const response = await request(web).delete("/api/car").send(deletePayload);
            expect(response.status).toBe(200);
            expect(response.text).toBe("Deleted 1 cars");
        });

        it("should return 400 if no query is provided", async () => {
            const response = await request(web).delete("/api/car").send({});
            expect(response.status).toBe(400);
            expect(response.text).toBe("Unknown \"name\" or \"brand\"");
        });
    });

})