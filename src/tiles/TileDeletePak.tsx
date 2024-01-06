import { useContext } from 'react'
import styling from '../lib/styling'
import { PageContext } from '../Contexts'

export default function TileDeletePak() {
  const { pushPage } = useContext(PageContext)

  return <div className={styling.tile.tileComponentCommand + ' flex flex-col'}>
    <button className={styling.button.formButton} onClick={() => {
      pushPage({
        ov: 'pakrypt.page:delete_pak',
      })
    }}>Delete Pak</button>
  </div>
}
