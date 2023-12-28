import { useContext } from 'react'
import { PageContext } from '../Contexts'
import styling from '../lib/styling'

export default function TileNewNote() {
  const { pushPage } = useContext(PageContext)

  function openNewNote() {
    pushPage({
      ov: 'pakrypt.page:new_note',
    })
  }
  
  return <div className={styling.tile.tileComponentCommand}>
    <button className={styling.button.formButton} onClick={() => openNewNote()}>New Note</button>
  </div>
}
