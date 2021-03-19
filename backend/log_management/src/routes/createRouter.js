const glob = require("glob");
const Router = require("express").Router;

/**
 * Create routes for all the routes inside of './api'.
 */
module.exports = () =>
  glob
    .sync("**/*.js", {
      cwd: __dirname,
    })
    .map((filename) => require(`./${filename}`))
    .filter((router) => Object.getPrototypeOf(router) === Router)
    .reduce(
      (rootRouter, router) => rootRouter.use(router),
      Router({
        mergeParams: true,
      })
    );
