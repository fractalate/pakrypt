import { Base64 } from 'js-base64'
import { FindBlock, Pak, PakFile } from '../pak/Pak'

export function downloadContent(filename: string, content: string | Uint8Array) {
  const blob = new Blob([content])
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  // Should revoke, but safari on ios encounters an error if you do.
  //window.URL.revokeObjectURL(url);
}

export function downloadPakFile(pak: Pak, entry: PakFile) {
  const content = preparePakFileForDownload(pak, entry)
  downloadContent(entry.title, content)
}

function preparePakFileForDownload(pak: Pak, entry: PakFile) {
  let result = new Uint8Array()
  for (const block of entry.blocks) {
    const b = FindBlock(pak, block.id)
    if (b == null) {
      throw Error('Block not found ' + block.id + '.')
    }
    result = new Uint8Array([...result, ...Base64.toUint8Array(b.data)])
  }
  return result
}
