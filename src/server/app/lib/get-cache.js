/**
 * if same options, try get the builed cache
 */

import md5 from './md5'
import {
  FILE_PREFIX
} from '../common/constants'
// import { resolve } from 'path'
// import { constants } from 'fs'
// import { access } from 'fs/promises'
import {
  checkFile
} from './s3'

// import { clean } from './clean'

// function checkExist (file) {
//   return access(file, constants.F_OK)
//     .then(() => true)
//     .catch(() => false)
// }

export async function getCache (options) {
  const id = md5(options)
  const fname = `${FILE_PREFIX}-${id}.tar.gz`
  const info = await checkFile(fname)
  // const path = resolve(TEMP_DIR, fname)
  // await clean()
  // const exist = await checkExist(path)
  if (!info || !info.exist) {
    return {
      md5: id
    }
  }
  return {
    file: fname
  }
}
