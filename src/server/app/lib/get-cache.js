/**
 * if same options, try get the builed cache
 */

import md5 from './md5'
import {
  FILE_PREFIX,
  TEMP_DIR
} from '../common/constants'
import { resolve } from 'path'
import { constants } from 'fs'
import { access } from 'fs/promises'

import { clean } from './clean'

function checkExist (file) {
  return access(file, constants.F_OK)
    .then(() => true)
    .catch(() => false)
}

export async function getCache (options) {
  const id = md5(options)
  const fname = `${FILE_PREFIX}-${id}.tar.gz`
  const path = resolve(TEMP_DIR, fname)
  await clean()
  const exist = await checkExist(path)
  if (!exist) {
    return {
      md5: id
    }
  }
  return {
    file: fname
  }
}
