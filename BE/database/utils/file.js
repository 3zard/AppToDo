const fs = require("fs");

function writeFile(filename, content) {
  fs.writeFile(filename, content, (error) => {
    if (error) {
      throw error;
    }
  });
}
module.exports = {
  writeFile,
};
