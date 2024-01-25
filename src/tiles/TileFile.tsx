import { useContext } from 'react'
import { PageContext, PakmanStateContext } from '../Contexts'
import styling from '../lib/styling'
import { PakFile } from '../pak/Pak'
import { downloadPakFile } from '../lib/download'

export default function TileFile({
  entry,
}: {
  entry: PakFile,
}) {
  const { pushPage } = useContext(PageContext)
  const { pakman } = useContext(PakmanStateContext)

  if (pakman.ov !== 'pakrypt.pakman_state:unlocked') {
    return <></>
  }

  const downloadFile = () => {
    downloadPakFile(pakman.pak, entry)
  }

  const openEditFile = () => {
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
    <div className="flex flex-row gap-2">
      <button className={'flex-1 ' + styling.button.formButton} onClick={() => openEditFile()}>Edit</button>
      <button className={'flex-1 ' + styling.button.formButton} onClick={() => downloadFile()}>Download</button>
    </div>
  </div>
}
