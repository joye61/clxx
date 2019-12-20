/**
 * 编译之前先删除旧的编译目标
 */
const fs = require("fs-extra");
const chalk = require("chalk");
const path = require("path");

const oldBuildPath = path.resolve(process.cwd(), "./build")

fs.remove(oldBuildPath);

console.log(oldBuildPath, chalk.green("REMOVED"));
