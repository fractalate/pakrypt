import { useContext } from 'react'
import styling from '../lib/styling'
import { PageContext } from '../Contexts'

export default function TileChangePassphrase() {
  const { pushPage } = useContext(PageContext)

  return <div className={styling.tile.tileComponentCommand}>
    <button className={styling.button.formButton} onClick={() => {
      pushPage({
        ov: 'pakrypt.page:changepassphrase',
      })
    }}>Change Passphrase</button>
  </div>
}
