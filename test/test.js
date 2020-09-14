
const supertest = require("supertest");
const app = require("../index");

describe("Home", () => {
  after((done) => {
    app.close(done);
  });

  it("return status code 200", (done) => {
    supertest(app)
      .get("/")
      .expect(200, done);
  });
});