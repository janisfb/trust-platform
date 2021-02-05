const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/config");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const router = require("./routes/createRouter")();

const app = express();

app.use(
  fileUpload({
    limits: { fileSize: config.FILE_SIZE },
  })
);

mongoose
  .connect(config.DB_LINK, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 50000,
  })
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) =>
    console.log("error while establishing connection to mongo db", err)
  );

// var connectWithRetry = function () {
//   return mongoose.connect(mongoUrl, function (err) {
//     if (err) {
//       console.error(
//         "Failed to connect to mongo on startup - retrying in 5 sec",
//         err
//       );
//       setTimeout(connectWithRetry, 5000);
//     }
//   });
// };
// connectWithRetry();

app.use(bodyParser.json());

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