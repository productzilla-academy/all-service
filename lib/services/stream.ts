import { Stream } from "stream"

export const isStream = (object: any): boolean =>  {
  if (object instanceof Stream) {
    return true
  }
  return false
}

export const streamToString = (stream: Stream): Promise<string> => {
  const chunks = []
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}