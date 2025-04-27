const request = require("supertest");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const url = require("url");
const app = require("../index"); // Path to your Express app
const { buffer } = require("stream/consumers");

const studentsRoute = "/students";

describe("Student REST", () => {
  it("READ: should return a 200 status on GET /students", async () => {
    const res = await request(app).get(studentsRoute);
    expect(res.status).toBe(200); // Just checks if the app is running
  });

  it("READ: should contain an object with properties", async () => {
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

  it("READ ONE: should return a 200 status and an object with name, age, and imageSrc properties", async () => {
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

  it("READ ONE: should return a 404 status when the student is not found", async () => {
    const res = await request(app).get("/students/dummyId");
    expect(res.status).toBe(404);
  });

  it("CREATE: should return a 201 status and the created student object", async () => {
    const studentObj = {
      name: "Peter John",
      age: 22,
    };

    const res = await request(app)
      .post("/students")
      .field("studentObj", JSON.stringify(studentObj));

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("createdId");
    expect(res.body).toHaveProperty("created");

    // Now, request the student by createdId
    const getRes = await request(app).get(`/students/${res.body.createdId}`); // Assuming the route is like `/students/:id`

    // Check that the response status is 200 (OK)
    expect(getRes.status).toBe(200);

    // Check that the returned student object contains the expected properties
    expect(getRes.body).toHaveProperty("name", studentObj.name);
    expect(getRes.body).toHaveProperty("age", studentObj.age);
    expect(getRes.body).toHaveProperty("imageSrc");
  });

  it("CREATE: requested with an image, it should return a 201 status and the created student object", async () => {
    const studentObj = {
      name: "Peter John",
      age: 22,
    };

    const testImagePath = path.join(
      __dirname,
      "attachments",
      "profilePicture.jpg"
    );

    const res = await request(app)
      .post("/students")
      .field("studentObj", JSON.stringify(studentObj))
      .attach("studentImg", testImagePath);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("createdId");
    expect(res.body).toHaveProperty("created");

    // Now checking the image
    const imageUrl =
      "/" + path.basename(new url.URL(res.body.created.imageSrc).pathname);

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
