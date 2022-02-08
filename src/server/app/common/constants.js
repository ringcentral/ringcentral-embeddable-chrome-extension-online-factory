import { resolve } from 'path'

export const MAX_SAVE_TIME = 1000 * 60 * 60 * 24 * 3 // 3 days
export const TEMP_DIR = process.env.WORK_DIR || '/tmp'
export const FILE_PREFIX = process.env.FILE_PREFIX || 'rcext'

export const cwd = process.cwd()
export const pack = require(resolve(cwd, 'package.json'))
