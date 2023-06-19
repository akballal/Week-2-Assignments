/**
  You need to create an express HTTP server in Node.js which will handle the logic of a file server.
  - Use built in Node.js `fs` module

  The expected API endpoints are defined below,
  1. GET /files - Returns a list of files present in `./files/` directory
    Response: 200 OK with an array of file names in JSON format.
    Example: GET http://localhost:3000/files

  2. GET /file/:filename - Returns content of given file by name
     Description: Use the filename from the request path parameter to read the file from `./files/` directory
     Response: 200 OK with the file content as the response body if found, or 404 Not Found if not found. Should return `File not found` as text if file is not found
     Example: GET http://localhost:3000/file/example.txt

    - For any other route not defined in the server return 404

    Testing the server - run `npm run test-fileServer` command in terminal
 */
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;
const directoryPath =
  "C:/Workspaces/Vscode_workspaces/Full_Stack_Course/Week-2-Assignments/02-nodejs/files";

function started() {
  console.log(`Example app listening on port ${port}`);
}
//app.listen(port, started);

app.get("/files", listFilesFromDirectory);
app.get("/file/:filename", getFileContent);

function listFilesFromDirectory(req, res) {
  fs.readdir(directoryPath, (error, files) => {
    if (error) {
      console.error("Error reading directory:", error);
      res.status(500).send("Error reading directory");
    }
    var result = {
      listOfFiles: files,
    };
    res.send(result);
  });
}

function getFileContent(req, res) {
  let filename = req.params.filename;
  let filePath = `C:/Workspaces/Vscode_workspaces/Full_Stack_Course/Week-2-Assignments/02-nodejs/files/${filename}`;
  fs.readFile(filePath, "utf8", (error, data) => {
    if (error) {
      res.status(404).send("File not found");
    }
    res.send(data);
  });
}

app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

module.exports = app;
