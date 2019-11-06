const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");

const rmList = [
  path.resolve(__dirname, "../es5"),
  path.resolve(__dirname, "../es6")
];

rmList.forEach(item => {
  console.log(`Removing build directory: ${chalk.yellow(item)}`);
  fs.removeSync(item);
});
