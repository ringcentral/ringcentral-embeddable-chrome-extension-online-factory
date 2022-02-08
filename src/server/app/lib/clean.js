/**
 * clean temp directory
 */

import {
  readdir,
  unlink,
  stat,
  rmdir
} from 'fs/promises'
import { resolve } from 'path'
import {
  MAX_SAVE_TIME,
  TEMP_DIR as temp,
  FILE_PREFIX
} from '../common/constants'

export async function clean () {
  const list = await readdir(temp)
  const all = list.filter(name => name.startsWith(FILE_PREFIX))
  for (const name of all) {
    const p = resolve(temp, name)
    const info = await stat(p)
    const isFolder = info.isDirectory()
    if (isFolder) {
      await rmdir(p, { recursive: true, force: true })
    } else {
      const ct = new Date(info.ctimeMs).getTime()
      const past = Date.now() - ct
      if (past > MAX_SAVE_TIME) {
        await unlink(p)
      }
    }
  }
}
