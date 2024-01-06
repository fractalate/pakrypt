import { useContext } from 'react'
import styling from '../lib/styling'
import { PageContext } from '../Contexts'

export default function TileNewPak() {
  const { pushPage } = useContext(PageContext)

  return <div className={styling.tile.tileComponentCommand + ' flex flex-col'}>
    <button className={styling.button.formButton} onClick={() => {
      pushPage({
        ov: 'pakrypt.page:new_pak',
      })
    }}>New Pak</button>
  </div>
}
