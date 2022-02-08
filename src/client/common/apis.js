import fetch from '../lib/fetch'

const {
  server
} = window.rc

export async function createExt (data) {
  const url = `${server}/api/create`
  return fetch.post(url, data)
}
