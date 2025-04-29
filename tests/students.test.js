const request = require("supertest");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const url = require("url");
const app = require("../index"); // Path to your Express app
const { buffer } = require("stream/consumers");

const studentsRoute = "/students";

describe("/students", () => {
  describe("READ", () => {
    it("should return a 200 status on GET /students", async () => {
      const res = await request(app).get(studentsRoute);
      expect(res.status).toBe(200); // Just checks if the app is running
    });

    it("should contain an object with properties", async () => {
      const res = await request(app).get(studentsRoute);
      expect(res.status).toBe(200); // Just checks if the app is running
      expect(res.body).toBeInstanceOf(Object);
      // Checking for fields

      if (Object.keys(res.body).length > 0) {
        const picked = Object.values(res.body)[0];
        expect(picked).toHaveProperty("imageSrc");
        expect(picked).toHaveProperty("name");
        expect(picked).toHaveProperty("age");
      }
    });

    it("one: should return a 200 status and an object with name, age, and imageSrc properties", async () => {
      const res = await request(app).get("/students/michael");

      // Check if the status code is 200
      expect(res.status).toBe(200);

      // Check if the response body is an object and contains the required properties
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("name");
      expect(res.body).toHaveProperty("age");
      expect(res.body).toHaveProperty("imageSrc");

      // Optionally, check the types of each property (e.g., name is a string, age is a number, imageSrc is a string)
      expect(typeof res.body.name).toBe("string");
      expect(typeof res.body.age).toBe("number");
      expect(typeof res.body.imageSrc).toBe("string");
    });

    it("one: should return a 404 status when the student is not found", async () => {
      const res = await request(app).get("/students/dummyId");
      expect(res.status).toBe(404);
    });
  });

  describe("CREATE", () => {
    let createdStudentId;
    let createdStudent;
    let createResponse;

    const testImagePath = path.join(
      __dirname,
      "attachments",
      "profilePicture.jpg"
    );

    beforeEach(async () => {
      const studentObj = {
        name: "Peter John",
        age: 22,
      };
      createResponse = await request(app)
        .post("/students")
        .field("studentObj", JSON.stringify(studentObj))
        .attach("studentImg", testImagePath);

      createdStudent = createResponse.body.created;
      createdStudentId = createResponse.body.createdId;
    });

    afterEach(async () => {
      await request(app).delete(`/students/${createdStudentId}`);
    });

    it("requested student should be the same as created", async () => {
      expect(createResponse.status).toBe(201);
      expect(createResponse.body).toHaveProperty("createdId");
      expect(createResponse.body).toHaveProperty("created");

      // Now, request the student by createdId
      const getRes = await request(app).get(`/students/${createdStudentId}`);

      // Check that the response status is 200 (OK)
      expect(getRes.status).toBe(200);

      // Check that the returned student object contains the expected properties
      expect(getRes.body).toMatchObject(createdStudent);
    });

    it("Image should be the same as uploaded", async () => {
      // Now checking the image
      const imageUrl =
        "/" + path.basename(new url.URL(createdStudent.imageSrc).pathname);

      const imageRes = await request(app).get(imageUrl); // Path to the image in the public directory

      const testImage = fs.readFileSync(testImagePath);
      const serverImgHash = crypto
        .createHash("sha256")
        .update(imageRes.body)
        .digest("hex");
      const testImgHash = crypto
        .createHash("sha256")
        .update(testImage)
        .digest("hex");

      expect(serverImgHash).toBe(testImgHash);
    });
  });

  describe("PATCH", () => {
    let createdStudentId;

    beforeAll(async () => {
      // Creating a dummy student
      const studentObj = {
        name: "Peter John",
        age: 22,
      };

      const testImagePath = path.join(
        __dirname,
        "attachments",
        "profilePicture.jpg"
      );

      const postRes = await request(app)
        .post("/students")
        .field("studentObj", JSON.stringify(studentObj))
        .attach("studentImg", testImagePath);

      createdStudentId = postRes.body.createdId;
    });

    afterAll(async () => {
      await request(app).delete(`/students/${createdStudentId}`);
    });

    it("UPDATE: should return a 404 for unknown student", async () => {
      const patchRes = await request(app)
        .patch("/students/dummyId")
        .field("delta", JSON.stringify({}));
      expect(patchRes.status).toBe(404);
    });

    it("UPDATE: should update a student and return the updated student", async () => {
      const delta = {
        // Add the fields you want to update here
        name: "Updated Student Name",
        age: 30,
        // e.g., email: 'newemail@example.com'
      };

      const patchRes = await request(app)
        .patch(`/students/${createdStudentId}`) // or PATCH if you prefer
        .field("delta", JSON.stringify(delta))
        .set("Accept", "application/json");

      expect(patchRes.status).toBe(200); // assuming 200 OK on successful update
      expect(patchRes.body).toHaveProperty("modified"); // assuming updated student object is returned
      expect(patchRes.body.modified).toMatchObject(delta);
    });

    it("UPDATE: image and data update, It should also change the image", async () => {
      const delta = {
        // Add the fields you want to update here
        name: "Updated with an image",
        age: 38,
        // e.g., email: 'newemail@example.com'
      };

      const modifiedImgPath = path.join(
        __dirname,
        "attachments",
        "profileModification.jpg"
      );

      const patchRes = await request(app)
        .patch(`/students/${createdStudentId}`) // or PATCH if you prefer
        .field("delta", JSON.stringify(delta))
        .attach("newImage", modifiedImgPath)
        .set("Accept", "application/json");

      expect(patchRes.status).toBe(200); // assuming 200 OK on successful update
      expect(patchRes.body).toHaveProperty("modified"); // assuming updated student object is returned
      expect(patchRes.body.modified).toMatchObject(delta);

      // Now checking the image
      const imageUrl =
        "/" +
        path.basename(new url.URL(patchRes.body.modified.imageSrc).pathname);

      const imageRes = await request(app).get(imageUrl); // Path to the image in the public directory

      const testImage = fs.readFileSync(modifiedImgPath);
      const serverImgHash = crypto
        .createHash("sha256")
        .update(imageRes.body)
        .digest("hex");
      const testImgHash = crypto
        .createHash("sha256")
        .update(testImage)
        .digest("hex");

      expect(serverImgHash).toBe(testImgHash);
    });

    afterAll(async () => {
      await request(app).delete(`/students/${createdStudentId}`);
    });
  });

  describe("DELETE", () => {
    let createdStudentId;

    beforeEach(async () => {
      // Creating a dummy student
      const studentObj = {
        name: "Peter John",
        age: 22,
      };

      const testImagePath = path.join(
        __dirname,
        "attachments",
        "profilePicture.jpg"
      );

      const postRes = await request(app)
        .post("/students")
        .field("studentObj", JSON.stringify(studentObj))
        .attach("studentImg", testImagePath);

      createdStudentId = postRes.body.createdId;
    });

    it("should return a 404 for invalid delete request", async () => {
      const deleteRes = await request(app).delete("/students/dummyId");

      expect(deleteRes.status).toBe(404);
    });

    it("should delete the requested object", async () => {
      const deleteRes = await request(app).delete(
        `/students/${createdStudentId}`
      );

      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.deletedId).toBe(createdStudentId);

      const getRes = await request(app).get(`/students/${createdStudentId}`);
      expect(getRes.status).toBe(404);
    });

    afterEach(async () => {
      await request(app).delete(`/students/${createdStudentId}`);
    });
  });
});
