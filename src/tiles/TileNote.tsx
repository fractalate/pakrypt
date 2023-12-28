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

  return <div className={styling.tile.tileComponentEntry}>
    <div>{entry.title}</div>
    <div>{entry.subtitle}</div>
    <div className="m-1"></div>
    {/* mr-1 is because I should really learn Flex. */}
    <button className={styling.button.formButton + ' mr-1'} onClick={() => openEditNote()}>Edit</button>
  </div>
}
