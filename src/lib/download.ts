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
