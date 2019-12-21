/**
 * 从模板创建一个新的包
 */
const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");

// 解析包名
const packageName = process.argv[process.argv.length - 1];
if (__filename === packageName) {
  console.error(
    `${chalk.red("Error: ")}${chalk.yellow(
      "Must specify the package name to be created"
    )}`
  );
  process.exit();
}

/**
 * 包路径
 */
const packagePath = path.resolve(__dirname, `../packages/${packageName}`);

// package.json文件
const packageJSON = {
  name: `@clxx/${packageName}`,
  version: "0.0.0",
  description: "package template",
  main: "./build/index.js",
  types: "./build/index.d.ts",
  scripts: {
    start: "tsc -w --pretty",
    build: "node ../../scripts/clear.js && tsc"
  },
  repository: {
    type: "git",
    url: `https://github.com/joye61/clxx/tree/master/packages/${packageName}`
  },
  publishConfig: {
    access: "public",
    registry: "https://registry.npmjs.org"
  },
  keywords: ["react", "css-in-js", "typescript"],
  author: "joye",
  license: "MIT",
  devDependencies: {
    typescript: "^3.7.3"
  }
};

// 复制模板文件夹
fs.copySync(path.resolve(__dirname, "../template"), packagePath);
// 生成packgae.json文件
fs.writeFileSync(
  path.resolve(packagePath, "package.json"),
  JSON.stringify(packageJSON, null, "\t")
);

// 打印成功日志
console.log(
  chalk.green(`Success: Package @clxx/${packageName} created successfully`)
);
