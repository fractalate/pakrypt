import { useContext } from 'react'
import { PageContext } from '../Contexts'
import styling from '../lib/styling'

export default function TileNewFile() {
  const { pushPage } = useContext(PageContext)

  function openNewFile() {
    pushPage({
      ov: 'pakrypt.page:new_file',
    })
  }
  
  return <div className={styling.tile.tileComponentCommand + ' flex flex-col'}>
    <button className={styling.button.formButton} onClick={() => openNewFile()}>New File</button>
  </div>
}
