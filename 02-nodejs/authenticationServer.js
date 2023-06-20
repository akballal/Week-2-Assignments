/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with email, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the email already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstName, lastName and id
    Request Body: JSON object with email and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstName, lastName and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstName/lastName.
    The users email and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the email and password in headers are valid, or 401 Unauthorized if the email and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express")
const PORT = 3000;
const app = express();
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken");
const JWT_secret = "token_test";
//app.listen(PORT, () => { console.log("Server started on port 3000") })
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
app.use(bodyParser.json());
let USERS = []

app.post('/signup', (req, res) => {
  const id = Math.floor(Math.random() * 100) + 1;
  const reqBody = req.body;
  const JsonData = { id, ...reqBody };
  const email = req.body.email
  Userfound = USERS.find(obj => obj.email === email)
  if (Userfound) {
    res.status(400).send("email already exists")
  }
  else {
    USERS.push(JsonData)
    res.status(201).send("Signup successful")
  }
})

app.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  

  USERS.forEach((user) => {
    if (user.email === email) {
      if (user.password === password) {
        res.json(
          {
            token: jwt.sign(email, JWT_secret),
            email,password,firstName: user.firstName,lastName: user.lastName
          }
        );
      } else {
        res.status(401).send("Unauthorized");
      }
    }
  });
  res.status(401).send("User doesn't exist, Sign up maybe ?");
})
module.exports = app;

app.get('/data', (req, res) => {
  const email = req.headers.email
  const password = req.headers.password

  USERS.forEach((user) => {
    if (user.email === email) {
      if (user.password === password) {
        // Map the array to exclude email and password fields
        const responseArray = USERS.map(obj => {
          const { email, password, ...rest } = obj;
          return rest;
        });

        res.json({users:responseArray})
      } else {
        res.status(401).send("Unauthorized");
      }
    }
  });
  res.status(401).send("User doesn't exist, Sign up maybe ?");
})

app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

module.exports = app;
