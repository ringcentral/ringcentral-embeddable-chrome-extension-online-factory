import {
  copy,
  readFile,
  writeFile
} from 'fs-extra'
import parser from '../common/string-parser'
import { resolve } from 'path'
import {
  TEMP_DIR,
  FILE_PREFIX
} from '../common/constants'
import _ from 'lodash'
import tar from 'tar'
import {
  uploadFile
} from './s3'

const cwd = process.cwd()

export function verify (options) {
  const {
    name,
    desc,
    matches
  } = options
  if (!options.name || !_.isString(name)) {
    return {
      error: 'name required'
    }
  } else if (desc && desc.length > 1000) {
    return {
      error: 'desc too long'
    }
  } else if (!matches.length) {
    return {
      error: 'matches required'
    }
  }
  return true
}

async function edit (folder, options) {
  const fest = resolve(folder, 'manifest.json')
  let str = await readFile(fest)
    .then(r => r.toString())
  const {
    name,
    desc,
    matches = [],
    excludeMatches = []
  } = options
  str = str.replace(/"name": "[^"]+",/, `"name": "${name}",`)
  str = str.replace(/"matches": \[[^[\]]+\]+,/, `"matches": ${parser(matches)},`)
  if (desc) {
    str = str.replace(/"description": "[^"]+",/, `"description": "${parser(desc)}",`)
  }
  if (excludeMatches.length) {
    str = str.replace('"exclude_matches": []', `"exclude_matches": ${parser(excludeMatches)}`)
  }
  await writeFile(fest, str)
}

export async function build (options, md5) {
  const from = resolve(cwd, 'node_modules/ringcentral-chrome-extension-template-spa/dist')
  const name = `${FILE_PREFIX}-${md5}`
  const to = resolve(
    TEMP_DIR,
    name
  )
  await copy(from, to)
  await edit(to, options)
  const to2 = `${name}.tar.gz`
  const to2path = resolve(TEMP_DIR, to2)
  await tar.c({
    cwd: TEMP_DIR,
    gzip: true,
    file: to2path
  }, [name])
  await uploadFile(to2path)
  return {
    file: to2
  }
}
