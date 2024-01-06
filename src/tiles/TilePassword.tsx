import { useContext, useState } from 'react'
import { PageContext } from '../Contexts'
import styling from '../lib/styling'
import { PakPassword } from '../pak/Pak'

export default function TilePassword({
  entry,
}: {
  entry: PakPassword,
}) {
  const { pushPage } = useContext(PageContext)
  const [copied, setCopied] = useState(false)

  function openEditPassword() {
    pushPage({
      ov: 'pakrypt.page:edit_password',
      entry,
    })
  }

  function copyPassword() {
    navigator.clipboard.writeText(entry.password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return <div className={styling.tile.tileComponentEntry + ' flex flex-col gap-2'}>
    <div>
      <div>{entry.title}</div>
      <div>{entry.subtitle || entry.username}</div>
    </div>
    <div className="flex flex-row gap-2">
      <button className={styling.button.formButton + ' w-1/2'} onClick={() => openEditPassword()}>Edit</button>
      {/* "relative" is for the "absolute" and "right" classes inside. */}
      <button className={styling.button.formButton + ' w-1/2 relative'} onClick={() => copyPassword()}>
        {copied && <div className="absolute right-1">&#x2705;</div>}
        <span>Copy Password</span>
      </button>
    </div>
  </div>
}
