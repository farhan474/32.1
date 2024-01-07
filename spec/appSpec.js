const request = require("supertest");
const app = require("../app.js");
describe("Express App", () => {


    it("should respond with status 400 when nums are missing for /mean", (done) => {
        request(app)
            .get("/mean")
            .expect(400, done);
    });

    it("should respond with a helpful error message for /mean with invalid input", (done) => {
        request(app)
            .get("/mean?nums=foo,2,3")
            .set("Accept", "application/json")
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.error).toBe("Invalid number provided");
                done();
            });
    });

    it("should save the result to a JSON file for /all with save=true", (done) => {
        request(app)
            .get("/all?nums=1,2,3&save=true")
            .set("Accept", "application/json")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.operation).toBe("all");
                expect(res.body.mean).toBeDefined();
                expect(res.body.median).toBeDefined();
                expect(res.body.mode).toBeDefined();

                // Check if the result file exists
                const fs = require("fs");
                expect(fs.existsSync("result.json")).toBe(true);

                // Clean up: Delete the result file
                fs.unlinkSync("result.json");
                done();
            });
    });

});
