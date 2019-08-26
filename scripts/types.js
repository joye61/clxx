const { exec } = require("child_process");
const path = require("path");
const fs = require("fs-extra");

console.log(`正在生成声明文件...`);
exec(
  path.resolve(__dirname, "../node_modules/.bin/tsc"),
  {
    cwd: path.dirname(__dirname),
    encoding: "utf8"
  },
  error => {
    if (error === null) {
      const buildRoot = path.resolve(__dirname, "../types");

      const remove = dir => {
        const list = fs.readdirSync(dir, {
          withFileTypes: true
        });
        for (let item of list) {
          const file = path.resolve(dir, item.name);
          if (item.isDirectory()) {
            remove(file);
          } else if (item.isFile() && !item.name.endsWith(".d.ts")) {
            fs.removeSync(file);
          }
        }
      };
      remove(buildRoot);
    }
  }
);
