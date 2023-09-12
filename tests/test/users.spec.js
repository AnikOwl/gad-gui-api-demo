const { gracefulQuit, setupEnv } = require("./helpers/helpers.js");
const { baseUsersUrl, request, faker, expect } = require("./config.js");
const { prepareUniqueLoggedUser, authUser } = require("./helpers/data.helpers.js");

describe("Endpoint /users", async () => {
  const baseUrl = baseUsersUrl;

  before(async () => {
    await setupEnv();
  });

  after(() => {
    gracefulQuit();
  });

  describe("Without auth", async () => {
    it("GET /users", async () => {
      // Act:
      const response = await request.get(baseUrl);

      // Assert:
      expect(response.status).to.equal(200);
      expect(response.body.length).to.be.greaterThan(1);
    });

    it("GET /users/:id - existing user", async () => {
      // Arrange:
      const expectedData = {
        avatar: ".\\data\\users\\face_1591133479.7144732.jpg",
        email: "****",
        firstname: "Moses",
        id: 1,
        lastname: "****",
        password: "****",
      };

      // Act:
      const response = await request.get(`${baseUrl}/1`);

      // Assert:
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(expectedData);
    });

    it("GET /users/:id - non existing user", async () => {
      // Act:
      const response = await request.get(`${baseUrl}/112312312`);

      // Assert:
      expect(response.status).to.equal(404);
    });

    describe("POST /users", () => {
      it("empty payload", () => {
        return request.post(baseUrl).send({}).expect(422);
      });

      it("valid registration", async () => {
        // Arrange:
        const testUserData = {
          email: faker.internet.email({ provider: "example.test.test" }),
          firstname: "string",
          lastname: "string",
          password: "string",
          avatar: "string",
        };

        // Act:
        const response = await request.post(baseUrl).send(testUserData);

        // Assert:
        expect(response.status).to.equal(201);
        testUserData.id = response.body.id;
        expect(response.body).to.deep.equal(testUserData);
      });

      it("invalid registration - same email", async () => {
        // Arrange:
        const testUserData = {
          email: faker.internet.email({ provider: "example.test.test" }),
          firstname: "string",
          lastname: "string",
          password: "string",
          avatar: "string",
        };
        const response = await request.post(baseUrl).send(testUserData);
        expect(response.status).to.equal(201);

        // Act:
        const responseAgain = await request.post(baseUrl).send(testUserData);

        // Assert:
        expect(responseAgain.status).to.equal(201);
      });
      it("invalid email", async () => {
        // Arrange:
        const testUserData = {
          email: "example.test.test",
          firstname: "string",
          lastname: "string",
          password: "string",
          avatar: "string",
        };

        // Act:
        const response = await request.post(baseUrl).send(testUserData);

        // Assert:
        expect(response.status).to.equal(422);
      });

      ["firstname", "lastname", "email", "avatar"].forEach((field) => {
        it(`missing mandatory field - ${field}`, async () => {
          // Arrange:
          const testUserData = {
            email: faker.internet.email({ provider: "example.test.test" }),
            firstname: "string",
            lastname: "string",
            password: "string",
            avatar: "string",
          };

          testUserData[field] = undefined;

          // Act:
          const response = await request.post(baseUrl).send(testUserData);

          // Assert:
          expect(response.status).to.equal(422);
        });
      });
    });

    it("PUT /users", () => {
      return request.put(baseUrl).send({}).expect(401);
    });

    it("PUT /users/:id", () => {
      return request.put(`${baseUrl}/1`).send({}).expect(401);
    });

    it("PATCH /users/:id", () => {
      return request.patch(`${baseUrl}/1`).send({}).expect(401);
    });

    it("DELETE /users/:id", () => {
      return request.delete(`${baseUrl}/1`).send({}).expect(401);
    });

    it("HEAD /users", () => {
      return request.head(`${baseUrl}/1`).expect(200);
    });
  });

  describe("With auth", async () => {
    let headers;

    beforeEach(async () => {
      const data = await authUser();
      headers = data.headers;
    });

    it("GET /users", async () => {
      // Act:
      const response = await request.get(baseUrl).set(headers);

      // Assert:
      expect(response.status).to.equal(200);
      expect(response.body.length).to.be.greaterThan(1);
    });

    it("GET /users/:id", async () => {
      // Arrange:
      const expectedData = {
        avatar: ".\\data\\users\\face_1591133479.7144732.jpg",
        email: "****",
        firstname: "Moses",
        id: 1,
        lastname: "****",
        password: "****",
      };

      // Act:
      const response = await request.get(`${baseUrl}/1`).set(headers);

      // Assert:
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(expectedData);
    });

    it("POST /users", async () => {
      // Arrange:
      const testUserData = {
        email: faker.internet.email({ provider: "example.test.test" }),
        firstname: "string",
        lastname: "string",
        password: "string",
        avatar: "string",
      };

      // Act:
      const response = await request.post(baseUrl).send(testUserData).set(headers);

      // Assert:
      expect(response.status).to.equal(201);
      testUserData.id = response.body.id;
      expect(response.body).to.deep.equal(testUserData);
    });

    it("HEAD /users", () => {
      return request.head(`${baseUrl}/1`).set(headers).expect(200);
    });
  });

  describe("MODIFY /users", async () => {
    let headers;
    let userId;
    let testUserData;

    beforeEach(async () => {
      const data = await prepareUniqueLoggedUser();
      headers = data.headers;
      userId = data.userId;
      testUserData = data.testUserData;
    });

    it("PUT /users", async () => {
      // Act:
      const response = await request.put(`${baseUrl}/${userId}`).set(headers).send(testUserData);

      // Assert:
      expect(response.status).to.equal(200);
    });

    it("PUT /users/:id", async () => {
      // Act:
      const response = await request.put(`${baseUrl}/${userId}`).set(headers).send(testUserData);

      // Assert:
      expect(response.status).to.equal(200);
    });

    it("PATCH /users/:id", async () => {
      // Act:
      const response = await request.patch(`${baseUrl}/${userId}`).set(headers).send(testUserData);

      // Assert:
      expect(response.status).to.equal(200);
    });
  });
  describe("DELETE /users", () => {
    let headers;
    let userId;

    beforeEach(async () => {
      const data = await prepareUniqueLoggedUser();
      headers = data.headers;
      userId = data.userId;
    });

    it("DELETE /users/:id - self delete", async () => {
      // Act:
      const responseDel = await request.delete(`${baseUrl}/${userId}`).set(headers);

      // Assert:
      expect(responseDel.status).to.equal(200);
    });

    it("DELETE /users/:id - attempt of delete of other user", async () => {
      // Act:
      const responseDel = await request.delete(`${baseUrl}/1`).set(headers);

      // Assert:
      expect(responseDel.status).to.equal(401);
    });

    it("DELETE /users/:id - attempt of delete of not existing user", async () => {
      // Act:
      const responseDel = await request.delete(`${baseUrl}/112323212`).set(headers);

      // Assert:
      expect(responseDel.status).to.equal(401);
    });
  });
});
