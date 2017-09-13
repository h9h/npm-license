const Glob = require('glob').Glob
const fs = require('fs')
const path = require('path')
const R = require('ramda')

const wd = path.normalize(process.argv[2] || '.')

const glob = new Glob('**/package.json', { cwd: wd })

const matches = []
const errors = []

const SPACE = ' '.repeat(40)

const pad = str => {
  if (str.length > SPACE.length - 1) return str
  return str + SPACE.substr(str.length)
}

const sort = (str1, str2) => (str1.localeCompare(str2))

console.log(`

  Working directory: ${wd}
  
`)

glob.on('match', m => {
  try {
    const file = fs.readFileSync(path.resolve(wd, m), 'utf8')

    if (file) {
      const pkg = JSON.parse(file)

      const item = {
        match: m,
        license: JSON.stringify(pkg.license) || 'n.a.',
        name: pkg.name || 'n.a.',
        version: pkg.version || 'n.a.'
      }
      matches.push(item)

    } else {
      const item = {
        match: m,
        error: 'readFileSync returned null'
      }
      errors.push(item)
      console.log(item)
    }

  } catch (e) {
    const item = {
      match: m,
      error: e
    }
    errors.push(item)
    console.log(item)
  }
})

console.log(`Glob options: ${JSON.stringify(glob)}`)
console.log(`

===============================================================================
                                   Results
===============================================================================

`)

glob.on('end', () => {
  console.log(`

  Anzahl Matches: ${matches.length}
  Anzahl Errors : ${errors.length}
  
  `)

  const groups = R.groupBy(R.prop('license'), matches)
  R.forEachObjIndexed((values, key) => {
    console.log(`
===============================================================================
License: ${key}
-------------------------------------------------------------------------------
${R.join('\n', R.sort(sort, R.map(value => (pad(value.name + ' (' + value.version + ')') + ' [' + value.match + ']'), values)))}
    
    `)
  }, groups)
})
