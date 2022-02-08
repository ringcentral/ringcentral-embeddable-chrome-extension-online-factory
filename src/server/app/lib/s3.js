import AWS from 'aws-sdk'
import fs from 'fs'
import path from 'path'
import {
  pack
} from '../common/constants'
import _ from 'lodash'

const {
  AWS_PROFILE,
  S3_BUCKET_NAME = pack.name
} = process.env

if (AWS_PROFILE) {
  const credentials = new AWS.SharedIniFileCredentials({
    profile: AWS_PROFILE
  })
  AWS.config.credentials = credentials
}

AWS.Request.prototype.forwardToExpress = function forwardToExpress (res, next) {
  this
    .on('httpHeaders', function (code, headers) {
      if (code < 300) {
        res.set(
          _.pick(
            headers,
            ['content-type', 'content-length', 'last-modified', 'ETag']
          )
        )
      }
    })
    .createReadStream()
    // .on('data', (chunk) => res.write(chunk))
    // .once('end', () => {
    //   res.end()
    // })
    // .on('error', () => {
    //   res.end()
    // })
    .on('error', next)
    .pipe(res)
}

const { S3 } = AWS
const bucketParams = { Bucket: S3_BUCKET_NAME }

async function createBucket (client) {
  return new Promise((resolve, reject) => {
    client.createBucket(bucketParams, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

async function checkBucket (client) {
  return new Promise((resolve, reject) => {
    client.headBucket(bucketParams, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
    .then(() => true)
    .catch(() => false)
}

async function getClient () {
  const client = new S3()
  const buck = await checkBucket(client)
  if (!buck) {
    await createBucket(client)
  }
  return client
}

export async function uploadFile (file) {
  const client = await getClient()
  const uploadParams = {
    Bucket: S3_BUCKET_NAME,
    // Add the required 'Key' parameter using the 'path' module.
    Key: path.basename(file),
    // Add the required 'Body' parameter
    Body: fs.createReadStream(file)
  }
  await new Promise((resolve, reject) => {
    client.putObject(uploadParams, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export async function checkFile (file) {
  const client = await getClient()
  const bucketParams = {
    Bucket: S3_BUCKET_NAME,
    Key: path.basename(file)
  }
  const exist = await new Promise((resolve, reject) => {
    client.headObject(bucketParams, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
    .then(() => true)
    .catch(() => false)
  return {
    bucketParams,
    client,
    exist
  }
}

export async function downloadFile (file) {
  const {
    client,
    bucketParams
  } = await checkFile(file)
  return client.getObject(bucketParams)
}
