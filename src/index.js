const fs = require('fs')
const path = require('path')

const traverseDirectory = (dirname, filter, callback) => {
  let directory = [];

  fs.readdir(dirname, function(err, list) {
    dirname = fs.realpathSync(dirname);
    if (err) {
      return callback({ err, dirname })
    }

    // merke dir die Anzahl der Einträge
    let numberOfFiles = list.length
    
    // behandle jeden Eintrag
    list.forEach(file => {
      file = path.resolve(dirname, file)

      fs.stat(file, (err, stat) => {
        if (err) {
          callback({ err, file })
          return
        }
        numberOfFiles -= 1
        directory.push(file);

        if (stat && stat.isDirectory()) {
          // gehe rekursiv in das Unterverzeichnis
          traverseDirectory(file, (err, parsed) => {
          
            // sammle die Dateien aus dem Unterverzeichnis(sen) ein
            directory = directory.concat(parsed)
            
            // und wenn wir bei 0 sind, sind alle Callbacks durch (Dir-Fall)
            if (numberOfFiles === 0) {
              callback(null, directory);
            }
          })
        } else {
          // und wenn wir bei 0 sind, sind alle Callbacks durch (Datei-Fall)
          if (numberOfFiles === 0) {
            callback(null, directory);
          }
        }
      })
    })
  })
}

traverseDirectory('.', function(err, result) {
  if (err) {
    console.log(JSON.stringify(err));
    return
  }

  console.log(result);
});
