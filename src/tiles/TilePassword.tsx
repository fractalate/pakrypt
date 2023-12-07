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
  
  return <div className={styling.tile.tileComponentEntry}>
    <div>{entry.title}</div>
    <div>{entry.subtitle || entry.username}</div>
    <div className="m-1"></div>
    {/* mr-1 is because I should really learn Flex. */}
    <button className={styling.button.formButton + ' mr-1'} onClick={() => openEditPassword()}>Edit</button>
    <button className={styling.button.formButton} onClick={() => copyPassword()}>Copy Password {copied && <>&#x2705;</>}</button>
  </div>
}
