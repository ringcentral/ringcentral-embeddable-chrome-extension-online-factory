/**
 * view index
 */

import copy from 'json-deep-copy'
import {
  pack
} from '../common/constants'

const {
  SERVER,
  APP_HOME
} = process.env

export default (req, res) => {
  res.set({
    'Cache-Control': 'no-cache'
  })
  const data = {
    version: pack.version,
    title: `${pack.name}: ${pack.description}`,
    server: SERVER,
    cdn: SERVER,
    home: APP_HOME,
    feedbackUrl: pack.bugs.url,
    github: pack.homepage
  }
  data._global = copy(data)
  res.render('app', data)
}
