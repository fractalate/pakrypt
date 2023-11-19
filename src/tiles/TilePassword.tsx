import { useContext } from 'react'
import { PageContext } from '../Contexts'
import styling from '../lib/styling'
import { PakPassword1r0 } from '../pak/Pak'

export function TilePassword({
  entry,
}: {
  entry: PakPassword1r0,
}) {
  const { pushPage } = useContext(PageContext)

  function openEditPassword() {
    pushPage({
      ov: 'pakrypt.page:edit_password',
      entry,
    })
  }

  function copyPassword() {
  }
  
  return <div className={styling.tile.tileComponent}>
    <div>{entry.title}</div>
    <div>{entry.subtitle}</div>
    <button className={styling.button.formButton} onClick={() => openEditPassword()}>Edit</button>
    <button className={styling.button.formButton} onClick={() => copyPassword()}>Copy Password</button>
  </div>
}
