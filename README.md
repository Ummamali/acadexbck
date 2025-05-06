# Acadex Backend 📦

The Acadex backend is a lightweight RESTful API developed using **Express.js** on **Node.js**, designed to handle CRUD operations for student records. It serves as the core engine of the Acadex application, enabling smooth and responsive interactions with the frontend. Instead of relying on a traditional database, it utilizes a simple **flat file JSON storage**, making it easy to set up, understand, and extend. This approach is especially suitable for educational projects, small-scale tools, or rapid prototyping. With clearly defined endpoints and modular structure, the backend ensures clean code and a minimal footprint for easy maintenance and learning.

## Features

**Create**  
Supports POST requests to add new student records efficiently.

**Read**  
Allows retrieval of all student records or a specific student by ID using GET requests.

**Update**  
Enables modification of existing student information through PUT or PATCH requests.

**Delete**  
Handles removal of student records using standard DELETE operations.

**Flat File Storage**  
Uses a lightweight JSON-based storage system, eliminating the need for a traditional database.

**RESTful API Design**  
Follows REST principles for clear, consistent, and maintainable endpoint structures.

**Lightweight and Educational**  
Designed to be minimal and easy to understand, making it ideal for small projects, demos, or full-stack learning.

## Technologies Used

**Node.js**  
JavaScript runtime environment used to build the backend server.

**Express.js**  
Minimal and flexible Node.js framework for building RESTful APIs.

**Yup**  
JavaScript schema builder for validating and parsing request data.

**Git**  
Version control system used for tracking changes and collaboration.

**Nodemon**  
Development utility that automatically restarts the server on file changes.

**CORS**  
Middleware to enable Cross-Origin Resource Sharing between frontend and backend.

**Body-Parser**  
Middleware to parse incoming request bodies in a middleware before your handlers.

**ESLint & Prettier**  
Tools for code linting and formatting to ensure clean and consistent code style.

**Flat File (JSON) Storage**  
Simple, no-database solution for storing and retrieving student records.

## Installation

Follow the steps below to set up the Acadex backend on your local machine:

1. **Clone the Repository**
   
   ```bash
   git clone https://github.com/ummamali/acadexbck.git
   cd acadexbck
   ```
   
2. **Install Dependencied**

   ```bash
   npm install
   ```
   
3. **Run Development Server**
   
    ```bash
    npm run dev
    ```

### Testing

Acadex uses **Jest** and **Supertest** to test its API routes, ensuring that all endpoints function as expected. The test suite covers core CRUD operations, validating both success scenarios and edge cases. This helps maintain code reliability and catch issues early during development. Tests are organized for clarity and ease of extension as the application grows. Running tests is straightforward and requires no additional setup beyond installing dependencies.

```bash
npm run test
```

## Licensing

This project is licensed under the **MIT License**. See the [LICENSE](https://opensource.org/license/MIT) file for more information.





