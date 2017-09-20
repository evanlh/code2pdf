const path = require('path');
const join = path.join;
const fs = require('fs');

// TODO make startDir file||directory
function rreaddirSync (startDir, allFiles = []) {
  const dirs = [];

  dirs.push(startDir);
  while (dirs.length) {
    let currentDir = dirs.shift();
    const files = fs.readdirSync(currentDir).map(f => join(currentDir, f))
    files.forEach(f => {
      let stat = fs.statSync(f)
      if (stat.isDirectory())  {
        dirs.push(f);
      }
      else {
        allFiles.push(f);
      }
    })
  }

  return allFiles
}

const BLACKLIST = [
  'CHANGELOG'
]

function crawl(dir) {
  return rreaddirSync(dir);
}

module.exports = {
  crawl: crawl
}
