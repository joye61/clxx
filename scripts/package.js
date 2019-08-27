const package = require("../package.json");
const fs = require("fs-extra");
const path = require("path");

console.log("Creating package.json ...");

delete package.scripts;
delete package.registry;
delete package.devDependencies;

fs.outputJsonSync(path.resolve(__dirname, "../libs/package.json"), package, {
  spaces: 2,
  EOL: "\n",
  encoding: "utf8"
});
