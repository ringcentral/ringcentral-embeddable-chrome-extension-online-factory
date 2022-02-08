
import crypto from 'crypto'

export default (strOrObj) => {
  const str = JSON.stringify(strOrObj)
  return crypto.createHash('md5').update(str).digest('hex')
}
