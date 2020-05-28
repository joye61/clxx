/**
 * 编译之前先删除旧的编译目标
 */
const path = require('path');
const fs = require('fs');

fs.rmdir(path.resolve(process.cwd(), './build'), {
  recursive: true,
});
