const Glob = require('glob').Glob
const fs = require('fs')
const path = require('path')
const R = require('ramda')

// get the working directory from commandline, or use directory of process
const wd = path.normalize(process.argv[2] || '.')

// set up Glob to match all package.json in any subdirectory (or wd itself)
const glob = new Glob('**/package.json', { cwd: wd })

// set up store for positive matches and errors
const matches = []
const errors = []

// utility to collect errors and log them out
const addAndLogError = (match, error = 'readFileSync returned null') => {
  const item = {
    match,
    error
  }
  errors.push(item)
  console.log(item)
}

// utility to right-pad a string with spaces
const pad = str => {
  const SPACE = ' '.repeat(40)

  if (str.length > SPACE.length - 1) return str
  return str + SPACE.substr(str.length)
}

// string-sort function for usage with R.sort
const sort = (str1, str2) => (str1.localeCompare(str2))

// this method is called, if a match is encountered
glob.on('match', match => {
  try {
    // read package.json
    const file = fs.readFileSync(path.resolve(wd, match), 'utf8')

    if (file) {
      // parse string to JSON, to easily get at the information therein
      const pkg = JSON.parse(file)

      const name = pkg.name || 'n.a.'
      const version = pkg.version || 'n.a.'

      // some license are just a string, some an object of shape { type, url }
      // we don't differentiate different URLs
      const license = pkg.license ? (pkg.license.type ? pkg.license.type : pkg.license) : 'n.a.'

      // add the extracted information to results
      matches.push({
        match,
        license,
        name,
        version,
        fqn: name + '_' + version
      })

    } else {
      addAndLogError(match)
    }

  } catch (e) {
    addAndLogError(match, e)
  }
})

console.log(`

===============================================================================
                                   Results
===============================================================================

  Working directory: ${wd}
  
  Glob options: ${JSON.stringify(glob)}

`)

// this method is called, when glob is done: Pretty print results to console
glob.on('end', () => {
  console.log(`

  Number of matches: ${matches.length}
  Number of errors : ${errors.length}
  
  `)

  // group matches by license-field
  const groups = R.groupBy(R.prop('license'), matches)

  // output each group
  R.forEach(license => {
    const modules = groups[license]
    const distinctModules = R.groupBy(R.prop('fqn'), modules)

    console.log(`
===============================================================================
License                   : ${license}
Number of distinct modules: ${R.keys(distinctModules).length}
-------------------------------------------------------------------------------
${R.join('\n', R.sort(sort, R.map(module => (pad(module.name + ' (' + module.version + ')') + ' [' + module.match + ']'), modules)))}
    
    `)
  }, R.sort(sort, R.keys(groups)))
})
