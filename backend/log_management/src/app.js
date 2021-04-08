const express = require("express");

const router = require("./routes/createRouter")();
const config = require("./config/config");

const app = express();

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
  console.log(`⚡️[log_management]: Server is running at localhost:${config.PORT}`);
});
