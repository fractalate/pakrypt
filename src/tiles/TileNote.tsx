import { useContext } from 'react'
import { PageContext } from '../Contexts'
import styling from '../lib/styling'
import { PakNote } from '../pak/Pak'

export default function TileNote({
  entry,
}: {
  entry: PakNote,
}) {
  const { pushPage } = useContext(PageContext)

  function openEditNote() {
    pushPage({
      ov: 'pakrypt.page:edit_note',
      entry,
    })
  }

  return <div className={styling.tile.tileComponentEntry + ' flex flex-col gap-2'}>
    <div>
      <div>{entry.title}</div>
      <div>{entry.subtitle}</div>
    </div>
    <button className={styling.button.formButton} onClick={() => openEditNote()}>Edit</button>
  </div>
}
