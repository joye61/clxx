const path = require("path");
const fs = require("fs-extra");

const cwd = process.cwd();
const packageJsonFile = path.resolve(cwd, "package.json");
const packageObject = fs.readJsonSync(packageJsonFile);
const package = {
  name: "cl-utils",
  version: packageObject.version,
  description: packageObject.description,
  main: "./index.js",
  author: packageObject.author,
  license: packageObject.license,
  bugs: packageObject.bugs,
  homepage: packageObject.homepage,
  repository: packageObject.repository,
  keywords: packageObject.keywords,
  publishConfig: {
    access: "public"
  },
  dependencies: packageObject.dependencies
};

const destPackageJsonFile = path.resolve(cwd, "lib/package.json");
fs.removeSync(destPackageJsonFile);
fs.writeJSONSync(destPackageJsonFile, package, { spaces: 2 });

console.log("Successfully created package.json file");
