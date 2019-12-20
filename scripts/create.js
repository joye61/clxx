/**
 * 从模板创建一个新的包
 */
const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");

const packageName = process.argv[process.argv.length - 1];
if (__filename === packageName) {
  console.error(
    `${chalk.red("Error: ")}${chalk.yellow(
      "Must specify the package name to be created"
    )}`
  );
  process.exit();
}

const src = path.resolve(__dirname, "../template");
fs.copySync(src, path.resolve(__dirname, `../packages/${packageName}`));
console.log(chalk.green(`Success: Package template created successfully`));
