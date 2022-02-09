
/**
 * lambda file
 */
import serverlessHTTP from 'serverless-http'
import app1 from './app/app'

export const app = serverlessHTTP(app1, {
  binary: ['application/octet-stream', 'application/gzip']
})
