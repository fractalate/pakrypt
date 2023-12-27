import { useContext } from 'react'
import styling from '../lib/styling'
import { PageContext } from '../Contexts'

export default function TileImportPak() {
  const { pushPage } = useContext(PageContext)

  return <div className={styling.tile.tileComponentCommand}>
    <button className={styling.button.formButton} onClick={() => {
      pushPage({
        ov: 'pakrypt.page:importpak',
      })
    }}>Import Pak</button>
  </div>
}
