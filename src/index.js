const fs = require(‚fs‘);
const path = require(‚path‘)

const traverseDirectory = (dirname, callback) => {
  let directory = [];

  fs.readdir(dirname, function(err, list) {
    dirname = fs.realpathSync(dirname);
    if (err) {
      return callback(err)
    }

    let listlength = list.length;
    list.forEach(function(file) {
      file = path.resolve(dirname, file)

      fs.stat(file, function(err, stat) {
        directory.push(file);

        if (stat && stat.isDirectory()) {
          traverseDirectory(file, function(err, parsed) {
            directory = directory.concat(parsed);
            if (!—listlength) {
              callback(null, directory);
            }
          })
        } else {
          if (!—listlength) {
            callback(null, directory);
          }
        }
      })
    })
  })
}

traverseDirectory(__dirname, function(err, result) {
  if (err) {
    console.log(err);
    return
  }

  console.log(result);
});
