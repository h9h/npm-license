const fs = require(‚fs‘);
const path = require(‚path‘)

const traverseDirectory = (dirname, callback) => {
  let directory = [];

  fs.readdir(dirname, function(err, list) {
    dirname = fs.realpathSync(dirname);
    if (err) {
      return callback(err)
    }

    // merke dir die Anzahl der Einträge
    let listlength = list.length
    
    // behandle jeden Eintrag
    list.forEach(file => {
      file = path.resolve(dirname, file)

      fs.stat(file, (err, stat) => {
        directory.push(file);

        if (stat && stat.isDirectory()) {
          // gehe rekursiv in das Unterverzeichnis
          traverseDirectory(file, (err, parsed) => {
          
            // sammle die Dateien aus dem Unterverzeichnis(sen) ein
            directory = directory.concat(parsed)
            
            // und wenn wir bei 0 sind, sind alle Callbacks durch (Dir-Fall)
            if (!—listlength) {
              callback(null, directory);
            }
          })
        } else {
          // und wenn wir bei 0 sind, sind alle Callbacks durch (Datei-Fall)
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
