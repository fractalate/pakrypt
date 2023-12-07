import { useContext } from 'react'
import { PageContext } from '../Contexts'
import styling from '../lib/styling'

// TODO: Unused, please remove.
export default function TileDemo() {
  const { pushPage } = useContext(PageContext)

  function openDemo() {
    pushPage({
      ov: 'pakrypt.page:demo',
    })
  }
  
  return <div className={styling.tile.tileComponentCommand}>
    <button className={styling.button.formButton} onClick={() => openDemo()}>Open Demo</button>
  </div>
}
