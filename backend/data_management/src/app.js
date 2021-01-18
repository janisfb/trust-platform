const express = require("express");
const fileUpload = require("express-fileupload");

const router = require("./routes/createRouter")();
const config = require("./config/config");

const app = express();

app.use(fileUpload({
  limits: { fileSize: config.FILE_SIZE },
}));

app.use("/api", router);

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

app.listen(config.PORT, () => {
  console.log(`⚡️[server]: Server is running at localhost:${config.PORT}`);
});


/** 
app.post("/upload", function (req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  // The name of the input field (retrieve the file)
  let uploadFile = req.files.uploadFile;

  let userDirectory = path.join(UPLOAD_DIRECTORY,req.headers['x-consumer-username'])

  if (!fs.existsSync(userDirectory)) {
    fs.mkdirSync(userDirectory);
  }

  let fileUploadPath = path.join(userDirectory, uploadFile.name)

  // Temp file will be moved to the final destination
  uploadFile.mv(fileUploadPath, function (err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.send("File uploaded to " + fileUploadPath + "!");
  });
});


app.get("/2/:id", function (req, res) {
  console.log(req.headers);
  res.send("Hello world! Your id is " + req.params.id + "\n your username is: " + req.headers['x-consumer-username'] + "\n your session is: " + req.headers.cookie);
});

app.get("/", (req, res) => res.send("Hello world!"));

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at localhost:${PORT}`);
});
*/
