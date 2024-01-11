import { useContext } from 'react'
import { PageContext } from '../Contexts'
import styling from '../lib/styling'
import { PakFile } from '../pak/Pak'

export default function TileFile({
  entry,
}: {
  entry: PakFile,
}) {
  const { pushPage } = useContext(PageContext)

  function openEditFile() {
    pushPage({
      ov: 'pakrypt.page:edit_file',
      entry,
    })
  }

  return <div className={styling.tile.tileComponentEntry + ' flex flex-col gap-2'}>
    <div>
      <div>{entry.title}</div>
      <div>{entry.subtitle}</div>
    </div>
    <button className={styling.button.formButton} onClick={() => openEditFile()}>Edit</button>
  </div>
}
