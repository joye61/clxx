const fs = require("fs-extra");
const path = require("path");
const package = require("../package.json");

package.main = "./index.js";
delete package.scripts;
delete package.registry;
delete package.devDependencies;

fs.removeSync(path.resolve(__dirname, "../libs"));
fs.outputJsonSync(path.resolve(__dirname, "../libs/package.json"), package, {
  spaces: 2
});
