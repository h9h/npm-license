const Glob = require('glob').Glob
const fs = require('fs')
const path = require('path')
const R = require('ramda')

const glob = new Glob('**/package.json')

const matches = []
const errors = []

glob.on('match', m => {
  try {
    const file = fs.readFileSync(path.resolve('.', m), 'utf8')

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
  R.forEachObjIndexed((value, key) => {
    console.log(`
===============================================================================
License: ${key}
-------------------------------------------------------------------------------
${JSON.stringify(value)}
    
    `)
  }, groups)
})
