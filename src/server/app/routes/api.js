/**
 * bot control apis
 * /api
 */

import {
  verify,
  build
} from '../lib/build-pack'
// import {
//   TEMP_DIR
// } from '../common/constants'
import {
  downloadFile
} from '../lib/s3'
import { getCache } from '../lib/get-cache'

async function create (req, res) {
  const { body } = req
  const ok = verify(body)
  if (ok.error) {
    return res.status(400).send(ok.error)
  }
  const st = await getCache(body)
  if (st && st.file) {
    return res.send(st)
  }
  const { md5 } = st
  const r = await build(body, md5)
  res.send(r)
}

async function download (req, res, next) {
  const {
    name
  } = req.params
  const stream = await downloadFile(name)
  if (!stream) {
    return res.status(404).send('file not exist')
  }
  stream.forwardToExpress(res, next)
}

export default (app) => {
  app.post('/api/create', create)
  app.get('/d/:name', download)
}
