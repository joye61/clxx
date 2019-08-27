const fs = require("fs-extra");
const path = require("path");

console.log("Removing build directory ...");

fs.removeSync(path.resolve(__dirname, "../libs"));
