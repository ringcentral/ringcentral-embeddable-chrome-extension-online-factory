/**
 * bot control apis
 * /api
 */

import {
  verify,
  build
} from '../lib/build-pack'
import {
  TEMP_DIR
} from '../common/constants'
import { getCache } from '../lib/get-cache'

async function create (req, res) {
  const { body } = req
  const ok = verify(body)
  if (ok.error) {
    return res.status(400).send(ok.error)
  }
  const st = await getCache(body)
  if (st.file) {
    return res.send(st)
  }
  const { md5 } = st
  const r = await build(body, md5)
  res.send(r)
}

async function download (req, res) {
  const {
    name
  } = req.params
  res.sendFile(`${TEMP_DIR}/${name}`)
}

export default (app) => {
  app.post('/api/create', create)
  app.get('/d/:name', download)
}
