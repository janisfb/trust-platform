const express = require("express");
const fileUpload = require("express-fileupload");
const TrustLogger = require("trust-logger-ba");

const router = require("./routes/createRouter")();
const config = require("./config/config");

const app = express();

const Logger = new TrustLogger(
  "kafka:9092",
  "data-management",
  "logs",
  "data-management"
);

app.use(fileUpload({
  limits: { fileSize: config.FILE_SIZE },
}));

app.use("/api", router);

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  Logger.log(req, "Create", false, null, `error on data management: ${err.message}`);

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

app.listen(config.PORT, () => {
  console.log(`⚡️[data-management]: Server is running at localhost:${config.PORT}`);
});
