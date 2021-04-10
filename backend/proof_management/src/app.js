const express = require("express");
const mongoose = require("mongoose");
var CronJob = require("cron").CronJob;

const router = require("./routes/createRouter")();
const config = require("./config/config");

const app = express();

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

// every minute
var blockGenJob = new CronJob(
  "* * * * *",
  function () {
    var endTime = new Date;
    var startTime = new Date(endTime);
    startTime.setMinutes(endTime.getMinutes() - 1);

    console.log(startTime, ", ", endTime);
  },
  function () {
    console.log("cron job completed");
  }
);
// blockGenJob.start();

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
  console.log(`⚡️[proof_management]: Server is running at localhost:${config.PORT}`);
});
